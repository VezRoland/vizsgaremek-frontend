import { Outlet, redirect } from "react-router"

import type { Route } from "./+types/layout"
import { createSupabaseServerClient } from "~/lib/supabase"

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request)

  const { data } = await supabase.auth.getUser()
  if (data.user) return redirect("/")
}

export default function AuthLayout() {
	return (
		<main className="h-screen grid place-items-center">
			<Outlet />
		</main>
	)
}
