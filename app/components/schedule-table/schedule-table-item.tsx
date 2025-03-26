import { Link, useSubmit } from "react-router"
import { cn, useScheduleContext, useUserContext } from "~/lib/utils"

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "../ui/dialog"
import { Button } from "../ui/button"
import { UsersTable } from "./users-table"
import { UserRole } from "~/types/database"
import { hasPermission } from "~/lib/roles"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { scheduleSchema } from "~/schemas/schedule"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { DateTimePicker } from "../ui/datetime-picker"
import { FlagTriangleLeftIcon, FlagTriangleRightIcon } from "lucide-react"

export function ScheduleTableItem({
	row,
	column
}: {
	row: number
	column: number
}) {
	const { week_start, schedule } = useScheduleContext()
	const user = useUserContext()
	const submit = useSubmit()
	const data = schedule[`${row}-${column}`] || []

	const form = useForm<z.infer<typeof scheduleSchema>>({
		resolver: zodResolver(scheduleSchema),
		defaultValues: {
			category: "1",
			start: new Date(),
			end: new Date(),
			user_id: user.id
		}
	})

	function getToday() {
		const today = new Date().getDay()
		return today === 0 ? 7 : today
	}

	function getDayName() {
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesdy",
			"Thursday",
			"Friday",
			"Saturday"
		]
		return days[column]
	}

	async function getDetailS() {
		await submit(
			{
				type: "VIEW_DETAILS",
				field: `${row}-${column}`,
				weekStart: week_start,
				page: 1
			},
			{ method: "POST", encType: "application/json" }
		)
	}

	async function onOpenChange(open: boolean) {
		if (!open) return
		getDetailS()
	}

	function onSubmit(values: z.infer<typeof scheduleSchema>) {
		// submit(
		// 	JSON.stringify({
		// 		type: "EDIT_SCHEDULE",
		// 		id: schedule![0].,
		// 		start: values.start,
		// 		end: values.end
		// 	}),
		// 	{
		// 		method: "POST",
		// 		encType: "application/json"
		// 	}
		// )
	}

	if (typeof data !== "number" || data === 0)
		return (
			<td
				className={cn(
					"h-16 p-6 border group-last:border-b-0",
					getToday() === column + 1 && "border-b-background bg-primary/25"
				)}
			></td>
		)

	return (
		<td
			className={cn(
				"relative h-16 border group-last:border-b-0",
				getToday() === column + 1 && "border-b-background bg-primary/25"
			)}
		>
			<Link to={`/schedule/details/${row}/${column}`}>
				<div className="flex flex-col px-4 py-2">
					<span
						className={cn(
							"text-sm text-muted-foreground",
							user.role === UserRole.Employee && "text-foreground"
						)}
					>
						{row.toString().padStart(2, "0")}:00
					</span>
					{user.role > UserRole.Employee && (
						<span className="text-lg font-medium">
							{data} {data > 1 ? "employees" : "employee"}
						</span>
					)}
				</div>
			</Link>
		</td>
		// <Dialog onOpenChange={onOpenChange}>
		// 	<DialogTrigger asChild>
		// 		<td
		// 			className={cn(
		// 				"relative h-16 border group-last:border-b-0",
		// 				getToday() === column + 1 && "border-b-background bg-primary/25"
		// 			)}
		// 		>
		// 			<div className="flex flex-col px-4 py-2">
		// 				<span
		// 					className={cn(
		// 						"text-sm text-muted-foreground",
		// 						user.role === UserRole.Employee && "text-foreground"
		// 					)}
		// 				>
		// 					{(row).toString().padStart(2, "0")}:00
		// 				</span>
		// 				{user.role > UserRole.Employee && (
		// 					<span className="text-lg font-medium">
		// 						{data} {data > 1 ? "employees" : "employee"}
		// 					</span>
		// 				)}
		// 			</div>
		// 		</td>
		// 	</DialogTrigger>
		// 	<DialogContent>
		// 		<DialogHeader>
		// 			<DialogTitle>
		// 				{getDayName()} - {`${(row).toString().padStart(2, "0")}:00`}
		// 			</DialogTitle>
		// 		</DialogHeader>
		// 		{user.role > UserRole.Employee ? (
		// 			<UsersTable />
		// 		) : (
		// 			<Form {...form}>
		// 				<form onSubmit={form.handleSubmit(onSubmit)}>
		// 					<FormField
		// 						control={form.control}
		// 						name="start"
		// 						render={({ field }) => (
		// 							<FormItem className="flex-1">
		// 								<FormControl>
		// 									<DateTimePicker
		// 										className="overflow-clip"
		// 										icon={<FlagTriangleRightIcon />}
		// 										granularity="minute"
		// 										value={field.value}
		// 										onChange={field.onChange}
		// 									/>
		// 								</FormControl>
		// 								<FormMessage />
		// 							</FormItem>
		// 						)}
		// 					/>
		// 					<FormField
		// 						control={form.control}
		// 						name="end"
		// 						render={({ field }) => (
		// 							<FormItem className="flex-1">
		// 								<FormControl>
		// 									<DateTimePicker
		// 										className="max-w-full text-clip"
		// 										icon={<FlagTriangleLeftIcon />}
		// 										granularity="minute"
		// 										value={field.value}
		// 										onChange={field.onChange}
		// 									/>
		// 								</FormControl>
		// 								<FormMessage />
		// 							</FormItem>
		// 						)}
		// 					/>
		// 				</form>
		// 			</Form>
		// 		)}
		// 		<DialogFooter className="gap-2">
		// 			{hasPermission(user, "schedules", "finalize") && (
		// 				<Button type="submit">Finalize</Button>
		// 			)}
		// 			{user.role === UserRole.Employee && (
		// 				<Button type="submit">Edit</Button>
		// 			)}
		// 			<DialogClose className="!m-0" asChild>
		// 				<Button variant="secondary">Cancel</Button>
		// 			</DialogClose>
		// 		</DialogFooter>
		// 	</DialogContent>
		// </Dialog>
	)
}
