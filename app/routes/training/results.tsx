import { fetchData, useUserContext } from "~/lib/utils"
import type { Route } from "./+types/results"
import { UserRole } from "~/types/database"
import { SubmissionsTable } from "~/components/training/submissions-table"
import type { TrainingSubmission } from "~/types/results"

export function clientLoader({ params: { testId } }: Route.ClientLoaderArgs) {
	return fetchData<TrainingSubmission[]>(`training/results?testId=${testId}`, { validate: true })
}

export default function Results({ loaderData }: Route.ComponentProps) {
  const user = useUserContext()
  console.log(loaderData)

  if (user.role !== UserRole.Employee) {
    return (
      <main className="max-w-4xl py-8 m-auto">
        <SubmissionsTable submissions={[...loaderData?.data || []]} />
      </main>
    )
  }
  
	return <h1>Hello World!</h1>
}
