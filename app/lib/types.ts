export type FieldError<T> = {
  error: boolean,
	type: "field"
	fields: T
}

export type MessageError = {
  error: boolean,
	type: "message",
  messageType: MessageErrorType, 
	message: string,
  description?: string
}

export type MessageErrorType = "error" | "warning" | "info" | "success"

export type ServerResponse<T = never> = FieldError<T> | MessageError
