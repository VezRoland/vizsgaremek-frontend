import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route
} from "@react-router/dev/routes"

export default [
	layout("routes/protected-route.tsx", [
		index("routes/home.tsx"),
		route("schedule", "routes/schedule/index.tsx", [
			route("new", "routes/schedule/new-schedule.tsx"),
      route("details/:hour/:day", "routes/schedule/schedule-details.tsx")
		]),
		...prefix("help", [
			index("routes/help/help.tsx"),
			route(":ticketId", "routes/help/help-ticket.tsx")
		])
	]),
	layout("routes/auth/layout.tsx", [
		route("signin", "routes/auth/signin.tsx"),
		route("signup-owner", "routes/auth/signup-owner.tsx"),
		route("signup-employee", "routes/auth/signup-employee.tsx")
	])
] satisfies RouteConfig
