import { Routes, Route } from 'react-router'
import { Layout } from '@/components/layout/Layout'
import { TournamentsPage } from '@/routes/TournamentsPage'
import { TournamentDetailPage } from '@/routes/TournamentDetailPage'
import { MatchDetailPage } from '@/routes/MatchDetailPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<TournamentsPage />} />
        <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="/matches/:id" element={<MatchDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App