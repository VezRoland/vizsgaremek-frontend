import { useContext } from "react"
import { cn, ScheduleContext, useUserContext } from "~/lib/utils"

import { UserRole } from "~/types/database"

import { Link } from "react-router"

export function ScheduleTableItem({
	row,
	column
}: {
	row: number
	column: number
}) {
	const schedule = useContext(ScheduleContext)
	const user = useUserContext()
	const data = schedule?.schedule[`${row}-${column}`] || []

	function getToday() {
		const today = new Date().getDay()
		return today === 0 ? 7 : today
	}

	if (typeof data !== "number" || data === 0)
		return (
			<td
				className={cn(
					"h-16 p-6 border group-last:border-b-0",
					getToday() === column + 1 && "border-b-background bg-primary/25"
				)}
			></td>
		)

	return (
		<td
			className={cn(
				"relative h-16 border group-last:border-b-0",
				getToday() === column + 1 && "border-b-background bg-primary/25"
			)}
		>
			<Link to={`/schedule/details/${row}/${column}`}>
				<div className="flex flex-col px-4 py-2">
					<span
						className={cn(
							"text-sm text-muted-foreground",
							user.role === UserRole.Employee && "text-foreground"
						)}
					>
						{row.toString().padStart(2, "0")}:00
					</span>
					{user.role > UserRole.Employee && (
						<span className="text-lg font-medium">
							{data} {data > 1 ? "employees" : "employee"}
						</span>
					)}
				</div>
			</Link>
		</td>
	)
}
