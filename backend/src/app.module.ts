import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MatchesModule } from './matches/matches.module';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [PrismaModule, MatchesModule, BlockchainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
