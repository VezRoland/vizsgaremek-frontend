import type { TrainingSubmission } from "~/types/results"

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
	submissions: TrainingSubmission[]
}) {
	return (
		<Table>
			<TableCaption>A list of recent training submissions.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Training</TableHead>
					<TableHead>Score</TableHead>
					<TableHead>Submitted at</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{submissions.map(submission => (
					<TableRow>
						<TableCell>{submission.name}</TableCell>
						<TableCell>{submission.training}</TableCell>
						<TableCell>{submission.score}</TableCell>
						<TableCell>
							{new Date(submission.submittedAt).toLocaleDateString()}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
