import { ClassValue, tv, VariantProps } from "../utils"

export type PopoverVariantProps = VariantProps<typeof popoverVariants>
export const popoverVariants = tv({
  slots: {
    // <AriaPopover />
    popover: [],
    // <AriaDialog />
    content: [],
  },
  variants: {
    variant: {
      default: {},
      menu: {
        content: ["bg-base-bg border rounded-sm"],
      },
      panel: {
        content: ["bg-base-bg border rounded-sm", "flex flex-col p-8"],
      },
      select: {
        content: [
          "bg-base-bg border-2 rounded-sm",
          "p-4 w-(--trigger-width) max-h-300 overflow-auto",
        ],
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// # ClassNames -----------------------------------------------------------------------------------

export type PopoverClassNames = {
  // slots.popover
  popover: ClassValue
  // slots.content
  content: ClassValue
}
