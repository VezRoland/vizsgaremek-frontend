import * as React from "react"
import { useSubmit } from "react-router"
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table"

import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState
} from "@tanstack/react-table"
import type { DetailsUser } from "~/types/results"

import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "~/components/ui/table"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"

export function UsersTable({
	data = [],
	pageLimit = 1
}: {
	data: DetailsUser[] | undefined
	pageLimit: number | undefined
}) {
	const submit = useSubmit()
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})

	const columns: ColumnDef<DetailsUser>[] = [
		{
			id: "select",
			size: 64,
			header: ({ table }) => (
				<div className="w-full h-full grid place-items-center">
					<Checkbox
						className="border-0 bg-primary-foreground"
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
						aria-label="Select all"
					/>
				</div>
			),
			cell: ({ row }) => (
				<div className="w-full h-full grid place-items-center">
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={value => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				</div>
			),
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: "user",
			header: "Name",
			cell: ({ row }) => (
				<div>
					{row.original.user.avatar_url}
					{row.original.user.name}
				</div>
			)
		},
		{
			accessorKey: "start",
			header: "Start",
			cell: ({ row }) => {
				const start = new Date(row.getValue("start"))

				return <div className="font-medium">{start.toLocaleDateString()}</div>
			}
		},
		{
			accessorKey: "end",
			header: "End",
			cell: ({ row }) => {
				const end = new Date(row.getValue("end"))

				return <div className="font-medium">{end.toLocaleDateString()}</div>
			}
		},
		{
			id: "actions",
			enableHiding: false,
			size: 64,
			cell: ({ row }) => {
				return (
					<div className="w-full h-full grid place-items-center">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem onClick={() => onFinalize(row.original.id)}>
									Finalize
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)
			}
		}
	]

	const table = useReactTable<DetailsUser>({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		pageCount: pageLimit,
		state: {
			sorting,
			columnFilters,
			columnVisibility
		}
	})

	function onFinalize(id: string) {
		const selectedIds = table
			.getSelectedRowModel()
			.rows.map(row => row.original.id)
		const scheduleIds = selectedIds.length > 0 ? selectedIds : [id]
		submit(JSON.stringify({ scheduleIds, finalized: true }), {
			method: "PATCH",
			encType: "application/json"
		})
	}

	return (
		<div className="w-full">
			<div className="rounded-md overflow-clip">
				<ScrollArea className="h-64">
					<Table>
						<TableHeader className="bg-primary">
							{table.getHeaderGroups().map(headerGroup => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map(header => {
										return (
											<TableHead
												className="text-primary-foreground"
												key={header.id}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</TableHead>
										)
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map(cell => (
											<TableCell
												style={{ width: cell.column.getSize() }}
												key={cell.id}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</ScrollArea>
			</div>
			<div className="flex items-center justify-between py-4">
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<ChevronRight />
					</Button>
				</div>
				<div className="text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
			</div>
		</div>
	)
}
