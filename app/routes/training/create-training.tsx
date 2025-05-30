import { redirect, useNavigate, useSubmit } from "react-router"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { trainingSchema } from "~/schemas/training"
import { cn, fetchData } from "~/lib/utils"

import type { Route } from "./+types/create-training"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { Card, CardFooter } from "~/components/ui/card"
import {
	LoaderCircle,
	Paperclip,
	Plus,
	Text,
	Type,
	UserRound
} from "lucide-react"
import { UserRole } from "~/types/database"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "~/components/ui/select"
import { useEffect, type ChangeEvent } from "react"
import { FileUpload } from "~/components/training/file-upload"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Training" },
    { name: "description", content: "Create training tests" }
  ]
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData()
	return fetchData("training", {
		method: "POST",
		body: formData
	})
}

export default function CreateTraining({ actionData }: Route.ComponentProps) {
	const navigate = useNavigate()
	const submit = useSubmit()
	const form = useForm<z.infer<typeof trainingSchema>>({
		resolver: zodResolver(trainingSchema),
		defaultValues: {
			name: "",
			description: "",
			role: UserRole.Employee,
			file: undefined
		}
	})

	const {
		fields: questionFields,
		append: appendQuestion,
		remove: removeQuestion,
		update: updateQuestions
	} = useFieldArray({
		control: form.control,
		name: "questions"
	})

	function addQuestion() {
		appendQuestion({
			name: "",
			answers: [
				{ text: "", correct: false },
				{ text: "", correct: false }
			]
		})
	}

	function handleRemoveQuestion(questionId: number) {
		removeQuestion(questionId)
	}

	function handleAddAnswer(questionIndex: number) {
		const currentQuestion = form.watch(`questions.${questionIndex}`)!
		currentQuestion.answers.push({ text: "", correct: false })
		updateQuestions(questionIndex, currentQuestion)
	}

	async function onSubmit(values: z.infer<typeof trainingSchema>) {
		const { file, ...data } = values
		const formData = new FormData()
		formData.append("file", file)
		formData.append("data", JSON.stringify(data))

		await submit(formData, {
			method: "POST",
			encType: "multipart/form-data"
		})
	}

	useEffect(() => {
		if (actionData?.status !== "success") return
		navigate("/training")
	}, [actionData])

	return (
		<main className="w-full max-w-4xl min-h-[calc(100vh-69px)] grid gap-8 px-4 py-8 m-auto">
			<Form {...form}>
				<form
					className="h-full flex flex-col gap-4"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="flex flex-col gap-2">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											icon={<Type />}
											placeholder="Title"
											disabled={form.formState.isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											icon={<Text />}
											placeholder="Description"
											disabled={form.formState.isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Select
											defaultValue={field.value.toString()}
											onValueChange={value => field.onChange(parseInt(value))}
										>
											<SelectTrigger icon={<UserRound />}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(UserRole).map(
													([key, value]) =>
														isNaN(parseInt(key)) && (
															<SelectItem key={value} value={value.toString()}>
																{key}
															</SelectItem>
														)
												)}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="file"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<FileUpload
											accept="application/pdf"
											onValueChange={file => field.onChange(file)}
										/>
										{/* <Input
											icon={<Paperclip />}
											type="file"
											accept="application/pdf, application/vnd.ms-excel"
											multiple={false}
											placeholder="Attachement"
											disabled={form.formState.isSubmitting}
											onChange={event =>
												field.onChange(handleFileUpload(event))
											}
										/> */}
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{questionFields.map((question, questionIndex) => {
						return (
							<Card key={question.id}>
								<div className="flex flex-col gap-2 p-6">
									<FormField
										control={form.control}
										name={`questions.${questionIndex}.name`}
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														placeholder={`Question ${questionIndex + 1}`}
														disabled={form.formState.isSubmitting}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid md:grid-cols-2 gap-2">
										{form
											.watch(`questions.${questionIndex}.answers`)
											?.map((_, answerIndex) => (
												<div className="flex rounded-md">
													<FormField
														control={form.control}
														name={`questions.${questionIndex}.answers.${answerIndex}.correct`}
														rules={{ deps: ["questions"] }}
														render={({ field }) => {
															const { value, ...rest } = field

															return (
																<FormItem>
																	<FormControl>
																		<Checkbox
																			className={cn(
																				"w-9 h-9 grid place-items-center border-border rounded-r-none",
																				value && "border-primary"
																			)}
																			checked={value}
																			disabled={form.formState.isSubmitting}
																			onCheckedChange={(checked: boolean) => {
																				field.onChange(checked)
																			}}
																			{...rest}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)
														}}
													/>
													<FormField
														key={`${question.id}-${answerIndex}`}
														control={form.control}
														name={`questions.${questionIndex}.answers.${answerIndex}.text`}
														render={({ field }) => (
															<FormItem className="flex-1">
																<FormControl>
																	<Input
																		className="border-l-0 rounded-l-none"
																		placeholder={`Answer ${answerIndex + 1}`}
																		disabled={form.formState.isSubmitting}
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											))}
										<FormField
											control={form.control}
											name={`questions.${questionIndex}.answers`}
											render={() => (
												<FormItem>
													<FormMessage isRoot />
												</FormItem>
											)}
										/>
									</div>
								</div>
								<CardFooter className="justify-end gap-2">
									<Button
										className="col-span-2"
										type="button"
										disabled={form.formState.isSubmitting}
										onClick={() => handleAddAnswer(questionIndex)}
									>
										Add answer
									</Button>
									<Button
										variant="outline"
										disabled={form.formState.isSubmitting}
										onClick={() => handleRemoveQuestion(questionIndex)}
									>
										Remove
									</Button>
								</CardFooter>
							</Card>
						)
					})}
					<div className="flex justify-between items-center gap-2 mt-auto">
						<FormField
							control={form.control}
							name="questions"
							render={() => (
								<FormItem>
									<FormMessage isRoot />
								</FormItem>
							)}
						/>
						<div className="flex gap-2">
							<Button
								className="w-max"
								variant="outline"
								type="button"
								onClick={addQuestion}
								disabled={form.formState.isSubmitting}
							>
								<Plus /> Add question
							</Button>
							<Button
								className="w-max"
								type="submit"
								disabled={
									Object.keys(form.formState.errors).length > 0 ||
									form.formState.isSubmitting
								}
							>
								{form.formState.isSubmitting && (
									<LoaderCircle className="animate-spin" />
								)}
								Submit
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</main>
	)
}
