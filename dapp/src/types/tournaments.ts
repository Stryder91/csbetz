export interface Tournament {
  id: string
  name: string
  imageUrl: string
  startDate: string
  endDate: string
  status: 'upcoming' | 'live' | 'finished'
}