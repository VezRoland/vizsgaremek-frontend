import { useSubmit } from "react-router"
import { hasPermission } from "~/lib/roles"
import { fetchData, useUserContext } from "~/lib/utils"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ticketResponseSchema } from "~/schemas/ticket"

import type { Route } from "./+types/help-ticket"
import type { Ticket, TicketResponse } from "~/types/database"

import {
  Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "~/components/ui/card"
import { HelpTicketResponse } from "~/components/help-ticket-response"
import { HelpTicketStatus } from "~/components/help-ticket-status"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "~/components/ui/form"
import { Button } from "~/components/ui/button"
import ActionLoadingWrapper from "~/components/action-loading-wrapper"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import { EllipsisVertical } from "lucide-react"

interface HelpTicket extends Ticket {
	responses: TicketResponse[]
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Help Ticket" },
    { name: "description", content: "View the details of a help ticket" }
  ]
}

export async function clientAction({
	request,
	params: { ticketId }
}: Route.ClientActionArgs) {
	const data = await request.json()

	switch (request.method) {
		case "POST":
			return fetchData(`ticket/${ticketId}/response`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data)
			})
		case "PATCH":
			return fetchData(`ticket/${ticketId}/status`, { method: "PATCH" })
	}
}

export async function clientLoader({
	params: { ticketId }
}: Route.ClientLoaderArgs) {
	const response = await fetchData<HelpTicket>(
		`ticket/${ticketId}?include_responses`
	)
	return response?.data
}

export default function HelpTicket({ loaderData }: Route.ComponentProps) {
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
								<ActionLoadingWrapper type="PATCH">
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
						<ActionLoadingWrapper type="POST">
							<Button>Send</Button>
						</ActionLoadingWrapper>
					</form>
				</Form>
			)}
		</main>
	)
}
