import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { OracleModule } from 'src/oracle/oracle.module';

@Module({
  imports: [OracleModule],
  controllers: [MatchesController],
  providers: [MatchesService]
})
export class MatchesModule {}
