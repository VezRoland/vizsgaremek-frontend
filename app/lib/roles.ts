import type { User } from "@supabase/supabase-js"
import { UserRole, type Ticket } from "../types/database"

type PermissionCheck<Key extends keyof Permissions> =
	| boolean
	| ((user: User, data: Permissions[Key]["dataType"]) => boolean)

type RolesWithPermissions = {
	[R in UserRole]: Partial<{
		[Key in keyof Permissions]: Partial<{
			[Action in Permissions[Key]["action"]]: PermissionCheck<Key>
		}>
	}>
}

type Permissions = {
	tickets: {
		dataType: Ticket
		action: "view" | "create" | "delete" | "close" | "respond"
	}
}

const ROLES = {
	[UserRole.Admin]: {},
	[UserRole.Owner]: {},
	[UserRole.Leader]: {},
	[UserRole.Employee]: {}
} as const satisfies RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions>(
	user: User,
	resource: Resource,
	action: Permissions[Resource]["action"],
	data?: Permissions[Resource]["dataType"]
) {
	const role = user.user_metadata.role as UserRole
	const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action]
	if (permission == null) return false

	if (typeof permission === "boolean") return permission
	return data != null && permission(user, data)
}
