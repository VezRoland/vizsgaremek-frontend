import { cn, fetchData, useUserContext } from "~/lib/utils"
import type { Route } from "./+types/results"
import { UserRole } from "~/types/database"
import { SubmissionsTable } from "~/components/training/submissions-table"
import type { TrainingResult } from "~/types/results"
import { Card, CardHeader, CardTitle } from "~/components/ui/card"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Checkbox } from "~/components/ui/checkbox"

export function clientLoader({ params: { testId } }: Route.ClientLoaderArgs) {
	const results: TrainingResult[] = [
		{
			id: crypto.randomUUID(),
			userName: "RealisticTestTaker",
			trainingName: "Applied Knowledge Assessment",
			questionEvaluations: [
				{
					id: crypto.randomUUID(),
					name: "Select the primary colors.",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "Red",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "Green",
							selectedByUser: false,
							correct: false
						},
						{
							id: crypto.randomUUID(),
							name: "Blue",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "Yellow",
							selectedByUser: true,
							correct: true
						}
					],
					multipleCorrect: true
				},
				{
					id: crypto.randomUUID(),
					name: "What is the capital of Hungary?",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "Vienna",
							selectedByUser: false,
							correct: false
						},
						{
							id: crypto.randomUUID(),
							name: "Budapest",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "Prague",
							selectedByUser: false,
							correct: false
						}
					],
					multipleCorrect: false
				},
				{
					id: crypto.randomUUID(),
					name: "Which of these are mammals?",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "Eagle",
							selectedByUser: false,
							correct: false
						},
						{
							id: crypto.randomUUID(),
							name: "Whale",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "Lizard",
							selectedByUser: false,
							correct: false
						},
						{
							id: crypto.randomUUID(),
							name: "Bat",
							selectedByUser: false,
							correct: true
						} // User missed this correct answer
					],
					multipleCorrect: true
				},
				{
					id: crypto.randomUUID(),
					name: "What is the chemical symbol for water?",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "H2O",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "CO2",
							selectedByUser: false,
							correct: false
						}
					],
					multipleCorrect: false
				},
				{
					id: crypto.randomUUID(),
					name: "Select the even numbers.",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "3",
							selectedByUser: false,
							correct: false
						},
						{
							id: crypto.randomUUID(),
							name: "6",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "8",
							selectedByUser: false,
							correct: true
						}, // User missed this correct answer
						{
							id: crypto.randomUUID(),
							name: "11",
							selectedByUser: false,
							correct: false
						}
					],
					multipleCorrect: true
				},
				{
					id: crypto.randomUUID(),
					name: "Who painted the Mona Lisa?",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "Leonardo da Vinci",
							selectedByUser: false,
							correct: true
						}, // User picked wrong
						{
							id: crypto.randomUUID(),
							name: "Michelangelo",
							selectedByUser: true,
							correct: false
						}
					],
					multipleCorrect: false
				},
				{
					id: crypto.randomUUID(),
					name: "Which of these are planets in our solar system?",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "Moon",
							selectedByUser: false,
							correct: false
						},
						{
							id: crypto.randomUUID(),
							name: "Mars",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "Asteroid",
							selectedByUser: false,
							correct: false
						},
						{
							id: crypto.randomUUID(),
							name: "Jupiter",
							selectedByUser: true,
							correct: true
						}
					],
					multipleCorrect: true
				},
				{
					id: crypto.randomUUID(),
					name: "What is the currency of Japan?",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "Yen",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "Won",
							selectedByUser: false,
							correct: false
						},
						{
							id: crypto.randomUUID(),
							name: "Yuan",
							selectedByUser: false,
							correct: false
						}
					],
					multipleCorrect: false
				},
				{
					id: crypto.randomUUID(),
					name: "Select the continents.",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "Europe",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "Atlantic",
							selectedByUser: false,
							correct: false
						},
						{
							id: crypto.randomUUID(),
							name: "Asia",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "Pacific",
							selectedByUser: false,
							correct: false
						}
					],
					multipleCorrect: true
				},
				{
					id: crypto.randomUUID(),
					name: "What is the boiling point of water in Celsius?",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "90",
							selectedByUser: true,
							correct: false
						}, // User picked wrong
						{
							id: crypto.randomUUID(),
							name: "100",
							selectedByUser: false,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "110",
							selectedByUser: false,
							correct: false
						}
					],
					multipleCorrect: false
				},
				{
					id: crypto.randomUUID(),
					name: "Which of these are prime numbers?",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "4",
							selectedByUser: false,
							correct: false
						},
						{
							id: crypto.randomUUID(),
							name: "7",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "9",
							selectedByUser: false,
							correct: false
						},
						{
							id: crypto.randomUUID(),
							name: "13",
							selectedByUser: true,
							correct: true
						}
					],
					multipleCorrect: true
				},
				{
					id: crypto.randomUUID(),
					name: "Who wrote 'Hamlet'?",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "Charles Dickens",
							selectedByUser: true,
							correct: false
						}, // User picked wrong
						{
							id: crypto.randomUUID(),
							name: "William Shakespeare",
							selectedByUser: false,
							correct: true
						}
					],
					multipleCorrect: false
				},
				{
					id: crypto.randomUUID(),
					name: "Select the parts of a plant.",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "Root",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "Cloud",
							selectedByUser: false,
							correct: false
						},
						{
							id: crypto.randomUUID(),
							name: "Stem",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "Leaf",
							selectedByUser: true,
							correct: true
						}
					],
					multipleCorrect: true
				},
				{
					id: crypto.randomUUID(),
					name: "What is the largest ocean on Earth?",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "Atlantic Ocean",
							selectedByUser: true,
							correct: false
						}, // User picked wrong
						{
							id: crypto.randomUUID(),
							name: "Pacific Ocean",
							selectedByUser: false,
							correct: true
						}
					],
					multipleCorrect: false
				},
				{
					id: crypto.randomUUID(),
					name: "Which of these are programming languages?",
					answers: [
						{
							id: crypto.randomUUID(),
							name: "HTML",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "CSS",
							selectedByUser: true,
							correct: true
						},
						{
							id: crypto.randomUUID(),
							name: "JavaScript",
							selectedByUser: false,
							correct: true
						}, // User missed one
						{
							id: crypto.randomUUID(),
							name: "English",
							selectedByUser: false,
							correct: false
						}
					],
					multipleCorrect: true
				}
			],
			totalQuestions: 15,
			incorrectCount: 9, // Recalculated based on the more random selections
			correctCount: 11, // Recalculated based on the more random selections
			createdAt: new Date().toString()
		}
	]

	return results
	// return fetchData<TrainingResult[]>(`training/results?testId=${testId}`, {
	// 	validate: true
	// })
}

