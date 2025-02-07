import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

import type {
	FieldValues,
	Path,
	UseFormReturn
} from "react-hook-form"
import type {
	MessageErrorType,
	ServerResponse
} from "./types"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const handleServerResponse = <T = undefined>(
	response: ServerResponse<T> | undefined,
	{
		form,
		callback
	}: {
		form?: UseFormReturn<T extends FieldValues ? T : FieldValues>
		callback?: () => any
	}
) => {
	if (!response) return

	if (response.type === "field") {
		if (!form) return
		Object.entries<string>(response.fields as FieldValues).forEach(
			([name, message]) => {
				form.setError(
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

	if (!response.error && callback) callback()
}
