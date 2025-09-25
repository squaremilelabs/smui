/**
 * Option list primitives for Square Mile UI built on top of react-aria-components (RAC).
 *
 * This module exposes a single generic component `SMUIOptionList` that can render
 * either a RAC `ListBox` (selection use-cases) or a RAC `Menu` (action/navigation
 * use-cases) via the `renderType` prop. It accepts a normalized `nodes` data model
 * supporting items and sections (submenus are sketched but intentionally disabled
 * for now).
 *
 * Features
 * - Shared API across listbox and menu modes (`renderType="listbox" | "menu"`).
 * - Section headers and grouped items via `SMUIOptionListSectionNode`.
 * - Slot-based styling using Tailwind Variants with `styles` and `classNames` overrides.
 * - Optional `renderItemContent` to fully control item rendering while still
 *   getting RAC render props and a `defaultChildren` fallback.
 *
 * Limitations
 * - Submenus are not currently supported. The code is scaffolded but commented out.
 *
 * See `SMUIOptionListProps` for the full API and examples below.
 */
"use client"
import {
  Collection,
  Header,
  ListBox,
  ListBoxItem,
  ListBoxItemRenderProps,
  ListBoxProps,
  ListBoxSection,
  Menu,
  MenuItem,
  MenuProps,
  MenuSection,
  MenuItemRenderProps,
} from "react-aria-components"
import { SquareCheckIcon, SquareIcon } from "lucide-react"
import { SlottedClassNames, tv, VariantProps } from "../utils/tailwind"
import { WithDefaultChildren } from "../utils/react-aria"

export type SMUIOptionListRenderType = "listbox" | "menu"
export type SMUIOptionListVisualType = "action" | "select" | "navigation" | "checklist"
export type SMUIOptionListNodeType = "item" | "section"

type SMUIBaseOptionListNode = {
  type: SMUIOptionListNodeType
}

export type SMUIOptionListItemNode<I extends object = object> = SMUIBaseOptionListNode & {
  id: string
  type: "item"
  label: string
  data?: I
}

export type SMUIOptionListSectionNode<I extends object = object> = SMUIBaseOptionListNode & {
  id: string
  type: "section"
  label: string
  nodes: Array<SMUIOptionListItemNode<I>>
}

export type SMUIOptionListNode<I extends object = object> =
  | SMUIOptionListItemNode<I>
  | SMUIOptionListSectionNode<I>

type ListBoxOrMenuAriaProps<
  R extends SMUIOptionListRenderType,
  I extends object = object,
> = R extends "listbox"
  ? Omit<ListBoxProps<SMUIOptionListNode<I>>, "children" | "items" | "className">
  : Omit<MenuProps<SMUIOptionListNode<I>>, "children" | "items" | "className">

/**
 * # SMUIOptionListProps
 *
 * @template R Render type: "listbox" or "menu".
 * @template I Type of the optional custom `data` field stored on item nodes.
 *
 * @property ariaLabel Accessible name for the collection (RAC `aria-label`).
 * @property renderType Selects RAC primitive: "listbox" -> `ListBox`, "menu" -> `Menu`.
 * @property visualType Optional semantic styling preset: "action" | "select" | "navigation".
 * @property nodes The flat data model for the collection. Supports sections and items.
 * @property renderItemContent Optional render override for items. Receives the item node and
 * RAC render props. You can use `renderProps.defaultChildren` to render the default label.
 * @property classNames Optional per-slot class overrides.
 * @property styles Optional Tailwind Variants overrides for slots/variants (e.g., `density`).
 *
 * Extends
 * - For `renderType="listbox"`: relevant RAC `ListBoxProps` (minus children/items/className).
 * - For `renderType="menu"`: relevant RAC `MenuProps` (minus children/items/className).
 */
