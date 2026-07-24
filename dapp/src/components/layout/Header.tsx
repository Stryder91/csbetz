import { Link } from 'react-router'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useUsdcBalance } from '@/hooks/useUsdcBalance'

export function Header() {
  const { isConnected } = useAccount()
  const { balance } = useUsdcBalance()

  return (
    <header className="border-b border-elevated bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="font-display text-lg font-semibold tracking-wide text-text-primary sm:text-xl">
          CS2<span className="text-t">BET</span>
        </Link>

        <div className="flex items-center gap-3">
          {isConnected && balance !== null && (
            <span className="hidden font-mono text-sm text-live sm:inline">
              {balance.toFixed(2)} USDC
            </span>
          )}
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
          />
        </div>
      </div>
    </header>
  )
}