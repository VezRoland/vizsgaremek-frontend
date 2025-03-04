import { cn } from "~/lib/utils"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "./ui/tooltip"
import { Check, Hourglass } from "lucide-react"

export function HelpTicketStatus({ closed }: { closed: boolean }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger
					className={cn(
						"w-10 h-10 grid place-items-center rounded-full text-accent-foreground bg-accent cursor-default",
						closed && "text-primary-foreground bg-primary"
					)}
				>
					{closed ? <Check size={18} /> : <Hourglass size={18} />}
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{closed
							? "The ticket was closed"
							: "Solving the ticket is still in progress"}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
