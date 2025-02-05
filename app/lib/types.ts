export type FieldError<T> = {
	type: "field"
	fields: T
}

export type MessageError = {
	type: "message"
	message: string
}

export type RequestError<T> = FieldError<T> | MessageError
