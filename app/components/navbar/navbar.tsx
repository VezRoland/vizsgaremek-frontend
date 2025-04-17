import { useMediaQuery } from "~/hooks/use-media-query"

import { UserRole } from "~/types/database"
import type { Route } from "./navbar-item"

import DesktopNavbar from "./desktop-navbar"
import MobileNavbar from "./mobile-navbar"

export function Navbar({ onSignOut }: { onSignOut: () => void }) {
	const isDesktop = useMediaQuery("(min-width: 650px)")

	const routes = [
		{ name: "Home", path: "/", minRole: UserRole.Employee },
		{
			name: "Management",
			path: "/employees",
			minRole: UserRole.Leader
		},
		{ name: "Schedule", path: "/schedule", minRole: UserRole.Employee },
		{ name: "Training", path: "/training", minRole: UserRole.Employee },
    { name: "Help", path: "/help", minRole: UserRole.Employee }
	] satisfies Route[]

	return isDesktop ? (
		<DesktopNavbar key={new Date().getTime()} routes={routes} onSignOut={onSignOut} />
	) : (
		<MobileNavbar key={new Date().getTime()} routes={routes} onSignOut={onSignOut} />
	)
}
