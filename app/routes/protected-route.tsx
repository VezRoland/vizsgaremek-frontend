import { Outlet, redirect, useSubmit } from "react-router"

import type { Route } from "./+types/protected-route"
import type { User } from "~/types/database"
import { UserContext } from "~/lib/utils"
import { Navbar } from "~/components/navbar"


export async function loader({ request }: Route.LoaderArgs) {
	const res = await fetch(`${process.env.VITE_API_URL}/user`, {
		headers: request.headers
	})
	const user = await res.json()

	if (res.status !== 200) return redirect("/signin")
	return user as User
}

export default function ProtectedRoute({ loaderData }: Route.ComponentProps) {
	const submit = useSubmit()

	function onSignOut() {
		submit(null, { method: "DELETE" })
	}

	return (
		<UserContext.Provider value={loaderData}>
			<Navbar onSignOut={onSignOut} />
			<Outlet />
		</UserContext.Provider>
	)
}
