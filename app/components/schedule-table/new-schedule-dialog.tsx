import { useSubmit } from "react-router"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { scheduleSchema } from "~/schemas/schedule"

import { useEffect, useState, type ReactElement } from "react"

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
	DialogTrigger
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../ui/select"
import { ScheduleCategory, UserRole } from "~/types/database"
import {
	FlagTriangleLeftIcon,
	FlagTriangleRightIcon,
	HandCoins
} from "lucide-react"
import { DateTimePicker } from "../ui/datetime-picker"
import { UserSearch } from "./user-search"
import { UserSearchProvider } from "./user-search-provider"
import { UserInput } from "./user-input"
import { cn, useUserContext } from "~/lib/utils"
import { hasPermission } from "~/lib/roles"
import ActionLoadingWrapper from "../action-loading-wrapper"

export function NewScheduleDialog({ children }: { children: ReactElement }) {
	const userContext = useUserContext()
	const submit = useSubmit()
  const [dialogOpen, setDialogOpen] = useState(false)

	const form = useForm<z.infer<typeof scheduleSchema>>({
		resolver: zodResolver(scheduleSchema),
		defaultValues: {
			start: new Date(),
			end: new Date(new Date().getTime() + 3600000),
			category: String(ScheduleCategory.Paid),
			user_id:
				userContext.role < UserRole.Leader
					? JSON.stringify([userContext.id])
					: ""
		}
	})
  const { formState } = form

	function onSubmit(values: z.infer<typeof scheduleSchema>) {
		submit(
			JSON.stringify({
				type: "CREATE_SCHEDULE",
				...values,
				category: parseInt(values.category),
				user_id: [...JSON.parse(values.user_id)],
				company_id: userContext.company_id
			}),
			{
				method: "POST",
				encType: "application/json"
			}
		)
	}

  function onOpenChange() {
    if (!formState.isSubmitting) return setDialogOpen(!dialogOpen)
    setDialogOpen(true)
  }

	return (
		<Dialog open={dialogOpen} onOpenChange={onOpenChange}>
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
							<UserSearchProvider>
								<>
									<div className="flex gap-2">
										{userContext.role > UserRole.Employee ? (
											<div className="flex-1 flex-col">
												<UserSearch />
												{form.formState.errors.user_id && (
													<p className="text-danger">
														{form.formState.errors.user_id.message}
													</p>
												)}
											</div>
										) : (
											<input type="hidden" {...form.register("user_id")} />
										)}
										<FormField
											control={form.control}
											name="category"
											render={({ field }) => (
												<FormItem
													className={cn(
														userContext.role < UserRole.Leader && "flex-1"
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
									{userContext.role > UserRole.Employee && (
										<UserInput
											onValueChange={value =>
												form.setValue("user_id", value, {
													shouldValidate: true
												})
											}
										/>
									)}
								</>
							</UserSearchProvider>
						</div>
						<DialogFooter className="gap-2">
              {formState.isSubmitting && "SUBMITTING"}
              <ActionLoadingWrapper type="CREATE_SCHEDULE">
                <Button type="submit">Add</Button>
              </ActionLoadingWrapper>
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
