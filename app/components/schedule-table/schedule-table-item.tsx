import { useSubmit } from "react-router"
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
	const { tableData, fieldData } = useScheduleContext()
	const userContext = useUserContext()
	const submit = useSubmit()
	const data = tableData.schedule[`${row}-${column}`] || []

	const form = useForm<z.infer<typeof scheduleSchema>>({
		resolver: zodResolver(scheduleSchema),
		defaultValues: {
			category: String(fieldData?.at(0)?.category || 1),
			start: new Date(fieldData?.at(0)?.start || new Date()),
			end: new Date(fieldData?.at(0)?.end || new Date()),
			user_id: userContext.id
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
				weekStart: tableData.week_start,
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
		submit(
			JSON.stringify({
				type: "EDIT_SCHEDULE",
				id: fieldData![0].id,
				start: values.start,
				end: values.end
			}),
			{
				method: "POST",
				encType: "application/json"
			}
		)
	}

	if (typeof data !== "number" || data === 0)
		return (
			<td
				className={cn(
					"p-6 border group-last:border-b-0",
					getToday() === column + 1 && "border-b-background bg-primary/25"
				)}
			></td>
		)

	return (
		<Dialog onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<td
					className={cn(
						"relative border group-last:border-b-0",
						getToday() === column + 1 && "border-b-background bg-primary/25"
					)}
				>
					<div className="flex flex-col px-4 py-2">
						<span
							className={cn(
								"text-sm text-muted-foreground",
								userContext.role < UserRole.Leader && "text-foreground"
							)}
						>
							{(row).toString().padStart(2, "0")}:00
						</span>
						{userContext.role > UserRole.Employee && (
							<span className="text-lg font-medium">
								{data} {data > 1 ? "employees" : "employee"}
							</span>
						)}
					</div>
				</td>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{getDayName()} - {`${(row).toString().padStart(2, "0")}:00`}
					</DialogTitle>
				</DialogHeader>
				{userContext.role > UserRole.Employee ? (
					<UsersTable />
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
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
				)}
				<DialogFooter className="gap-2">
					{hasPermission(userContext, "schedules", "finalize") && (
						<Button type="submit">Finalize</Button>
					)}
					{userContext.role < UserRole.Leader && (
						<Button type="submit">Edit</Button>
					)}
					<DialogClose className="!m-0" asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
