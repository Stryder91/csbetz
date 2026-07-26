import { Module } from '@nestjs/common'
import { OracleService } from './oracle.service'
import { HltvService } from './hltv.service'
import { BlockchainModule } from '../blockchain/blockchain.module'

@Module({
  imports: [BlockchainModule],
  providers: [OracleService, HltvService],
  exports: [HltvService],
})
export class OracleModule {}