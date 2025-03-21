import { useUserSearchContext } from "~/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { useEffect, useRef, type ChangeEvent } from "react"

export function UserInput({
	onValueChange
}: {
	onValueChange: (value: string) => void
}) {
	const searchContext = useUserSearchContext()

	useEffect(() => {
		onValueChange(
			searchContext.users.length === 0
				? ""
				: JSON.stringify(searchContext.users.map(user => user.id))
		)
	}, [searchContext.users])

	if (searchContext.users.length === 0) return null

	return (
		<div className="px-4 py-2 border rounded-md shadow-sm">
			<ul className="flex flex-col">
				{searchContext.users.map(user => (
					<li className="py-2 even:border-t group">
						<div className="flex items-center gap-4">
							<Avatar className="w-8 h-8">
								<AvatarImage></AvatarImage>
								<AvatarFallback>
									{user.name.substring(0, 1).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<span className="text-sm">{user.name}</span>
							<Button
								className="w-8 h-8 hidden group-hover:flex ml-auto"
								size="icon"
								variant="ghost"
								onClick={() => searchContext.remove(user.id)}
							>
								<X />
							</Button>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
