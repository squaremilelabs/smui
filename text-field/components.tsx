"use client"

import React from "react"
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  TextFieldRenderProps as AriaTextFieldRenderProps,
  Input as AriaInput,
  InputProps as AriaInputProps,
  useContextProps,
  TextAreaContext,
} from "react-aria-components"
import TextareaAutosize, { TextareaAutosizeProps } from "react-textarea-autosize"
import { cn, ClassValue, DeepPartial, WithDefaultChildren } from "../utils"
import { FieldClassNames, fieldVariants } from "../field/variants"
import { TextFieldVariantProps, TextFieldClassNames, textFieldVariants } from "./variants"

export type TextFieldRenderProps = WithDefaultChildren<AriaTextFieldRenderProps>
export type TextFieldProps = Omit<AriaTextFieldProps, "children" | "className"> & {
  variants?: TextFieldVariantProps
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

export type TextFieldTextAreaProps = Omit<TextareaAutosizeProps, "className"> & {
  className: ClassValue
}

export function TextField({ variants, classNames, children, ...props }: TextFieldProps) {
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
  } = fieldVariants(variants?.field)

  const baseClassName = cn(
    baseStyles({ className: classNames?.base }),
    variants?.field && fieldBaseStyles({ className: classNames?.field?.base })
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

const ForwardedTextareaAutosize = React.forwardRef<HTMLTextAreaElement, TextFieldTextAreaProps>(
  (props, ref) => {
    const [innerProps, innerRef] = useContextProps(props, ref, TextAreaContext)
    return <TextareaAutosize {...innerProps} ref={innerRef} className={cn(innerProps.className)} />
  }
)
ForwardedTextareaAutosize.displayName = "ForwardedTextareaAutosize"

export function TextFieldTextArea({ className, ...props }: TextFieldTextAreaProps) {
  return <ForwardedTextareaAutosize {...props} className={cn(className)} />
}
