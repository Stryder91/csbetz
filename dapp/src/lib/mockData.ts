import type { Tournament } from '@/types/tournament'
import type { Match } from '@/types/match'

export const mockTournaments: Tournament[] = [
  {
    id: 'blast-premier-2026',
    name: 'BLAST Premier World Final',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-6533d95c9b48?w=800',
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    status: 'live',
  },
  {
    id: 'iem-cologne-2026',
    name: 'IEM Cologne',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    startDate: '2026-07-15',
    endDate: '2026-07-25',
    status: 'finished',
  },
  {
    id: 'pgl-major-2026',
    name: 'PGL Major Copenhagen',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    startDate: '2026-09-01',
    endDate: '2026-09-15',
    status: 'upcoming',
  },
];


export const mockMatches: Match[] = [
  {
    id: 'match-1',
    tournamentId: 'blast-premier-2026',
    teamA: { id: 'navi', name: 'NAVI', logoUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=navi' },
    teamB: { id: 'vitality', name: 'Vitality', logoUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=vitality' },
    status: 'upcoming',
    scheduledAt: '2026-08-02T18:00:00Z',
    poolTeamA: 1200,
    poolTeamB: 800,
  },
  {
    id: 'match-2',
    tournamentId: 'blast-premier-2026',
    teamA: { id: 'g2', name: 'G2', logoUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=g2' },
    teamB: { id: 'faze', name: 'FaZe', logoUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=faze' },
    status: 'live',
    scheduledAt: '2026-08-01T16:00:00Z',
    poolTeamA: 3400,
    poolTeamB: 2100,
  },
  {
    id: 'match-3',
    tournamentId: 'blast-premier-2026',
    teamA: { id: 'spirit', name: 'Spirit', logoUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=spirit' },
    teamB: { id: 'mouz', name: 'MOUZ', logoUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=mouz' },
    status: 'finished',
    scheduledAt: '2026-07-30T14:00:00Z',
    poolTeamA: 900,
    poolTeamB: 1500,
    winnerTeamId: 'mouz',
  },
];