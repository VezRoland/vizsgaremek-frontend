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

export function ScheduleTable({ data, weekStart }: { data: ScheduleWeek | undefined, weekStart: number | undefined }) {
	const [searchParams, setSearchParams] = useSearchParams()

	function setWeekStart(weekStart: string) {
		setSearchParams(prevParams => {
			prevParams.set("weekStart", weekStart)
			return prevParams
		})
	}

	function setCategory(category: string) {
		setSearchParams(prevParams => {
			if (category === "all") prevParams.delete("category")
			else prevParams.set("category", category)
			return prevParams
		})
	}

	return (
		<ScheduleContext.Provider value={data}>
			<section className="w-full h-full flex flex-col gap-4">
				<div className="flex flex-wrap justify-between items-center gap-2">
					<div className="flex flex-1 justify-between">
						<Button
							size="icon"
							variant="ghost"
							disabled={!data?.prevDate}
							onClick={() => data?.prevDate && setWeekStart(data.prevDate)}
						>
							<ChevronLeft />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							disabled={!data?.nextDate}
							onClick={() => data?.nextDate && setWeekStart(data.nextDate)}
						>
							<ChevronRight />
						</Button>
					</div>
					<div className="w-max flex flex-[999] gap-4">
						<Select
							key={new Date().getTime()}
							defaultValue={searchParams.get("category") || "all"}
							onValueChange={setCategory}
						>
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
										{weekStart && (
											<span className="font-normal">
												{new Date(
													weekStart + (i + 1) * DAY
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
