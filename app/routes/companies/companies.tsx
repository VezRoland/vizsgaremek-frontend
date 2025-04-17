import { Outlet } from "react-router"
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow
} from "~/components/ui/table"
import type { Company } from "~/types/database"

export async function clientLoader() {
	const companies: Company[] = [
		{
			id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
			name: "Acme Corporation",
			code: "ABCDEFGH",
			verified: true,
			createdAt: "2024-01-15T10:30:00Z"
		},
		{
			id: "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
			name: "Beta Industries",
			code: "WXYZ1234",
			verified: false,
			createdAt: "2023-11-20T14:45:30Z"
		},
		{
			id: "01234567-89ab-cdef-0123-456789abcdef",
			name: "Gamma Solutions",
			code: "QRSTUVWX",
			verified: true,
			createdAt: "2025-03-01T09:00:00Z"
		},
		{
			id: "bcdefa01-2345-6789-abcd-ef0123456789",
			name: "Delta Technologies",
			code: "LMNOPQRS",
			verified: true,
			createdAt: "2024-07-10T16:15:45Z"
		},
		{
			id: "98765432-10fe-dcba-9876-543210fedcba",
			name: "Epsilon Enterprises",
			code: "IJKLMNOP",
			verified: false,
			createdAt: "2023-05-25T11:20:15Z"
		},
		{
			id: "fedcba98-7654-3210-fedc-ba9876543210",
			name: "Zeta Group",
			code: "GHIJKLMN",
			verified: true,
			createdAt: "2024-09-05T13:55:00Z"
		},
		{
			id: "abcdef01-2345-6789-abcd-ef0123456789",
			name: "Eta Systems",
			code: "EFGHIJKL",
			verified: true,
			createdAt: "2025-02-18T17:30:20Z"
		},
		{
			id: "12345678-9abc-def0-1234-567890abcdef",
			name: "Theta Innovations",
			code: "CDEFGHIJ",
			verified: false,
			createdAt: "2023-12-01T08:40:50Z"
		},
		{
			id: "89abcdef-0123-4567-89ab-cdef01234567",
			name: "Iota Software",
			code: "BCDEFGHI",
			verified: true,
			createdAt: "2024-04-22T12:05:35Z"
		},
		{
			id: "cdef0123-4567-89ab-cdef-0123456789ab",
			name: "Kappa Solutions Ltd.",
			code: "ABCDEFGH",
			verified: true,
			createdAt: "2024-11-30T15:20:05Z"
		}
	]

	return companies
}
export interface Company {
	id: string
	name: string
	code: string
  verified: boolean
	createdAt: string
}
export default function Companies() {


	return (
		<>
			<Outlet />
			<main className="w-full max-w-4xl px-4 py-8 m-auto">
				<Table className="rounded-md overflow-clip">
					<TableHeader className="bg-primary">
						<TableRow>
							<TableHead className="text-primary-foreground">Name</TableHead>
							<TableHead className="text-primary-foreground">
								Created at
							</TableHead>
							<TableHead className="text-primary-foreground">
								Verified
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody></TableBody>
				</Table>
			</main>
		</>
	)
}
