import { ReactNode } from "react"
import { ClassValue } from "./tailwind"

export type ChildrenOrFunction<T> = ReactNode | ((props: T) => ReactNode)
export type ClassNameOrFunction<T> = ClassValue | ((props: T) => ClassValue)

/**
 * Utility function to render children with RAC render props,
 * additional classNames, etc if passed as a function.
 */
export function composeChildren<T extends object>(
  children: ChildrenOrFunction<T>,
  props: T
): ReactNode {
  if (typeof children === "function") return children(props)
  return children
}

export function composeClassValue<T extends object>(
  className: ClassNameOrFunction<T>,
  props: T
): ClassValue {
  if (typeof className === "function") return className(props)
  return className
}

/** Utility type for appending defaultChildren to RAC render props */
export type WithDefaultChildren<T extends object> = T & { defaultChildren?: ReactNode }

export type WithDefaultClassName<T extends object> = T & { defaultClassName?: string }
