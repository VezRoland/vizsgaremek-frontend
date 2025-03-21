import { ChevronLeft, ChevronRight, HandCoins, Plus } from "lucide-react"
import { Link, useSubmit } from "react-router"
import { ScheduleContext } from "~/lib/utils"

import { ScheduleCategory } from "~/types/database"
import type { ScheduleWeek, DetailsUser } from "~/types/results"

import { Button } from "../ui/button"
import { ScheduleTableItem } from "./schedule-table-item"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../ui/select"
import { NewScheduleDialog } from "./new-schedule-dialog"

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
	fieldData?: DetailsUser[]
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

	return (
		<ScheduleContext.Provider value={{ tableData, fieldData }}>
			<section className="w-full h-full flex flex-col gap-4">
				<div className="flex flex-wrap justify-between items-center gap-2">
					<div className="flex flex-1 justify-between">
						<Link
							className="grid flex-1 place-content-center"
							to={`/schedule${tableData.prevDate ? `?week_start=${tableData.prevDate}` : ""}`}
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
							to={`/schedule${tableData.nextDate ? `?week_start=${tableData.nextDate}` : ""}`}
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
					<div className="w-max flex flex-[999] gap-4">
						<Select defaultValue="all">
							<SelectTrigger className="max-w-max ml-auto" icon={<HandCoins />}>
								<SelectValue placeholder="Choose a category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value={String(ScheduleCategory.Paid)}>
									Paid
								</SelectItem>
								<SelectItem value={String(ScheduleCategory.Unpaid)}>
									Unpaid
								</SelectItem>
							</SelectContent>
						</Select>
						<NewScheduleDialog>
							<Button className="aspect-square" size="icon">
								<Plus />
							</Button>
						</NewScheduleDialog>
					</div>
				</div>
				<div className="w-full flex-1 border-b rounded-md text-nowrap bg-accent overflow-auto">
					<table className="relative isolate w-full table-fixed">
						<thead className="z-10 sticky top-0 border-2 border-accent text-accent-foreground bg-accent">
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
								<tr key={row} className="group">
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
