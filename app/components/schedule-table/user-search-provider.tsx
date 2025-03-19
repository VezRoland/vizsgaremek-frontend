import { useState } from "react"
import { UserSearchContext } from "~/lib/utils"

import type { Schedule, User } from "~/types/database"

export function UserSearchProvider({
	children
}: {
	children: React.ReactElement
}) {
	const [users, setUsers] = useState<Pick<User & Schedule, "id" | "name">[]>([])

	function add(user: Pick<User & Schedule, "id" | "name">) {
		setUsers(prevUsers => {
			const newUsers = [...prevUsers]
			newUsers.push(user)
			return newUsers
		})
	}

	return (
		<UserSearchContext.Provider value={{ users, add }}>
			{children}
		</UserSearchContext.Provider>
	)
}
