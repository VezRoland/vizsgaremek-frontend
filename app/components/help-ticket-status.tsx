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
						closed && "text-success-foreground bg-success"
					)}
				>
					{closed ? <Check size={18} /> : <Hourglass size={18} />}
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{closed
							? "A hibajegy lezárult."
							: "A hibajegy megoldása még folyamatban."}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
