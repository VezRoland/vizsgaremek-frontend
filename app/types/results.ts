import type { Schedule, User } from "./database"

export interface ScheduleWithUser extends Omit<Schedule, "user_id"> {
  user: { avatar_url: string } & Pick<User, "name">
}

export interface ScheduleWeek {
	week_start: string,
  prevDate: number | null,
  nextDate: number | null,
	schedule: { [key: string]: number }
}
