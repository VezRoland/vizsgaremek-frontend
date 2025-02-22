import { useUserContext } from "~/lib/utils"

import type { Route } from "./navbar-item"
import NavbarItem from "./navbar-item"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import ActionLoadingWrapper from "./action-loading-wrapper"

export default function DesktopNavbar({
	routes,
	onSignOut
}: {
	routes: Route[]
	onSignOut: () => void
}) {
	const user = useUserContext()

	return (
		<nav className="sticky top-0 left-0 max-w-full grid grid-cols-[1fr_2fr_1fr] px-8 py-4 border-b">
			<img className="h-9" src="favicon.ico" alt="" />
			<ul className="flex justify-center">
				{routes.map(route => (
					<li>
						<NavbarItem {...route} />
					</li>
				))}
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
