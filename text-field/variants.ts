import { tv, VariantProps, ClassValue } from "../utils"
import { FieldVariantProps } from "../field/variants"

type BaseTextFieldVariantProps = VariantProps<typeof textFieldVariants>
export type TextFieldVariantProps = BaseTextFieldVariantProps & {
  field?: FieldVariantProps
}
export const textFieldVariants = tv({
  slots: {
    // <TextField />
    base: [],
    // <TextFieldInput />
    input: [],
    // <TextFieldTextArea />
    textarea: ["resize-none"],
  },
  variants: {
    variant: {
      default: {},
      title: {
        base: ["flex items-start w-full gap-8"],
        textarea: ["text-lg w-full !outline-0 font-medium"],
      },
      create: {
        base: [
          "flex items-stretch w-full",
          "rounded-sm gap-4 p-8",
          "focus-within:outline-2",
          "not-focus-within:hover:bg-neutral-muted-bg/50",
        ],
        input: ["!outline-0 w-full"],
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export type TextFieldClassNames = {
  // slots.base
  base: ClassValue
  // slots.input
  input: ClassValue
  // slots.textarea
  textarea: ClassValue
}
