import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ticketSchema } from "~/schemas/ticket"

import type { Route } from "./+types/help"
import type { Ticket } from "~/types/database"
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
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/ui/select"
import { SelectValue } from "@radix-ui/react-select"

export async function clientAction({ request }: Route.ClientActionArgs) {
	const data = await request.json()

	switch (request.method) {
		case "POST":
			const newTicket = data as z.infer<typeof ticketSchema>

			const response = await fetch("http://localhost/ticket", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(newTicket)
			})

      return response
	}
}

export function clientLoader() {
	return [
		{
			id: "a",
			title: "Test ticket",
			content: "This is a test ticket",
			closed: false,
			createdAt: new Date().toDateString()
		},
		{
			id: "b",
			title: "Another ticket",
			content: "This is a test ticket again",
			closed: true,
			createdAt: new Date().toDateString()
		}
	] satisfies Ticket[]
}

export default function Help({ actionData, loaderData }: Route.ComponentProps) {
  const user = useUserContext()
	const submit = useSubmit()

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
			<Card>
				<CardHeader>
					<CardTitle>Hibajegy létrehozása</CardTitle>
					<CardDescription>
						Hozzon létre hibajegyet az alkalmazással kapcsolatos technikai
						problémák, vagy cégével kapcsolatban.
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
										<FormLabel>Cím</FormLabel>
										<FormControl>
											<Input
												placeholder="Hibajegy rövid ismertető címe"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
              <FormField
                control={form.control}
                name="company_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Címzett</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Címzett" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={user.company_id}>Cég</SelectItem>
                          <SelectItem value="null">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Leírás</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Hibajegy hosszú leírása"
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
								Létrehozás
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
			<section>
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold">Korábbi hibajegyek</h3>
          <Separator className="flex-1" />
        </div>
				<ul className="p-4">
					{loaderData.map(ticket => (
						<HelpTicketPreview key={ticket.id} {...ticket} />
					))}
				</ul>
			</section>
		</main>
	)
}
