import type { Route } from "./+types/schedule"
import type { Schedule } from "~/types/database"
import type { ApiResponse } from "~/types/response"
import type { ScheduleWeek } from "~/types/results"

import { ScheduleTable } from "~/components/schedule-table/schedule-table"

export async function clientAction({ request }: Route.ClientActionArgs) {
	const data = await request.json()
	let result

	switch (data.type) {
		case "VIEW DETAILS":
			const field = data.field as string
			const weekStart = data.weekStart
			const page = data.page | 1

			result = await fetch(
				`http://localhost:3000/schedule/details/${field}?week_start=${weekStart}&page=${page}`,
				{ credentials: "include" }
			)
			break
	}

	return (await result?.json()) as ApiResponse
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

	const schedule = (await data.json()) as ApiResponse<ScheduleWeek>
	return schedule
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
				tableData={loaderData?.data}
				fieldData={actionData?.data}
			/>
		</main>
	)
}
