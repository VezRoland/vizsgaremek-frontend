import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link, useSubmit } from "react-router"
import { ScheduleContext } from "~/lib/utils"

import { ScheduleCategory } from "~/types/database"
import type { ScheduleWeek, ScheduleWithUser } from "~/types/results"

import { Button } from "../ui/button"
import { ScheduleTableItem } from "./schedule-table-item"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../ui/select"

const DAY = 24 * 60 * 60 * 1000

const days = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
]

export function ScheduleTable({
	tableData,
	fieldData
}: {
	tableData: ScheduleWeek
	fieldData?: ScheduleWithUser[]
}) {
	const submit = useSubmit()
	const date = new Date()

	const pastLimit = new Date(date)
	pastLimit.setFullYear(date.getFullYear() - 1)

	const futureLimit = new Date(date)
	futureLimit.setFullYear(date.getFullYear() + 1)

	const week = new Date(date.getTime() - date.getDay() * DAY)
	week.setUTCHours(0, 0, 0, 0)
	week.setTime(week.getTime() - 14 * DAY)

	function handleNavigation(date: number) {
		submit(JSON.stringify({ type: "NAVIGATION", week_start: date }), {
			method: "POST",
			encType: "application/json"
		})
	}

	console.log(tableData)

	return (
		<ScheduleContext.Provider value={{ tableData, fieldData }}>
			<section className="w-full h-full flex flex-col gap-4">
				<div className="flex flex-wrap justify-between items-center gap-2">
					<div className="flex flex-1 justify-between">
						<Link
							className="grid flex-1 place-content-center"
							to={`/schedule?week_start=${tableData.prevDate}`}
						>
							<Button
								size="icon"
								variant="ghost"
								disabled={!tableData.prevDate}
							>
								<ChevronLeft />
							</Button>
						</Link>
						<Link
							className="grid flex-1 place-content-center"
							to={`/schedule?week_start=${tableData.nextDate}`}
						>
							<Button
								size="icon"
								variant="ghost"
								disabled={!tableData.nextDate}
							>
								<ChevronRight />
							</Button>
						</Link>
					</div>
					<div className="w-max min-w-[min(160px,100%)] flex-[999]">
						<Select>
							<SelectTrigger className="max-w-60 ml-auto">
								<SelectValue placeholder="All" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="">All</SelectItem>
								<SelectItem value={String(ScheduleCategory.Paid)}>
									Paid
								</SelectItem>
								<SelectItem value={String(ScheduleCategory.Unpaid)}>
									Unpaid
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="w-full flex-1 border-b rounded-md text-nowrap bg-accent overflow-auto">
					<table className="relative w-full table-fixed">
						<thead className="sticky top-0 border-2 border-accent text-accent-foreground bg-accent">
							<tr>
								{days.map((day, i) => (
									<th className="w-32 p-2 border border-accent" key={day}>
										<span>{day}</span>
										<br />
										<span className="font-normal">
											{new Date(
												new Date(tableData.week_start).getTime() + i * DAY
											).toLocaleDateString(undefined, {
												month: "2-digit",
												day: "2-digit"
											})}
										</span>
									</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-background">
							{Array.from({ length: 24 }).map((_, row) => (
								<tr key={row}>
									{Array.from({ length: 7 }).map((_, column) => (
										<ScheduleTableItem
											key={`${row}-${column}`}
											row={row}
											column={column}
										/>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</ScheduleContext.Provider>
	)
}
