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
	Employee = 1,
	Leader,
	Owner,
	Admin
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
	company_id: string
	created_at: string
}
