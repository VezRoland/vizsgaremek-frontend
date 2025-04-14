import { Outlet, redirect } from "react-router"
import { fetchData } from "~/lib/utils"

export async function clientLoader() {
	const response = await fetchData("auth/user", { disableToast: true })
	if (response?.data) return redirect("/")
}

export default function AuthLayout() {
	return (
		<main className="h-screen grid place-items-center p-4">
			<Outlet />
		</main>
	)
}
