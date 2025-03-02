export interface User {
	id: string
	name: string
	age?: number
	hourly_wage?: number
	role: UserRole
	company_id: string
	verified: boolean
	created_at: string
}

export enum UserRole {
	"employee" = 1,
	"leader",
	"owner",
	"admin"
}

export interface Company {
	id: string
	name: string
	code: string
	created_at: string
}

export interface Ticket {
	id: string
	title: string
	content: string
	closed: boolean
	user_id: string
	created_at: string
	company_id: string
}

export interface TicketResponse {
	id: string
	content: string,
  name: string,
	user_id: string
	ticket_id: string
	created_at: string
}
