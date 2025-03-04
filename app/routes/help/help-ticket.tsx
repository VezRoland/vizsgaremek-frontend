import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ticketResponseSchema } from "~/schemas/ticket"
import { hasPermission } from "~/lib/roles"

import type { Route } from "./+types/help-ticket"
import type { Ticket, TicketResponse } from "~/types/database"
import type { ApiResponse } from "~/types/response"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "~/components/ui/card"
import { HelpTicketStatus } from "~/components/help-ticket-status"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "~/components/ui/form"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"
import { useSubmit } from "react-router"
import { useEffect } from "react"
import { handleServerResponse, useUserContext } from "~/lib/utils"
import { HelpTicketResponse } from "~/components/help-ticket-response"
import ActionLoadingWrapper from "~/components/action-loading-wrapper"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { Input } from "~/components/ui/input"

interface HelpTicket extends Ticket {
	responses: TicketResponse[]
}

export async function clientAction({
	request,
	params: { ticketId }
}: Route.ClientActionArgs) {
	const data = await request.json()
	let response

	switch (request.method) {
		case "POST":
			response = await fetch(
				`http://localhost:3000/ticket/${ticketId}/response`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify(data)
				}
			)

      break
		case "PATCH":
			response = await fetch(
				`http://localhost:3000/ticket/${ticketId}/status`,
				{
					method: "PATCH",
					credentials: "include"
				}
			)

      break
	}

	return response
}

export async function clientLoader({
	params: { ticketId }
}: Route.ClientLoaderArgs) {
	const response = await fetch(
		`http://localhost:3000/ticket/${ticketId}?include_responses`,
		{ credentials: "include" }
	)
	const ticket = (await response.json()) as ApiResponse<HelpTicket>
	return ticket.data
}

export default function HelpTicket({
	actionData,
	loaderData
}: Route.ComponentProps) {
	if (!loaderData) {
		return <h2>Ticket doesn't exist</h2>
	}

	const user = useUserContext()
	const submit = useSubmit()
	const form = useForm<z.infer<typeof ticketResponseSchema>>({
		resolver: zodResolver(ticketResponseSchema),
		defaultValues: {
			content: ""
		}
	})

	async function onSubmit(values: z.infer<typeof ticketResponseSchema>) {
		await submit(values, {
			method: "POST",
			encType: "application/json"
		})
	}

	function onTicketStateChange() {
		submit(null, { method: "PATCH", encType: "application/json" })
	}

	useEffect(() => handleServerResponse(actionData, { form }), [actionData])

	return (
		<main className="w-full max-w-4xl h-screen max-h-[calc(100vh-69px)] flex flex-col gap-4 px-4 py-8 m-auto">
			<Card>
				<CardHeader className="flex-row items-center gap-4">
					<div className="flex flex-1 flex-col gap-1.5">
						<CardTitle>{loaderData.title}</CardTitle>
						<CardDescription>
							{new Date(loaderData.created_at).toLocaleDateString()}
						</CardDescription>
					</div>
					<HelpTicketStatus closed={loaderData.closed} />
					{hasPermission(user, "tickets", "close", loaderData) && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size="icon" variant="ghost">
									<EllipsisVertical />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<ActionLoadingWrapper pathname="/" method="PATCH">
									<DropdownMenuItem onClick={onTicketStateChange}>
										{loaderData.closed ? "Reopen ticket" : "Close ticket"}
									</DropdownMenuItem>
								</ActionLoadingWrapper>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</CardHeader>
				<CardContent>
					<p>{loaderData.content}</p>
				</CardContent>
			</Card>
			<div className="relative flex-1 overflow-y-scroll">
        {loaderData.responses.map(response => (
          <HelpTicketResponse key={response.id} {...response} />
        ))}
			</div>
			{hasPermission(user, "tickets", "respond", loaderData) && (
				<Form {...form}>
					<form className="flex gap-2" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormControl>
										<Input
											placeholder="Content of the response..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<ActionLoadingWrapper pathname="/help-ticket" method="POST">
							<Button>Send</Button>
						</ActionLoadingWrapper>
					</form>
				</Form>
			)}
		</main>
	)
}
