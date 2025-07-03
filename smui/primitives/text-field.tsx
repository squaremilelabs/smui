"use client"

import React from "react"
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  TextFieldRenderProps as AriaTextFieldRenderProps,
  Input as AriaInput,
  InputProps as AriaInputProps,
  TextArea as AriaTextArea,
  TextAreaProps as AriaTextAreaProps,
} from "react-aria-components"
import { cn, tv, VariantProps, ClassValue, DeepPartial, WithDefaultChildren } from "../utils"
import { FieldClassNames, FieldVariantProps, fieldVariants as getFieldVariants } from "./field"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/TextField.html

__Notes__
- Can implement the SMUI `field` components & variants.

Composition:
- <TextField /> (slots.base)
- <TextFieldInput /> (slots.input)
- <TextFieldTextArea /> (slots.textarea)

__Basic (with Input)__
```tsx
  <TextField>
    {(renderProps, classNames) => (
      <TextFieldInput classNames={classNames.input} />
    )}
  </Select>
```

__Basic (with TextArea)__
```tsx
  <TextField>
    {(renderProps, classNames) => (
      <TextFieldTextArea classNames={classNames.textarea} />
    )}
  </Select>
```

__With Field Components__
```tsx
  <TextField
    variants={{} as TextFieldVariantProps}
    fieldVariants={{} as FieldVariantProps}
    >
    {(renderProps, classNames) => (
      <>
        <FieldLabel className={classNames.field.label}>
        <TextFieldInput classNames={cn(classNames.input, classNames.field.inputBox)} />
        <FieldDescription className={classNames.field.description}>
        <FieldError className={classNames.field.error}>
      </>
    )}
  </TextField>
```
*/

// # Variants -------------------------------------------------------------------------------------

export type TextFieldVariantProps = VariantProps<typeof textFieldVariants>
export const textFieldVariants = tv({
  slots: {
    // <TextField />
    base: [],
    // <TextFieldInput />
    input: [],
    // <TextFieldTextArea />
    textarea: [],
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

export type TextFieldClassNames = {
  // slots.base
  base: ClassValue
  // slots.input
  input: ClassValue
  // slots.textarea
  textarea: ClassValue
}

// # Props ----------------------------------------------------------------------------------------

export type TextFieldRenderProps = WithDefaultChildren<AriaTextFieldRenderProps>
export type TextFieldProps = Omit<AriaTextFieldProps, "children" | "className"> & {
  variants?: TextFieldVariantProps
  fieldVariants?: FieldVariantProps
  classNames?: DeepPartial<TextFieldClassNames & { field: FieldClassNames }>
  children: (
    renderProps: TextFieldRenderProps,
    classNames: Omit<TextFieldClassNames, "base"> & {
      field: Omit<FieldClassNames, "base">
    }
  ) => React.ReactNode
}

export type TextFieldInputProps = Omit<AriaInputProps, "className"> & {
  className: ClassValue
}

export type TextFieldTextAreaProps = Omit<AriaTextAreaProps, "className"> & {
  className: ClassValue
}

// # Components -----------------------------------------------------------------------------------

export function TextField({
  variants,
  fieldVariants,
  classNames,
  children,
  ...props
}: TextFieldProps) {
  const {
    base: baseStyles,
    input: inputStyles,
    textarea: textareaStyles,
  } = textFieldVariants(variants)

  const {
    base: fieldBaseStyles,
    label: fieldLabelStyles,
    inputBox: fieldInputBoxStyles,
    description: fieldDescriptionStyles,
    error: fieldErrorStyles,
  } = getFieldVariants(fieldVariants)

  const baseClassName = cn(
    baseStyles({ className: classNames?.base }),
    fieldVariants && fieldBaseStyles({ className: classNames?.field?.base })
  )

  const childrenClassNames = {
    input: inputStyles({ className: classNames?.input }),
    textarea: textareaStyles({ className: classNames?.textarea }),
    field: {
      label: fieldLabelStyles({ className: classNames?.field?.label }),
      inputBox: fieldInputBoxStyles({ className: classNames?.field?.inputBox }),
      description: fieldDescriptionStyles({ className: classNames?.field?.description }),
      error: fieldErrorStyles({ className: classNames?.field?.error }),
    },
  }

  return (
    <AriaTextField {...props} className={baseClassName}>
      {(renderProps) => children(renderProps, childrenClassNames)}
    </AriaTextField>
  )
}

export function TextFieldInput({ className, ...props }: TextFieldInputProps) {
  return <AriaInput {...props} className={cn(className)} />
}

export function TextFieldTextArea({ className, ...props }: TextFieldTextAreaProps) {
  return <AriaTextArea {...props} className={cn(className)} />
}
