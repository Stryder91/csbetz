import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { HltvService } from 'src/oracle/hltv.service'

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) { }

  findAllTournaments() {
    return this.prisma.tournament.findMany({
      orderBy: { startDate: 'desc' },
    })
  }

  findMatchesByTournament(tournamentId: string) {
    return this.prisma.match.findMany({
      where: { tournamentId },
      orderBy: { scheduledAt: 'asc' },
    })
  }

  findMatchById(id: string) {
    return this.prisma.match.findUnique({ where: { id } })
  }

  async createTournament(data: { name: string; imageUrl: string; startDate: Date; endDate: Date }) {
    return this.prisma.tournament.create({ data })
  }

  async createMatch(data: {
    tournamentId: string
    hltvMatchId: string
    teamAName: string
    teamALogoUrl: string
    teamBName: string
    teamBLogoUrl: string
    scheduledAt: Date
  }) {
    const lastMatch = await this.prisma.match.findFirst({
      orderBy: { onChainMatchId: 'desc' },
    })
    const nextOnChainMatchId = (lastMatch?.onChainMatchId ?? BigInt(0)) + BigInt(1)

    return this.prisma.match.create({
      data: {
        ...data,
        onChainMatchId: nextOnChainMatchId,
      },
    })
  }

  async syncFromHltv(upcomingMatches: Awaited<ReturnType<HltvService['getUpcomingMatches']>>) {
    const results = { created: 0, skipped: 0 }

    for (const m of upcomingMatches) {
      const existing = await this.prisma.match.findUnique({
        where: { hltvMatchId: m.hltvMatchId },
      })
      if (existing) {
        results.skipped++
        continue
      }

      // Trouve ou crée le tournoi correspondant
      let tournament = m.hltvEventId
        ? await this.prisma.tournament.findFirst({ where: { name: m.hltvEventName } })
        : null

      if (!tournament) {
        tournament = await this.prisma.tournament.create({
          data: {
            name: m.hltvEventName,
            imageUrl: '', // à compléter manuellement ou via HLTV.getEvent() plus tard
            startDate: m.scheduledAt,
            endDate: m.scheduledAt,
          },
        })
      }

      await this.createMatch({
        tournamentId: tournament.id,
        hltvMatchId: m.hltvMatchId,
        teamAName: m.teamAName,
        teamALogoUrl: m.teamALogoUrl,
        teamBName: m.teamBName,
        teamBLogoUrl: m.teamBLogoUrl,
        scheduledAt: m.scheduledAt,
      })
      results.created++
    }

    return results
  }
}