import { useUserSearchContext } from "~/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { useEffect, useRef, type ChangeEvent } from "react"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

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
		<ScrollArea className="h-40 px-4 py-2 border rounded-md shadow-sm">
			<ul className="flex flex-col">
				{searchContext.users.map(user => (
					<li className="py-2 border-b last:border-none group">
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
								type="button"
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
			<ScrollBar orientation="vertical" />
		</ScrollArea>
	)
}
