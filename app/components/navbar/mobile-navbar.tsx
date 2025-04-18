import { useUserContext } from "~/lib/utils"

import type { Route } from "./navbar-item"

import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTrigger
} from "../ui/drawer"
import { LogOut, MenuIcon, X } from "lucide-react"
import { Button } from "../ui/button"
import NavbarItem from "./navbar-item"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import ActionLoadingWrapper from "../action-loading-wrapper"

export default function MobileNavbar({
	routes,
	onSignOut
}: {
	routes: Route[]
	onSignOut: () => void
}) {
	const user = useUserContext()

	return (
		<nav className="z-50 sticky top-0 left-0 max-w-full flex justify-between p-4 border-b bg-background/25 backdrop-blur-md">
			<img className="h-9" src="/favicon.ico" alt="Logo" />
			<Drawer direction="right">
				<DrawerTrigger asChild>
					<Button size="icon" variant="ghost">
						<MenuIcon />
					</Button>
				</DrawerTrigger>
				<DrawerContent className="h-full">
					<DrawerHeader className="flex justify-between">
						<img className="h-9" src="/favicon.ico" alt="Logo" />
						<DrawerClose asChild>
							<Button size="icon" variant="ghost">
								<X />
							</Button>
						</DrawerClose>
					</DrawerHeader>
					<ul className="flex flex-col p-4">
						{routes.map(route => (
							<NavbarItem {...route} />
						))}
					</ul>
					<DrawerFooter className="flex-row justify-between border-t">
						<DropdownMenu>
							<DropdownMenuTrigger className="w-max">
								<Avatar className="w-8 h-8">
									<AvatarImage />
									<AvatarFallback>
										{user.name.substring(0, 1).toLocaleUpperCase()}
									</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<ActionLoadingWrapper type="DELETE">
									<DropdownMenuItem onClick={onSignOut}>
										Sign out
									</DropdownMenuItem>
								</ActionLoadingWrapper>
							</DropdownMenuContent>
						</DropdownMenu>
						<div>
							<ActionLoadingWrapper type="DELETE">
								<Button size="icon" variant="ghost" onClick={onSignOut}>
									<LogOut />
								</Button>
							</ActionLoadingWrapper>
						</div>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</nav>
	)
}
