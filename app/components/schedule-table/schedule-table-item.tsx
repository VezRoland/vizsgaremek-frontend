import { useSubmit } from "react-router"
import { cn, useScheduleContext } from "~/lib/utils"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger
} from "../ui/dialog"

export function ScheduleTableItem({
	row,
	column
}: {
	row: number
	column: number
}) {  
	const { tableData, fieldData } = useScheduleContext()
	const submit = useSubmit()
	const data = tableData.schedule[`${row + 1}-${column + 1}`] || []

	function getToday() {
		const today = new Date().getDay()
		return today === 0 ? 7 : today
	}

	async function onOpenChange(open: boolean) {
		if (!open) return

		await submit(
			{
				type: "VIEW_DETAILS",
				field: `${row}-${column}`,
				weekStart: tableData.week_start,
				page: 1
			},
			{ method: "POST", encType: "application/json" }
		)
	}

	if (typeof data !== "number" || data === 0)
		return (
			<td
				className={cn(
					"p-6 border group-last:border-b-0",
					getToday() === column + 1 && "border-b-background bg-primary/25"
				)}
			></td>
		)

	return (
		<Dialog onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<td
					className={cn(
						"relative border group-last:border-b-0",
						getToday() === column + 1 && "border-b-background bg-primary/25"
					)}
				>
					<div className="flex flex-col px-4 py-2">
						<span className="text-sm text-muted-foreground">
							{row.toString().padStart(2, "0")}:00
						</span>
						<span className="text-lg font-medium">
							{data} {data > 1 ? "employees" : "employee"}
						</span>
					</div>
				</td>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader></DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
