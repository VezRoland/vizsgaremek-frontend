import {
	useCallback,
	useRef,
	useState,
	type ChangeEvent,
	type FocusEventHandler,
	type MouseEventHandler
} from "react"
import { useActionData, useSubmit } from "react-router"
import debounce from "debounce"
import * as useClickOutside from "react-click-outside-hook"

import type { SearchResponse } from "~/types/response"

import { Command, CommandInput, CommandList } from "../ui/command"
import { UserSearchItem } from "./user-search-item"

export function UserSearch() {
	const actionData: SearchResponse | undefined = useActionData()
	const submit = useSubmit()

	const [open, setOpen] = useState(false)
	const commandRef = useRef<HTMLDivElement>(null)

	const debouncedSearch = useCallback(
		debounce((search: string) => {
			submit(
				JSON.stringify({
					type: "SEARCH_USERS",
					search,
					page: actionData?.page || 1
				}),
				{ method: "POST", encType: "application/json" }
			)
		}, 500),
		[submit, actionData?.page]
	)

	function onSearch(search: string) {
		debouncedSearch(search)
	}

	function onBlur({
		relatedTarget
	}: React.FocusEvent<HTMLDivElement, Element>) {
		if (!relatedTarget || !commandRef.current) return

		setOpen(commandRef.current.contains(relatedTarget))
	}

	return (
		<Command
			className="z-10 relative overflow-visible"
			ref={commandRef}
			onBlur={onBlur}
		>
			<CommandInput
				placeholder="Search for employees"
				onValueChange={onSearch}
				onFocus={() => setOpen(true)}
			/>
			<CommandList className="absolute bottom-0 w-full h-max translate-y-full bg-background">
				{open &&
					actionData?.type === "SearchResponse" &&
					actionData.data?.map(user => <UserSearchItem {...user} />)}
			</CommandList>
		</Command>
	)
}
