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

	async function onOpenChange(open: boolean) {
		if (!open) return
		await submit(
			{
				type: "VIEW_DETAILS",
				field: `${row}-${column}`,
				weekStart: tableData.week_start,
				page: 1
			},
			{ method: "POST", action: "/schedule", encType: "application/json" }
		)
	}

	if (typeof data !== "number" || data === 0)
		return (
			<td
				className={cn(
					"border",
					new Date().getDay() === column + 1 &&
						"p-6 border-background bg-primary/25"
				)}
			></td>
		)

	return (
		<Dialog onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<td
					className={cn(
						"border",
						new Date().getDay() === column + 1 &&
							"p-6 border-background bg-primary/25"
					)}
				>
					<>
						<span>
							{data} <span>({row.toString().padStart(2, "0")}:00)</span>
						</span>
					</>
				</td>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader></DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
