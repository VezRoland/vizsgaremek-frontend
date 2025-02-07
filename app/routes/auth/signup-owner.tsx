import { useActionData, useNavigate, useSubmit } from "react-router"
import { createSupabaseServerClient } from "~/lib/supabase"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpOwnerSchema } from "~/schemas/auth"

import type { Route } from "./+types/signup-owner"
import type { ServerResponse } from "~/lib/types"

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
import { useEffect } from "react"
import { handleServerResponse } from "~/lib/utils"

export async function action({ request }: Route.ActionArgs) {
	const fields = (await request.json()) as z.infer<typeof signUpOwnerSchema>

	const { supabase, headers } = createSupabaseServerClient(request)
	const { error } = await supabase.auth.admin.createUser({
		email: fields.email,
		password: fields.password,
		user_metadata: {
			name: fields.name,
			role: 3
		},
		email_confirm: true
	})

  if (error) {
    if (error.code === "unexpected_failure") {
      return Response.json(
        {
          error: true,
          type: "message",
          message: "Váratlan hiba történt!",
          messageType: "error"
        } as ServerResponse,
        {
          headers,
          status: 403
        }
      )
    }
  }

	return Response.json(
		{
			error: false,
			type: "message",
			message: "Sikeres regisztráció!",
			messageType: "success"
		} as ServerResponse,
		{
			headers,
			status: 200
		}
	)
}

export default function SignUpOwner() {
	const actionData = useActionData<ServerResponse | undefined>()
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
					<CardContent className="flex flex-col gap-1.5">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Teljes név</FormLabel>
									<FormControl>
										<Input placeholder="Teljes Név" {...field} />
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
						<FormField
							control={form.control}
							name="company_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cégnév</FormLabel>
									<FormControl>
										<Input placeholder="Cég Neve" {...field} />
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
