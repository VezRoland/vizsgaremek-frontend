import { array, object, string, instanceof as instanceof_, boolean, number } from "zod"

const trainingAnswerSchema = object({
	text: string().min(1, "The answer is required"),
	correct: boolean()
})

const trainingQuestionSchema = object({
	name: string().min(1, "The title is required"),
	answers: array(trainingAnswerSchema)
		.min(2, "At least 2 answers are required")
		.max(4, "Maximum 4 answers are allowed")
}).refine(data => data.answers.some(answer => answer.correct), {
	message: "At least one answers should be marked as correct",
	path: ["answers.root"]
})

export const trainingSchema = object({
	name: string().min(1, "The test should have a title"),
	description: string().min(1, "The test should have a description"),
  role: number(),
	questions: array(trainingQuestionSchema).min(
		1,
		"The test should contain at least 1 question"
	)
})

const trainingSubmissionQuestionSchema = object({
  id: string(),
  answers: string().array().min(1, "At least one answer should be selected")
})

export const trainingSubmissionSchema = object({
  id: string(),
  questions: array(trainingSubmissionQuestionSchema)
})
