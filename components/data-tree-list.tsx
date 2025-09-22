"use client"

import {
  Collection,
  Tree,
  TreeProps,
  TreeItem,
  TreeItemContent,
  TreeItemContentRenderProps,
} from "react-aria-components"
import { tv, VariantProps } from "tailwind-variants"
import { SlottedClassNames } from "../utils/tailwind"

export type SMUIDataTreeListItem<
  I extends object = object,
  K extends string | undefined = undefined,
> = {
  id: string
  kind?: K
  label: string
  data: I
  items?: Array<SMUIDataTreeListItem<I, K>>
}

export type SMUIDataTreeListItemRenderProps = TreeItemContentRenderProps

export type SMUIDataTreeListProps<
  I extends object = object,
  K extends string | undefined = undefined,
> = {
  ariaLabel: string
  items: SMUIDataTreeListItem<I, K>[]
  renderItemContent: (
    node: SMUIDataTreeListItem<I, K>,
    renderProps: SMUIDataTreeListItemRenderProps
  ) => React.ReactNode
  classNames?: Partial<SlottedClassNames<typeof smuiDataTreeListStyles>>
  styles?: VariantProps<typeof smuiDataTreeListStyles>
} & Omit<TreeProps<I>, "children" | "className" | "items">

export function SMUIDataTreeList<
  I extends object = object,
  K extends string | undefined = undefined,
>({
  items,
  renderItemContent,
  ariaLabel,
  styles,
  classNames,
  ...props
}: SMUIDataTreeListProps<I, K>) {
  const { list, item } = smuiDataTreeListStyles(styles)

  const listStyles = list({ className: classNames?.list })
  const itemStyles = item({ className: classNames?.item })

  return (
    <Tree aria-label={ariaLabel} items={items} className={listStyles} {...props}>
      {function renderItem(item) {
        return (
          <TreeItem id={item.id} textValue={item.label} className={itemStyles}>
            <TreeItemContent>
              {(renderProps) => renderItemContent(item, renderProps)}
            </TreeItemContent>
            <Collection items={item.items ?? []}>{renderItem}</Collection>
          </TreeItem>
        )
      }}
    </Tree>
  )
}

export const smuiDataTreeListStyles = tv({
  slots: {
    list: [],
    item: [],
  },
})
