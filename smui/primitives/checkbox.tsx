"use client"

import {
  Checkbox as AriaCheckbox,
  CheckboxProps as AriaCheckboxProps,
  CheckboxRenderProps as AriaCheckboxRenderProps,
  CheckboxGroup as AriaCheckboxGroup,
  CheckboxGroupProps as AriaCheckboxGroupProps,
  CheckboxGroupRenderProps as AriaCheckboxGroupRenderProps,
} from "react-aria-components"
import { SquareCheckIcon, SquareIcon, SquareMinusIcon } from "lucide-react"
import {
  cn,
  DeepPartial,
  renderChildren,
  WithDefaultChildren,
  ClassValue,
  tv,
  VariantProps,
} from "../utils"
import { FieldClassNames, FieldVariantProps, fieldVariants as getFieldVariants } from "./field"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/Checkbox.html
https://react-spectrum.adobe.com/react-aria/CheckboxGroup.html

__Notes__
- Checkbox children are wrapped in a `span` element to apply the label styles.
- CheckboxGroup can implement the SMUI `field` components & variants.

__Composition__
- `<Checkbox />` (slots.checkboxBase)
- `<Checkbox />` ... `<Icon />` (slots.checkboxIcon - INTERNAL)
- `<Checkbox />` ... `<span />` (slots.checkboxLabel - INTERNAL)
- `<CheckboxGroup />` (slots.group)

__Checkbox__
```tsx
  // Icon only
  <Checkbox />

  // With label (as children)
  <Checkbox>
    {children || (renderProps) => children}
  </Checkbox>
```

__CheckboxGroup__
```tsx
  <CheckboxGroup>
    {(renderProps, classNames) => (
      <>
        <Checkbox classNames={classNames.checkbox} />
        <Checkbox classNames={classNames.checkbox} />
        <Checkbox classNames={classNames.checkbox} />
      </>
    )}
  </CheckboxGroup>
```

__CheckboxGroup with Field Components__
```tsx
  <CheckboxGroup 
    variants={{} as CheckboxVariantProps}
    fieldVariants={{} as FieldVariantProps}
    >
    {(renderProps, classNames) => (
      <>
        <FieldLabel className={classNames.field.label}>
        <Checkbox classNames={classNames.checkbox} />
        <Checkbox classNames={classNames.checkbox} />
        <Checkbox classNames={classNames.checkbox} />
        <FieldDescription className={classNames.field.description}>
        <FieldError className={classNames.field.error}>
      </>
    )}
  </CheckboxGroup>
```

*/

// # Icons ----------------------------------------------------------------------------------------
// Replace if not using lucide-react

const IndeterminateIcon = SquareMinusIcon
const CheckedIcon = SquareCheckIcon
const UncheckedIcon = SquareIcon

// # Variants -------------------------------------------------------------------------------------

export type CheckboxVariantProps = VariantProps<typeof checkboxVariants>
export const checkboxVariants = tv({
  slots: {
    // <CheckboxGroup />
    group: [],
    // <Checkbox />
    checkboxBase: [],
    // <Checkbox /> ... <Icon />
    checkboxIcon: [],
    // <Checkbox /> ... <span />
    checkboxLabel: [],
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

export type CheckboxClassNames = {
  // slots.checkboxBase
  base: ClassValue
  // slots.checkboxIcon
  icon: ClassValue
  // slots.checkboxLabel
  label: ClassValue
}

export type CheckboxGroupClassNames = {
  // slots.group
  base: ClassValue
  // Checkbox slots
  checkbox: CheckboxClassNames
}

// # Props ----------------------------------------------------------------------------------------

export type CheckboxRenderProps = WithDefaultChildren<AriaCheckboxRenderProps>
export type CheckboxProps = Omit<AriaCheckboxProps, "className"> & {
  variants?: CheckboxVariantProps
  classNames?: DeepPartial<CheckboxClassNames>
}

export type CheckboxGroupRenderProps = WithDefaultChildren<AriaCheckboxGroupRenderProps>
export type CheckboxGroupProps = Omit<AriaCheckboxGroupProps, "children" | "className"> & {
  variants?: CheckboxVariantProps
  fieldVariants?: FieldVariantProps
  classNames?: DeepPartial<CheckboxGroupClassNames & { field: FieldClassNames }>
  children: (
    renderProps: CheckboxGroupRenderProps,
    classNames: Omit<CheckboxGroupClassNames, "base"> & { field: Omit<FieldClassNames, "base"> }
  ) => React.ReactNode
}

// # Components -----------------------------------------------------------------------------------

export function Checkbox({ variants, classNames, children, ...props }: CheckboxProps) {
  const {
    checkboxBase: baseStyles,
    checkboxIcon: iconStyles,
    checkboxLabel: labelStyles,
  } = checkboxVariants(variants)
  return (
    <AriaCheckbox {...props} className={baseStyles({ className: classNames?.base })}>
      {(renderProps) => (
        <>
          {renderProps.isIndeterminate ? (
            <IndeterminateIcon className={iconStyles({ className: classNames?.icon })} />
          ) : renderProps.isSelected ? (
            <CheckedIcon className={iconStyles({ className: classNames?.icon })} />
          ) : (
            <UncheckedIcon className={iconStyles({ className: classNames?.icon })} />
          )}
          <span className={labelStyles({ className: classNames?.label })}>
            {renderChildren(children, renderProps)}
          </span>
        </>
      )}
    </AriaCheckbox>
  )
}

export function CheckboxGroup({
  variants,
  fieldVariants,
  classNames,
  children,
  ...props
}: CheckboxGroupProps) {
  const {
    group: baseStyles,
    checkboxBase: checkboxBaseStyles,
    checkboxIcon: checkboxIconStyles,
    checkboxLabel: checkboxLabelStyles,
  } = checkboxVariants(variants)

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
    checkbox: {
      base: checkboxBaseStyles({ className: classNames?.checkbox?.base }),
      icon: checkboxIconStyles({ className: classNames?.checkbox?.icon }),
      label: checkboxLabelStyles({ className: classNames?.checkbox?.label }),
    },
    field: {
      label: fieldLabelStyles({ className: classNames?.field?.label }),
      inputBox: fieldInputBoxStyles({ className: classNames?.field?.inputBox }),
      description: fieldDescriptionStyles({ className: classNames?.field?.description }),
      error: fieldErrorStyles({ className: classNames?.field?.error }),
    },
  }

  return (
    <AriaCheckboxGroup {...props} className={baseClassName}>
      {(renderProps) => children(renderProps, childrenClassNames)}
    </AriaCheckboxGroup>
  )
}
