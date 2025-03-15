import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { scheduleSchema } from "~/schemas/schedule"

import type { ReactElement } from "react"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "../ui/dialog"
import { Button } from "../ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "../ui/form"
import { Input } from "../ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../ui/select"
import { ScheduleCategory } from "~/types/database"
import {
	FlagTriangleLeftIcon,
	FlagTriangleRight,
	FlagTriangleRightIcon,
	HandCoins,
	Search
} from "lucide-react"
import { DateTimePicker } from "../ui/datetime-picker"

export function NewScheduleDialog({ children }: { children: ReactElement }) {
	const form = useForm<z.infer<typeof scheduleSchema>>({
		resolver: zodResolver(scheduleSchema),
		defaultValues: {
			start: new Date(),
			end: new Date(new Date().getTime() + 3600000),
			category: String(ScheduleCategory.Paid),
			users: ""
		}
	})

	function onSubmit(values: z.infer<typeof scheduleSchema>) {
		console.log(values)
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="flex flex-col">
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
							<div className="flex flex-wrap md:grid-cols-2 gap-2">
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
							<div className="flex gap-2">
								<div className="flex-1">
									<Input
										type="search"
										icon={<Search size={16} />}
										placeholder="Search for employees"
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
							</div>
						</div>
						<DialogFooter className="gap-2">
							<Button>Add</Button>
							<DialogClose className="!m-0" asChild>
								<Button variant="secondary">Cancel</Button>
							</DialogClose>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
