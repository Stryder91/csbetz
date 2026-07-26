import { Injectable, Logger } from '@nestjs/common'
import HLTV from 'hltv'

@Injectable()
export class HltvService {
  private readonly logger = new Logger(HltvService.name)

  async getMatchResult(hltvMatchId: string): Promise<{ finished: boolean; winnerTeamName?: string }> {
    try {
      const match = await HLTV.getMatch({ id: Number(hltvMatchId) })

      if (!match.winnerTeam?.name) {
        return { finished: false }
      }

      return { finished: true, winnerTeamName: match.winnerTeam.name }
    } catch (e) {
      this.logger.error(`Failed to fetch HLTV match ${hltvMatchId}`, e)
      return { finished: false }
    }
  }

  async test() {
    const stats = await HLTV.getMatchesStats({ startDate: '2017-07-10', endDate: '2017-07-18' })
    console.log("stats", stats)
  }
  async getUpcomingMatches() {
    const matches = await HLTV.getMatches();

    console.log("matches", matches)
    return matches
      .filter((m) => m.team1 && m.team2 && m.date)
      .map((m) => ({
        hltvMatchId: String(m.id),
        teamAName: m.team1!.name,
        teamALogoUrl: '',
        teamBName: m.team2!.name,
        teamBLogoUrl: '',
        scheduledAt: new Date(m.date!),
        hltvEventId: m.event ? String(m.event.id) : null,
        hltvEventName: m.event?.name ?? 'Unknown Event',
      }))
  }
}