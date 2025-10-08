"use client"

import { ChevronsUpDownIcon } from "lucide-react"
import { ReactNode } from "react"
import {
  Button,
  Select,
  SelectValue,
  SelectProps,
  SelectValueRenderProps,
} from "react-aria-components"
import { WithDefaultChildren } from "../utils/react-aria"
import { SlottedClassNames, tv, VariantProps } from "../utils/tailwind"
import { SMUIDialog, SMUIDialogProps } from "./dialog"
import { SMUIOptionList, SMUIOptionListItem, SMUIOptionListProps } from "./option-list"

export type SMUIPickerRenderItemContentProps<I extends object = object> =
  | ({
      renderLocation: "option-list"
    } & Parameters<NonNullable<SMUIOptionListProps<"listbox", I>["renderItemContent"]>>[1])
  | ({
      renderLocation: "select-value"
    } & WithDefaultChildren<SelectValueRenderProps<I>>)

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
  items: SMUIOptionListProps<"listbox", I>["items"]
  optionListStyles?: SMUIOptionListProps<"listbox", I>["styles"]
  renderItemContent?: (
    item: SMUIOptionListItem<I> | null,
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
  items,
  optionListVisualType = "select",
  optionListStyles,
  renderItemContent,
  styles,
  classNames,
  ...props
}: SMUIIPickerProps<I>) {
  const { wrapper, button, value } = smuiPickerStyles(styles)
  const wrapperStyles = wrapper({ className: classNames?.wrapper })
  const buttonStyles = button({ className: classNames?.button })
  const valueStyles = value({ className: classNames?.value })

  return (
    <Select aria-label={ariaLabel} className={wrapperStyles} {...props}>
      <Button className={buttonStyles}>
        <SelectValue className={valueStyles}>
          {(renderProps: WithDefaultChildren<SelectValueRenderProps<I>>) =>
            renderItemContent
              ? renderItemContent((renderProps.selectedItem as SMUIOptionListItem<I>) ?? null, {
                  ...renderProps,
                  renderLocation: "select-value",
                })
              : renderProps.defaultChildren
          }
        </SelectValue>
        <ChevronsUpDownIcon />
      </Button>
      <SMUIDialog
        ariaLabel={`${ariaLabel} Dialog`}
        renderType="popover"
        visualType={dialogVisualType}
        styles={{
          size: "trigger",
          ...dialogStyles,
        }}
        crossOffset={0}
        classNames={classNames?.dialog}
        placement="bottom start"
      >
        <SMUIOptionList
          ariaLabel={`${ariaLabel} Options`}
          renderType="listbox"
          visualType={optionListVisualType}
          styles={{
            density: styles?.density,
            ...optionListStyles,
          }}
          items={items}
          renderItemContent={
            renderItemContent
              ? (item, props) =>
                  renderItemContent(item, { ...props, renderLocation: "option-list" })
              : undefined
          }
          classNames={classNames?.optionList}
        />
      </SMUIDialog>
    </Select>
  )
}

export const smuiPickerStyles = tv({
  slots: {
    wrapper: ["flex flex-col"],
    button: [
      "flex grow items-center justify-between",
      "border",
      "not-data-disabled:hover:cursor-pointer",
      "not-data-disabled:hover:bg-neutral-muted-bg",
    ],
    value: ["flex grow items-center"],
  },
  variants: {
    density: {
      compact: {
        button: ["h-box-sm gap-space-sm px-space-md rounded-sm text-sm"],
        value: ["gap-space-sm"],
      },
      comfortable: {
        button: ["h-box-md gap-space-md px-space-lg text-md rounded-md"],
        value: ["gap-spaace-md"],
      },
    },
  },
  defaultVariants: {
    density: "comfortable",
  },
})
