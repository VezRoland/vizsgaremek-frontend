import { useSubmit } from "react-router"
import { cn, useScheduleContext } from "~/lib/utils"

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "../ui/dialog"
import { Button } from "../ui/button"

export function ScheduleTableItem({
	row,
	column
}: {
	row: number
	column: number
}) {
	const { tableData, fieldData } = useScheduleContext()
	const submit = useSubmit()
	const data = tableData.schedule[`${row}-${column}`] || []

	function getToday() {
		const today = new Date().getDay()
		return today === 0 ? 7 : today
	}

	function getDayName() {
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesdy",
			"Thursday",
			"Friday",
			"Saturday"
		]
		return days[column]
	}

  async function getDetailS() {
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

	async function onOpenChange(open: boolean) {
		if (!open) return
    getDetailS()
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

    console.log(fieldData)

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
				<DialogHeader>
					<DialogTitle>
						{getDayName()} - {`${row.toString().padStart(2, "0")}:00`}
					</DialogTitle>
				</DialogHeader>
        <ul>
          {fieldData?.map(data => (
            <li>{data.user.name}</li>
          ))}
        </ul>
				<DialogFooter className="gap-2">
					<Button type="submit">Finalize</Button>
					<DialogClose className="!m-0" asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
