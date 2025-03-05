import type { ScheduleWeek } from "~/types/results"
import type { Route } from "./+types/schedule"

import { ScheduleTable } from "~/components/schedule-table/schedule-table"
import { ScheduleCategory } from "~/types/database"

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.json()
	console.log(formData)
}

export default function Schedule() {
	let date = new Date()
	date = new Date(date.getTime() - date.getDay() * 24 * 60 * 60 * 1000)
	date.setUTCHours(0, 0, 0, 0)

	const data: ScheduleWeek = {
		week_start: "2025-03-02",
		prevDate: 12345678912345,
		nextDate: 12345612898989,
		schedule: {
			"12-3": [
				{
					id: "a",
					category: ScheduleCategory.Paid,
					start: "2025-03-04T22:00:00",
					end: "2025-03-05T06:00:00",
					user: {
						name: "Test User",
						avatar_url: "a.png"
					}
				},
				{
					id: "b",
					category: ScheduleCategory.Unpaid,
					start: "2025-03-05T08:00:00",
					end: "2025-03-05T20:00:00",
					user: {
						name: "Another User",
						avatar_url: "b.png"
					}
				}
			]
		}
	}

	return (
		<main className="h-[calc(100vh-69px)] p-4">
			<ScheduleTable />
		</main>
	)
}
