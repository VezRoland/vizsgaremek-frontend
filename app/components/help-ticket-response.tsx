import type { TicketResponse } from "~/types/database"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function HelpTicketResponse({ name, content, created_at }: TicketResponse) {
	return (
		<Card className="border-0 border-b last:border-0 rounded-none has-[focus]:text-red-500 has-[focus-visible]:outline-none has-[focus-visible]:ring-2 has-[focus-visible]:ring-ring has-[focus-visible]:ring-offset-2 shadow-none bg-background">
			<CardHeader className="flex-row items-center gap-2 pb-2 space-y-0">
        <Avatar className="w-6 h-6">
          <AvatarImage></AvatarImage>
          <AvatarFallback className="text-sm">
            {name.substring(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
				<CardTitle className="flex-1 text-sm">{name}</CardTitle>
        <span className="text-sm text-muted-foreground">{new Date(created_at).toLocaleDateString()}</span>
			</CardHeader>
			<CardContent>
				<p>{content}</p>
			</CardContent>
		</Card>
	)
}
