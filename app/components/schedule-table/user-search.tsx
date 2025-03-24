import { useCallback, useEffect, useRef, useState } from "react"
import { useActionData, useSubmit } from "react-router"
import debounce from "debounce"
import * as useClickOutside from "react-click-outside-hook"

import type { User } from "~/types/database"
import type { SearchResponse } from "~/types/response"

import { Command, CommandInput, CommandList } from "../ui/command"
import { UserSearchItem } from "./user-search-item"
import { InView } from "react-intersection-observer"

export function UserSearch() {
	const actionData = useActionData<SearchResponse>()
	const submit = useSubmit()

	const [data, setData] = useState<{
		search: string
		users: User[]
		page: number
	}>({
		search: "",
		users: [],
		page: 1
	})

	const [open, setOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const commandRef = useRef<HTMLDivElement>(null)

	const debouncedSearch = useCallback(
		debounce((search: string) => {
			searchUser(search)
		}, 500),
		[submit]
	)

	function searchUser(search: string, page = data.page) {
		if (actionData?.data && page > actionData.data.pagination.totalPages) return

		submit(
			JSON.stringify({
				type: "SEARCH_USERS",
				search,
				page
			}),
			{ method: "POST", encType: "application/json" }
		)

		setData(prevData => {
			const newData = { ...prevData }
			if (search !== prevData.search) newData.users = []
			newData.search = search
			return newData
		})
	}

	function onBlur({
		relatedTarget
	}: React.FocusEvent<HTMLDivElement, Element>) {
		if (!relatedTarget || !commandRef.current) return
		setOpen(commandRef.current.contains(relatedTarget))
	}

	useEffect(() => {
		if (actionData?.type !== "SearchResponse") return
		setData(prevData => {
			if (!actionData?.data) return prevData
			const newData = { ...prevData }
			newData.users = [...newData.users, ...(actionData.data.users || [])]
			newData.page = actionData.data.pagination.currentPage
			return newData
		})
	}, [actionData])

	return (
		<Command
			className="z-10 relative overflow-visible"
			ref={commandRef}
			onBlur={onBlur}
		>
			<CommandInput
				placeholder="Search for employees"
				onValueChange={search => debouncedSearch(search)}
				ref={inputRef}
				onFocus={() => setOpen(true)}
			/>
			<CommandList className="absolute bottom-0 w-full h-max rounded-md translate-y-full bg-background">
				{open && (
					<>
						{data.users.map(user => (
							<UserSearchItem key={user.id} {...user} />
						))}
						<InView
							onChange={inView =>
								inView
									? searchUser(inputRef.current?.value || "", data.page)
									: null
							}
						>
							<div className="w-full"></div>
						</InView>
					</>
				)}
			</CommandList>
		</Command>
	)
}
