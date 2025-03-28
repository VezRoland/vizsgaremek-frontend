import { useEffect } from "react"
import { useNavigate, useSearchParams, useSubmit } from "react-router"
import {
	cn,
	fetchData,
	handleServerResponse,
	useUserContext
} from "~/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { scheduleSchema } from "~/schemas/schedule"

import type { Route } from "./+types/new-schedule"
import { ScheduleCategory, UserRole, type User } from "~/types/database"
import type { Pagination } from "~/types/results"
import type { ApiResponse } from "~/types/results"

import { UserInput } from "~/components/schedule-table/user-input"
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
import { UserSearch } from "~/components/schedule-table/user-search"
import { FlagTriangleRightIcon, HandCoins, Loader2 } from "lucide-react"

type FormData = z.infer<typeof scheduleSchema>

interface Search {
	users: User[]
	pagination: Pagination
}

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New Schedule" },
		{ name: "description", content: "Create a new schedule" }
	]
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const data: FormData = await request.json()
	return fetchData("schedule", { method: "POST", body: data })
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	const { searchParams } = new URL(request.url)
  console.log(searchParams.toString())
	return fetchData<Search>(`schedule/users?${searchParams.toString()}`)
}

export default function NewSchedule({ loaderData }: Route.ComponentProps) {
	const submit = useSubmit()
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const user = useUserContext()

	const form = useForm<FormData>({
		resolver: zodResolver(scheduleSchema),
		defaultValues: {
			start: new Date(searchParams.get("weekStart") || new Date()),
			end: new Date(searchParams.get("weekStart") || new Date()),
			category: "1",
			user_id: user.role === UserRole.Employee ? JSON.stringify([user.id]) : ""
		}
	})

	async function onSubmit(values: FormData) {
		await submit(
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

	return (
		<Dialog
			onOpenChange={open =>
				!open
					? navigate(`/schedule?weekStart=${searchParams.get("weekStart")}`)
					: null
			}
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
																data={loaderData?.users}
																pageLimit={
																	loaderData?.pagination?.totalPages
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
											}}
										/>
									)}
								</>
							</UserSearchProvider>
						</div>
						<div className="flex justify-end gap-2 pt-4">
							<Button
								type="submit"
								disabled={
									form.formState.isSubmitting ||
									Object.keys(form.formState.errors).length > 0
								}
							>
								{form.formState.isSubmitting && (
									<Loader2 className="animate-spin" />
								)}
								Add
							</Button>
							<DialogClose>
								<Button
									type="button"
									variant="outline"
									disabled={
										form.formState.isSubmitting ||
										Object.keys(form.formState.errors).length > 0
									}
								>
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
