import { Link } from 'react-router'
import type { Tournament } from '@/types/tournament'

const statusConfig = {
  upcoming: { label: 'À venir', className: 'text-text-muted border-text-muted' },
  live: { label: 'En cours', className: 'text-live border-live' },
  finished: { label: 'Terminé', className: 'text-text-muted border-text-muted' },
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const status = statusConfig[tournament.status]

  return (
    <Link
      to={`/tournaments/${tournament.id}`}
      className="clip-corner group block overflow-hidden bg-surface transition-colors hover:bg-elevated"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={tournament.imageUrl}
          alt={tournament.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute right-3 top-3 border px-2 py-0.5 font-mono text-xs uppercase tracking-wider ${status.className} bg-void/80 backdrop-blur-sm`}
        >
          {tournament.status === 'live' && (
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-live animate-pulse" />
          )}
          {status.label}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-text-primary sm:text-lg">
          {tournament.name}
        </h3>
        <p className="mt-1 font-mono text-xs text-text-muted">
          {new Date(tournament.startDate).toLocaleDateString('fr-FR')} — {new Date(tournament.endDate).toLocaleDateString('fr-FR')}
        </p>
      </div>
    </Link>
  )
}