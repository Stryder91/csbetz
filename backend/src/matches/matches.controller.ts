import { Controller, Get, Param, NotFoundException } from '@nestjs/common'
import { MatchesService } from './matches.service'

@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

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
}