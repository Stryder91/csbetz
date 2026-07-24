import { useAccount, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { BASE_SEPOLIA_USDC_ADDRESS, USDC_ABI } from '@/lib/contracts/cs2Betting'

export function useUsdcBalance() {
  const { address } = useAccount()

  const { data: decimals } = useReadContract({
    address: BASE_SEPOLIA_USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'decimals',
  })

  const { data: balance, isLoading, refetch } = useReadContract({
    address: BASE_SEPOLIA_USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 100_000,
    },
  })

  const formatted = balance !== undefined && decimals !== undefined
    ? Number(formatUnits(balance, decimals))
    : null

  return { balance: formatted, isLoading, refetch }
}