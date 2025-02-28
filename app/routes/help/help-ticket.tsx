import type { Route } from "./+types/help-ticket"
import type { Ticket, TicketResponse } from "~/types/database"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Hourglass } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"

interface HelpTicket extends Ticket {
	responses: TicketResponse[]
}

export function clientLoader({ params: { ticketId } }: Route.ClientLoaderArgs) {
	// GET request
	const ticket = {
		id: "",
		title: "Teszt hibajegy",
		content: "Ennek a teszt hibajegynek a leírása.",
		closed: false,
		createdAt: new Date().toDateString(),
		responses: []
	} satisfies HelpTicket

	return ticket
}

export default function HelpTicket({
	loaderData: { title, content, closed, createdAt, responses }
}: Route.ComponentProps) {
	return (
		<main className="w-full max-w-4xl grid px-4 py-8 m-auto">
			<Card>
				<CardHeader className="flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1.5">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{createdAt}</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-10 h-10 grid place-items-center rounded-full text-accent-foreground bg-accent cursor-default">
                <Hourglass size={18} />
              </TooltipTrigger>
              <TooltipContent>
                <p></p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
				</CardHeader>
        <CardContent>
          <p>{content}</p>
        </CardContent>
			</Card>
		</main>
	)
}
