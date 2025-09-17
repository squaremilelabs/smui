import { ClassValue, tv, VariantProps } from "../utils"

// # Variants -------------------------------------------------------------------------------------

export type ModalVariantProps = VariantProps<typeof modalVariants>
export const modalVariants = tv({
  slots: {
    // <ModalOverlay />
    overlay: [],
    // <Modal />
    modal: [],
    // <Dialog />
    content: [],
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
