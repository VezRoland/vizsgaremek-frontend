import { Outlet, useNavigate, useSubmit } from "react-router"
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

export async function clientAction({ request }: Route.ClientActionArgs) {
	const { id } = await request.json()
  await fetchData(`company/verify/${id}`, { method: "PATCH" })
}

export async function clientLoader() {
  const response = await fetchData<User[]>("company/users")
  return response?.data || []
}

export default function Employees({ loaderData }: Route.ComponentProps) {
	const submit = useSubmit()
	const navigate = useNavigate()
	const users = loaderData

	function verifyUser(id: string) {
		submit(JSON.stringify({ id }), {
			method: "POST",
			encType: "application/json"
		})
	}

	return (
		<>
			<Outlet />
			<main className="w-full max-w-4xl px-4 py-8 m-auto">
				<Table className="rounded-md overflow-clip">
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
						{users.map(user => (
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
												onClick={() => navigate(`/employees/${user.id}`)}
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
			</main>
		</>
	)
}
