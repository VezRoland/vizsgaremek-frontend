import { useCallback, useState } from "react"
import { useActionData, useSubmit } from "react-router"
import debounce from "debounce"

import type { SearchResponse } from "~/types/response"

import { Command, CommandInput, CommandList } from "../ui/command"
import { UserSearchItem } from "./user-search-item"

export function UserSearch() {
	const actionData: SearchResponse | undefined = useActionData()
	const submit = useSubmit()

	const [open, setOpen] = useState(false)

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

	return (
		<Command className="relative overflow-visible">
			<CommandInput
				placeholder="Search for employees"
				onValueChange={onSearch}
			/>
			<CommandList className="z-100 absolute bottom-0 w-full h-max translate-y-full bg-background">
				{open &&
					actionData?.type === "SearchResponse" &&
					actionData.data?.map(user => <UserSearchItem {...user} />)}
			</CommandList>
		</Command>
	)
}
