import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { useSubmit } from "react-router"
import { cn } from "~/lib/utils"

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

export function ScheduleTable() {
	const submit = useSubmit()
	const date = new Date()

	const pastLimit = new Date(date)
	pastLimit.setFullYear(date.getFullYear() - 1)

	const futureLimit = new Date(date)
	futureLimit.setFullYear(date.getFullYear() + 1)

	const week = new Date(date.getTime() - date.getDay() * DAY)
  week.setUTCHours(0, 0, 0, 0)
  week.setTime(week.getTime() - 14 * DAY)

	function handleNavigation(newDate: Date) {
		const date = new Date(newDate)
		date.setUTCHours(0, 0, 0, 0)

		submit(JSON.stringify({ monday: date }), {
			method: "POST",
			encType: "application/json"
		})
	}

	return (
		<section className="w-full h-full flex flex-col gap-4">
			<div className="ml-auto">
				<Button
					size="icon"
					variant="ghost"
					onClick={() => handleNavigation(new Date(week.getTime() - 6 * DAY))}
				>
					<ChevronLeft />
				</Button>
				<Button
					size="icon"
					variant="ghost"
					onClick={() => handleNavigation(new Date(week.getTime() + 8 * DAY))}
				>
					<ChevronRight />
				</Button>
			</div>
			<table className="w-full flex-1 table-fixed">
				<thead>
					<tr>
						{days.map((day, i) => (
							<th className="h-16 border border-accent text-accent-foreground bg-accent">
								<span>{day}</span>
                <br/>
								<span className="font-normal">
									{new Date(week.getTime() + (i + 1) * DAY).toLocaleDateString(
										undefined,
										{ month: "2-digit", day: "2-digit" }
									)}
								</span>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: 24 }).map(() => (
						<tr>
							{Array.from({ length: 7 }).map((_, i) => (
								<td
									className={cn(
										"border",
										date.getDay() === i + 1 && "border-background bg-primary/25"
									)}
								></td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</section>
	)
}
