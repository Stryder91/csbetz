import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

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
}