import { tv, VariantProps } from "../utils"

export type TooltipVariantProps = VariantProps<typeof tooltipVariants>
export const tooltipVariants = tv({
  base: [],
  variants: {
    variant: {
      default: [],
      info: ["bg-base-bg rounded-sm border px-8 py-4"],
      action: ["bg-base-bg rounded-sm border px-16 py-4 text-sm"],
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
