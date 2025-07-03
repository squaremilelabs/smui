"use client"

import React from "react"
import {
  Select as AriaSelect,
  SelectProps as AriaSelectProps,
  SelectRenderProps as AriaSelectRenderProps,
  Button as AriaButton,
  ButtonProps as AriaButtonProps,
  ButtonRenderProps as AriaButtonRenderProps,
  SelectValue as AriaSelectValue,
  SelectValueRenderProps as AriaSelectValueRenderProps,
  Popover as AriaPopover,
  PopoverProps as AriaPopoverProps,
} from "react-aria-components"
import { ChevronsUpDownIcon } from "lucide-react"
import { cn, DeepPartial, ClassValue, tv, VariantProps, WithDefaultChildren } from "../utils"
import { FieldClassNames, FieldVariantProps, fieldVariants as getFieldVariants } from "./field"
import { PopoverVariantProps, popoverVariants } from "./popover"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/Select.html

__Notes__
- Can implement the SMUI `field` components & variants.
- Inherits `popoverVariants` for the `SelectPopover`.
- Same as RAC, excpects a `ListBox` descendent.
- Combines the `Button` and `SelectValue` into a single component, `SelectButton`.

__Composition__
- `<Select />` (slots.base)
- `<SelectButton />` (slots.button)
- `<SelectButton />` ... `<AriaSelectValue />` (slots.buttonValue - INTERNAL)
- `<SelectButton />` ... `<SelectButtonIcon />` (slots.buttonIcon - INTERNAL)

__Basic__
```tsx
  <Select>
    {(renderProps, classNames) => (
      <>
        <SelectButton classNames={classNames.button>}>
          {children || (renderProps) => (children)}
        </SelectButton>
        <SelectPopover variants={{} as PopoverVariantProps}>
          <ListBox items={items} />
        </SelectPopover>
      </>
    )}
  </Select>
```

__With Field Components__
```tsx
  <Select
    variants={{} as SelectVariantProps}
    fieldVariants={{} as FieldVariantProps}
    >
    {(renderProps, classNames) => (
      <>
        <FieldLabel className={classNames.field.label}>
        <SelectButton classNames={cn(classNames.button, classNames.field.inputBox)}>
          {children || (renderProps) => (children)}
        </SelectButton>
        <FieldDescription className={classNames.field.description}>
        <FieldError className={classNames.field.error}>
        <SelectPopover variants={{} as PopoverVariantProps}>
          <ListBox />
        </SelectPopover>
      </>
    )}
  </Select>
  
```

*/

// # Icons ----------------------------------------------------------------------------------------
// Replace if not using lucide-react

const SelectButtonIcon = ChevronsUpDownIcon

// # Variants -------------------------------------------------------------------------------------

export type SelectVariantProps = VariantProps<typeof selectVariants>
export const selectVariants = tv({
  slots: {
    // <Select />
    base: [],
    // <SelectButton />
    button: [],
    // <SelectButton /> ... <AriaSelectValue />
    buttonValue: [],
    // <SelectButton /> ... <SelectButtonIcon />
    buttonIcon: [],
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

export type SelectClassNames = {
  // slots.base
  base: ClassValue
  // SelectButton slots
  button: {
    // slots.button
    base: ClassValue
    // slots.buttonValue
    value: ClassValue
    // slots.buttonIcon
    icon: ClassValue
  }
}

// # Props ----------------------------------------------------------------------------------------

export type SelectRenderProps = WithDefaultChildren<AriaSelectRenderProps>
export type SelectProps = Omit<AriaSelectProps, "children" | "className"> & {
  variants?: SelectVariantProps
  fieldVariants?: FieldVariantProps
  classNames?: DeepPartial<SelectClassNames & { field: FieldClassNames }>
  children: (
    renderProps: SelectRenderProps,
    classNames: Omit<SelectClassNames, "base"> & {
      field: Omit<FieldClassNames, "base">
    }
  ) => React.ReactNode
}

export type SelectButtonRenderProps<T extends object> = WithDefaultChildren<
  AriaSelectValueRenderProps<T>
> &
  AriaButtonRenderProps

export type SelectButtonProps<T extends object> = Omit<
  AriaButtonProps,
  "children" | "className"
> & {
  classNames: SelectClassNames["button"]
  children?: (renderProps: SelectButtonRenderProps<T>) => React.ReactNode
}

export type SelectPopoverProps = Omit<AriaPopoverProps, "className"> & {
  variants?: PopoverVariantProps
  className?: ClassValue
}

// # Components -----------------------------------------------------------------------------------

export function Select({ variants, fieldVariants, classNames, children, ...props }: SelectProps) {
  const {
    base: baseStyles,
    button: buttonStyles,
    buttonValue: buttonValueStyles,
    buttonIcon: buttonIconStyles,
  } = selectVariants(variants)

  const {
    base: fieldBaseStyles,
    label: fieldLabelStyles,
    inputBox: fieldInputBoxStyles,
    description: fieldDescriptionStyles,
    error: fieldErrorStyles,
  } = getFieldVariants(fieldVariants)

  const baseClassName = cn(
    baseStyles({ className: classNames?.base }),
    // apply field base styles only if fieldVariants are provided
    fieldVariants && fieldBaseStyles({ className: classNames?.field?.base })
  )

  const childrenClassNames = {
    button: {
      base: buttonStyles({ className: classNames?.button?.base }),
      value: buttonValueStyles({ className: classNames?.button?.value }),
      icon: buttonIconStyles({ className: classNames?.button?.icon }),
    },
    field: {
      label: fieldLabelStyles({ className: classNames?.field?.label }),
      inputBox: fieldInputBoxStyles({ className: classNames?.field?.inputBox }),
      description: fieldDescriptionStyles({ className: classNames?.field?.description }),
      error: fieldErrorStyles({ className: classNames?.field?.error }),
    },
  }

  return (
    <AriaSelect {...props} className={baseClassName}>
      {(renderProps) => children(renderProps, childrenClassNames)}
    </AriaSelect>
  )
}

export function SelectButton<T extends object>({
  classNames,
  children,
  ...props
}: SelectButtonProps<T>) {
  return (
    <AriaButton {...props} className={cn(classNames.base)}>
      {(buttonRenderProps) => (
        <>
          <AriaSelectValue<T> className={cn(classNames.value)}>
            {(selectValueRenderProps) => {
              if (children) return children({ ...selectValueRenderProps, ...buttonRenderProps })
              return selectValueRenderProps.defaultChildren
            }}
          </AriaSelectValue>
          <SelectButtonIcon className={cn(classNames.icon)} />
        </>
      )}
    </AriaButton>
  )
}

export function SelectPopover({ variants, className, ...props }: SelectPopoverProps) {
  const { popover: popoverStyles } = popoverVariants(variants)
  return <AriaPopover {...props} className={popoverStyles({ className })} />
}
