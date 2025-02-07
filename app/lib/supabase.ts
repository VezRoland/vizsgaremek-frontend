import { createServerClient, parseCookieHeader, serialize } from "@supabase/ssr"

export const createSupabaseServerClient = (request: Request) => {
	const headers = new Headers()

	const supabase = createServerClient(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
		{
			cookies: {
				getAll() {
					return parseCookieHeader(request.headers.get("Cookie") ?? "")
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						headers.append("Set-Cookie", serialize(name, value, options))
					})
				}
			}
		}
	)

	return { supabase, headers }
}
