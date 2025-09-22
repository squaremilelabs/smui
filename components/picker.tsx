/**
 * Picker (Select) primitives for Square Mile UI built atop react-aria-components (RAC).
 *
 * This module exports a single high-level component `SMUIPicker` that composes:
 * - RAC `Select`, `Button`, and `SelectValue` primitives
 * - `SMUIDialog` (rendered as a responsive Popover / Sheet) for the dropdown surface
 * - `SMUIOptionList` (rendered as a `ListBox`) for the option collection
 *
 * Design goals / Why it exists:
 * - Provide a consistent, stylable select/picker with the same slot + variant system used
 *   by other SMUI primitives (`tv()` + per-slot `classNames` overrides).
 * - Offer a single customization point (`renderItemContent`) that can tailor both the
 *   trigger's selected value rendering AND each option row while still giving access to
 *   RAC's render props plus a safe `defaultChildren` fallback.
 * - Support responsive presentation (popover on desktop, sheet on mobile) by delegating
 *   to `SMUIDialog`'s responsive `visualType` resolution.
 *
 * Key Features
 * - Unified render override: `renderItemContent` receives a discriminated union letting
 *   you know if you're rendering inside the option list (renderLocation="option-list") or
 *   inside the trigger (renderLocation="select-value").
 * - Strongly typed option data via generic `I` (forwarded to RAC `Select` and option nodes).
 * - Tailwind Variants driven styling: pass `styles` for picker-level variants; override
 *   nested dialog and option list slots with `classNames.dialog` / `classNames.optionList`.
 * - Reuses the normalized node data model from `SMUIOptionList` (items / sections).
 *
 * Non-Goals / Limitations
 * - Does not (yet) expose asynchronous / virtualized loading helpers; supply fully built
 *   `options` array up-front.
 * - Multi-select is not supported here directly; create a bespoke component (or future
 *   extension) if you need tag-style selection chips, etc.
 * - Advanced submenu patterns are intentionally not wired until `SMUIOptionList` adds them.
 *
 * Accessibility
 * - Inherits RAC `Select` semantics (focus management, labeling via `ariaLabel`).
 * - Dialog underlay / sheet semantics handled by `SMUIDialog`.
 * - Section headers in the option list are exposed via heading semantics from RAC.
 *
 * Styling Overview
 * - Top-level `pickerStyles` defines slots: wrapper, triggerButton, selectValue, itemContent,
 *   chevronIcon.
 * - Pass `classNames` to override slot classes. Nested structure allows overrides for the
 *   dialog (`classNames.dialog`) and the option list (`classNames.optionList`).
 * - Use `dialogStyles`, `dialogVisualType`, `optionListStyles`, `optionListVisualType` to
 *   thread variant props down to composed primitives.
 *
 * Examples
 * @example
 * // Basic picker
 * <SMUIPicker
 *   ariaLabel="Assignee"
 *   selectedKey={selected}
 *   onSelectionChange={setSelected}
 *   options={[
 *     { type: "item", id: "u1", label: "Ada" },
 *     { type: "item", id: "u2", label: "Grace" },
 *   ]}
 * />
 *
 * @example
 * // Custom rendering: avatar + name in both trigger & list
 * <SMUIPicker
 *   ariaLabel="Assignee"
 *   options={users}
 *   renderItemContent={(item, rp) => {
 *     if (!item || item.type !== 'item') return rp.defaultChildren
 *     const content = (
 *       <div className="flex items-center gap-2">
 *         <img alt="" src={item.data?.avatar} className="h-5 w-5 rounded-full" />
 *         <span>{item.label}</span>
 *       </div>
 *     )
 *     return content
 *   }}
 * />
 *
 * @example
 * // Sectioned options & compact density in the list
 * <SMUIPicker
 *   ariaLabel="Project"
 *   options=[
 *     { type: 'section', id: 'active', label: 'Active', nodes: [ { type: 'item', id: 'a', label: 'Alpha' } ] },
 *     { type: 'section', id: 'archived', label: 'Archived', nodes: [ { type: 'item', id: 'z', label: 'Zeta' } ] },
 *   ]
 *   optionListStyles={{ density: 'compact' }}
 * />
 */
"use client"

import {
  Button,
  Select,
  SelectValue,
  SelectProps,
  SelectValueRenderProps,
} from "react-aria-components"
import { ChevronsUpDownIcon } from "lucide-react"
import { ReactNode } from "react"
import { WithDefaultChildren } from "../utils/react-aria"
import { SlottedClassNames, tv, VariantProps } from "../utils/tailwind"
import { SMUIDialog, SMUIDialogProps } from "./dialog"
import { SMUIOptionList, SMUIOptionListNode, SMUIOptionListProps } from "./option-list"

export type SMUIPickerRenderItemContentProps<I extends object = object> =
  | ({
      renderLocation: "option-list"
    } & Parameters<NonNullable<SMUIOptionListProps<"listbox", I>["renderItemContent"]>>[1])
  | ({
      renderLocation: "select-value"
    } & WithDefaultChildren<SelectValueRenderProps<I>>)

