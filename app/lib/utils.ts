import { createContext, useContext } from "react"
import type { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

import type { ApiResponse } from "~/types/response"
import type { User } from "~/types/database"
import type { ScheduleWeek, ScheduleWithUser } from "~/types/results"

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

	messageToasts[response.status]()
	if (response.status !== "error" && options?.callback) options.callback()
}

export const UserContext = createContext<User | undefined>(undefined)

export function useUserContext() {
	const user = useContext(UserContext)

	if (!user) {
		throw Error("The user can only be accessed inside the UserContextProvider!")
	}

	return user
}

export const ScheduleContext = createContext<
	{ tableData: ScheduleWeek; fieldData?: ScheduleWithUser[] } | undefined
>(undefined)

export function useScheduleContext() {
	const schedule = useContext(ScheduleContext)

	if (!schedule) {
		throw Error(
			"The schedule can only be accessed inside the ScheduleContextProvider!"
		)
	}

	return schedule
}
