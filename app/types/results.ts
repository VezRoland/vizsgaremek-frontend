import type { UserRole } from "./database"

export interface ApiResponse<D = unknown, E = unknown> {
	status: "success" | "error" | "ignore"
	message: string
	data?: D
	errors?: E
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
	prevDate: string | null
	nextDate: string | null
	schedule: { [key: string]: number }
}

export interface Pagination {
	totalPages: number
	currentPage: number
	limit: number
	totalItems: number
}
