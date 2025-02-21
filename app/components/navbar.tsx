import { Link, NavLink, useLocation } from "react-router"
import { useUserContext } from "~/lib/utils"

import { UserRole } from "~/types/database"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import ActionLoadingWrapper from "./action-loading-wrapper"
import { Button } from "./ui/button"

export function Navbar({ onSignOut }: { onSignOut: () => void }) {
	const user = useUserContext()
	const { pathname } = useLocation()

	const routes = [{ name: "Főoldal", path: "/", minRole: UserRole.employee }]

	return (
		<nav className="sticky top-0 left-0 max-w-full grid grid-cols-[1fr_2fr_1fr] px-8 py-4 border-b">
			<img src="" alt="" />
			<ul className="flex justify-center">
				{routes.map(
					route =>
						user.role >= route.minRole && (
							<li>
								<Button
									variant={pathname === route.path ? "nav_active" : "ghost"}
									asChild
								>
									<NavLink to={route.path}>{route.name}</NavLink>
								</Button>
							</li>
						)
				)}
			</ul>
			<DropdownMenu>
				<DropdownMenuTrigger className="w-max ml-auto">
					<Avatar className="w-8 h-8">
						<AvatarImage />
						<AvatarFallback>
							{user.name.substring(0, 1).toLocaleUpperCase()}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<ActionLoadingWrapper pathname="/" method="DELETE">
						<DropdownMenuItem onClick={onSignOut}>
							Kijelentkezés
						</DropdownMenuItem>
					</ActionLoadingWrapper>
				</DropdownMenuContent>
			</DropdownMenu>
		</nav>
	)
}
