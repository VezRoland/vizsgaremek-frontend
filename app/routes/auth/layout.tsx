import { Outlet } from "react-router"

export default function AuthLayout() {
	return (
		<main className="h-screen grid place-items-center p-4">
			<Outlet />
		</main>
	)
}
