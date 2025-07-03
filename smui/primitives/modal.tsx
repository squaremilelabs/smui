"use client"

import React from "react"
import {
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  ModalOverlayProps as AriaModalOverlayProps,
  ModalRenderProps as AriaModalRenderProps,
  Dialog as AriaDialog,
  DialogRenderProps as AriaDialogRenderProps,
  DialogTrigger as AriaDialogTrigger,
  DialogTriggerProps as AriaDialogTriggerProps,
} from "react-aria-components"
import { renderChildren, ClassValue, tv, VariantProps, WithDefaultChildren } from "../utils"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/Modal.html

__Notes__
- Reduces the RAC composition (`ModalOverlay`, `Modal`, `Dialog`) to a single component.
- Combines RAC renderProps from both `Modal` and `Dialog`

__Composition__
- `<Modal /> ... <AriaModalOverlay />` (slots.overlay – INTERNAL)
- `<Modal /> ... <AriaModal />` (slots.modal – INTERNAL)
- `<Modal /> ... <AriaDialog />` (slots.content – INTERNAL)

__Basic (with ModalTrigger)__
```tsx
  <ModalTrigger>
    <Button>Open</Button>
    <Modal>
      {children || (renderProps) => children}
    </Modal>
  </ModalTrigger>
```

__Without ModalTrigger__
```tsx
  const [isOpen, setIsOpen] = React.useState(false)
  <Modal open={isOpen} onOpenChange={setIsOpen}>
    {children || (renderProps) => children}
  </Modal>
```

*/

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

// # ClassNames -----------------------------------------------------------------------------------

export type ModalClassNames = {
  // slots.overlay
  overlay: ClassValue
  // slots.modal
  modal: ClassValue
  // slots.dialog
  content: ClassValue
}

// # Props ----------------------------------------------------------------------------------------

export type ModalRenderProps = WithDefaultChildren<AriaModalRenderProps> & AriaDialogRenderProps
export type ModalProps = Omit<AriaModalOverlayProps, "children" | "className"> & {
  variants?: ModalVariantProps
  classNames?: Partial<ModalClassNames>
  children: React.ReactNode | ((renderProps: ModalRenderProps) => React.ReactNode)
}

export type ModalTriggerProps = AriaDialogTriggerProps

// # Components -----------------------------------------------------------------------------------

export function Modal({ children, classNames, variants, ...props }: ModalProps) {
  const {
    overlay: overlayStyles,
    modal: modalStyles,
    content: contentStyles,
  } = modalVariants(variants)

  return (
    <AriaModalOverlay {...props} className={overlayStyles({ className: classNames?.overlay })}>
      <AriaModal className={modalStyles({ className: classNames?.modal })}>
        {(modalRenderProps) => (
          <AriaDialog className={contentStyles({ className: classNames?.content })}>
            {(dialogRenderProps) =>
              renderChildren(children, {
                ...modalRenderProps,
                ...dialogRenderProps,
              })
            }
          </AriaDialog>
        )}
      </AriaModal>
    </AriaModalOverlay>
  )
}

export const ModalTrigger = AriaDialogTrigger
