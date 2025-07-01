"use client"

import {
  Label as AriaLabel,
  LabelProps as AriaLabelProps,
  FieldError as AriaFieldError,
  FieldErrorProps as AriaFieldErrorProps,
  FieldErrorRenderProps as AriaFieldErrorRenderProps,
  Text as AriaText,
  TextProps as AriaTextProps,
} from "react-aria-components"
import { cn, tv, VariantProps, ClassValue } from "../utils"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/Form.html

__Notes__
- These are not standalone components
- They are meant to be used within field-based components like `<TextField />`, `<Select />`, etc.
- See those field-based component files for usage examples

*/

// # Variants -------------------------------------------------------------------------------------

export type FieldVariantProps = VariantProps<typeof fieldVariants>
export const fieldVariants = tv({
  slots: {
    // To be appended to the base field component (e.g., <Select />, <TextField />, etc.)
    base: [],
    // To be appended to the field input component (e.g., <SelectButton />, <TextFieldInput />, etc.)
    inputBox: [],
    // <FieldLabel />
    label: [],
    // <FieldDescription />
    description: [],
    // <FieldError />
    error: [],
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

export type FieldClassNames = {
  // slots.base
  base: ClassValue
  // slots.label
  label: ClassValue
  // slots.inputBox
  inputBox: ClassValue
  // slots.description
  description: ClassValue
  // slots.error
  error: ClassValue
}

// # Props ----------------------------------------------------------------------------------------

export type FieldLabelProps = Omit<AriaLabelProps, "className"> & {
  className: ClassValue
}

export type FieldDescriptionProps = Omit<AriaTextProps, "className"> & {
  className: ClassValue
}

export type FieldErrorRenderProps = AriaFieldErrorRenderProps
export type FieldErrorProps = Omit<AriaFieldErrorProps, "className"> & {
  className: ClassValue
}

// # Components -----------------------------------------------------------------------------------

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return <AriaLabel {...props} className={cn(className)} />
}

export function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return <AriaText {...props} slot="description" className={cn(className)} />
}

export function FieldError({ className, ...props }: FieldErrorProps) {
  return <AriaFieldError {...props} className={cn(className)} />
}
