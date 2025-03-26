import { Await, Outlet } from "react-router"

import type { Route } from "./+types"
import type { ScheduleWeek } from "~/types/results"
import type { ApiResponse } from "~/types/response"

import { ScheduleTable } from "~/components/schedule-table/schedule-table"
import React from "react"

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
	const { searchParams } = new URL(request.url)
	const weekStart = searchParams.get("week_start")

	const data = await fetch(
		`http://localhost:3000/schedule${weekStart ? `/${weekStart}` : ""}`,
		{
			method: "GET",
			credentials: "include"
		}
	)

	return data.json() as Promise<ApiResponse<ScheduleWeek>>
}

export default function Schedule({ loaderData }: Route.ComponentProps) {
	return (
		<>
			<Outlet />
			<main className="h-[calc(100vh-69px)] p-4">
        <React.Suspense fallback={<div>Loading</div>}>
          <Await resolve={loaderData}>
            { value => <ScheduleTable data={value.data!} /> }
          </Await>
        </React.Suspense>
			</main>
		</>
	)
}
