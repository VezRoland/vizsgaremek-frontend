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

export async function clientAction({ request }: Route.ClientActionArgs) {
	const { id } = await request.json()
}

export function clientLoader() {
	const users: User[] = [
		{
			id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
			name: "Alice Johnson",
			age: 42,
			role: 3,
			companyId: "company-2",
			verified: true,
			createdAt: "2024-07-03T15:22:18.456Z"
		},
		{
			id: "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
			name: "Bob Williams",
			hourlyWage: 25.75,
			role: 1,
			companyId: "company-5",
			verified: false,
			createdAt: "2025-01-19T08:45:59.123Z"
		},
		{
			id: "01234567-89ab-cdef-0123-456789abcdef",
			name: "Charlie Brown",
			age: 28,
			role: 2,
			companyId: "company-1",
			verified: true,
			createdAt: "2024-05-12T20:10:33.789Z"
		},
		{
			id: "bacdef01-2345-6789-abcd-ef0123456789",
			name: "Diana Miller",
			age: 51,
			hourlyWage: 31.2,
			role: 1,
			companyId: "company-3",
			verified: true,
			createdAt: "2024-11-28T11:58:02.012Z"
		},
		{
			id: "98765432-10fe-dcba-9876-543210fedcba",
			name: "Ethan Davis",
			role: 4,
			companyId: "company-4",
			verified: false,
			createdAt: "2024-09-05T02:31:47.345Z"
		},
		{
			id: "defabc98-7654-3210-fedc-ba9876543210",
			name: "Fiona Garcia",
			age: 35,
			hourlyWage: 19.5,
			role: 1,
			companyId: "company-1",
			verified: true,
			createdAt: "2025-03-15T17:05:21.678Z"
		},
		{
			id: "1a2b3c4d-5e6f-7890-1234-567890abcdef",
			name: "George Rodriguez",
			role: 2,
			companyId: "company-4",
			verified: false,
			createdAt: "2024-06-22T09:19:05.901Z"
		},
		{
			id: "fedcba98-7654-3210-0123-456789abcdef",
			name: "Hannah Wilson",
			age: 24,
			hourlyWage: 28.8,
			role: 1,
			companyId: "company-2",
			verified: true,
			createdAt: "2024-12-30T23:42:39.234Z"
		},
		{
			id: "bcdefa01-2345-6789-abcd-ef0123456789",
			name: "Ian Martinez",
			role: 3,
			companyId: "company-5",
			verified: true,
			createdAt: "2024-08-08T14:56:12.567Z"
		},
		{
			id: "87654321-fedc-ba98-7654-3210abcdef98",
			name: "Julia Anderson",
			age: 48,
			hourlyWage: 35.15,
			role: 1,
			companyId: "company-3",
			verified: false,
			createdAt: "2025-02-01T05:30:00.890Z"
		}
	]

	return users
}

export default function Employees({ loaderData }: Route.ComponentProps) {
	const submit = useSubmit()
	const navigate = useNavigate()
	const users = loaderData || []

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
								<TableCell>{user.hourlyWage || "-"}</TableCell>
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
