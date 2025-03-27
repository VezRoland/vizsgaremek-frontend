import type { Route } from "./+types/schedule-details"
import type { ApiResponse, ScheduleDetails } from "~/types/results"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from "~/components/ui/dialog"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { handleServerResponse, useUserContext } from "~/lib/utils"
import { UserRole } from "~/types/database"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "~/components/ui/form"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { scheduleSchema } from "~/schemas/schedule"
import { zodResolver } from "@hookform/resolvers/zod"
import { DateTimePicker } from "~/components/ui/datetime-picker"
import { UsersTable } from "~/components/schedule-table/users-table"
import { FlagTriangleLeftIcon, FlagTriangleRightIcon } from "lucide-react"

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Edit Schedule" },
		{ name: "description", content: "Edit a specific schedule" }
	]
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	let result: Promise<ApiResponse> | null

	switch (request.method) {
		case "PATCH": {
			const { scheduleIds, finalized } = await request.json()
			const response = await fetch("http://localhost:3000/schedule/finalize", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					schedule_ids: scheduleIds,
					finalized
				}),
				credentials: "include"
			})
			return (result = response.json())
		}
		default: {
			result = null
		}
	}

	return result
}

export async function clientLoader({
	params: { hour, day }
}: Route.ClientLoaderArgs) {
	const response = await fetch(
		`http://localhost:3000/schedule/details/${hour}-${day}?week_start=2025-03-23T00:00:00`,
		{ credentials: "include" }
	)

	return response.json() as Promise<ApiResponse<ScheduleDetails>>
}

function getDayName(index: number) {
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	]
	return days[index]
}

export default function ScheduleDetails({
	params,
	actionData,
	loaderData
}: Route.ComponentProps) {
	const navigate = useNavigate()
	const user = useUserContext()

	const form = useForm<z.infer<typeof scheduleSchema>>({
		resolver: zodResolver(scheduleSchema),
		defaultValues: {
			category:
				user.role === UserRole.Employee
					? loaderData.data?.schedules?.at(0)?.category.toString()
					: "1",
			start:
				user.role === UserRole.Employee
					? new Date(loaderData.data?.schedules?.at(0)?.start || new Date())
					: new Date(),
			end:
				user.role === UserRole.Employee
					? new Date(loaderData.data?.schedules?.at(0)?.end || new Date())
					: new Date(),
			user_id: user.id
		}
	})

	const { hour, day } = params

	useEffect(() => handleServerResponse(actionData), [actionData])

	return (
		<Dialog
			onOpenChange={open => (!open ? navigate("/schedule") : null)}
			defaultOpen={true}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{getDayName(parseInt(day))} -{" "}
						{`${hour.toString().padStart(2, "0")}:00`}
					</DialogTitle>
				</DialogHeader>
				{user.role === UserRole.Employee ? (
					<Form {...form}>
						<form>
							<FormField
								control={form.control}
								name="start"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<DateTimePicker
												className="overflow-clip"
												icon={<FlagTriangleRightIcon />}
												granularity="minute"
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="end"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<DateTimePicker
												className="max-w-full text-clip"
												icon={<FlagTriangleLeftIcon />}
												granularity="minute"
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				) : (
					<UsersTable
						data={loaderData.data?.schedules}
						pageLimit={loaderData.data?.pagination.totalPages}
					/>
				)}
			</DialogContent>
		</Dialog>
	)
}
