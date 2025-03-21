import { object, date, string } from "zod"

export const scheduleSchema = object({
  start: date(),
  end: date(),
  category: string(),
  user_id: string().min(1, "At least one user must be selected")
})
