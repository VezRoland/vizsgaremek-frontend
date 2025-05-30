import { fetchData, useUserContext } from "~/lib/utils"

import type { Route } from "./+types/overview"
import { UserRole } from "~/types/database"
import type { TrainingPreview, TrainingResult } from "~/types/results"

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from "~/components/ui/card"
import { SubmissionsTable } from "~/components/training/submissions-table"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { EllipsisVertical, Plus } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"
import { Badge } from "~/components/ui/badge"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Trainings" },
    { name: "description", content: "View all the available training tests" }
  ]
}

export async function clientLoader() {
	const tests = (await fetchData<TrainingPreview[]>("training"))?.data || []
	const submissions =
		(
			await fetchData<TrainingResult[]>("training/results", {
				disableToast: true
			})
		)?.data || []
	return { tests, submissions }
}

export default function TrainingOverview({ loaderData }: Route.ComponentProps) {
	const user = useUserContext()
	const { tests, submissions } = loaderData

	return (
		<main className="w-full max-w-4xl grid gap-8 px-4 py-8 m-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{tests.map(training => (
					<Link
						to={`/training/${
							user.role === UserRole.Employee ? "test" : "results"
						}/${training.id}`}
					>
						<Card className="h-full">
							<CardHeader className="flex-row justify-between items-start gap-2 space-y-0">
								<div className="flex flex-col space-y-1.5">
									<CardTitle className="flex gap-2">{training.name}</CardTitle>
									<CardDescription>{training.description}</CardDescription>
									<div className="flex gap-2">
										{(training.active || training.completed) && (
											<Badge>
												{training.active
													? "In progress"
													: training.completed && "Completed"}
											</Badge>
										)}
									</div>
								</div>
								{user.role > UserRole.Employee ||
									(training.completed && (
										<DropdownMenu>
											<DropdownMenuTrigger>
												<Button size="icon" variant="ghost">
													<EllipsisVertical />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												{training.completed && (
													<DropdownMenuItem asChild>
														<Link to={`/training/results/${training.id}`}>
															Check results
														</Link>
													</DropdownMenuItem>
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									))}
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
			{user.role > UserRole.Employee && (
				<>
					<SubmissionsTable submissions={submissions} />
					<Button className="absolute bottom-8 right-8" size="icon" asChild>
						<Link to="/training/create">
							<Plus />
						</Link>
					</Button>
				</>
			)}
		</main>
	)
}
