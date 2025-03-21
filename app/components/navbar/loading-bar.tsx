import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigation } from "react-router"
import { cn } from "~/lib/utils"

export function LoadingBar() {
	const { pathname } = useLocation()
	const { state, location } = useNavigation()

	const ref = useRef<HTMLDivElement>(null)
	const [transitionEnded, setTransitionEnded] = useState(true)

	useEffect(() => {
		if (!ref.current) return
		if (state !== "idle") setTransitionEnded(false)

		Promise.all(
			ref.current.getAnimations().map(({ finished }) => finished)
		).then(() => state === "idle" && setTransitionEnded(true))
	}, [state])

  if (state !== "idle" && pathname === location.pathname) return

	return (
		<div
			className={cn(
				"z-50 fixed top-0 left-0 w-full h-1 opacity-100 transition-opacity duration-500 ease-in-out",
				state === "idle" && transitionEnded && "opacity-0"
			)}
		>
			<div
				className={cn(
					"h-full rounded-md bg-primary transition-[width] duration-500 ease-in-out",
					state === "idle" && transitionEnded && "w-0 delay-500",
					state === "submitting" && "w-1/4",
					state === "loading" && "w-2/3",
					state === "idle" && !transitionEnded && "w-full"
				)}
				ref={ref}
			/>
		</div>
	)
}
