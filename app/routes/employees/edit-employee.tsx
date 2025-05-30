import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "~/components/ui/dialog"
import type { Route } from "./+types/edit-employee"
import { UserRole, type User } from "~/types/database"
import { Button } from "~/components/ui/button"
import { redirect, useNavigate, useSearchParams, useSubmit } from "react-router"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { editEmployeeSchema } from "~/schemas/management"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { HandCoins, UsersRound } from "lucide-react"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "~/components/ui/select"
import { fetchData } from "~/lib/utils"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edit Employee" },
    { name: "description", content: "Edit the data of an employee" }
  ]
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const data = await request.json()
	await fetchData(`company/user/${data.id}`, {
		method: "PATCH",
    headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ hourlyWage: data.hourlyWage, role: data.role })
	})
  return redirect("/employees")
}

export async function clientLoader({
	params: { userId }
}: Route.ClientLoaderArgs) {
	const response = await fetchData<User>(`company/user/${userId}`, {
		validate: true
	})
	return response?.data!
}

export default function Employee({ loaderData: employee }: Route.ComponentProps) {
	const submit = useSubmit()
	const navigate = useNavigate()
  const searchParams = useSearchParams()

	const form = useForm<z.infer<typeof editEmployeeSchema>>({
		resolver: zodResolver(editEmployeeSchema),
		defaultValues: {
			id: employee.id,
			hourlyWage: employee.hourlyWage || 0,
			role: employee.role
		}
	})

	async function onSubmit(values: z.infer<typeof editEmployeeSchema>) {
		await submit(JSON.stringify(values), {
			method: "POST",
			encType: "application/json"
		})
	}

	return (
		<Dialog
			onOpenChange={open => (!open ? navigate(`/employees?${searchParams[0].toString()}`) : null)}
			defaultOpen={true}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{employee.name}</DialogTitle>
					<DialogDescription>
						Edit the information of the selected employee.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						className="flex flex-col"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className="flex flex-col gap-2 py-4">
							<FormField
								control={form.control}
								name="hourlyWage"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												icon={<HandCoins />}
												placeholder="Hourly wage"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Select
												defaultValue={field.value.toString()}
												onValueChange={value => field.onChange(value)}
											>
												<SelectTrigger icon={<UsersRound />}>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{Object.entries(UserRole).map(
														([key, value]) =>
															isNaN(parseInt(key)) &&
															value !== UserRole.Admin && value !== UserRole.Owner && (
																<SelectItem
																	key={value}
																	value={value.toString()}
																>
																	{key}
																</SelectItem>
															)
													)}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex justify-end gap-2 pt-4">
							<Button type="submit">Save</Button>
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
