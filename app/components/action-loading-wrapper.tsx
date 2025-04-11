import { useNavigation } from "react-router"

import type { ReactElement } from "react"
import React from "react"
import { Loader2 } from "lucide-react"

export default function ActionLoadingWrapper({
	type,
	children
}: {
	type?: string
	children: ReactElement<any, any>
}) {
	const { state, json } = useNavigation()

	if ((json as { type: string })?.type !== type) {
		return children
	}

	return React.cloneElement(children, {
		disabled: true,
		children: [<Loader2 className="animate-spin" />, children.props.children]
	})
}
