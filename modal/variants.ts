import { ClassValue, tv, VariantProps } from "../utils"

// # Variants -------------------------------------------------------------------------------------

export type ModalVariantProps = VariantProps<typeof modalVariants>
export const modalVariants = tv({
  slots: {
    // <ModalOverlay />
    overlay: [
      "fixed inset-0 h-dvh w-dvw z-60",
      "flex flex-col items-center p-8 md:pt-[10dvh]",
      "bg-neutral-muted-bg/30 backdrop-blur-xs",
    ],
    // <Modal />
    modal: [""],
    // <Dialog />
    content: ["flex flex-col max-w-[95dvw] max-h-[95dvh] overflow-auto"],
  },
  variants: {
    variant: {
      default: {},
    },
    size: {
      xs: { content: ["w-xs"] },
      sm: { content: ["w-sm"] },
      md: { content: ["w-md"] },
      lg: { content: ["w-lg"] },
      xl: { content: ["w-xl"] },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
  },
})

export type ModalClassNames = {
  // slots.overlay
  overlay: ClassValue
  // slots.modal
  modal: ClassValue
  // slots.dialog
  content: ClassValue
}
