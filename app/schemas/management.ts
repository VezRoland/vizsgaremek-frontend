import { coerce, object, string } from "zod"

export const editEmployeeSchema = object({
	id: string(),
	hourlyWage: coerce
		.number({ message: "Hourly wage should be a number" })
		.min(0, "Hourly wage has to be positive"),
	role: coerce.number()
})
