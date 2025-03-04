import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ticketSchema } from "~/schemas/ticket"

import type { Route } from "./+types/help"
import { UserRole, type Ticket } from "~/types/database"
import type { ApiResponse } from "~/types/response"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { useSubmit } from "react-router"
import { useEffect } from "react"
import { handleServerResponse, useUserContext } from "~/lib/utils"
import { Loader2 } from "lucide-react"
import { HelpTicketStatus } from "~/components/help-ticket-status"
import { HelpTicketPreview } from "~/components/help-ticket-preview"
import { Separator } from "~/components/ui/separator"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger
} from "~/components/ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { hasPermission } from "~/lib/roles"

export async function clientAction({ request }: Route.ClientActionArgs) {
	const data = await request.json()

	switch (request.method) {
		case "POST":
			const newTicket = {
				...data,
				company_id: JSON.parse(data.company_id)
			} as z.infer<typeof ticketSchema>

			const response = await fetch("http://localhost:3000/ticket", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(newTicket)
			})

			return response
	}
}

export async function clientLoader() {
	const response = await fetch("http://localhost:3000/ticket/all", {
		credentials: "include"
	})
	const tickets = (await response.json()) as ApiResponse<Ticket[]>
	return tickets.data || []
}

export default function Help({ actionData, loaderData }: Route.ComponentProps) {
	const user = useUserContext()
	const submit = useSubmit()

	let ownTickets: Ticket[] = []
	let notOwnTickets: Ticket[] = []

	loaderData.forEach(ticket => {
		if (ticket.user_id === user.id) return ownTickets.push(ticket)
		notOwnTickets.push(ticket)
	})

	const form = useForm<z.infer<typeof ticketSchema>>({
		resolver: zodResolver(ticketSchema),
		defaultValues: {
			title: "",
			company_id: "null",
			content: ""
		}
	})

	async function onSubmit(values: z.infer<typeof ticketSchema>) {
		await submit(values, {
			method: "POST",
			encType: "application/json"
		})
	}

	useEffect(() => handleServerResponse(actionData, { form }), [actionData])

	return (
		<main className="w-full max-w-4xl grid gap-8 px-4 py-8 m-auto">
			{hasPermission(user, "tickets", "create") && (
				<Card>
					<CardHeader>
						<CardTitle>Ticket creation</CardTitle>
						<CardDescription>
							{user.role === UserRole.Owner
								? "Create a ticket regarding technical issues with the application."
								: "Create a ticket regarding technical issues with the application or your company."}
						</CardDescription>
					</CardHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<CardContent>
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl>
												<Input
													placeholder="Short, descriptive title"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{user.role !== UserRole.Owner && (
									<FormField
										control={form.control}
										name="company_id"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Receiver</FormLabel>
												<FormControl>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<SelectTrigger>
															<SelectValue placeholder="Receiver" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value={user.company_id}>
																Company
															</SelectItem>
															<SelectItem value="null">Admin</SelectItem>
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Detailed description"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
							<CardFooter className="justify-end">
								<Button type="submit" disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting && (
										<Loader2 className="animate-spin" />
									)}
									Create
								</Button>
							</CardFooter>
						</form>
					</Form>
				</Card>
			)}
			{notOwnTickets.length > 0 && (
				<section>
					<div className="flex items-center gap-4">
						<h3 className="text-xl font-semibold">
							{user.role === UserRole.Admin ? "Tickets" : "Company tickets"}
						</h3>
						<Separator className="flex-1" />
					</div>
					<div className="flex flex-col p-4">
						{notOwnTickets.map(ticket => (
							<HelpTicketPreview key={ticket.id} {...ticket} />
						))}
					</div>
				</section>
			)}
			{ownTickets.length > 0 && (
				<section>
					<div className="flex items-center gap-4">
						<h3 className="text-xl font-semibold">Own tickets</h3>
						<Separator className="flex-1" />
					</div>
					<div className="flex flex-col p-4">
						{ownTickets.map(ticket => (
							<HelpTicketPreview key={ticket.id} {...ticket} />
						))}
					</div>
				</section>
			)}
		</main>
	)
}
