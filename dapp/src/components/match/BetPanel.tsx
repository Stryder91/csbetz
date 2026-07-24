import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAccount } from 'wagmi'
import type { Match } from '@/types/match'
import { useApproveAndBet } from '@/hooks/useApproveAndBet'


const betSchema = z.object({
  teamId: z.string().min(1, 'Sélectionne une équipe'),
  amount: z
    .number({ error: 'Montant requis' })
    .positive('Le montant doit être positif')
    .min(1, 'Minimum 1 token'),
})

type BetFormValues = z.infer<typeof betSchema>

export function BetPanel({ match }: { match: Match }) {
  const { isConnected } = useAccount()
  const { placeBet, step, error } = useApproveAndBet()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BetFormValues>({
    resolver: zodResolver(betSchema),
    defaultValues: { teamId: '', amount: undefined },
  })

  const selectedTeamId = watch('teamId')
  const isSubmitting = step !== 'idle' && step !== 'done' && step !== 'error'

  const onSubmit = async (values: BetFormValues) => {
    const team = values.teamId === match.teamA.id ? 0 : 1
    // matchId : pour l'instant on caste l'id string mocké en bigint arbitraire
    // à remplacer par le vrai id numérique on-chain une fois le back branché
    await placeBet(BigInt(1), team, values.amount.toString())
  }

  // ... reste du JSX identique, mais le bouton devient :

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="clip-corner bg-surface p-4 sm:p-5">
      {/* ... champs équipe + montant identiques ... */}

      {error && <p className="mt-3 font-mono text-xs text-t">{error}</p>}

      {!isConnected ? (
        <p className="mt-4 text-center font-mono text-xs text-text-muted">
          Connecte ton wallet pour parier
        </p>
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="clip-corner-sm mt-4 w-full bg-ct py-3 font-display text-sm font-semibold uppercase tracking-wider text-void transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {step === 'approving' && 'Confirme l\'approbation…'}
          {step === 'waiting-approval' && 'Approbation en cours…'}
          {step === 'betting' && 'Confirme la mise…'}
          {step === 'waiting-bet' && 'Mise en cours…'}
          {step === 'done' && 'Mise confirmée ✓'}
          {(step === 'idle' || step === 'error') && 'Confirmer la mise'}
        </button>
      )}
    </form>
  )
}
function TeamOption({
  label,
  logoUrl,
  color,
  selected,
  onClick,
}: {
  label: string
  logoUrl: string
  color: 'ct' | 't'
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`clip-corner-sm flex flex-col items-center gap-2 border-2 bg-void p-3 transition-colors sm:p-4 ${
        selected ? (color === 'ct' ? 'border-ct' : 'border-t') : 'border-elevated hover:border-text-muted'
      }`}
    >
      <img src={logoUrl} alt={label} className="h-10 w-10 sm:h-12 sm:w-12" />
      <span className="truncate font-display text-sm font-semibold text-text-primary">{label}</span>
    </button>
  )
}