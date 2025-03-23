import { Paperclip } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "~/components/ui/card"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import type { Training, TrainingQuestion } from "~/types/database"

const training: Training = {
	id: "a",
	name: "Test training",
	description: "This is the description of a test training",
	file_url: "",
	created_at: new Date().toLocaleDateString()
}

const questions: TrainingQuestion[] = [
	{
		id: "aa",
		name: "What is this?",
		answers: ["I don't know", "Anything", "Everything", "Nothing"],
		training_id: "a",
		created_at: ""
	},
	{
		id: "ab",
		name: "Where am I?",
		answers: ["I don't know", "Anywhere", "Everywhere", "Nowhere"],
		training_id: "a",
		created_at: ""
	}
]

export default function Training() {
	return (
		<main className="w-full max-w-4xl grid gap-8 px-4 py-8 m-auto">
			<Card className="border-none shadow-none bg-transparent">
				<CardHeader>
					<CardTitle>{training.name}</CardTitle>
					<CardDescription>{training.description}</CardDescription>
				</CardHeader>
				<CardFooter className="justify-end gap-2">
					<Button>
						<Paperclip /> Download attachement
					</Button>
					<Button variant="secondary">Start test</Button>
				</CardFooter>
			</Card>
		</main>
	)
}
