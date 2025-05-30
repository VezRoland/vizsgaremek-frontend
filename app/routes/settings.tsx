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
import { avatarSchema, profileSchema } from "~/schemas/settings"
import type { Route } from "./+types/settings"
import { useSubmit } from "react-router"

export async function clientAction({ request }: Route.ClientActionArgs) {
	const data = await request.formData()

	switch (data.get("type")) {
		case "avatar":
			await fetchData("user/avatar", {
				method: "POST",
				headers: {
					"Cache-Control": "no-cache"
				},
				body: data
			})
			break
		case "profile":
			await fetchData("user/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: data.get("name"),
					age: parseInt(data.get("age") as string)
				})
			})
			break
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

	const profileForm = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: { name: user.name, age: user.age }
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

	function handleProfileSubmit(values: z.infer<typeof profileSchema>) {
		const formData = new FormData()
		formData.append("type", "profile")
		formData.append("name", values.name)
		formData.append("age", JSON.stringify(values.age))
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
						<Form {...profileForm}>
							<form
								className="flex flex-col gap-2"
								onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
							>
								{user.company_code && (
									<p>
										Company code: <b>{user.company_code}</b>
									</p>
								)}
								<FormField
									control={profileForm.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													icon={<UserRound />}
													placeholder="Full Name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={profileForm.control}
									name="age"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													icon={<CalendarIcon />}
													placeholder="Age"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button className="ml-auto" type="submit">
									Apply
								</Button>
							</form>
						</Form>
					</div>
				</CardContent>
			</Card>
		</main>
	)
}
