import { redirect, useNavigate, useSubmit } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"

import type { Route } from "./+types/new-schedule"
import { ScheduleCategory, UserRole } from "~/types/database"
import type { ApiResponse, SearchResponse } from "~/types/response"

import { UserInput } from "~/components/schedule-table/user-input"
import { UserSearch } from "~/components/schedule-table/user-search"
import { UserSearchProvider } from "~/components/schedule-table/user-search-provider"
import { Button } from "~/components/ui/button"
import { DateTimePicker } from "~/components/ui/datetime-picker"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "~/components/ui/dialog"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "~/components/ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "~/components/ui/select"
import { cn, handleServerResponse, useUserContext } from "~/lib/utils"
import { scheduleSchema } from "~/schemas/schedule"
import { FlagTriangleRightIcon, HandCoins } from "lucide-react"
import { useEffect } from "react"

type FormData = z.infer<typeof scheduleSchema>

export async function clientAction({ request }: Route.ClientActionArgs) {
	const data: FormData = await request.json()

	const response = await fetch("http://localhost:3000/schedule?week_start=2025-03-23T00:00:00", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json"
		},
		credentials: "include"
	})
	const result: ApiResponse = await response.json()

	return result
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	const { searchParams } = new URL(request.url)

	const response = await fetch(
		`http://localhost:3000/schedule/users?name=${searchParams.get(
			"search"
		)}&page=${searchParams.get("page")}`,
		{ credentials: "include" }
	)
	const result: SearchResponse = await response.json()
  console.log(result)

	return result
}

export default function NewSchedule({
	actionData,
	loaderData
}: Route.ComponentProps) {
	const submit = useSubmit()
	const navigate = useNavigate()
	const user = useUserContext()

	const form = useForm<FormData>({
		resolver: zodResolver(scheduleSchema),
		defaultValues: {
			start: new Date(),
			end: new Date(),
			category: "1",
			user_id: user.role === UserRole.Employee ? JSON.stringify([user.id]) : ""
		}
	})

	function onSubmit(values: FormData) {
    console.log(values)

		submit(
			JSON.stringify({
				...values,
				user_id: [...JSON.parse(values.user_id)],
				category: parseInt(values.category),
				company_id: user.company_id
			}),
			{
				method: "POST",
				encType: "application/json"
			}
		)
	}

	useEffect(
		() =>
			handleServerResponse(actionData, {
				callback: () => navigate("/schedule")
			}),
		[actionData]
	)

	return (
		<Dialog
			onOpenChange={open => (!open ? navigate("/schedule") : null)}
			defaultOpen={true}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Schedule</DialogTitle>
					<DialogDescription>
						Add a new record to the already existing work schedules.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						className="flex flex-col"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className="flex flex-col gap-4 py-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								<FormField
									control={form.control}
									name="start"
									render={({ field }) => (
										<FormItem>
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
										<FormItem>
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
							</div>
							<UserSearchProvider>
								<>
									<div className="flex gap-2">
										{user.role === UserRole.Employee ? (
											<input type="hidden" {...form.register("user_id")} />
										) : (
											<FormField
												control={form.control}
												name="user_id"
												render={() => (
													<FormItem className="flex-1 flex-col">
														<FormControl>
															<UserSearch
																data={loaderData.data?.users}
																pageLimit={
																	loaderData.data?.pagination.totalPages
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}
										<FormField
											control={form.control}
											name="category"
											render={({ field }) => (
												<FormItem
													className={cn(
														user.role === UserRole.Employee && "flex-1"
													)}
												>
													<FormControl>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<SelectTrigger icon={<HandCoins />}>
																<SelectValue placeholder="Choose a category" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem
																	value={String(ScheduleCategory.Paid)}
																>
																	Paid
																</SelectItem>
																<SelectItem
																	value={String(ScheduleCategory.Unpaid)}
																>
																	Unpaid
																</SelectItem>
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									{user.role !== UserRole.Employee && (
										<UserInput
											onValueChange={value => {
												form.setValue("user_id", value)
												form.trigger("user_id")
											}}
										/>
									)}
								</>
							</UserSearchProvider>
						</div>
						<div className="flex justify-end gap-2 pt-4">
							<Button type="submit">Add</Button>
							{/* <Button
									type="button"
									onClick={() =>
										navigate("/schedule/new?search=Tim", {
											state: {
												values: form.getValues(),
												errors: form.formState.errors
											}
										})
									}
								>
									Go somewhere
								</Button> */}
							<DialogClose>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</DialogClose>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
