export type MatchStatus = 'upcoming' | 'live' | 'finished'

export interface Team {
  id: string
  name: string
  logoUrl: string
}

export interface Match {
  id: string
  tournamentId: string
  teamA: Team
  teamB: Team
  status: MatchStatus
  scheduledAt: string
  poolTeamA: number // total tokens misés sur teamA
  poolTeamB: number // total tokens misés sur teamB
  winnerTeamId?: string // si status === 'finished'
}