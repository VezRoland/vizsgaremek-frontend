import { useEffect } from "react"
import { useNavigate, useSubmit } from "react-router"
import { createSupabaseServerClient } from "~/lib/supabase"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpOwnerSchema } from "~/schemas/auth"
import { handleServerResponse } from "~/lib/utils"

import type { Route } from "./+types/signup-owner"
import type { ApiResponse } from "~/types/response"
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
	FormLabel,
	FormMessage
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Building2, KeyRound, Loader2, Mail, UserRound } from "lucide-react"

export async function action({ request }: Route.ActionArgs) {
	const fields = (await request.json()) as z.infer<typeof signUpOwnerSchema>

	const { supabase, headers } = createSupabaseServerClient(request)
	const { data, error } = await supabase.auth.admin.createUser({
		email: fields.email,
		password: fields.password,
		user_metadata: {
			name: fields.name,
			role: UserRole.Owner
		},
		email_confirm: true
	})

	if (error) {
		if (error.code === "unexpected_failure") {
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
	}

	const res = await fetch(`${process.env.VITE_API_URL}/company`, {
		method: "POST",
		body: JSON.stringify({ name: fields.company_name })
	})

	if (res.status !== 201) {
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
			message: "The registration was successful!"
		} as ApiResponse,
		{
			headers,
			status: 200
		}
	)
}

export default function SignUpOwner({ actionData }: Route.ComponentProps) {
	const navigate = useNavigate()
	const submit = useSubmit()

	const form = useForm<z.infer<typeof signUpOwnerSchema>>({
		resolver: zodResolver(signUpOwnerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			company_name: ""
		}
	})

	const onSubmit = async (values: z.infer<typeof signUpOwnerSchema>) => {
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
		<Card className="w-full max-w-xl">
			<CardHeader>
				<CardTitle>
					<h1>Regisztráció</h1>
				</CardTitle>
				<CardDescription>
					<p>Hozza létre saját cégének fiókját.</p>
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
									<FormLabel>Teljes név</FormLabel>
									<FormControl>
										<Input
											icon={<UserRound size={16} />}
											placeholder="Teljes Név"
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
									<FormLabel>Email</FormLabel>
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
						<FormField
							control={form.control}
							name="company_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cégnév</FormLabel>
									<FormControl>
										<Input
											icon={<Building2 size={16} />}
											placeholder="Cég Neve"
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
							Regisztráció
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	)
}
