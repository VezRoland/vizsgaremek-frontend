import * as React from "react"

import { cn } from "~/lib/utils"

const Input = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"input"> & { icon?: React.ReactElement }
>(({ className, type, icon, ...props }, ref) => {
	return (
		<label
			className={cn(
				"h-9 w-full flex items-center gap-2 rounded-md border border-input bg-transparent px-4 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				className
			)}
		>
			{icon && <div className="flex justify-center items-center h-4 w-4 text-muted-foreground">{icon}</div>}
			<input className="w-full outline-none bg-transparent" type={type} ref={ref} {...props} />
		</label>
	)
})
Input.displayName = "Input"

export { Input }
