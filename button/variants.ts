"use client"
import { tv, VariantProps, ClassValue } from "../utils"

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
export const buttonVariants = tv({
  slots: {
    // <ButtonGroup />
    group: [],
    // <Button />
    button: [
      "not-disabled:cursor-pointer",
      "disabled:cursor-not-allowed",
      "not-disabled:hover:opacity-70",
    ],
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

export type ButtonGroupClassNames = {
  // slots.group
  base: ClassValue
  // slots.button
  button: ClassValue
}
