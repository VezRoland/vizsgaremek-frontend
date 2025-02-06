import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
	index("routes/home.tsx"),
  layout("routes/auth/layout.tsx", [
    route("signin", "routes/auth/signin.tsx")
  ])
] satisfies RouteConfig
