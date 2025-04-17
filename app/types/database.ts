export interface User {
	id: string
	name: string
	age?: number
	hourlyWage?: number
	role: UserRole
	companyId: string
	verified: boolean
	createdAt: string
}

export enum UserRole {
	Employee = 1,
	Leader,
	Owner,
	Admin
}

export interface Company {
	id: string
	name: string
	code: string
  verified: boolean
	createdAt: string
}

export interface Schedule {
	id: string
	start: string
	end: string
	category: ScheduleCategory
	user_id: string
	company_id: string
}

export enum ScheduleCategory {
	Paid = 1,
	Unpaid
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
	content: string
	name: string
	user_id: string
	ticket_id: string
	company_id: string
	created_at: string
}
