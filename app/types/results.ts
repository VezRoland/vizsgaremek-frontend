import type { Schedule, User } from "./database"

interface ScheduleWithUser extends Omit<Schedule, "user_id"> {
  user: { avatar_url: string } & Pick<User, "name">
}

export interface ScheduleWeek {
	week_start: string,
  prevDate: number,
  nextDate: number,
	schedule: { [key: string]: ScheduleWithUser[] }
}
