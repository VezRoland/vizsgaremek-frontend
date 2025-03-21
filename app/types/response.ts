import type { Schedule, User } from "./database"
import type { ScheduleWithUser } from "./results"

export interface ApiResponse<D = unknown, E = unknown> {
	status: "success" | "error" | "ignore"
	message: string
	data?: D
	errors?: E
}

export interface DetailsResponse extends ApiResponse<ScheduleWithUser[]> {
	type: "DetailsResponse"
}

export interface SearchResponse
	extends ApiResponse<Pick<User & Schedule, "id" | "name">[]> {
	type: "SearchResponse"
	page: number
}