export default function Results({ loaderData }: Route.ComponentProps) {
	const user = useUserContext()
	const results = loaderData || []

	if (user.role !== UserRole.Employee) {
		return (
			<main className="max-w-4xl py-8 m-auto">
				<SubmissionsTable submissions={results} />
			</main>
		)
	}

	return (
		<main className="w-full max-w-4xl grid gap-8 px-4 py-8 m-auto">
			<Card className="border-none shadow-none bg-transparent">
				<CardHeader>
					<CardTitle>{results[0].trainingName}</CardTitle>
				</CardHeader>
			</Card>
			<div className="flex flex-col gap-4">
				{results?.at(0)?.questionEvaluations?.map(question => (
					<Card>
						<CardHeader>
							<CardTitle>{question.name}</CardTitle>
						</CardHeader>
						<div className="p-6 pt-0">
							{question.multipleCorrect ? (
								<div className="grid grid-cols-2 gap-4">
									{question.answers.map(answer => (
										<div
											className={cn(
												"flex items-center gap-2",
												answer.correct && "text-emerald-500",
												!answer.correct &&
													answer.selectedByUser &&
													"text-destructive"
											)}
											key={answer.id}
										>
											<Checkbox
												className="!opacity-100"
												id={answer.id}
												checked={answer.selectedByUser}
												disabled
											/>
											<label htmlFor={answer.id}>{answer.name}</label>
										</div>
									))}
								</div>
							) : (
								<RadioGroup className="grid grid-cols-2 gap-4">
									{question.answers.map(answer => (
										<div
											className={cn(
												"flex items-center gap-2",
												answer.correct && "text-success",
												!answer.correct &&
													answer.selectedByUser &&
													"text-destructive"
											)}
											key={answer.id}
										>
											<RadioGroupItem
												className="!opacity-100"
												value={answer.id}
												id={answer.id}
												checked={answer.selectedByUser}
												disabled
											/>
											<label htmlFor={answer.id}>{answer.name}</label>
										</div>
									))}
								</RadioGroup>
							)}
						</div>
					</Card>
				))}
			</div>
		</main>
	)
}
