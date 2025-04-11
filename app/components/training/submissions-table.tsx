import type { TrainingResult } from "~/types/results"

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "../ui/table"

export function SubmissionsTable({
	submissions
}: {
	submissions: TrainingResult[]
}) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Test</TableHead>
					<TableHead>Score</TableHead>
					<TableHead>Submitted at</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{submissions.map(submission => (
					<TableRow key={submission.id}>
						<TableCell>{submission.userName}</TableCell>
						<TableCell>{submission.trainingName}</TableCell>
						<TableCell>
							{submission.correctCount} / {submission.totalQuestions}
						</TableCell>
						<TableCell>
							{new Date(submission.createdAt).toLocaleString()}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
