import { NavLink, useLocation } from "react-router"
import { useUserContext } from "~/lib/utils"

import type { UserRole } from "~/types/database"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"

export interface Route {
	name: string
	path: string | Route[]
	minRole: UserRole
}

export default function NavbarItem({ name, path, minRole }: Route) {
	const user = useUserContext()
	const { pathname } = useLocation()

  if (user.role < minRole) return

	if (Array.isArray(path)) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            {name}
          </Button>
        </DropdownMenuTrigger>
				<DropdownMenuContent>
					{path.map(
						route =>
							user.role >= route.minRole && (
								<DropdownMenuItem asChild>
									<Button
										variant={pathname === route.path ? "nav_active" : "ghost"}
										asChild
									>
										<NavLink to={route.path as string}>{route.name}</NavLink>
									</Button>
								</DropdownMenuItem>
							)
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}

	return (
		<Button variant={pathname === path ? "nav_active" : "ghost"} asChild>
			<NavLink to={path}>{name}</NavLink>
		</Button>
	)
}
