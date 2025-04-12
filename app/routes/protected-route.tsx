import { Outlet, redirect, useSubmit } from "react-router"
import { fetchData, UserContext } from "~/lib/utils"

import type { Route } from "./+types/protected-route"
import type { User } from "~/types/database"

import { Navbar } from "~/components/navbar/navbar"

export async function clientLoader() {
	const response = await fetchData<User>("auth/user", { disableToast: true })
	if (!response || response.status === "error") return redirect("/sign-in")
	return response.data
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
