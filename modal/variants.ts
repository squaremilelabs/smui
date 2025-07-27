import { ClassValue, tv, VariantProps } from "../utils"

// # Variants -------------------------------------------------------------------------------------

export type ModalVariantProps = VariantProps<typeof modalVariants>
export const modalVariants = tv({
  slots: {
    // <ModalOverlay />
    overlay: [
      "fixed inset-0 h-dvh w-dvw z-60",
      "flex flex-col items-center pt-[10dvh]",
      "bg-canvas-1/30 backdrop-blur-xs",
    ],
    // <Modal />
    modal: ["bg-canvas-0 rounded-sm border-2"],
    // <Dialog />
    content: ["flex flex-col"],
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

export type ModalClassNames = {
  // slots.overlay
  overlay: ClassValue
  // slots.modal
  modal: ClassValue
  // slots.dialog
  content: ClassValue
}
