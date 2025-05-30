import { object, date, string } from "zod"

export const scheduleSchema = object({
	start: date(),
	end: date(),
	category: string(),
	userId: string().min(1, "At least one user must be selected")
}).superRefine((data, ctx) => {
	if (new Date(data.end.getTime() - data.start.getTime()).getHours() >= 4) return
	ctx.addIssue({
		code: "custom",
		message: "A schedule must be at least 4 hours long.",
		path: ["start"]
	})
	ctx.addIssue({
		code: "custom",
		message: "A schedule must be at least 4 hours long.",
		path: ["end"]
	})
})
