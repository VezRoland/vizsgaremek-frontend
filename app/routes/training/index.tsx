import { useUserContext } from "~/lib/utils"

import { UserRole } from "~/types/database"
import type {
	Training,
	TrainingPreview,
	TrainingSubmission
} from "~/types/results"

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from "~/components/ui/card"
import { SubmissionsTable } from "~/components/training/submissions-table"
import { Link } from "react-router"

// Mock data
const trainings: TrainingPreview[] = [
	{
		id: crypto.randomUUID(),
		name: "Software Development Fundamentals",
		description: "A basic test covering core concepts of software development.",
		createdAt: new Date().toLocaleDateString()
	}
]

const submissions: TrainingSubmission[] = [
	{
		name: "Test User",
		training: "Test training",
		score: "10/15",
		submittedAt: new Date().toLocaleDateString()
	}
]

export default function Index() {
	const user = useUserContext()

	return (
		<main className="w-full max-w-4xl grid gap-8 px-4 py-8 m-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{trainings.map(training => (
					<Link to={`/training/${training.id}`}>
						<Card>
							<CardHeader>
								<CardTitle>{training.name}</CardTitle>
								<CardDescription>{training.description}</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
			{user.role > UserRole.Employee && (
				<SubmissionsTable submissions={submissions} />
			)}
		</main>
	)
}
