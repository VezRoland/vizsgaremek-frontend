import { object, string } from "zod"

export const ticketSchema = object({
  title: string().min(1, "A hibajegy címének megadása szükséges.").max(50, "A hibajegy címe legfejlebb 50 karakterből állhat."),
  company_id: string().min(1, "A hibajegy címzettjének megadása szükséges."),
  content: string().min(1, "A hibajegy leírásának megadása szükséges.")
})
