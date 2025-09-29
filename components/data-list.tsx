"use client"

import {
  GridList,
  GridListItem,
  GridListItemRenderProps,
  GridListProps,
} from "react-aria-components"
import { tv, VariantProps } from "tailwind-variants"
import { SlottedClassNames } from "../utils/tailwind"

export type SMUIDataListItem<I extends object = object> = {
  id: string
  label: string
  data: I
}

export type SMUIDataListItemRenderProps = GridListItemRenderProps

export type SMUIDataListProps<I extends object = object> = {
  ariaLabel: string
  items: SMUIDataListItem<I>[]
  renderItemContent: (
    item: SMUIDataListItem<I>,
    renderProps: SMUIDataListItemRenderProps
  ) => React.ReactNode
  classNames?: Partial<SlottedClassNames<typeof smuiDataListStyles>>
  styles?: VariantProps<typeof smuiDataListStyles>
} & Omit<GridListProps<I>, "children" | "className" | "items">

export function SMUIDataList<I extends object = object>({
  items,
  renderItemContent,
  ariaLabel,
  styles,
  classNames,
  ...props
}: SMUIDataListProps<I>) {
  const { list, item } = smuiDataListStyles(styles)

  const listStyles = list({ className: classNames?.list })
  const itemStyles = item({ className: classNames?.item })

  return (
    <GridList aria-label={ariaLabel} items={items} className={listStyles} {...props}>
      {function renderItem(item) {
        return (
          <GridListItem id={item.id} textValue={item.label} className={itemStyles}>
            {(renderProps) => renderItemContent(item, renderProps)}
          </GridListItem>
        )
      }}
    </GridList>
  )
}

export const smuiDataListStyles = tv({
  slots: {
    list: [],
    item: [],
  },
})