export type SMUIOptionListProps<R extends SMUIOptionListRenderType, I extends object = object> = {
  ariaLabel: string
  renderType: R
  visualType: SMUIOptionListVisualType
  nodes: Array<SMUIOptionListNode<I>>
  renderItemContent?: (
    item: R extends "listbox" ? SMUIOptionListNode<I> : SMUIOptionListNode<I>,
    renderProps: R extends "listbox"
      ? WithDefaultChildren<ListBoxItemRenderProps>
      : WithDefaultChildren<MenuItemRenderProps>
  ) => React.ReactNode
  classNames?: Partial<SlottedClassNames<typeof smuiOptionListStyles>>
  styles?: Omit<VariantProps<typeof smuiOptionListStyles>, "visualType">
  // TODO: Support submenus. Not currently working.
  // submenuDialogProps?: Partial<SMUIDialogProps<"popover">>
} & ListBoxOrMenuAriaProps<R, I>

/**
 * Generic option list that renders either a `ListBox` (for selection) or a `Menu`
 * (for actions/navigation) depending on `renderType`.
 *
 * Behavior
 * - Applies slot classes via tv with overrides through `styles` and `classNames`.
 * - Renders sections and items from the normalized `nodes` structure.
 * - If `renderItemContent` is provided, its `renderProps` argument includes
 *   RAC render props plus `defaultChildren` that renders the default text label.
 *
 * Accessibility
 * - `ariaLabel` provides an accessible name when there isn’t a visible heading.
 * - RAC handles focus management, selection, and navigation semantics.
 *
 * Examples
 *
 * @example
 * // Action menu (no selection state)
 * <SMUIOptionList
 *   ariaLabel="File actions"
 *   renderType="menu"
 *   nodes=[
 *     { type: "item", id: "new", label: "New" },
 *     { type: "item", id: "open", label: "Open" },
 *     {
 *       type: "section",
 *       id: "more",
 *       label: "More",
 *       nodes: [
 *         { type: "item", id: "rename", label: "Rename" },
 *         { type: "item", id: "delete", label: "Delete" },
 *       ],
 *     },
 *   ]
 * />
 *
 * @example
 * // Select listbox with custom density
 * <SMUIOptionList
 *   ariaLabel="Assignees"
 *   renderType="listbox"
 *   visualType="select"
 *   styles={{ density: "compact" }}
 *   selectionMode="multiple"
 *   nodes=[
 *     { type: "item", id: "u1", label: "Ada" },
 *     { type: "item", id: "u2", label: "Grace" },
 *   ]
 * />
 */
export function SMUIOptionList<R extends SMUIOptionListRenderType, I extends object = object>({
  ariaLabel,
  renderType,
  visualType,
  nodes,
  classNames,
  styles,
  renderItemContent,
  // TODO: Support submenus. Not currently working.
  // submenuDialogProps,
  ...props
}: SMUIOptionListProps<R, I>) {
  // Define components based on renderType
  const ListComponent = renderType === "listbox" ? ListBox : Menu
  const ItemComponent = renderType === "listbox" ? ListBoxItem : MenuItem
  const SectionComponent = renderType === "listbox" ? ListBoxSection : MenuSection

  // Prepare slotted styles
  const { list, item, itemContent, itemIcon, section, sectionLabel } = smuiOptionListStyles({
    ...styles,
    visualType,
  })
  const listStyles = list({ className: classNames?.list })
  const itemStyles = item({ className: classNames?.item })
  const itemContentStyles = itemContent({ className: classNames?.itemContent })
  const itemIconStyles = itemIcon({ className: classNames?.itemIcon })
  const sectionStyles = section({ className: classNames?.section })
  const sectionLabelStyles = sectionLabel({ className: classNames?.sectionLabel })

  return (
    // @ts-expect-error // ! TS can't narrow the type of `props` here correctly
    <ListComponent aria-label={ariaLabel} items={nodes} className={listStyles} {...props}>
      {function renderListNode(node) {
        // Render Section
        if (node.type === "section") {
          return (
            <SectionComponent className={sectionStyles}>
              <Header className={sectionLabelStyles}>{node.label}</Header>
              <Collection items={node.nodes}>{renderListNode}</Collection>
            </SectionComponent>
          )
        }

        // Render Item
        if (node.type === "item") {
          return (
            <ItemComponent id={node.id} key={node.id} textValue={node.label} className={itemStyles}>
              {(renderProps) => (
                <>
                  {visualType === "checklist" &&
                    (renderProps.isSelected ? (
                      <SquareCheckIcon className={itemIconStyles} />
                    ) : (
                      <SquareIcon className={itemIconStyles} />
                    ))}
                  <div className={itemContentStyles}>
                    {renderItemContent
                      ? // @ts-expect-error -- // ! TS can't narrow the type here correctly
                        renderItemContent(node, { ...renderProps, defaultChildren: node.label })
                      : node.label}
                  </div>
                </>
              )}
            </ItemComponent>
          )
        }

        // Should reach here unless an unsupported node type is used - this sill result in an error
        return null
      }}
    </ListComponent>
  )
}

