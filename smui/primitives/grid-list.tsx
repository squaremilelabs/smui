"use client"

import React from "react"
import {
  GridList as AriaGridList,
  GridListProps as AriaGridListProps,
  GridListItem as AriaGridListItem,
  GridListItemProps as AriaGridListItemProps,
  GridListItemRenderProps as AriaGridListItemRenderProps,
  Key,
} from "react-aria-components"
import { cn, DeepPartial, WithDefaultChildren, ClassValue, tv, VariantProps } from "../utils"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/GridList.html

__Notes__
- Enforces dynamic items (no static)

```tsx
  <GridList items={items}>
    {(item, classNames) => (
      <GridListItem
        id={item.id}
        textValue={item.name}
        className={classNames.item}
      >
        {children || (renderProps) => children}
      </GridListItem>
    )}
  </GridList>
```

*/

// # Variants -------------------------------------------------------------------------------------

export type GridListVariantProps = VariantProps<typeof gridListVariants>
export const gridListVariants = tv({
  slots: {
    // <GridList />
    base: [],
    // <GridListItem />
    item: [],
  },
  variants: {
    variant: {
      default: {},
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// # ClassNames -----------------------------------------------------------------------------------

export type GridListClassNames = {
  // slots.base
  base: ClassValue
  // slots.item
  item: ClassValue
}

// # Props ----------------------------------------------------------------------------------------

export type GridListProps<T extends object> = Omit<
  AriaGridListProps<T>,
  "children" | "className" | "items"
> & {
  variants?: GridListVariantProps
  classNames?: DeepPartial<GridListClassNames>
  items: Array<T> // enforced
  children: (item: T, classNames: Omit<GridListClassNames, "base">) => React.ReactNode
}

export type GridListItemRenderProps = WithDefaultChildren<AriaGridListItemRenderProps>
export type GridListItemProps = Omit<AriaGridListItemProps, "id" | "className" | "textValue"> & {
  id: Key // enforced
  textValue: string // enforced
  className: ClassValue
}

// # Components -----------------------------------------------------------------------------------

export function GridList<T extends object>({
  variants,
  classNames,
  items,
  children,
  ...props
}: GridListProps<T>) {
  const { base: baseStyles, item: itemStyles } = gridListVariants(variants)

  const baseClassName = baseStyles({ className: classNames?.base })

  const childrenClassNames = {
    item: itemStyles({ className: classNames?.item }),
  }

  return (
    <AriaGridList {...props} items={items} className={baseClassName}>
      {(item) => children(item as T, childrenClassNames)}
    </AriaGridList>
  )
}

export function GridListItem({ id, className, textValue, ...props }: GridListItemProps) {
  return <AriaGridListItem id={id} textValue={textValue} className={cn(className)} {...props} />
}
