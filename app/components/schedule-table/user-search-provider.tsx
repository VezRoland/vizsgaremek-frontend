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

  function remove(userId: string) {
		setUsers(prevUsers => {
			let newUsers = [...prevUsers]
			newUsers = newUsers.filter(user => user.id !== userId)
			return newUsers
		})
  }

	return (
		<UserSearchContext.Provider value={{ users, add, remove }}>
			{children}
		</UserSearchContext.Provider>
	)
}
