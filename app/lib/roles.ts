import { UserRole } from "../types/database"
import type { Schedule, Ticket, User } from "../types/database"

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
	},
  schedules: {
    dataType: Schedule
    action: "view" | "create" | "delete" | "finalize"
  }
}

const ROLES = {
	[UserRole.Admin]: {
		tickets: {
			view: (_, data) => data.company_id === null,
			create: false,
			delete: (_, data) => data.company_id === null,
			close: (_, data) => data.company_id === null,
			respond: (_, data) => data.company_id === null,
		}
	},
	[UserRole.Owner]: {
		tickets: {
			view: (user, data) => user.id === data.user_id || user.company_id === data.company_id,
			create: true,
			delete: (user, data) => user.company_id === data.company_id,
			close: (user, data) => user.company_id === data.company_id,
			respond: (user, data) => user.id === data.user_id || user.company_id === data.company_id,
		},
    schedules: {
      view: true,
      create: true,
      delete: true,
      finalize: true
    }
	},
	[UserRole.Leader]: {
		tickets: {
			view: (user, data) => user.id === data.user_id || user.company_id === data.company_id,
			create: true,
			delete: (user, data) => user.company_id === data.company_id,
			close: (user, data) => user.company_id === data.company_id,
			respond: (user, data) => user.id === data.user_id || user.company_id === data.company_id,
		},
    schedules: {
      view: true,
      create: true,
      delete: true,
      finalize: true
    }
	},
	[UserRole.Employee]: {
		tickets: {
			view: (user, data) => user.id === data.user_id,
			create: true,
			delete: false,
			close: false,
			respond: (user, data) => user.id === data.user_id,
		},
    schedules: {
      view: true,
      create: true,
      delete: false,
      finalize: false
    }
	}
} as const satisfies RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions>(
	user: User,
	resource: Resource,
	action: Permissions[Resource]["action"],
	data?: Permissions[Resource]["dataType"]
) {
	const role = user.role as UserRole
	const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action]
	if (permission == null) return false

	if (typeof permission === "boolean") return permission
	return data != null && permission(user, data)
}
