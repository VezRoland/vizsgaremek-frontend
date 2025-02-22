import * as React from "react"

import { cn } from "~/lib/utils"

const Input = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"input"> & { icon?: React.ReactElement }
>(({ className, type, icon, ...props }, ref) => {
	return (
		<div className="relative contents group">
			{icon && <div className="absolute w-9 h-9 grid place-content-center border-border border-r text-muted-foreground group-[&:has(:focus-visible)]:text-primary pointer-events-none">{icon}</div>}
			<input
				type={type}
				className={cn(
					"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					icon && "pl-11",
          className
				)}
				ref={ref}
				{...props}
			/>
		</div>
	)
})
Input.displayName = "Input"

export { Input }
