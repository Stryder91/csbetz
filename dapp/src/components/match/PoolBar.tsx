export function PoolBar({ poolTeamA, poolTeamB }: { poolTeamA: number; poolTeamB: number }) {
  const total = poolTeamA + poolTeamB
  const percentA = total === 0 ? 50 : (poolTeamA / total) * 100

  return (
    <div className="flex h-1.5 w-full overflow-hidden bg-elevated">
      <div className="h-full bg-ct transition-all" style={{ width: `${percentA}%` }} />
      <div className="h-full bg-t transition-all" style={{ width: `${100 - percentA}%` }} />
    </div>
  )
}