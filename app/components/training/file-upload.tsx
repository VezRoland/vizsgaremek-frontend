import { useEffect, useState } from "react"

import type { ChangeEvent, DragEvent } from "react"

import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { FileText, Upload, X } from "lucide-react"

export function FileUpload({
	accept,
	onValueChange
}: {
	accept: string
	onValueChange?: (value: File | undefined) => void
}) {
	const [file, setFile] = useState<File | undefined>()

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const files = event.target.files
		if (!files || files.length === 0 || files[0].type !== accept) return
		setFile(files[0])
	}

	function handleDragOver(event: DragEvent<HTMLDivElement>) {
		event.preventDefault()
	}

	function handleDrop(event: DragEvent<HTMLDivElement>) {
		event.preventDefault()
		const { files } = event.dataTransfer
		if (!files || files.length === 0 || files[0].type !== accept) return
		setFile(files[0])
	}

	function formatFileSize(bytes: number) {
		if (bytes === 0) {
			return "0 Bytes"
		}

		const k = 1024
		const sizes = ["Bytes", "KB", "MB", "GB"]
		const i = Math.floor(Math.log(bytes) / Math.log(k))

		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
	}

	useEffect(() => {
		if (onValueChange) onValueChange(file)
	}, [file])

	if (file) {
		return (
			<Card className="flex justify-between border-border shadow-none">
				<CardHeader className="flex-1 flex-row items-center gap-6">
					<FileText />
					<div className="flex flex-col space-y-1.5">
						<CardTitle>{file.name}</CardTitle>
						<CardDescription>{formatFileSize(file.size)}</CardDescription>
					</div>
				</CardHeader>
				<div className="p-2">
					<Button
						className="text-muted-foreground"
						size="icon"
						variant="ghost"
						onClick={() => setFile(undefined)}
					>
						<X />
					</Button>
				</div>
			</Card>
		)
	}

	return (
		<Card
			className="relative border-border shadow-none text-muted-foreground"
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			<CardHeader className="items-center">
				<div className="p-4 border rounded-full">
					<Upload />
				</div>
				<CardTitle role="label" id="fileUploadLabel">
					Drag 'n' drop a file here, or click to select a file
				</CardTitle>
				<CardDescription>
					You can upload a single PDF file (5 MB)
				</CardDescription>
			</CardHeader>
			<input
				className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
				type="file"
				accept={accept}
				onChange={handleChange}
				aria-labelledby="fileUploadLabel"
			/>
		</Card>
	)
}
