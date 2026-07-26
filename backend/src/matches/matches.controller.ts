import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common'
import { MatchesService } from './matches.service'
import { CreateTournamentDto, CreateMatchDto } from './dto/create-match.dto'
import { HltvService } from 'src/oracle/hltv.service'

@Controller()
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly hltvService: HltvService,
  ) { }
  

  @Get('tournaments')
  getTournaments() {
    return this.matchesService.findAllTournaments()
  }

  @Get('tournaments/:id/matches')
  getMatchesByTournament(@Param('id') id: string) {
    return this.matchesService.findMatchesByTournament(id)
  }

  @Get('matches/:id')
  async getMatch(@Param('id') id: string) {
    const match = await this.matchesService.findMatchById(id)
    if (!match) throw new NotFoundException('Match introuvable')
    return match
  }

  @Post('tournaments')
  createTournament(@Body() dto: CreateTournamentDto) {
    return this.matchesService.createTournament({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    })
  }

  @Post('matches')
  createMatch(@Body() dto: CreateMatchDto) {
    return this.matchesService.createMatch({
      ...dto,
      scheduledAt: new Date(dto.scheduledAt),
    })
  }

  @Post('sync/hltv')
  async syncHltv() {
    return await this.hltvService.test()
    // const upcoming = await this.hltvService.getUpcomingMatches()
    // return this.matchesService.syncFromHltv(upcoming)
  }
}