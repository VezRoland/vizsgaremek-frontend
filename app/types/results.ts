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

export interface InactiveTraining {
  id: string,
  name: string,
  description: string,
  file_url: string,
  isActive: false,
  created_at: string
}

export interface ActiveTraining {
  id: string,
	name: string,
  description: string,
  isActive: true,
  questions: TrainingQuestion[]
  createdAt: string,
}

export type Training = InactiveTraining | ActiveTraining

export interface TrainingPreview {
  id: string,
  name: string,
  description: string,
  createdAt: string
}

export interface TrainingSubmission {
  id: string,
	name: string
	training: string
	score: string
	submittedAt: string
}

export interface TrainingQuestion {
  id: string,
  name: string,
  answers: string[],
  multipleCorrect: boolean,
}
