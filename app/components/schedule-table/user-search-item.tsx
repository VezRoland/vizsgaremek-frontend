import type { Schedule, User } from "~/types/database"
import { CommandItem } from "../ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useUserSearchContext } from "~/lib/utils"

export function UserSearchItem({
	id,
	name
}: Pick<User & Schedule, "id" | "name">) {
	const searchContext = useUserSearchContext()

	console.log(searchContext.users)

	return (
		<CommandItem
			key={id}
			value={name}
			disabled={!!searchContext.users.find(user => user.id === id)}
		>
			<div className="flex items-center gap-2" onClick={() => searchContext.add({ id, name })}>
				<Avatar>
					<AvatarImage></AvatarImage>
					<AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
				</Avatar>
				{name}
			</div>
		</CommandItem>
	)
}
