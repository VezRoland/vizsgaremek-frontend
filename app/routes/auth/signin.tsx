import { useEffect } from "react"
import { useActionData, useSubmit } from "react-router"
import { createSupabaseServerClient } from "~/lib/supabase"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "~/schemas/auth"

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
	FormLabel,
	FormMessage
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Loader2 } from "lucide-react"

import type { Route } from "./+types/signin"
import type { RequestError } from "~/lib/types"

export async function action({ request }: Route.ActionArgs) {
	const fields = (await request.json()) as z.infer<typeof signInSchema>

	const { supabase, headers } = createSupabaseServerClient(request)
	const { error } = await supabase.auth.signInWithPassword(fields)

	if (error)
		return Response.json(
			{
				type: "field",
				fields: {
					email: "Helytelen email cím és/vagy jelszó",
					password: "Helytelen email cím és/vagy jelszó"
				}
			} as RequestError<z.infer<typeof signInSchema>>,
			{
				headers,
				status: 401
			}
		)

	return Response.json(null, {
		headers,
		status: 200
	})
}

export default function SignIn() {
	const actionData = useActionData<RequestError | undefined>()
	const submit = useSubmit()

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	})

	const onSubmit = async (values: z.infer<typeof signInSchema>) => {
		await submit(values, {
			method: "POST",
			encType: "application/json"
		})
	}

	useEffect(() => {
		if (!actionData) return

		switch (actionData.type) {
			case "field":
				Object.entries<string>(actionData.fields).forEach(([name, message]) => {
					form.setError(name as "email" | "password", {
						type: "invalid",
						message
					})
				})
		}
	}, [actionData])

  useEffect(() => {
    console.log(form.formState.errors)
  }, [ form.formState.errors ])

	return (
		<Card className="w-full max-w-xl">
			<CardHeader>
				<CardTitle>
					<h1>Bejelentkezés</h1>
				</CardTitle>
				<CardDescription>
					<p>Jelentkezzen be már meglévő fiókjába.</p>
				</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="flex flex-col gap-1.5">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="emailcim@domain.com"
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
									<FormLabel>Jelszó</FormLabel>
									<FormControl>
										<Input type="password" placeholder="********" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter>
						<Button
							className="w-full"
							type="submit"
							disabled={form.formState.isSubmitting}
						>
							{form.formState.isSubmitting && (
								<Loader2 className="animate-spin" />
							)}
							Bejelentkezés
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	)
}
