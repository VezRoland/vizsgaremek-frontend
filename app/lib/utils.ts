import { createContext, useContext } from "react"
import { data, useNavigate } from "react-router"
import type { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

import type { User } from "~/types/database"
import type { FormMethod } from "react-router"
import type { ApiResponse, ScheduleWeek } from "~/types/results"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const handleServerResponse = <D = unknown, E = unknown>(
	response: ApiResponse<D, E> | undefined,
	options?: {
		form?: UseFormReturn<E extends FieldValues ? E : FieldValues>
		callback?: () => any
	}
) => {
	if (!response) return

	if (response.errors) {
		if (!options?.form) return
		Object.entries<string>(response.errors as FieldValues).forEach(
			([name, message]) => {
				options.form!.setError(
					name as
						| `root.${string}`
						| "root"
						| Path<E extends FieldValues ? E : FieldValues>,
					{
						type: "custom",
						message
					}
				)
			}
		)
	}

	const messageToasts = {
		error: () => toast.error(response.message),
		success: () => toast.success(response.message)
	} as Record<string, () => any>

	if (response.status !== "ignore") messageToasts[response.status]()
	if (response.status !== "error" && options?.callback) options.callback()
}

export async function fetchData<T>(
	path: string,
	options?: {
		method?: FormMethod
		headers?: HeadersInit
		body?: any
		validate?: boolean
	}
): Promise<ApiResponse<T> | undefined> {
	const response = await fetch(`http://localhost:3000/${path}`, {
		method: options?.method || "GET",
		headers: options?.headers,
		...(options?.body ? { body: options.body } : {}),
		credentials: "include"
	})

	if (
		(options?.validate && !response.ok) ||
		!response.headers.get("Content-Type")?.includes("application/json")
	)
		throw data(null, { status: response.status })

	const result: ApiResponse<T> = await response.json()
	handleServerResponse(result)

	return result
}

export const UserContext = createContext<User | undefined>(undefined)

export function useUserContext() {
	const user = useContext(UserContext)

	if (!user) {
		throw Error("The user can only be accessed inside the UserContextProvider!")
	}

	return user
}

export const ScheduleContext = createContext<ScheduleWeek | undefined>(
	undefined
)

export const UserSearchContext = createContext<
	| {
			users: Pick<User, "id" | "name">[]
			add: (user: Pick<User, "id" | "name">) => void
			remove: (userId: string) => void
	  }
	| undefined
>(undefined)

export function useUserSearchContext() {
	const users = useContext(UserSearchContext)

	if (!users) {
		throw Error(
			"The users can only be accessed inside the UserSearchContextProvider!"
		)
	}

	return users
}
