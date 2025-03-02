import type { TicketResponse } from "~/types/database"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function HelpTicketResponse({ name, content }: TicketResponse) {
	return (
		<Card className="border-0 border-b last:border-0 rounded-none has-[focus]:text-red-500 has-[focus-visible]:outline-none has-[focus-visible]:ring-2 has-[focus-visible]:ring-ring has-[focus-visible]:ring-offset-2 shadow-none">
			<CardHeader className="pb-0">
				<CardTitle className="text-lg">{name}</CardTitle>
			</CardHeader>
			<CardContent>
				<p>{content}</p>
			</CardContent>
		</Card>
	)
}
