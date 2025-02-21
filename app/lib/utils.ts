import { createContext, useContext } from "react"
import type { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

import type { MessageErrorType, ServerResponse } from "~/types/response"
import type { User } from "~/types/database"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const handleServerResponse = <T = undefined>(
	response: ServerResponse<T> | undefined,
	options?: {
		form?: UseFormReturn<T extends FieldValues ? T : FieldValues>
		callback?: () => any
	}
) => {
	if (!response) return

	if (response.type === "field") {
		if (!options?.form) return
		Object.entries<string>(response.fields as FieldValues).forEach(
			([name, message]) => {
				options.form!.setError(
					name as
						| `root.${string}`
						| "root"
						| Path<T extends FieldValues ? T : FieldValues>,
					{
						type: "custom",
						message
					}
				)
			}
		)
	}

	if (response.type === "message") {
		const messageToasts = {
			error: () =>
				toast.error(response.message, { description: response.description }),
			warning: () =>
				toast.warning(response.message, { description: response.description }),
			success: () =>
				toast.success(response.message, { description: response.description }),
			info: () =>
				toast.info(response.message, { description: response.description })
		} as Record<MessageErrorType, () => any>

		messageToasts[response.messageType]()
	}

	if (!response.error && options?.callback) options.callback()
}

export const UserContext = createContext<User | null>(null)

export function useUserContext() {
	const user = useContext(UserContext)

	if (!user) {
		throw Error("The user can only be accessed inside the UserContextProvider!")
	}

	return user
}
