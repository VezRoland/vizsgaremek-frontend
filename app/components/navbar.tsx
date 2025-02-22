import { useMediaQuery } from "~/hooks/use-media-query"

import { UserRole } from "~/types/database"
import type { Route } from "./navbar-item"

import DesktopNavbar from "./desktop-navbar"
import MobileNavbar from "./mobile-navbar"

export function Navbar({ onSignOut }: { onSignOut: () => void }) {
	const isDesktop = useMediaQuery("(min-width: 650px)")

	const routes = [
		{ name: "Főoldal", path: "/", minRole: UserRole.employee },
		{
			name: "Igazgatás",
			path: [
				{ name: "Alkalmazottak", path: "/employees", minRole: UserRole.leader },
				{ name: "Cég", path: "/company", minRole: UserRole.owner }
			],
			minRole: UserRole.leader
		},
		{ name: "Beosztás", path: "/schedule", minRole: UserRole.employee },
		{ name: "Betanítás", path: "/training", minRole: UserRole.employee }
	] satisfies Route[]

	return isDesktop ? (
		<DesktopNavbar routes={routes} onSignOut={onSignOut} />
	) : (
		<MobileNavbar routes={routes} onSignOut={onSignOut} />
	)
}
