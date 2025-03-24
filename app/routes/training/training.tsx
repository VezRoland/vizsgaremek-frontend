import type { Training } from "~/types/results"

import { Paperclip } from "lucide-react"
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
import { Input } from "~/components/ui/input"
import { useFieldArray, useForm } from "react-hook-form"
import type { z } from "zod"
import { trainingSubmissionSchema } from "~/schemas/training"
import { zodResolver } from "@hookform/resolvers/zod"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Checkbox } from "~/components/ui/checkbox"
import { useEffect } from "react"

const training: Training = {
	id: crypto.randomUUID(),
	name: "Software Development Fundamentals",
	description: "A basic test covering core concepts of software development.",
	isActive: true,
	questions: [
		{
			id: crypto.randomUUID(),
			name: "What does HTML stand for?",
			answers: [
				"Hyper Text Markup Language",
				"Highly Technical Modern Language",
				"Hyperlink and Text Management Language",
				"Home Tool Markup Language"
			],
			multipleCorrect: false
		},
		{
			id: crypto.randomUUID(),
			name: "Which of the following is NOT a primitive data type in JavaScript?",
			answers: ["string", "number", "boolean", "object"],
			multipleCorrect: false
		},
		{
			id: crypto.randomUUID(),
			name: "What is the purpose of a version control system like Git?",
			answers: [
				"To manage different versions of code",
				"To automatically deploy code to production",
				"To write code faster",
				"To design user interfaces"
			],
			multipleCorrect: false
		},
		{
			id: crypto.randomUUID(),
			name: "Which of the following are benefits of using functions in programming?",
			answers: [
				"Code reusability",
				"Improved code organization",
				"Reduced code complexity",
				"Faster execution speed"
			],
			multipleCorrect: true
		},
		{
			id: crypto.randomUUID(),
			name: "What is the role of CSS in web development?",
			answers: [
				"To define the structure of a web page",
				"To add interactivity to a web page",
				"To style the visual presentation of a web page",
				"To manage server-side logic"
			],
			multipleCorrect: false
		},
		{
			id: crypto.randomUUID(),
			name: "Which of the following are common HTTP methods?",
			answers: ["GET", "POST", "UPDATE", "DELETE"],
			multipleCorrect: true
		},
		{
			id: crypto.randomUUID(),
			name: "What is an algorithm?",
			answers: [
				"A step-by-step procedure for solving a problem",
				"A type of computer hardware",
				"A programming language",
				"A database management system"
			],
			multipleCorrect: false
		},
		{
			id: crypto.randomUUID(),
			name: "Which of the following principles are part of SOLID design principles?",
			answers: [
				"Single Responsibility Principle",
				"Open/Closed Principle",
				"Liskov Substitution Principle",
				"Don't Repeat Yourself (DRY)"
			],
			multipleCorrect: true
		},
		{
			id: crypto.randomUUID(),
			name: "What is the purpose of a database?",
			answers: [
				"To store and manage data",
				"To execute code",
				"To render web pages",
				"To handle network requests"
			],
			multipleCorrect: false
		},
		{
			id: crypto.randomUUID(),
			name: "Which of the following are commonly used data structures?",
			answers: ["Arrays", "Linked Lists", "Trees", "Functions"],
			multipleCorrect: true
		},
		{
			id: crypto.randomUUID(),
			name: "What is the difference between '==' and '===' in JavaScript?",
			answers: [
				"'==' compares values, '===' compares values and types",
				"'===' compares values, '==' compares values and types",
				"There is no difference",
				"They are used for different data types"
			],
			multipleCorrect: false
		},
		{
			id: crypto.randomUUID(),
			name: "Which of the following are front-end frameworks/libraries?",
			answers: ["React", "Angular", "Vue.js", "Node.js"],
			multipleCorrect: true
		}
	],
	createdAt: new Date().toLocaleDateString()
}

export default function Training() {
	if (!training.isActive) {
		return (
			<main className="w-full max-w-4xl grid gap-8 px-4 py-8 m-auto">
				<Card className="border-none shadow-none bg-transparent">
					<CardHeader>
						<CardTitle>{training.name}</CardTitle>
						<CardDescription>{training.description}</CardDescription>
					</CardHeader>
					<CardFooter className="justify-end gap-2">
						<Button>
							<Paperclip /> Download attachement
						</Button>
						<Button variant="secondary">Start test</Button>
					</CardFooter>
				</Card>
			</main>
		)
	}

	const form = useForm<z.infer<typeof trainingSubmissionSchema>>({
		resolver: zodResolver(trainingSubmissionSchema),
		defaultValues: {
			id: training.id,
			questions: training.questions.map(({ id }) => ({ id, answers: [] }))
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

	function onSubmit(values: z.infer<typeof trainingSubmissionSchema>) {
		console.log(values)
	}

	useEffect(() => {
		console.log(form.formState.errors)
	}, [form.getValues()])

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
																	defaultChecked={field.value.includes(answer)}
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
														defaultValue={field.value[0]}
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
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</main>
	)
}
