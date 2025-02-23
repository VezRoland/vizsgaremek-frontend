import { useContext, useEffect } from "react"
import { useActionData, useNavigate, useSubmit } from "react-router"
import { createSupabaseServerClient } from "~/lib/supabase"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "~/schemas/auth"
import { handleServerResponse, UserContext } from "~/lib/utils"

import type { Route } from "./+types/signin"
import type { MessageError, ServerResponse } from "~/types/response"

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
import { KeyRound, Loader2, Mail } from "lucide-react"

export async function action({ request }: Route.ActionArgs) {
	const fields = (await request.json()) as z.infer<typeof signInSchema>

	const { supabase, headers } = createSupabaseServerClient(request)
	const { error } = await supabase.auth.signInWithPassword(fields)

	if (error) {
		if (error.code === "unexpected_failure") {
			return Response.json(
				{
					error: true,
					type: "message",
					message: "Váratlan hiba történt. Próbálja újra!",
					messageType: "error"
				} as ServerResponse,
				{
					headers,
					status: 500
				}
			)
		}

		return Response.json(
			{
				error: true,
				type: "field",
				fields: {
					email: "Helytelen email cím és/vagy jelszó",
					password: "Helytelen email cím és/vagy jelszó"
				}
			} as ServerResponse<z.infer<typeof signInSchema>>,
			{
				headers,
				status: 401
			}
		)
	}

	return Response.json(
		{
			error: false,
			type: "message",
			message: "Sikeres bejelentkezés!",
			messageType: "success"
		} as ServerResponse,
		{
			headers,
			status: 200
		}
	)
}

export default function SignIn({ actionData }: Route.ComponentProps) {
	const navigate = useNavigate()
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

	useEffect(() => handleServerResponse(actionData, { form }), [actionData])

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
					<CardContent className="flex flex-col gap-2">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
                  <FormLabel>Email cím</FormLabel>
									<FormControl>
										<Input
                      icon={<Mail size={16} />}
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
