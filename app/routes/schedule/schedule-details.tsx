import type { Route } from "./+types/schedule-details"
import type { ScheduleDetails } from "~/types/results"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from "~/components/ui/dialog"
import { useNavigate, useSearchParams } from "react-router"
import { fetchData, useUserContext } from "~/lib/utils"
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
	const data = await request.json()
	switch (request.method) {
		case "PATCH":
			return fetchData("schedule/finalize", { method: "PATCH", body: data })
	}
}

export async function clientLoader({
	request,
	params: { hour, day }
}: Route.ClientLoaderArgs) {
	const { searchParams } = new URL(request.url)
	return fetchData<ScheduleDetails>(
		`schedule/details/${hour}-${day}?${searchParams.toString()}`
	)
}

function getDayName(index: number) {
	const days = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
    "Sunday"
	]
	return days[index]
}

export default function Details({ params, loaderData }: Route.ComponentProps) {
	const navigate = useNavigate()
  const [searchParams] = useSearchParams()
	const user = useUserContext()

  console.log(loaderData)

	const form = useForm<z.infer<typeof scheduleSchema>>({
		resolver: zodResolver(scheduleSchema),
		defaultValues: {
			category:
				user.role === UserRole.Employee
					? loaderData?.schedules?.at(0)?.category.toString()
					: "1",
			start:
				user.role === UserRole.Employee
					? new Date(loaderData?.schedules?.at(0)?.start || new Date())
					: new Date(),
			end:
				user.role === UserRole.Employee
					? new Date(loaderData?.schedules?.at(0)?.end || new Date())
					: new Date(),
			user_id: user.id
		}
	})

	const { hour, day } = params

	return (
		<Dialog
			onOpenChange={open => (!open ? navigate(`/schedule?${searchParams.toString()}`) : null)}
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
						data={loaderData?.schedules}
						pageLimit={loaderData?.pagination.totalPages}
					/>
				)}
			</DialogContent>
		</Dialog>
	)
}
