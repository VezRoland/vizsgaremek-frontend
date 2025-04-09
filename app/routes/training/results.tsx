import { cn, fetchData, useUserContext } from "~/lib/utils"
import type { Route } from "./+types/results"
import { UserRole } from "~/types/database"
import { SubmissionsTable } from "~/components/training/submissions-table"
import type { TrainingResult } from "~/types/results"
import { Card, CardHeader, CardTitle } from "~/components/ui/card"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Checkbox } from "~/components/ui/checkbox"

export function clientLoader({ params: { testId } }: Route.ClientLoaderArgs) {
	return fetchData<TrainingResult[]>(`training/results?testId=${testId}`, {
		validate: true
	})
}

export default function Results({ loaderData }: Route.ComponentProps) {
	const user = useUserContext()
	const results = loaderData?.data || []

	if (user.role !== UserRole.Employee) {
    if (results.length > 0) {
      return (
        <main className="w-full max-w-4xl grid gap-8 px-4 py-8 m-auto">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader>
              <CardTitle>Results: {results.at(0)?.trainingName}</CardTitle>
            </CardHeader>
          </Card>
          <SubmissionsTable submissions={results} />
        </main>
      )
    }

    return (
      <main className="w-full max-w-4xl min-h-[calc(100vh-69px)] grid place-items-center px-4 py-8 m-auto">
        <p>No results found</p>
      </main>
    )
	}

	return (
		<main className="w-full max-w-4xl min-h-[calc(100vh-69px)] grid gap-8 px-4 py-8 m-auto">
			<div className="flex flex-col gap-4">
				<Card className="border-none shadow-none bg-transparent">
					<CardHeader>
						<CardTitle>Results: {results.at(0)?.trainingName}</CardTitle>
					</CardHeader>
				</Card>
				{results.at(0)?.questionEvaluations?.map(question => (
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
												answer.correct && "text-success",
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
				<div className="flex justify-end items-center gap-2 mt-auto">
					<p>
						Score: {results[0].correctCount} / {results[0].totalQuestions}
					</p>
				</div>
			</div>
		</main>
	)
}
