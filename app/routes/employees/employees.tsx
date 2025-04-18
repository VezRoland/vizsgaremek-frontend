import { Outlet, useNavigate, useSearchParams, useSubmit } from "react-router"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "~/components/ui/table"
import { UserRole, type User } from "~/types/database"
import type { Route } from "./+types/employees"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { Button } from "~/components/ui/button"
import { fetchData } from "~/lib/utils"
import type { Pagination as TPagination } from "~/types/results"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink
} from "~/components/ui/pagination"

export async function clientAction({ request }: Route.ClientActionArgs) {
	const { id } = await request.json()
	await fetchData(`company/verify/${id}`, { method: "PATCH" })
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	const { searchParams } = new URL(request.url)
	const page = searchParams.get("page") || 1
	const response = await fetchData<{ pagination: TPagination; users: User[] }>(
		`company/users?page=${page}`
	)
	console.log(response)
	return response?.data
}

export default function Employees({ loaderData }: Route.ComponentProps) {
	const submit = useSubmit()
	const navigate = useNavigate()
	const searchParams = useSearchParams()

	function verifyUser(id: string) {
		submit(JSON.stringify({ id }), {
			method: "POST",
			encType: "application/json"
		})
	}

	return (
		<>
			<Outlet />
			<main className="w-full max-w-4xl flex flex-col gap-4 px-4 py-8 m-auto">
				<div className="max-w-screen w-full overflow-auto">
					<Table className="rounded-md">
						<TableHeader className="bg-primary">
							<TableRow>
								<TableHead className="text-primary-foreground">Name</TableHead>
								<TableHead className="text-primary-foreground">Age</TableHead>
								<TableHead className="text-primary-foreground">
									Hourly wage
								</TableHead>
								<TableHead className="text-primary-foreground">Role</TableHead>
								<TableHead className="text-primary-foreground" colSpan={2}>
									Status
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loaderData?.users.map(user => (
								<TableRow>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.age || "-"}</TableCell>
									<TableCell>{user.hourlyWage ?? "-"}</TableCell>
									<TableCell>{UserRole[user.role]}</TableCell>
									<TableCell>
										{user.verified ? "Verified" : "Unverified"}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button size="icon" variant="ghost">
													<EllipsisVertical />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem
													onClick={() =>
														navigate(
															`/employees/${user.id}?${searchParams[0].toString()}`
														)
													}
												>
													Edit
												</DropdownMenuItem>
												{!user.verified && (
													<DropdownMenuItem onClick={() => verifyUser(user.id)}>
														Verify
													</DropdownMenuItem>
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<Pagination>
					<PaginationContent>
						{Array.from({
							length: Math.max(
								Math.min(3, loaderData?.pagination.totalPages || 0),
								0
							)
						}).map((_, page) => (
							<PaginationItem>
								<PaginationLink
									to={`/employees?page=${page + 1}`}
									isActive={loaderData?.pagination.currentPage === page + 1}
								>
									{page + 1}
								</PaginationLink>
							</PaginationItem>
						))}
					</PaginationContent>
				</Pagination>
			</main>
		</>
	)
}
