import { ScheduleContext } from "~/lib/utils"

import { ScheduleCategory } from "~/types/database"
import type { ScheduleWeek } from "~/types/results"

import { Link, useSearchParams } from "react-router"
import { Button } from "../ui/button"
import { ScheduleTableItem } from "./schedule-table-item"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "../ui/select"
import { ChevronLeft, ChevronRight, HandCoins, Plus } from "lucide-react"

const DAY = 24 * 60 * 60 * 1000
const DAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
]

export function ScheduleTable({ data }: { data: ScheduleWeek | undefined }) {
  const [searchParams] = useSearchParams()

	return (
		<ScheduleContext.Provider value={data}>
			<section className="w-full h-full flex flex-col gap-4">
				<div className="flex flex-wrap justify-between items-center gap-2">
					<div className="flex flex-1 justify-between">
						<Button size="icon" variant="ghost" disabled={!data?.prevDate}>
							<Link
								className="grid flex-1 place-content-center"
								to={`/schedule?weekStart=${data?.prevDate}`}
							>
								<ChevronLeft />
							</Link>
						</Button>
						<Button size="icon" variant="ghost" disabled={!data?.nextDate}>
							<Link
								className="grid flex-1 place-content-center"
								to={`/schedule?weekStart=${data?.nextDate}`}
							>
								<ChevronRight />
							</Link>
						</Button>
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
						<Button className="aspect-square" size="icon" asChild>
							<Link to={`/schedule/new?${searchParams.toString()}`}>
								<Plus />
							</Link>
						</Button>
					</div>
				</div>
				<div className="w-full flex-1 border-b rounded-md text-nowrap bg-accent overflow-auto">
					<table className="relative isolate w-full table-fixed">
						<thead className="z-10 sticky top-0 border-2 border-accent text-accent-foreground bg-accent">
							<tr>
								{DAYS.map((day, i) => (
									<th className="w-32 p-2 border border-accent" key={day}>
										<span>{day}</span>
										<br />
										{data && (
											<span className="font-normal">
												{new Date(
													new Date(data.week_start).getTime() + (i + 1) * DAY
												).toLocaleDateString(undefined, {
													month: "2-digit",
													day: "2-digit"
												})}
											</span>
										)}
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
