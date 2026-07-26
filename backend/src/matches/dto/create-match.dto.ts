import { IsString, IsUrl, IsISO8601 } from 'class-validator'

export class CreateTournamentDto {
  @IsString()
  name: string

  @IsUrl()
  imageUrl: string

  @IsISO8601()
  startDate: string

  @IsISO8601()
  endDate: string
}

export class CreateMatchDto {
  @IsString()
  tournamentId: string

  @IsString()
  hltvMatchId: string

  @IsString()
  teamAName: string

  @IsUrl()
  teamALogoUrl: string

  @IsString()
  teamBName: string

  @IsUrl()
  teamBLogoUrl: string

  @IsISO8601()
  scheduledAt: string
}