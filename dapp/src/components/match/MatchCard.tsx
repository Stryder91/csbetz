import { Link } from 'react-router'
import type { Match } from '@/types/match'
import { PoolBar } from './PoolBar'

const statusConfig = {
  upcoming: { label: 'À venir', className: 'text-text-muted border-text-muted' },
  live: { label: 'En cours', className: 'text-live border-live' },
  finished: { label: 'Terminé', className: 'text-text-muted border-text-muted' },
}

export function MatchCard({ match }: { match: Match }) {
  const status = statusConfig[match.status]
  const total = match.poolTeamA + match.poolTeamB

  return (
    <Link
      to={`/matches/${match.id}`}
      className="clip-corner-sm block bg-surface p-4 transition-colors hover:bg-elevated"
    >
      <div className="flex items-center justify-between">
        <span className={`border px-2 py-0.5 font-mono text-xs uppercase tracking-wider ${status.className}`}>
          {match.status === 'live' && (
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-live animate-pulse" />
          )}
          {status.label}
        </span>
        <span className="font-mono text-xs text-text-muted">
          {new Date(match.scheduledAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <TeamSlot name={match.teamA.name} logoUrl={match.teamA.logoUrl} isWinner={match.winnerTeamId === match.teamA.id} align="left" />
        <span className="font-display text-sm text-text-muted">VS</span>
        <TeamSlot name={match.teamB.name} logoUrl={match.teamB.logoUrl} isWinner={match.winnerTeamId === match.teamB.id} align="right" />
      </div>

      <div className="mt-4">
        <PoolBar poolTeamA={match.poolTeamA} poolTeamB={match.poolTeamB} />
        <div className="mt-1.5 flex justify-between font-mono text-xs text-text-muted">
          <span>{match.poolTeamA} tokens</span>
          <span>{total} total</span>
          <span>{match.poolTeamB} tokens</span>
        </div>
      </div>
    </Link>
  )
}

function TeamSlot({ name, logoUrl, isWinner, align }: { name: string; logoUrl: string; isWinner: boolean; align: 'left' | 'right' }) {
  return (
    <div className={`flex flex-1 items-center gap-2 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <img src={logoUrl} alt={name} className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" />
      <span className={`truncate font-display text-sm font-semibold sm:text-base ${isWinner ? 'text-live' : 'text-text-primary'}`}>
        {name}
      </span>
    </div>
  )
}