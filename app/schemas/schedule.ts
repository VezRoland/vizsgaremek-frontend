import { object, date, string } from "zod"

export const scheduleSchema = object({
  start: date(),
  end: date(),
  category: string(),
  users: string()
})
