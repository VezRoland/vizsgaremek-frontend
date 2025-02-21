import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
	index("routes/home.tsx"),
  layout("routes/auth/layout.tsx", [
    route("signin", "routes/auth/signin.tsx"),
    route("signup-owner", "routes/auth/signup-owner.tsx"),
    route("signup-employee", "routes/auth/signup-employee.tsx")
  ])
] satisfies RouteConfig
