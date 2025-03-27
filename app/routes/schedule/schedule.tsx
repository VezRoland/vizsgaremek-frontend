import { Outlet } from "react-router"

import type { Route } from "./+types/schedule"
import type { ApiResponse, ScheduleWeek } from "~/types/results"

import { ScheduleTable } from "~/components/schedule-table/schedule-table"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Schedule" },
    { name: "description", content: "Manage your company's schedule" }
  ]
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	const { searchParams } = new URL(request.url)
	const weekStart = searchParams.get("week_start")

	const response = await fetch(
		`http://localhost:3000/schedule${
			weekStart ? `/weekStart/${weekStart}` : ""
		}`,
		{
			method: "GET",
			credentials: "include"
		}
	)

	return response.json() as Promise<ApiResponse<ScheduleWeek>>
}

export default function Schedule({ loaderData }: Route.ComponentProps) {
	return (
		<>
			<Outlet />
			<main className="h-[calc(100vh-69px)] p-4">
				<ScheduleTable data={loaderData.data!} />
			</main>
		</>
	)
}
