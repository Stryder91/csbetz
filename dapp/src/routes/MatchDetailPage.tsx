import { useParams } from 'react-router'
import { mockMatches } from '@/lib/mockData'
import { PoolBar } from '@/components/match/PoolBar'
import { BetPanel } from '@/components/match/BetPanel'

export function MatchDetailPage() {
  const { id } = useParams()
  const match = mockMatches.find((m) => m.id === id)

  if (!match) {
    return <p className="font-mono text-sm text-text-muted">Match introuvable.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="clip-corner bg-surface p-4 sm:p-6">
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            <TeamBlock name={match.teamA.name} logoUrl={match.teamA.logoUrl} isWinner={match.winnerTeamId === match.teamA.id} />
            <span className="font-display text-lg text-text-muted sm:text-2xl">VS</span>
            <TeamBlock name={match.teamB.name} logoUrl={match.teamB.logoUrl} isWinner={match.winnerTeamId === match.teamB.id} />
          </div>

          <div className="mt-6">
            <PoolBar poolTeamA={match.poolTeamA} poolTeamB={match.poolTeamB} />
            <div className="mt-1.5 flex justify-between font-mono text-xs text-text-muted">
              <span>{match.poolTeamA} tokens</span>
              <span>{match.poolTeamA + match.poolTeamB} total</span>
              <span>{match.poolTeamB} tokens</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        {match.status === 'upcoming' ? (
          <BetPanel match={match} />
        ) : (
          <div className="clip-corner bg-surface p-4 sm:p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
              {match.status === 'live' ? 'Match en cours' : 'Match terminé'}
            </h2>
            <p className="mt-2 font-mono text-xs text-text-muted">
              {match.status === 'finished'
                ? `Vainqueur : ${match.winnerTeamId === match.teamA.id ? match.teamA.name : match.teamB.name}`
                : 'Les mises sont fermées pour ce match.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function TeamBlock({ name, logoUrl, isWinner }: { name: string; logoUrl: string; isWinner: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <img src={logoUrl} alt={name} className="h-14 w-14 sm:h-20 sm:w-20" />
      <span className={`font-display text-sm font-semibold sm:text-lg ${isWinner ? 'text-live' : 'text-text-primary'}`}>
        {name}
      </span>
    </div>
  )
}