/**
 * Tailwind Variants configuration for list slots and variants.
 *
 * Slots
 * - list: container for the list/menu
 * - item: each list item (ListBoxItem or MenuItem)
 * - itemLabel: default Text label within an item
 * - section: container for a section (ListBoxSection or MenuSection)
 * - sectionLabel: header row for sections
 *
 * Variants
 * - visualType: "select" | "action" | "navigation" — semantic presets
 * - density: "compact" | "comfortable" — spacing and sizing
 */
export const smuiOptionListStyles = tv({
  slots: {
    list: ["group/list flex flex-col transition-all"],
    item: [
      "group/list-item",
      "transition-all",
      "flex items-center w-full",
      "not-data-disabled:cursor-pointer",
      "data-disabled:cursor-not-allowed",
      "data-disabled:opacity-50",
    ],
    itemContent: ["flex w-full grow items-center"],
    itemIcon: [
      "self-start",
      // hide if not inside of list (e.g., when used with Select)
      "hidden group-not-empty/list-item:block",
    ],
    section: ["group/list-section flex flex-col"],
    sectionLabel: [
      "flex items-center",
      "text-neutral-text font-semibold",
      "tracking-wide uppercase",
    ],
  },
  variants: {
    visualType: {
      select: {
        list: ["bg-neutral-muted-bg"],
        item: [
          "data-selected:border-base-border border border-transparent",
          "data-selected:bg-base-bg",
          "not-data-disabled:hover:bg-base-bg/70",
        ],
      },
      action: {
        list: ["bg-base-bg"],
        item: ["not-data-disabled:hover:bg-neutral-muted-bg", "data-pressed:scale-99"],
      },
      checklist: {
        list: ["bg-base-bg"],
        item: ["not-data-disabled:hover:bg-neutral-muted-bg"],
        itemIcon: ["text-neutral-muted-text", "group-data-selected/list-item:text-base-text"],
      },
      navigation: {},
    },
    density: {
      compact: {
        list: ["gap-space-xs p-space-xs rounded-xs"],
        item: [
          "h-box-sm gap-space-xs px-space-sm rounded-sm text-sm",
          "group-not-empty/list-section:ml-space-md",
        ],
        itemIcon: ["h-content-sm min-w-content-sm my-space-sm"],
        section: ["gap-space-xs my-space-sm"],
        sectionLabel: ["px-space-sm mb-space-xs text-xs"],
      },
      comfortable: {
        list: ["gap-space-sm p-space-sm rounded-sm"],
        item: [
          "h-box-md px-space-md gap-space-sm text-md rounded-sm",
          "group-not-empty/list-section:ml-space-lg",
        ],
        itemIcon: ["h-content-md min-w-content-md my-space-md"],
        section: ["gap-space-sm my-space-md"],
        sectionLabel: ["px-space-md mb-space-sm text-sm"],
      },
    },
  },
  defaultVariants: {
    density: "comfortable",
    visualType: "action",
  },
})
