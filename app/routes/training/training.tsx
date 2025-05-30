import { useEffect } from "react"
import { Link, useNavigate, useSubmit } from "react-router"
import { useFieldArray, useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { trainingSubmissionSchema } from "~/schemas/training"
import { fetchData } from "~/lib/utils"

import type { Route } from "./+types/training"
import type { Training } from "~/types/results"

import { Loader2, Paperclip } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
	Card,
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
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Checkbox } from "~/components/ui/checkbox"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Training" },
    { name: "description", content: "Fill out the training test" }
  ]
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const data = await request.json()

	switch (request.method) {
		case "POST": {
			const { id } = data as z.infer<typeof trainingSubmissionSchema>
			const result = await fetchData(`training/submission/${id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data)
			})
			if (result) result.redirect = "/training"
			return result
		}
		case "PATCH": {
			const { id } = data
			return fetchData(`training/start/${id}`, { method: "POST" })
		}
	}
}

export function clientLoader({ params: { testId } }: Route.ClientLoaderArgs) {
	return fetchData<Training>(`training/test/${testId}`, { validate: true })
}

export default function Training({
	actionData,
	loaderData
}: Route.ComponentProps) {
	const navigate = useNavigate()
	const submit = useSubmit()
	const training = loaderData?.data!

	const form = useForm<z.infer<typeof trainingSubmissionSchema>>({
		resolver: zodResolver(trainingSubmissionSchema),
		defaultValues: {
			id: training.id,
			questions: []
		}
	})

	const { update: updateQuestions } = useFieldArray({
		control: form.control,
		name: "questions"
	})

	function handleAddAnswer(questionIndex: number, answer: string) {
		const currentQuestion = form.watch(`questions.${questionIndex}`)!
		currentQuestion.answers.push(answer)
		updateQuestions(questionIndex, currentQuestion)
		form.trigger(`questions.${questionIndex}`)
	}

	function handleSetAnswer(questionIndex: number, answer: string) {
		const currentQuestion = form.watch(`questions.${questionIndex}`)!
		currentQuestion.answers = [answer]
		updateQuestions(questionIndex, currentQuestion)
		form.trigger(`questions.${questionIndex}`)
	}

	function handleRemoveAnswer(questionIndex: number, answer: string) {
		const currentQuestion = form.watch(`questions.${questionIndex}`)!
		currentQuestion.answers = currentQuestion.answers.filter(a => a !== answer)
		updateQuestions(questionIndex, currentQuestion)
		form.trigger(`questions.${questionIndex}`)
	}

	async function handleClick() {
		await submit(JSON.stringify({ id: training.id }), {
			method: "PATCH",
			encType: "application/json"
		})
	}

	async function onSubmit(values: z.infer<typeof trainingSubmissionSchema>) {
		await submit(JSON.stringify(values), {
			method: "POST",
			encType: "application/json"
		})
	}

	useEffect(() => {
		if (actionData?.redirect) navigate(actionData.redirect)
	}, [actionData])

	useEffect(() => {
		form.setValue(
			"questions",
			training.isActive
				? training.questions?.map(({ id }) => ({ id, answers: [] }))
				: []
		)
	}, [loaderData])

	console.log(training)

	if (!training.isActive) {
		return (
			<main className="w-full max-w-4xl grid gap-8 px-4 py-8 m-auto">
				<Card className="border-none shadow-none bg-transparent">
					<CardHeader>
						<CardTitle>{training.name}</CardTitle>
						<CardDescription>{training.description}</CardDescription>
					</CardHeader>
					<CardFooter className="justify-end gap-2">
						<Button asChild>
							<Link to={training.fileUrl}>
								<Paperclip /> Download attachement
							</Link>
						</Button>
						<Button variant="secondary" onClick={handleClick}>
							Start test
						</Button>
					</CardFooter>
				</Card>
			</main>
		)
	}

	return (
		<main className="w-full max-w-4xl grid gap-8 px-4 py-8 m-auto">
			<Card className="border-none shadow-none bg-transparent">
				<CardHeader>
					<CardTitle>{training.name}</CardTitle>
					<CardDescription>{training.description}</CardDescription>
				</CardHeader>
			</Card>
			<Form {...form}>
				<form
					className="flex flex-col gap-4"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					{training.questions.map((question, questionIndex) => (
						<Card>
							<CardHeader>
								<CardTitle>{question.name}</CardTitle>
							</CardHeader>
							<div className="p-6 pt-0">
								<FormField
									control={form.control}
									name={`questions.${questionIndex}.answers`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												{question.multipleCorrect ? (
													<div className="grid grid-cols-2 gap-4">
														{question.answers.map((answer, answerIndex) => (
															<div
																className="flex items-center gap-2"
																key={`${answer}-${answerIndex}`}
															>
																<Checkbox
																	id={`${answer}-${answerIndex}`}
																	defaultChecked={field?.value?.includes(
																		answer
																	)}
																	onCheckedChange={(checked: boolean) =>
																		checked
																			? handleAddAnswer(questionIndex, answer)
																			: handleRemoveAnswer(
																					questionIndex,
																					answer
																			  )
																	}
																/>
																<label htmlFor={`${answer}-${answerIndex}`}>
																	{answer}
																</label>
															</div>
														))}
													</div>
												) : (
													<RadioGroup
														className="grid grid-cols-2 gap-4"
														defaultValue={field?.value?.at(0)}
														onChange={event =>
															handleSetAnswer(
																questionIndex,
																(event.target as HTMLInputElement).value
															)
														}
													>
														{question.answers.map((answer, answerIndex) => (
															<div
																className="flex items-center gap-2"
																key={`${answer}-${answerIndex}`}
															>
																<RadioGroupItem
																	value={answer}
																	id={`${answer}-${answerIndex}`}
																/>
																<label htmlFor={`${answer}-${answerIndex}`}>
																	{answer}
																</label>
															</div>
														))}
													</RadioGroup>
												)}
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</Card>
					))}
					<Button type="submit" disabled={form.formState.isLoading}>
						{form.formState.isLoading && <Loader2 />} Submit
					</Button>
				</form>
			</Form>
		</main>
	)
}
