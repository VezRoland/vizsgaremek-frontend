import { useEffect } from "react"
import { Link, redirect, useNavigate, useSubmit } from "react-router"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpEmployeeSchema } from "~/schemas/auth"
import { fetchData } from "~/lib/utils"

import type { Route } from "./+types/sign-up-employee"

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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Employee Sign Up" },
    { name: "description", content: "Sign up as an employee" }
  ]
}

export async function clientAction({ request }: Route.ActionArgs) {
	const fields = (await request.json()) as z.infer<typeof signUpEmployeeSchema>

	const response = await fetchData<
		unknown,
		z.infer<typeof signUpEmployeeSchema>
	>("auth/sign-up/employee", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(fields)
	})

	if (response?.status === "success") return redirect("/sign-in")
	return response
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
			company_code: ""
		}
	})

	const onSubmit = async (values: z.infer<typeof signUpEmployeeSchema>) => {
		await submit(values, {
			method: "POST",
			encType: "application/json"
		})
	}

	useEffect(() => {
		if (actionData?.errors) {
			Object.entries(actionData.errors).map(([field, errors]) => {
				console.log(field, errors)
				form.setError(
					field as
						| "name"
						| `root.${string}`
						| "root"
						| "company_code"
						| "email"
						| "password",
					{ message: errors }
				)
			})
		}
	}, [actionData])

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
								name="company_code"
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
							<Link className="underline text-primary" to="/sign-in">
								I already have an account.
							</Link>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</TabsContent>
	)
}
