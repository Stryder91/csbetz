import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAccount } from 'wagmi'
import type { Match } from '@/types/match'

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

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BetFormValues>({
    resolver: zodResolver(betSchema),
    defaultValues: { teamId: '', amount: undefined },
  })

  const selectedTeamId = watch('teamId')

  const onSubmit = async (values: BetFormValues) => {
    // TODO: appel wagmi writeContract une fois le smart contract prêt
    console.log('Mise à envoyer on-chain :', values)
    await new Promise((r) => setTimeout(r, 800)) // mock délai tx
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="clip-corner bg-surface p-4 sm:p-5">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted">
        Placer une mise
      </h2>

      <Controller
        name="teamId"
        control={control}
        render={({ field }) => (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <TeamOption
              label={match.teamA.name}
              logoUrl={match.teamA.logoUrl}
              color="ct"
              selected={field.value === match.teamA.id}
              onClick={() => field.onChange(match.teamA.id)}
            />
            <TeamOption
              label={match.teamB.name}
              logoUrl={match.teamB.logoUrl}
              color="t"
              selected={field.value === match.teamB.id}
              onClick={() => field.onChange(match.teamB.id)}
            />
          </div>
        )}
      />
      {errors.teamId && <p className="mt-1.5 font-mono text-xs text-t">{errors.teamId.message}</p>}

      <div className="mt-4">
        <label htmlFor="amount" className="font-mono text-xs uppercase tracking-wider text-text-muted">
          Montant (tokens)
        </label>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id="amount"
              type="number"
              inputMode="decimal"
              placeholder="0"
              onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
              value={field.value ?? ''}
              className="mt-1.5 w-full border border-elevated bg-void px-3 py-2.5 font-mono text-lg text-text-primary outline-none focus:border-ct"
            />
          )}
        />
        {errors.amount && <p className="mt-1.5 font-mono text-xs text-t">{errors.amount.message}</p>}
      </div>

      {selectedTeamId && (
        <p className="mt-3 font-mono text-xs text-text-muted">
          Gain potentiel estimé : calcul basé sur le pool final au moment de la résolution.
        </p>
      )}

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
          {isSubmitting ? 'Confirmation…' : 'Confirmer la mise'}
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