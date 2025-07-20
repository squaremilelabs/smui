import { tv, VariantProps } from "../../utils"

export type IconVariantProps = VariantProps<typeof iconVariants>
export const iconVariants = tv({
  base: [],
  variants: {
    variant: {
      default: [],
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
