import { useState } from 'react'
import { useParams } from 'react-router'
import { mockMatches } from '@/lib/mockData'
import { MatchCard } from '@/components/match/MatchCard'
import type { MatchStatus } from '@/types/match'

const filters: { value: MatchStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'upcoming', label: 'À venir' },
  { value: 'live', label: 'En cours' },
  { value: 'finished', label: 'Terminés' },
]

export function TournamentDetailPage() {
  const { id } = useParams()
  const [activeFilter, setActiveFilter] = useState<MatchStatus | 'all'>('all')

  const matches = mockMatches.filter((m) => m.tournamentId === id)
  const filtered = activeFilter === 'all' ? matches : matches.filter((m) => m.status === activeFilter)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
        Matchs
      </h1>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`shrink-0 whitespace-nowrap px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              activeFilter === f.value
                ? 'bg-ct text-void'
                : 'bg-surface text-text-muted hover:text-text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {filtered.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center font-mono text-sm text-text-muted">Aucun match dans cette catégorie.</p>
        )}
      </div>
    </div>
  )
}