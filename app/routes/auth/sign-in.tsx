import { useEffect } from "react"
import { Link, redirect, useNavigate, useSubmit } from "react-router"
import { createSupabaseServerClient } from "~/lib/supabase"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "~/schemas/auth"
import { fetchData, handleServerResponse } from "~/lib/utils"

import type { Route } from "./+types/sign-in"

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
import { KeyRound, Loader2, Mail } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export async function clientAction({ request }: Route.ClientActionArgs) {
	const fields = (await request.json()) as z.infer<typeof signInSchema>

	await fetchData("auth/sign-in", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(fields)
	})

	const response = await fetchData<User>("auth/user", {
		headers: { "Cache-Control": "no-cache" },
		disableToast: true
	})

	if (response?.data) return redirect("/")
}

export default function SignIn({ actionData }: Route.ComponentProps) {
	const submit = useSubmit()

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	})

	async function onSubmit(values: z.infer<typeof signInSchema>) {
		await submit(values, {
			method: "POST",
			encType: "application/json"
		})
	}

	useEffect(() => handleServerResponse(actionData, { form }), [actionData])

	return (
		<Card className="w-full max-w-xl">
			<CardHeader>
				<CardTitle>
					<h1>Sign in</h1>
				</CardTitle>
				<CardDescription>
					<p>Log into an already existing account.</p>
				</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="flex flex-col gap-2">
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
							Sign in
						</Button>
						<Link className="underline text-primary" to="/sign-up-employee">
							I do not have an account.
						</Link>
					</CardFooter>
				</form>
			</Form>
		</Card>
	)
}
