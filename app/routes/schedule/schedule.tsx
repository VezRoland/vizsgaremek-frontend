import { Outlet } from "react-router"

import type { Route } from "./+types/schedule"
import type { ScheduleWeek } from "~/types/results"

import { ScheduleTable } from "~/components/schedule-table/schedule-table"
import { fetchData } from "~/lib/utils"

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Schedule" },
		{ name: "description", content: "Manage your company's schedule" }
	]
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	const { searchParams } = new URL(request.url)
	const weekStart = searchParams.get("week_start")
	return fetchData<ScheduleWeek>(
		weekStart ? `schedule/weekStart/${weekStart}` : "schedule",
		{ validate: true }
	)
}

export default function Schedule({ loaderData }: Route.ComponentProps) {
	return (
		<>
			<Outlet />
			<main className="h-[calc(100vh-69px)] p-4">
				<ScheduleTable data={loaderData!} />
			</main>
		</>
	)
}
