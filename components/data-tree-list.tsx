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

type SMUIBaseDataTreeListItem<
  I extends object = object,
  K extends string | undefined = undefined,
> = {
  id: string
  kind?: K
  label: string
  data: I
}

export type SMUIDataTreeNestedListItem<
  I extends object = object,
  K extends string | undefined = undefined,
> = SMUIBaseDataTreeListItem<I, K> & {
  items?: Array<SMUIDataTreeNestedListItem<I, K>>
}

export type SMUIDataTreeListProps<
  I extends object = object,
  K extends string | undefined = undefined,
> = {
  ariaLabel: string
  items: SMUIDataTreeNestedListItem<I, K>[]
  renderItemContent: (
    node: SMUIDataTreeNestedListItem<I, K>,
    renderProps: TreeItemContentRenderProps
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

// Optional utilities for building tree structure from a flat list
export type SMUIDataTreeFlatListItem<
  I extends object = object,
  K extends string | undefined = undefined,
> = SMUIBaseDataTreeListItem<I, K> & {
  parentId: string | null
}

export function constructSMUIDataTreeListItems<
  I extends object = object,
  K extends string | undefined = undefined,
>(items: SMUIDataTreeFlatListItem<I, K>[]): SMUIDataTreeNestedListItem<I, K>[] {
  // Group items by parentId for easy lookup
  const itemsByParentId = new Map<string | null, SMUIDataTreeFlatListItem<I, K>[]>()
  for (const item of items) {
    if (!itemsByParentId.has(item.parentId)) {
      itemsByParentId.set(item.parentId, [item])
    } else {
      itemsByParentId.get(item.parentId)!.push(item)
    }
  }

  // Keep track of built level ids to avoid infinite loops in case of cyclic references
  const builtLevelIds = new Set<string | null>()

  function buildLevelNodes(levelId: string | null): SMUIDataTreeNestedListItem<I, K>[] {
    if (builtLevelIds.has(levelId)) return []
    builtLevelIds.add(levelId)
    const levelNodes = itemsByParentId.get(levelId)
    if (!levelNodes) return []
    return levelNodes.map((currentNode) => ({
      id: currentNode.id,
      label: currentNode.label,
      kind: currentNode.kind,
      data: currentNode.data,
      items: buildLevelNodes(currentNode.id),
    }))
  }

  // Start building from root items (parentId === null)
  return buildLevelNodes(null)
}
