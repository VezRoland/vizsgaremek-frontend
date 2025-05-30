import { object, instanceof as instanceof_, number, string, coerce } from "zod"

const MAX_FILE_SIZE = 2 * 1024 * 1024

export const avatarSchema = object({
	avatar: instanceof_(File, { message: "Upload an image" })
		.refine(file => file.size <= MAX_FILE_SIZE, "Max file size is 2MB")
		.refine(
			file => file.type.startsWith("image"),
			"Only image formats are supported"
		)
})

export const profileSchema = object({
	name: string({ message: "Name is required" })
		.min(1, "Name is required")
		.max(150, "Name is too long (max. 150 characters)"),
	age: coerce
		.number({
			required_error: "Age is required",
			invalid_type_error: "Age must be a number"
		})
		.min(14, "Age must be at least 14")
		.max(120, "Age cannot be more than 120")
})
