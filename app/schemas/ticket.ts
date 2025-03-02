import { object, string } from "zod"

export const ticketSchema = object({
  title: string().min(1, "The title of the ticket is required").max(50, "The title of the ticket can be 50 characters long at maximum"),
  company_id: string().min(1, "The receiver of the ticket needs to be selected"),
  content: string().min(1, "The description of the ticket is required")
})

export const ticketResponseSchema = object({
  content: string().min(1, "The content of the response is required")
})
