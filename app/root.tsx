import { createSupabaseServerClient } from "./lib/supabase"
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration
} from "react-router"

import type { Route } from "./+types/root"
import type { ServerResponse } from "./types/response"

import "./app.css"
import { Toaster } from "~/components/ui/sonner"
import { useEffect } from "react"
import { handleServerResponse } from "./lib/utils"

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
	}
]

export async function action({ request }: Route.ActionArgs) {
	const { supabase, headers } = createSupabaseServerClient(request)

	await supabase.auth.signOut()

	return Response.json(
		{
			error: false,
			type: "message",
			message: "Sikeres kijelentkezés!",
			messageType: "success"
		} as ServerResponse,
		{
			headers,
			status: 200
		}
	)
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html className="bg-background" lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<Toaster />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App({ actionData }: Route.ComponentProps) {
	useEffect(() => handleServerResponse(actionData), [actionData])

	return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Hoppá!"
	let details = "Váratlan hiba történt."
	let stack: string | undefined

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Hiba"
		details =
			error.status === 404
				? "A kért oldal nem található."
				: error.statusText || details
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message
		stack = error.stack
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	)
}
