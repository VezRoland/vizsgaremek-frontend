import { useEffect } from "react"
import { Link, useNavigate, useSubmit } from "react-router"
import { createSupabaseServerClient } from "~/lib/supabase"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpEmployeeSchema } from "~/schemas/auth"
import { handleServerResponse } from "~/lib/utils"

import type { Route } from "./+types/signup-employee"
import type { ApiResponse } from "~/types/results"
import { UserRole, type Company } from "~/types/database"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "~/components/ui/card"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { TabsContent } from "~/components/ui/tabs"
import {
	KeyRound,
	Loader2,
	Mail,
	SquareAsterisk,
	UserRound
} from "lucide-react"

export async function action({ request }: Route.ActionArgs) {
	const fields = (await request.json()) as z.infer<typeof signUpEmployeeSchema>

	const { supabase, headers } = createSupabaseServerClient(request)
	const { data, error } = await supabase.auth.admin.createUser({
		email: fields.email,
		password: fields.password,
		user_metadata: {
			name: fields.name,
			role: UserRole.Employee
		},
		email_confirm: true
	})

	if (error) {
		if (error.code === "email_exists") {
			return Response.json(
				{
					status: "error",
					message: "The registration failed.",
					errors: {
						email: "There is already a user with the same email address."
					}
				} as ApiResponse<null, z.infer<typeof signUpEmployeeSchema>>,
				{
					headers,
					status: 403
				}
			)
		}

		return Response.json(
			{
				status: "error",
				message: "An unexpected error occoured. Try again!"
			} as ApiResponse,
			{
				headers,
				status: 403
			}
		)
	}

	const res = await fetch(`${process.env.VITE_API_URL}/company/${fields.code}`)

	if (res.status !== 200) {
		await supabase.auth.admin.deleteUser(data.user!.id)
		return Response.json(await res.json(), { headers })
	}

	const company = (await res.json()) as Company
	await supabase.auth.admin.updateUserById(data.user!.id, {
		user_metadata: { company_id: company.id }
	})

	return Response.json(
		{
			status: "success",
			message: "The registration was successful."
		} as ApiResponse,
		{
			headers,
			status: 200
		}
	)
}

export default function SignUpEmployee({ actionData }: Route.ComponentProps) {
	const navigate = useNavigate()
	const submit = useSubmit()

	const form = useForm<z.infer<typeof signUpEmployeeSchema>>({
		resolver: zodResolver(signUpEmployeeSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			code: ""
		}
	})

	const onSubmit = async (values: z.infer<typeof signUpEmployeeSchema>) => {
		await submit(values, {
			method: "POST",
			encType: "application/json"
		})
	}

	useEffect(
		() =>
			handleServerResponse(actionData, {
				form,
				callback: async () => await navigate("/signin")
			}),
		[actionData]
	)

	return (
		<TabsContent value="employee">
			<Card className="w-full">
				<CardHeader>
					<CardTitle>
						<h1>Register an Employee</h1>
					</CardTitle>
					<CardDescription>
						<p>Register a new employee account.</p>
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="flex flex-col gap-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												icon={<UserRound size={16} />}
												placeholder="Full Name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												icon={<Mail size={16} />}
												type="email"
												placeholder="email@domain.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												icon={<KeyRound size={16} />}
												type="password"
												placeholder="********"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												icon={<SquareAsterisk size={16} />}
												placeholder="########"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter className="flex-col gap-2">
							<Button
								className="w-full"
								type="submit"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting && (
									<Loader2 className="animate-spin" />
								)}
								Sign up
							</Button>
							<Link className="underline text-primary" to="/signin">
								I already have an account.
							</Link>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</TabsContent>
	)
}
