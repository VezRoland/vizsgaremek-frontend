import type { Schedule, User, UserRole } from "./database"

export interface DetailsUser {
  id: string,
  category: UserRole,
  start: string,
  end: string,
  user: {
    name: string,
    avatar_url: string | null
  }
}

export interface ScheduleWeek {
	week_start: string,
  prevDate: number | null,
  nextDate: number | null,
	schedule: { [key: string]: number }
}
