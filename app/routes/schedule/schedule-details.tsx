import type { Route } from "./+types/schedule-details"
import type { ScheduleDetails } from "~/types/results"

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "~/components/ui/dialog"
import { useNavigate, useSearchParams } from "react-router"
import { fetchData, useUserContext } from "~/lib/utils"
import { ScheduleCategory, UserRole } from "~/types/database"
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
import {
	FlagTriangleLeftIcon,
	FlagTriangleRightIcon,
	HandCoins
} from "lucide-react"
import { Button } from "~/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "~/components/ui/select"

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

  const data = loaderData?.data
	const { hour, day } = params

	if (user.role === UserRole.Employee) {
    console.log(loaderData)

		const form = useForm<z.infer<typeof scheduleSchema>>({
			resolver: zodResolver(scheduleSchema),
			defaultValues: {
				category: data?.schedules?.at(0)?.category.toString(),
				start: new Date(data?.schedules?.at(0)?.start || new Date()),
				end: new Date(data?.schedules?.at(0)?.end || new Date()),
				user_id: user.id
			}
		})

		return (
			<Dialog
				onOpenChange={open =>
					!open ? navigate(`/schedule?${searchParams.toString()}`) : null
				}
				defaultOpen={true}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{getDayName(parseInt(day))} -{" "}
							{`${hour.toString().padStart(2, "0")}:00`}
						</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form className="flex flex-col gap-4 py-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
							</div>
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<SelectTrigger icon={<HandCoins />}>
													<SelectValue placeholder="Choose a category" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value={String(ScheduleCategory.Paid)}>
														Paid
													</SelectItem>
													<SelectItem value={String(ScheduleCategory.Unpaid)}>
														Unpaid
													</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
					<DialogFooter>
						<Button>Save</Button>
						<DialogClose>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Dialog
			onOpenChange={open =>
				!open ? navigate(`/schedule?${searchParams.toString()}`) : null
			}
			defaultOpen={true}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{getDayName(parseInt(day))} -{" "}
						{`${hour.toString().padStart(2, "0")}:00`}
					</DialogTitle>
				</DialogHeader>

				<UsersTable
					data={data?.schedules}
					pageLimit={data?.pagination.totalPages}
				/>
			</DialogContent>
		</Dialog>
	)
}
