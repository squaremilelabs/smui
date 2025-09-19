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

type SMUIPickerRenderItemContentProps<I extends object = object> =
  | ({
      renderLocation: "option-list"
    } & Parameters<NonNullable<SMUIOptionListProps<"listbox", I>["renderItemContent"]>>[1])
  | ({
      renderLocation: "select-value"
    } & WithDefaultChildren<SelectValueRenderProps<I>>)

type SMUIIPickerProps<I extends object = object> = {
  ariaLabel: string
  styles?: VariantProps<typeof pickerStyles>
  classNames?: Partial<SlottedClassNames<typeof pickerStyles>>
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
  const { wrapper, triggerButton, itemContent, chevronIcon } = pickerStyles(styles)
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
          classNames={{ itemContent: classNames?.itemContent }}
        />
      </SMUIDialog>
    </Select>
  )
}

const pickerStyles = tv({
  slots: {
    wrapper: [],
    triggerButton: [],
    selectValue: [],
    itemContent: [],
    chevronIcon: [],
  },
  variants: {
    density: {},
  },
})
