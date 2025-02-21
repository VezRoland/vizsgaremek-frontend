import {
	Outlet,
	useNavigation,
	type FormMethod,
	type Location
} from "react-router"

import type {
	ForwardRefExoticComponent,
	ReactElement,
	ReactNode,
	ReactPortal
} from "react"
import React from "react"
import { Loader2 } from "lucide-react"

export default function ActionLoadingWrapper({
	pathname,
	method,
	children
}: {
	pathname: string
	method: FormMethod
	children: ReactElement<any, any>
}) {
	const navigation = useNavigation()

	if (
		navigation.location?.pathname !== pathname &&
		navigation.formMethod !== method
	) {
		return children
	}

	return React.cloneElement(children, {
		disabled: true,
		children: [<Loader2 className="animate-spin" />, children.props.children]
	})
}
