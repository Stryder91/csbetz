import { Injectable, Logger } from '@nestjs/common'
import { createWalletClient, createPublicClient, http, type Hash } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import cs2BettingAbi from './cs2BettingAbi.json'

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name)
  private readonly account = privateKeyToAccount(process.env.ORACLE_PRIVATE_KEY as `0x${string}`)
  private readonly contractAddress = process.env.CS2_BETTING_ADDRESS as `0x${string}`

  private readonly walletClient = createWalletClient({
    account: this.account,
    chain: baseSepolia,
    transport: http(process.env.BASE_SEPOLIA_RPC_URL),
  })

  private readonly publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.BASE_SEPOLIA_RPC_URL),
  })

  async lockMatch(onChainMatchId: bigint): Promise<Hash> {
    this.logger.log(`Locking match ${onChainMatchId}`)
    const hash = await this.walletClient.writeContract({
      address: this.contractAddress,
      abi: cs2BettingAbi,
      functionName: 'lockMatch',
      args: [onChainMatchId],
    })
    await this.publicClient.waitForTransactionReceipt({ hash })
    return hash
  }

  async resolveMatch(onChainMatchId: bigint, winner: 0 | 1): Promise<Hash> {
    this.logger.log(`Resolving match ${onChainMatchId}, winner: ${winner}`)
    const hash = await this.walletClient.writeContract({
      address: this.contractAddress,
      abi: cs2BettingAbi,
      functionName: 'resolveMatch',
      args: [onChainMatchId, winner],
    })
    await this.publicClient.waitForTransactionReceipt({ hash })
    return hash
  }

  async getNextMatchId(): Promise<bigint> {
    // Pas de compteur natif dans le contrat actuel — on gère l'incrémentation côté DB.
    // Placeholder ici, on branchera la vraie logique à l'étape suivante avec Prisma.
    throw new Error('Not implemented yet')
  }
}