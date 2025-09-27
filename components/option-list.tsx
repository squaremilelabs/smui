"use client"

import {
  ListBox,
  ListBoxItem,
  ListBoxItemRenderProps,
  ListBoxProps,
  Menu,
  MenuItem,
  MenuProps,
  MenuItemRenderProps,
} from "react-aria-components"
import { CheckIcon } from "lucide-react"
import { SlottedClassNames, tv, VariantProps } from "../utils/tailwind"
import { WithDefaultChildren } from "../utils/react-aria"

export type SMUIOptionListRenderType = "listbox" | "menu"
export type SMUIOptionListVisualType = "action" | "select" | "tabs"

export type SMUIOptionListItem<I extends object = object> = {
  id: string
  label: string
  data?: I
}

type ListBoxOrMenuAriaProps<
  R extends SMUIOptionListRenderType,
  I extends object = object,
> = R extends "listbox"
  ? Omit<ListBoxProps<SMUIOptionListItem<I>>, "children" | "items" | "className">
  : Omit<MenuProps<SMUIOptionListItem<I>>, "children" | "items" | "className">

export type SMUIOptionListItemRenderProps<R extends SMUIOptionListRenderType> = WithDefaultChildren<
  R extends "listbox" ? ListBoxItemRenderProps : MenuItemRenderProps
>

export type SMUIOptionListProps<
  R extends SMUIOptionListRenderType = SMUIOptionListRenderType,
  I extends object = object,
> = {
  ariaLabel: string
  renderType: R
  visualType: SMUIOptionListVisualType
  items: Array<SMUIOptionListItem<I>>
  renderItemContent?: (
    item: SMUIOptionListItem<I>,
    renderProps: SMUIOptionListItemRenderProps<R>
  ) => React.ReactNode
  classNames?: Partial<SlottedClassNames<typeof smuiOptionListStyles>>
  styles?: Omit<VariantProps<typeof smuiOptionListStyles>, "visualType">
} & ListBoxOrMenuAriaProps<R, I>

export function SMUIOptionList<
  R extends SMUIOptionListRenderType = SMUIOptionListRenderType,
  I extends object = object,
>({
  ariaLabel,
  renderType,
  visualType,
  items,
  classNames,
  styles,
  renderItemContent,
  ...props
}: SMUIOptionListProps<R, I>) {
  // Define components based on renderType
  const ListComponent = renderType === "listbox" ? ListBox : Menu
  const ItemComponent = renderType === "listbox" ? ListBoxItem : MenuItem

  // Prepare slotted styles
  const { list, item } = smuiOptionListStyles({
    ...styles,
    visualType,
  })
  const listStyles = list({ className: classNames?.list })
  const itemStyles = item({ className: classNames?.item })

  return (
    // @ts-expect-error // ! TS can't narrow the type of `props` here correctly
    <ListComponent aria-label={ariaLabel} items={items} className={listStyles} {...props}>
      {(item) => {
        return (
          <ItemComponent id={item.id} textValue={item.label} className={itemStyles}>
            {(renderProps) => {
              return (
                <>
                  {renderItemContent
                    ? // @ts-expect-error // ! TS can't narrow the type of `renderProps` here correctly
                      renderItemContent(item, { ...renderProps, defaultChildren: item.label })
                    : item.label}
                  {visualType === "select" && renderProps.isSelected && (
                    <CheckIcon id="check-icon" />
                  )}
                </>
              )
            }}
          </ItemComponent>
        )
      }}
    </ListComponent>
  )
}

export const smuiOptionListStyles = tv({
  slots: {
    list: ["group/list", "flex flex-col"],
    item: [
      "group/list-item",
      "flex items-center",
      "transition-all",
      "not-data-disabled:cursor-pointer",
      "not-data-disabled:hover:bg-neutral-muted-bg",
      "data-disabled:cursor-not-allowed data-disabled:opacity-50",
    ],
  },
  variants: {
    visualType: {
      action: {
        item: ["data-pressed:ml-space-md"],
      },
      select: {
        item: ["data-selected:font-semibold", "[&_#check-icon]:ml-auto"],
      },
      tabs: {
        list: ["flex-row"],
        item: ["data-selected:border-base-outline border-b-2"],
      },
    },
    density: {
      compact: {
        list: [""],
        item: ["h-box-sm gap-space-sm px-space-md text-sm"],
      },
      comfortable: {
        list: [""],
        item: ["h-box-md px-space-lg gap-space-md text-md"],
      },
    },
  },
  defaultVariants: {
    visualType: "action",
    density: "comfortable",
  },
})
