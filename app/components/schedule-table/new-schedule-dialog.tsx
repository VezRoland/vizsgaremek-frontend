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
import { FlagTriangleLeftIcon, FlagTriangleRight, FlagTriangleRightIcon, Search } from "lucide-react"

export function NewScheduleDialog({ children }: { children: ReactElement }) {
	const form = useForm<z.infer<typeof scheduleSchema>>({
		resolver: zodResolver(scheduleSchema),
		defaultValues: {
			start: new Date(),
			end: new Date(),
			category: String(ScheduleCategory.Paid),
			users: ""
		}
	})

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Schedule</DialogTitle>
					<DialogDescription>
						Add a new record to the already existing work schedules.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form>
						<div className="flex flex-col gap-4 py-4">
							<div className="flex gap-2">
								<FormField
									control={form.control}
									name="start"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormControl>
												<Input icon={<FlagTriangleRight size={16} />} {...field} />
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
												<Input icon={<FlagTriangleLeftIcon size={16} />} {...field} />
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
												<SelectTrigger>
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
              <Input type="search" icon={<Search size={16} />} placeholder="Search for employees" />
						</div>
						<DialogFooter>
							<Button>Add</Button>
							<DialogClose asChild>
								<Button variant="secondary">
									Cancel
								</Button>
							</DialogClose>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