/**
 * Props for `SMUIPicker`.
 *
 * @template I Type of the custom data stored on each option node (forwarded to RAC `Select`).
 *
 * Core Props
 * @property ariaLabel Accessible name used for the trigger + dialog labeling.
 * @property options The option/section node array consumed by the internal `SMUIOptionList`.
 *
 * Composition / Styling Props
 * @property styles Variant overrides for the picker wrapper/trigger slots (`pickerStyles`).
 * @property classNames Slot class overrides for picker slots AND nested dialog/option list.
 *   - `classNames.dialog` -> forwarded to `SMUIDialog` `classNames` prop
 *   - `classNames.optionList` -> forwarded to `SMUIOptionList` `classNames` (merged with itemContent)
 * @property dialogVisualType Responsive or static visual type for the dropdown (`popover` or `sheet`).
 * @property dialogStyles Style variants passed to `SMUIDialog`.
 * @property optionListVisualType Visual preset for the option list (e.g. `select`).
 * @property optionListStyles Style variants passed to `SMUIOptionList` (e.g. `density`).
 *
 * Rendering Customization
 * @property renderItemContent Discriminated union render override. Receives `item` (or `null`
 *   when rendering selected value with nothing chosen) and contextual render props with
 *   `renderLocation` distinguishing trigger vs option list context. Always includes
 *   `defaultChildren` fallback from RAC.
 *
 * Extends
 * - Inherits RAC `SelectProps` (minus children/className) allowing `selectedKey`,
 *   `onSelectionChange`, `defaultSelectedKey`, etc.
 */
export type SMUIIPickerProps<I extends object = object> = {
  ariaLabel: string
  styles?: VariantProps<typeof smuiPickerStyles>
  classNames?: Partial<
    SlottedClassNames<typeof smuiPickerStyles> & {
      dialog: SMUIDialogProps<"popover">["classNames"]
      optionList: SMUIOptionListProps<"listbox", I>["classNames"]
    }
  >
  dialogStyles?: SMUIDialogProps<"popover">["styles"]
  dialogVisualType?: SMUIDialogProps<"popover">["visualType"]
  optionListVisualType?: SMUIOptionListProps<"listbox", I>["visualType"]
  options: SMUIOptionListProps<"listbox", I>["nodes"]
  optionListStyles?: SMUIOptionListProps<"listbox", I>["styles"]
  renderItemContent?: (
    item: SMUIOptionListNode<I> | null,
    renderProps: SMUIPickerRenderItemContentProps<I>
  ) => ReactNode
} & Omit<SelectProps<I>, "children" | "className">

/**
 * High-level SMUI Picker component.
 *
 * Behavior / Flow
 * 1. Renders a RAC `Select` root with a trigger `Button`.
 * 2. Wraps the option list in an `SMUIDialog` (Popover / Sheet) for adaptive surfaces.
 * 3. Uses `SMUIOptionList` to render the provided `options` (items & sections).
 * 4. Option & selected value rendering can be customized uniformly via `renderItemContent`.
 *
 * Render Override Contract (`renderItemContent`)
 * - `renderLocation: "select-value"` — Rendering inside the trigger. `item` may be null.
 * - `renderLocation: "option-list"` — Rendering an option row. `item` is a node of type `item`.
 * - Always receives `defaultChildren` for graceful fallback.
 *
 * Styling Strategy
 * - `pickerStyles` TV slots: wrapper, triggerButton, itemContent, chevronIcon.
 * - Pass nested style props (`dialog*`, `optionList*`) to fine-tune composed primitives.
 *
 * @example
 * <SMUIPicker
 *   ariaLabel="Status"
 *   selectedKey={status}
 *   onSelectionChange={setStatus}
 *   options={[
 *     { type: 'item', id: 'open', label: 'Open' },
 *     { type: 'item', id: 'closed', label: 'Closed' },
 *   ]}
 * />
 */
export function SMUIPicker<I extends object = object>({
  ariaLabel,
  dialogVisualType = { desktop: "popover", mobile: "sheet" },
  dialogStyles,
  options,
  optionListVisualType = "select",
  optionListStyles,
  renderItemContent,
  styles,
  classNames,
  ...props
}: SMUIIPickerProps<I>) {
  const { wrapper, triggerButton, itemContent, chevronIcon } = smuiPickerStyles(styles)
  const wrapperStyles = wrapper({ className: classNames?.wrapper })
  const itemContentStyles = itemContent({ className: classNames?.itemContent })
  const chevronIconStyles = chevronIcon({ className: classNames?.chevronIcon })
  const triggerButtonStyles = triggerButton({ className: classNames?.triggerButton })

  return (
    <Select aria-label={ariaLabel} className={wrapperStyles} {...props}>
      <Button className={triggerButtonStyles}>
        <SelectValue className={itemContentStyles}>
          {(renderProps: WithDefaultChildren<SelectValueRenderProps<I>>) =>
            renderItemContent
              ? renderItemContent((renderProps.selectedItem as SMUIOptionListNode<I>) ?? null, {
                  ...renderProps,
                  renderLocation: "select-value",
                })
              : renderProps.defaultChildren
          }
        </SelectValue>
        <ChevronsUpDownIcon className={chevronIconStyles} />
      </Button>
      <SMUIDialog
        ariaLabel={`${ariaLabel} Dialog`}
        renderType="popover"
        visualType={dialogVisualType}
        styles={dialogStyles}
        classNames={classNames?.dialog}
      >
        <SMUIOptionList
          ariaLabel={`${ariaLabel} Options`}
          renderType="listbox"
          visualType={optionListVisualType}
          styles={optionListStyles}
          nodes={options}
          renderItemContent={
            renderItemContent
              ? (item, props) =>
                  renderItemContent(item, { ...props, renderLocation: "option-list" })
              : undefined
          }
          classNames={{ itemContent: classNames?.itemContent, ...classNames?.optionList }}
        />
      </SMUIDialog>
    </Select>
  )
}

export const smuiPickerStyles = tv({
  slots: {
    wrapper: [],
    triggerButton: ["flex items-center"],
    itemContent: ["flex items-center"],
    chevronIcon: ["size-content-sm min-w-content-sm"],
  },
  variants: {
    density: {},
  },
})
