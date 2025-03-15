import { object, date, string } from "zod"

export const scheduleSchema = object({
  start: date(),
  end: date(),
  category: string(),
  users: string()
})
.refine(({start, end}) => start > end, { message: "Start date must be before end date", path: ["start"] })
.refine(({start, end}) => start < end, { message: "End date must be after start date", path: ["end"] })