import type { User } from "./database"
import type { Pagination, ScheduleDetails, UserSearch } from "./results"

export interface ApiResponse<D = unknown, E = unknown> {
	status: "success" | "error" | "ignore"
	message: string
	data?: D
	errors?: E
}

export interface DetailsResponse extends ApiResponse<ScheduleDetails> {
	type: "DetailsResponse"
}

export interface SearchResponse extends ApiResponse<UserSearch> {
	type: "SearchResponse"
}
