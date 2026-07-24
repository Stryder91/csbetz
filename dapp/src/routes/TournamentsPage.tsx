import { mockTournaments } from '@/lib/mockData'
import { TournamentCard } from '@/components/tournament/TournamentCard'

export function TournamentsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
        Tournois
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {mockTournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
    </div>
  )
}