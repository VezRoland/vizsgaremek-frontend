import type { UserRole } from "./database"

export interface ApiResponse<D = unknown, E = unknown> {
	status: "success" | "error" | "ignore"
	message: string
	data?: D
	errors?: E
	redirect?: string
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
	schedules: DetailsUser[]
	pagination: Pagination
}

export interface ScheduleWeek {
	weekStart: string
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

export interface InactiveTraining {
	id: string
	name: string
	description: string
	fileUrl: string
	isActive: false
	created_at: string
}

export interface ActiveTraining {
	id: string
	name: string
	description: string
	isActive: true
	questions: TrainingQuestion[]
	createdAt: string
}

export type Training = InactiveTraining | ActiveTraining

export interface TrainingPreview {
	id: string
	name: string
	description: string
	active: boolean
	completed: boolean
	createdAt: string
}

export interface TrainingResult {
	id: string
	userName: string
	trainingName: string
	questionEvaluations?: TrainingQuestionEvaluation[]
	totalQuestions: number
	incorrectCount: number
	correctCount: number
	createdAt: string
}

export interface TrainingQuestionEvaluation {
	id: string
  name: string
	answers: {
    id: string
		name: string
		selectedByUser: boolean
    correct: boolean
	}[]
  multipleCorrect: boolean
}

export interface TrainingQuestion {
	id: string
	name: string
	answers: string[]
	multipleCorrect: boolean
}
