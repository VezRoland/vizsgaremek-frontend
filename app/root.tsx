import { useEffect } from "react"
import { createSupabaseServerClient } from "./lib/supabase"
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useActionData
} from "react-router"
import { fetchData, handleServerResponse } from "./lib/utils"

import type { Route } from "./+types/root"
import type { ApiResponse } from "./types/results"

import { Toaster } from "~/components/ui/sonner"
import { LoadingBar } from "./components/navbar/loading-bar"

import "./app.css"

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

export async function clientAction() {
	await fetchData("auth/sign-out", { method: "POST" })
	await fetchData("auth/user", {
		headers: { "Cache-Control": "no-cache" },
		disableToast: true
	})
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
				<LoadingBar />
				{children}
				<Toaster />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	const actionData = useActionData<ApiResponse>()

	useEffect(() => {
		if (!actionData?.errors) {
			handleServerResponse(actionData)
		}
	}, [actionData])

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
