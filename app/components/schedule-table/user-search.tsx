import { useCallback, useRef, useState } from "react"
import { useSearchParams, useSubmit } from "react-router"
import debounce from "debounce"

import type { User } from "~/types/database"

import { Command, CommandInput, CommandList } from "../ui/command"
import { UserSearchItem } from "./user-search-item"
import { InView } from "react-intersection-observer"

export function UserSearch({
	data = [],
	pageLimit = 0
}: {
	data?: User[]
	pageLimit?: number
}) {
	const [searchParams, setSearchParams] = useSearchParams()
	const submit = useSubmit()

	const [open, setOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const commandRef = useRef<HTMLDivElement>(null)

	const debouncedSearch = useCallback(
		debounce((search: string) => {
			searchUser(search)
		}, 500),
		[submit]
	)

	function searchUser(search: string, page = 1) {
		const newParams = new URLSearchParams(searchParams)
		const currentSearch = newParams.get("search")

		if (search !== currentSearch) newParams.set("page", "1")
		else if (page <= pageLimit) newParams.set("page", page.toString())

		newParams.set("search", search)
		setSearchParams(newParams)
	}

	function onBlur({
		relatedTarget
	}: React.FocusEvent<HTMLDivElement, Element>) {
		if (!relatedTarget || !commandRef.current) return
		console.log(commandRef.current.contains(relatedTarget))
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
				onValueChange={search => debouncedSearch(search)}
				ref={inputRef}
				onFocus={() => setOpen(true)}
			/>
			<CommandList className="absolute bottom-0 w-full h-max rounded-md translate-y-full bg-background">
				{open && (
					<>
						{data.length > 0 && (
							<InView
								onChange={inView =>
									inView
										? searchUser(
												inputRef.current?.value || "",
												Math.max(1, parseInt(searchParams.get("page") || "1") - 1)
										  )
										: null
								}
							>
								<div className="w-full"></div>
							</InView>
						)}
						{data.map(user => (
							<UserSearchItem key={user.id} {...user} />
						))}
						<InView
							onChange={inView =>
								inView
									? searchUser(
											inputRef.current?.value || "",
											parseInt(searchParams.get("page") || "0") + 1
									  )
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
