import { useState, useCallback } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { parseUnits } from 'viem'
import { config } from '@/lib/wagmi'
import {
  CS2_BETTING_ADDRESS,
  CS2_BETTING_ABI,
  BASE_SEPOLIA_USDC_ADDRESS,
  USDC_ABI,
} from '@/lib/contracts/cs2Betting'

type Step = 'idle' | 'approving' | 'waiting-approval' | 'betting' | 'waiting-bet' | 'done' | 'error'

export function useApproveAndBet() {
  const { address } = useAccount()
  const [step, setStep] = useState<Step>('idle')
  const [error, setError] = useState<string | null>(null)

  const { data: decimals } = useReadContract({
    address: BASE_SEPOLIA_USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'decimals',
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: BASE_SEPOLIA_USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: address ? [address, CS2_BETTING_ADDRESS] : undefined,
    query: { enabled: !!address },
  })

  const { writeContractAsync } = useWriteContract()

  const placeBet = useCallback(
    async (matchId: bigint, team: 0 | 1, amountInput: string) => {
      if (!address || decimals === undefined) return
      setError(null)
      setStep('idle')

      try {
        const amount = parseUnits(amountInput, decimals)

        if (!allowance || allowance < amount) {
          setStep('approving')
          const approveHash = await writeContractAsync({
            address: BASE_SEPOLIA_USDC_ADDRESS,
            abi: USDC_ABI,
            functionName: 'approve',
            args: [CS2_BETTING_ADDRESS, amount],
          })

          setStep('waiting-approval')
          await waitForTransactionReceipt(config, { hash: approveHash })
          await refetchAllowance()
        }

        setStep('betting')
        const betHash = await writeContractAsync({
          address: CS2_BETTING_ADDRESS,
          abi: CS2_BETTING_ABI,
          functionName: 'placeBet',
          args: [matchId, team, amount],
        })

        setStep('waiting-bet')
        await waitForTransactionReceipt(config, { hash: betHash })

        setStep('done')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Transaction échouée')
        setStep('error')
      }
    },
    [address, decimals, allowance, writeContractAsync, refetchAllowance]
  )

  return { placeBet, step, error }
}