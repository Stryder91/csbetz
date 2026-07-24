import { useAccount, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { CS2_BETTING_ADDRESS, CS2_BETTING_ABI, USDC_ABI, BASE_SEPOLIA_USDC_ADDRESS } from '@/lib/contracts/cs2Betting'

export function useMyBet(matchId: bigint) {
  const { address } = useAccount()

  const { data: decimals } = useReadContract({
    address: BASE_SEPOLIA_USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'decimals',
  })

  const { data, isLoading, refetch } = useReadContract({
    address: CS2_BETTING_ADDRESS,
    abi: CS2_BETTING_ABI,
    functionName: 'getUserBet',
    args: address ? [matchId, address] : undefined,
    query: { enabled: !!address },
  })

  if (!data || decimals === undefined) {
    return { betOnA: 0, betOnB: 0, isLoading, refetch }
  }

  const [betOnA, betOnB] = data as [bigint, bigint]

  return {
    betOnA: Number(formatUnits(betOnA, decimals)),
    betOnB: Number(formatUnits(betOnB, decimals)),
    isLoading,
    refetch,
  }
}