import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '../prisma/prisma.service'
import { BlockchainService } from '../blockchain/blockchain.service'
import { HltvService } from './hltv.service'

@Injectable()
export class OracleService {
  private readonly logger = new Logger(OracleService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchain: BlockchainService,
    private readonly hltv: HltvService,
  ) {}

  // Toutes les 2 minutes : verrouille les matchs dont l'heure est passée
  @Cron('*/2 * * * *') // toutes les 2 minutes
  async lockDueMatches() {
    const dueMatches = await this.prisma.match.findMany({
      where: { status: 'UPCOMING', scheduledAt: { lte: new Date() } },
    })

    for (const match of dueMatches) {
      try {
        await this.blockchain.lockMatch(match.onChainMatchId)
        await this.prisma.match.update({
          where: { id: match.id },
          data: { status: 'LIVE', lockedAt: new Date() },
        })
        this.logger.log(`Match ${match.id} locked on-chain`)
      } catch (e) {
        // On ne throw pas : le match reste UPCOMING, on retentera au prochain tick.
        // Si l'échec est permanent (ex: déjà locked on-chain suite à un crash après la tx mais avant l'update DB),
        // il faudra un jour un mécanisme de réconciliation on-chain <-> DB. Pas géré ici, MVP assumé.
        this.logger.error(`Failed to lock match ${match.id}`, e)
      }
    }
  }

  // Toutes les 5 minutes : vérifie les résultats des matchs en cours
  @Cron(CronExpression.EVERY_5_MINUTES)
  async resolveFinishedMatches() {
    const liveMatches = await this.prisma.match.findMany({
      where: { status: 'LIVE' },
    })

    for (const match of liveMatches) {
      try {
        const result = await this.hltv.getMatchResult(match.hltvMatchId)
        if (!result.finished || !result.winnerTeamName) continue

        const winner = result.winnerTeamName === match.teamAName ? 0 : 1

        await this.blockchain.resolveMatch(match.onChainMatchId, winner)
        await this.prisma.match.update({
          where: { id: match.id },
          data: {
            status: 'FINISHED',
            winnerTeam: winner === 0 ? 'A' : 'B',
            resolvedAt: new Date(),
          },
        })
        this.logger.log(`Match ${match.id} resolved, winner: ${result.winnerTeamName}`)
      } catch (e) {
        this.logger.error(`Failed to resolve match ${match.id}`, e)
      }
    }
  }
}