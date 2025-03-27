import { Outlet, useLocation, useNavigate } from "react-router"

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Button } from "~/components/ui/button"
import { Building2, UserRound } from "lucide-react"

export default function SignupLayout() {
	const navigate = useNavigate()
	const { pathname } = useLocation()

	return (
		<Tabs
			className="w-full max-w-xl flex flex-col gap-2"
			value={pathname.split("-")[1]}
		>
			<TabsList className="h-full">
				<Button variant="ghost" asChild>
					<TabsTrigger
						className="flex-1"
						value="employee"
						onClick={() => navigate("/signup-employee")}
					>
						<UserRound />
						Employee
					</TabsTrigger>
				</Button>
				<Button variant="ghost" asChild>
					<TabsTrigger
						className="flex-1"
						value="company"
						onClick={() => navigate("/signup-company")}
					>
						<Building2 />
						Company
					</TabsTrigger>
				</Button>
			</TabsList>
			<Outlet />
		</Tabs>
	)
}
