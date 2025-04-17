import { useUserContext } from "~/lib/utils"
import type { Route } from "../+types/root"

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" }
	]
}

export default function Home() {
	const user = useUserContext()

	return (
		<main className="max-w-4xl m-auto p-8">
			<h1 className="text-4xl">Welcome back, {user.name}!</h1>
		</main>
	)
}
