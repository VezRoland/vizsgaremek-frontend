import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigation, useSearchParams, useSubmit } from "react-router"
import debounce from "debounce"

import type { User } from "~/types/database"

import { Command, CommandInput, CommandList } from "../ui/command"
import { UserSearchItem } from "./user-search-item"
import { InView } from "react-intersection-observer"
import { Loader, Loader2, LoaderCircle } from "lucide-react"

export function UserSearch({
	data = [],
	pageLimit = 0
}: {
	data?: User[]
	pageLimit?: number
}) {
	const submit = useSubmit()
	const { state } = useNavigation()
	const [searchParams, setSearchParams] = useSearchParams()

	const [open, setOpen] = useState(false)
	const [results, setResults] = useState<Map<string, User>>(new Map())

	const inputRef = useRef<HTMLInputElement>(null)
	const commandRef = useRef<HTMLDivElement>(null)

	const debouncedSearch = useCallback(
		debounce((search: string) => {
			searchUser(search)
		}, 500),
		[submit]
	)

	function searchUser(name: string | null, page = 1) {
		const newParams = new URLSearchParams(searchParams)
		const currentSearch = newParams.get("name")

		if (name !== currentSearch) {
			setResults(new Map())
			newParams.delete("page")
		} else if (page <= pageLimit && page > 1) {
			newParams.set("page", page.toString())
		}

		if (name && name.trim().length > 0) {
			setResults(new Map())
			newParams.set("name", name.trim())
		} else newParams.delete("name")

		if (
			searchParams.get("name") !== newParams.get("name") ||
			searchParams.get("page") !== newParams.get("page")
		)
			setSearchParams(newParams)
	}

	console.log(state)

	function onBlur({
		relatedTarget
	}: React.FocusEvent<HTMLDivElement, Element>) {
		if (!relatedTarget || !commandRef.current) return
		console.log(commandRef.current.contains(relatedTarget))
		setOpen(commandRef.current.contains(relatedTarget))
	}

	useEffect(() => {
		setResults(prevResults => {
			const newResults = new Map(prevResults)
			data.forEach(d => newResults.set(d.id, d))
			return newResults
		})
	}, [data])

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
						{Array.from(results.values()).map(user => (
							<UserSearchItem key={user.id} {...user} />
						))}
						{state === "loading" && (
							<div className="w-full grid place-items-center py-8">
								<Loader2 className="animate-spin" />
							</div>
						)}
						<InView
							onChange={inView =>
								inView
									? searchUser(
											inputRef.current?.value || null,
											parseInt(searchParams.get("page") || "1") + 1
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
