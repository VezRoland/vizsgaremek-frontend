import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, CalendarIcon, UserRound } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { AvatarUpload } from "~/components/avatar-upload"
import { Button } from "~/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
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
import { fetchData, useUserContext } from "~/lib/utils"
import { ageSchema, avatarSchema, nameSchema } from "~/schemas/settings"
import type { Route } from "./+types/settings"
import { useSubmit } from "react-router"

export async function clientAction({ request }: Route.ClientActionArgs) {
	const data = await request.formData()

	switch (data.get("type")) {
		case "avatar":
			return await fetchData("user/avatar", {
				method: "POST",
				headers: {
					"Cache-Control": "no-cache"
				},
				body: data
			})
		case "name":
			return await fetchData("user/name", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: data.get("name") })
			})
		case "age":
			return await fetchData("user/age", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ age: parseInt(data.get("age") as string) })
			})
	}

	fetchData("auth/user", {
		headers: { "Cache-Control": "no-cache" },
		disableToast: true
	})
}

export default function Settings() {
	const submit = useSubmit()
	const user = useUserContext()

	const avatarForm = useForm<z.infer<typeof avatarSchema>>({
		resolver: zodResolver(avatarSchema),
		defaultValues: { avatar: undefined }
	})

	const nameForm = useForm<z.infer<typeof nameSchema>>({
		resolver: zodResolver(nameSchema),
		defaultValues: { name: user.name }
	})

	const ageForm = useForm<z.infer<typeof ageSchema>>({
		resolver: zodResolver(ageSchema),
		defaultValues: { age: user.age }
	})

	function handleAvatarSubmit(values: z.infer<typeof avatarSchema>) {
		const formData = new FormData()
		formData.append("type", "avatar")
		formData.append("avatar", values.avatar)
		submit(formData, {
			method: "POST",
			encType: "multipart/form-data"
		})
	}

	function handleNameSubmit(values: z.infer<typeof nameSchema>) {
		const formData = new FormData()
		formData.append("type", "name")
		formData.append("name", values.name)
		submit(formData, {
			method: "POST",
			encType: "multipart/form-data"
		})
	}

	function handleAgeSubmit(values: z.infer<typeof ageSchema>) {
		const formData = new FormData()
		formData.append("type", "age")
		formData.append("age", values.age.toString())
		submit(formData, {
			method: "POST",
			encType: "multipart/form-data"
		})
	}

	return (
		<main className="w-full max-w-4xl px-4 py-8 m-auto">
			<Card>
				<CardContent>
					<CardHeader>
						<CardTitle>Settings</CardTitle>
						<CardDescription>
							Customize your account by editing your information and uploading
							profile pictures.
						</CardDescription>
					</CardHeader>
					<div className="flex flex-col gap-4">
						<Form {...avatarForm}>
							<form onSubmit={avatarForm.handleSubmit(handleAvatarSubmit)}>
								<FormField
									control={avatarForm.control}
									name="avatar"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<AvatarUpload
													accept="image/*"
													onValueChange={value => field.onChange(value)}
												/>
											</FormControl>
											<div className="flex justify-between items-center">
												<FormMessage />
												{field.value && (
													<Button className="ml-auto" type="submit">
														Upload
													</Button>
												)}
											</div>
										</FormItem>
									)}
								/>
							</form>
						</Form>
						<Form {...nameForm}>
							<form
								className="flex gap-2"
								onSubmit={nameForm.handleSubmit(handleNameSubmit)}
							>
								<FormField
									control={nameForm.control}
									name="name"
									render={({ field }) => (
										<FormItem className="w-full">
											<div className="flex gap-2">
												<FormControl>
													<Input
														className="flex-1"
														icon={<UserRound />}
														placeholder="Full Name"
														{...field}
													/>
												</FormControl>
												<Button type="submit">Apply</Button>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</form>
						</Form>
						<Form {...ageForm}>
							<form
								className="flex gap-2"
								onSubmit={ageForm.handleSubmit(handleAgeSubmit)}
							>
								<FormField
									control={ageForm.control}
									name="age"
									render={({ field }) => (
										<FormItem className="w-full">
											<div className="flex gap-2">
												<FormControl>
													<Input
														className="flex-1"
														icon={<CalendarIcon />}
														placeholder="Age"
														{...field}
													/>
												</FormControl>
												<Button type="submit">Apply</Button>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</form>
						</Form>
					</div>
				</CardContent>
			</Card>
		</main>
	)
}
