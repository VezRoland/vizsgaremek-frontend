import type { Route } from "./+types/schedule"
import type { Schedule, User } from "~/types/database"
import type { ApiResponse, DetailsResponse, SearchResponse } from "~/types/response"
import type { ScheduleWeek, ScheduleWithUser } from "~/types/results"

import { ScheduleTable } from "~/components/schedule-table/schedule-table"



export async function clientAction({ request }: Route.ClientActionArgs) {
	const data = await request.json()
	let result: DetailsResponse | SearchResponse | undefined

	switch (data.type) {
		case "VIEW_DETAILS": {
			const field = data.field as string
			const weekStart = data.weekStart
			const page = data.page | 1

			const response = await fetch(
				`http://localhost:3000/schedule/details/${field}?week_start=${weekStart}&page=${page}`,
				{ credentials: "include" }
			)

			return (result = {
				type: "DetailsResponse",
				...(await response.json())
			} satisfies DetailsResponse)
		}
		case "SEARCH_USERS": {
			const search = data.search as string
			const page = data.page as number

			const response = await fetch(
				`http://localhost:3000/schedule/users?name=${search}&page=${page}`,
				{ credentials: "include" }
      )

			return (result = {
				type: "SearchResponse",
				page,
				...(await response.json())
			} satisfies SearchResponse)
		}
		default:
			result = undefined
	}

	console.log(result)
	return result
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	const url = new URL(request.url)
	const weekStart = url.searchParams.get("week_start")

	const data = await fetch(
		`http://localhost:3000/schedule${weekStart ? `/${weekStart}` : ""}`,
		{
			method: "GET",
			credentials: "include"
		}
	)

	return (await data.json()) as ApiResponse<ScheduleWeek>
}

export default function Schedule({
	actionData,
	loaderData
}: Route.ComponentProps) {
	let date = new Date()
	date = new Date(date.getTime() - date.getDay() * 24 * 60 * 60 * 1000)
	date.setUTCHours(0, 0, 0, 0)

	return (
		<main className="h-[calc(100vh-69px)] p-4">
			<ScheduleTable
				tableData={loaderData.data!}
				fieldData={
					(actionData?.type === "DetailsResponse" && actionData?.data) ||
					undefined
				}
			/>
		</main>
	)
}
