import { useState, useCallback } from 'react'
import { useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { config } from '@/lib/wagmi'
import { CS2_BETTING_ADDRESS, CS2_BETTING_ABI } from '@/lib/contracts/cs2Betting'

export function useWithdrawBet() {
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { writeContractAsync } = useWriteContract()

  const withdraw = useCallback(
    async (matchId: bigint, team: 0 | 1) => {
      setError(null)
      setIsWithdrawing(true)
      try {
        const hash = await writeContractAsync({
          address: CS2_BETTING_ADDRESS,
          abi: CS2_BETTING_ABI,
          functionName: 'withdrawBet',
          args: [matchId, team],
        })
        await waitForTransactionReceipt(config, { hash })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Retrait échoué')
      } finally {
        setIsWithdrawing(false)
      }
    },
    [writeContractAsync]
  )

  return { withdraw, isWithdrawing, error }
}