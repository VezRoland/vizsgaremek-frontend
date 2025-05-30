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
	const schedule = await fetchData<ScheduleWeek>(
		`schedule?${searchParams.toString()}`,
		{
			validate: true
		}
	)
	return {
		schedule: schedule?.data,
		days: schedule?.data
			? Array.from({ length: 7 }).map((_, i) => {
					return new Date(
						new Date(schedule.data!.weekStart).getTime() +
							(i + 1) * (24 * 60 * 60 * 1000)
					).toLocaleDateString(undefined, {
						month: "2-digit",
						day: "2-digit"
					})
			  })
			: undefined
	}
}

export default function Schedule({ loaderData }: Route.ComponentProps) {
	const { schedule, days } = loaderData

	return (
		<>
			<Outlet />
			<main className="h-[calc(100vh-69px)] p-4">
				<ScheduleTable data={schedule!} days={days} />
			</main>
		</>
	)
}
