import { object, string } from "zod"

export const signInSchema = object({
	email: string()
		.min(1, "Adja meg email címét")
		.email("Adjon meg egy érvényes email címet"),
	password: string().min(1, "Adja meg jelszavát")
})
