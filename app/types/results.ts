import type { User, UserRole } from "./database"

export interface UserSearch {
  users: User[]
  pagination: Pagination
}

export interface DetailsUser {
	id: string
	category: UserRole
	start: string
	end: string
	user: {
		name: string
		avatar_url: string | null
	}
}

export interface ScheduleDetails {
  schedules: DetailsUser[],
  pagination: Pagination
}

export interface ScheduleWeek {
	week_start: string
	prevDate: number | null
	nextDate: number | null
	schedule: { [key: string]: number }
}

export interface Pagination {
	totalPages: number
	currentPage: number
	limit: number
	totalItems: number
}
