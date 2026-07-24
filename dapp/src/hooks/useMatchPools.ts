import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { CS2_BETTING_ADDRESS, CS2_BETTING_ABI, USDC_ABI, BASE_SEPOLIA_USDC_ADDRESS } from '@/lib/contracts/cs2Betting'

const STATUS_MAP = ['open', 'locked', 'resolved'] as const

export function useMatchPools(matchId: bigint) {
  const { data: decimals } = useReadContract({
    address: BASE_SEPOLIA_USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'decimals',
  })

  const { data, isLoading, refetch } = useReadContract({
    address: CS2_BETTING_ADDRESS,
    abi: CS2_BETTING_ABI,
    functionName: 'getMatchPools',
    args: [matchId],
    query: {
      refetchInterval: 10_000, // repoll toutes les 10s, simple mais efficace pour du MVP
    },
  })

  if (!data || decimals === undefined) {
    return { poolTeamA: 0, poolTeamB: 0, onChainStatus: null, isLoading, refetch }
  }

  const [poolA, poolB, status] = data as [bigint, bigint, number]

  return {
    poolTeamA: Number(formatUnits(poolA, decimals)),
    poolTeamB: Number(formatUnits(poolB, decimals)),
    onChainStatus: STATUS_MAP[status],
    isLoading,
    refetch,
  }
}