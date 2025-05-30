import { useUserContext } from "~/lib/utils"
import type { Route } from "../+types/root"

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Home" },
		{ name: "description", content: "Welcome to the home page of NexusOPS!" }
	]
}

export default function Home() {
	const user = useUserContext()

	return (
		<main className="max-w-4xl flex flex-col gap-4 p-8 m-auto">
			<h1 className="text-4xl">Welcome back, {user.name}!</h1>
			{user.company_code && (
				<p>
					Company code: <b>{user.company_code}</b>
				</p>
			)}
		</main>
	)
}
