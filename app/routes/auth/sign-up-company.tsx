import { useEffect } from "react"
import { Link, redirect, useSubmit } from "react-router"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpCompanySchema } from "~/schemas/auth"
import { fetchData } from "~/lib/utils"

import type { Route } from "./+types/sign-up-company"

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
import { Building2, KeyRound, Loader2, Mail, UserRound } from "lucide-react"

export async function clientAction({ request }: Route.ActionArgs) {
	const fields = (await request.json()) as z.infer<typeof signUpCompanySchema>

	const response = await fetchData<
		unknown,
		z.infer<typeof signUpCompanySchema>
	>("auth/sign-up/company", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(fields)
	})

	if (response?.status === "success") return redirect("/sign-in")
	return response
}

export default function SignUpCompany({ actionData }: Route.ComponentProps) {
	const submit = useSubmit()

	const form = useForm<z.infer<typeof signUpCompanySchema>>({
		resolver: zodResolver(signUpCompanySchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			company_name: ""
		}
	})

	useEffect(() => {
		if (actionData?.errors) {
			Object.entries(actionData.errors).map(([field, errors]) => {
				form.setError(
					field as
						| "name"
						| "email"
						| "password"
						| "company_name"
						| "root"
						| `root.${string}`,
					{ message: errors }
				)
			})
		}
	}, [actionData])

	const onSubmit = async (values: z.infer<typeof signUpCompanySchema>) => {
		await submit(values, {
			method: "POST",
			encType: "application/json"
		})
	}

	return (
		<TabsContent value="company">
			<Card className="w-full">
				<CardHeader>
					<CardTitle>
						<h1>Register a Company</h1>
					</CardTitle>
					<CardDescription>
						<p>Register a new company account.</p>
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
								name="company_name"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												icon={<Building2 size={16} />}
												placeholder="Company Name"
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
