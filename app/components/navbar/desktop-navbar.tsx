import { useUserContext } from "~/lib/utils"

import type { Route } from "./navbar-item"
import NavbarItem from "./navbar-item"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import ActionLoadingWrapper from "../action-loading-wrapper"
import { useNavigate } from "react-router"

export default function DesktopNavbar({
	routes,
	onSignOut
}: {
	routes: Route[]
	onSignOut: () => void
}) {
	const navigate = useNavigate()
	const user = useUserContext()

	return (
		<nav className="z-50 sticky top-0 left-0 max-w-full grid grid-cols-[1fr_2fr_1fr] px-8 py-4 border-b bg-background/50 backdrop-blur-sm">
			<img className="h-9" src="/favicon.ico" alt="Logo" />
			<ul className="flex justify-center">
				{routes.map(route => (
					<li key={route.name}>
						<NavbarItem {...route} />
					</li>
				))}
			</ul>
			<DropdownMenu>
				<DropdownMenuTrigger className="w-max ml-auto">
					<Avatar className="w-8 h-8">
						<AvatarImage src={user.avatar_url} />
						<AvatarFallback>
							{user.name.substring(0, 1).toLocaleUpperCase()}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => navigate("/settings")}>
						Settings
					</DropdownMenuItem>
					<ActionLoadingWrapper type="DELETE">
						<DropdownMenuItem onClick={onSignOut}>Sign out</DropdownMenuItem>
					</ActionLoadingWrapper>
				</DropdownMenuContent>
			</DropdownMenu>
		</nav>
	)
}
