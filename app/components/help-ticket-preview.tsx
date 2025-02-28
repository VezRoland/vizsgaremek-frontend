import type { Ticket } from "~/types/database"

import { HelpTicketStatus } from "./help-ticket-status"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Link } from "react-router"

export function HelpTicketPreview({ id, title, closed, createdAt }: Ticket) {
	return (
    <Link className="group" to={`/help/${id}`}>
      <Card className="border-0 group-even:border-t group-first:rounded-t-xl group-last:rounded-b-xl rounded-none shadow-none hover:bg-accent cursor-pointer">
        <CardHeader className="flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">
              {new Date(createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <HelpTicketStatus closed={closed} />
        </CardHeader>
      </Card>
    </Link>
	)
}
