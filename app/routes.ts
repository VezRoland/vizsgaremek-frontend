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
		route("schedule", "routes/schedule/schedule.tsx", [
			route("new", "routes/schedule/new-schedule.tsx"),
			route("details/:hour/:day", "routes/schedule/schedule-details.tsx")
		]),
		route("employees", "routes/employees/employees.tsx", [
			route(":userId", "routes/employees/edit-employee.tsx")
		]),
		...prefix("training", [
			index("routes/training/overview.tsx"),
			route("test/:testId", "routes/training/training.tsx"),
			route("results/:testId", "routes/training/results.tsx"),
			route("create", "routes/training/create-training.tsx")
		]),
		...prefix("help", [
			index("routes/help/help.tsx"),
			route(":ticketId", "routes/help/help-ticket.tsx")
		]),
		route("settings", "routes/settings.tsx")
	]),
	layout("routes/auth/layout.tsx", [
		route("sign-in", "routes/auth/sign-in.tsx"),
		layout("routes/auth/sign-up-layout.tsx", [
			route("sign-up-company", "routes/auth/sign-up-company.tsx"),
			route("sign-up-employee", "routes/auth/sign-up-employee.tsx")
		])
	])
] satisfies RouteConfig
