import type { Schedule, User } from "./database"
import type { DetailsUser } from "./results"

export interface ApiResponse<D = unknown, E = unknown> {
	status: "success" | "error" | "ignore"
	message: string
	data?: D
	errors?: E
}

export interface DetailsResponse extends ApiResponse<DetailsUser[]> {
	type: "DetailsResponse"
}

export interface SearchResponse
	extends ApiResponse<User[]> {
	type: "SearchResponse"
	page: number
}
