"use client"

import React from "react"
import {
  Popover as AriaPopover,
  PopoverProps as AriaPopoverProps,
  PopoverRenderProps as AriaPopoverRenderProps,
  Dialog as AriaDialog,
  DialogRenderProps as AriaDialogRenderProps,
  DialogTrigger as AriaDialogTrigger,
  DialogTriggerProps as AriaDialogTriggerProps,
} from "react-aria-components"
import { renderChildren, ClassValue, tv, VariantProps, WithDefaultChildren } from "../utils"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/Popover.html

__Notes__
- Reduces the RAC composition (`Popover`, `Dialog`) to a single component.
- Combines RAC renderProps from both `Popover` and `Dialog`
- Does not implement an `OverlayArrow`

__Composition__
- `<Popover /> ... <AriaPopover />` (slots.popover – INTERNAL)
- `<Popover /> ... <AriaDialog />` (slots.content – INTERNAL)

__Basic (with PopoverTrigger)__
```tsx
  <PopoverTrigger>
    <Button>Open</Button>
    <Popover>
      {children || (renderProps) => children}
    </Popover>
  </PopoverTrigger>
```

__Without PopoverTrigger__
```tsx
  const triggerRef = React.useRef(null)
  const [isOpen, setIsOpen] = React.useState(false)
  
  <span ref={triggerRef} />
  <Popover triggerRef={triggerRef} open={isOpen} onOpenChange={setIsOpen}>
    {children || (renderProps) => children}
  </Popover>
```

*/

// # Variants -------------------------------------------------------------------------------------

export type PopoverVariantProps = VariantProps<typeof popoverVariants>
export const popoverVariants = tv({
  slots: {
    // <Popover />
    popover: [],
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

export type PopoverClassNames = {
  // slots.popover
  popover: ClassValue
  // slots.content
  content: ClassValue
}

// # Props ----------------------------------------------------------------------------------------

export type PopoverRenderProps = WithDefaultChildren<AriaPopoverRenderProps> & AriaDialogRenderProps
export type PopoverProps = Omit<AriaPopoverProps, "children" | "className"> & {
  variants?: PopoverVariantProps
  classNames?: Partial<PopoverClassNames>
  children: React.ReactNode | ((renderProps: PopoverRenderProps) => React.ReactNode)
}

export type PopoverTriggerProps = AriaDialogTriggerProps

// # Components -----------------------------------------------------------------------------------

export function Popover({ children, classNames, variants, ...props }: PopoverProps) {
  const { popover: popoverStyles, content: contentStyles } = popoverVariants(variants)
  return (
    <AriaPopover {...props} className={popoverStyles({ className: classNames?.popover })}>
      {(popoverRenderProps) => (
        <AriaDialog className={contentStyles({ className: classNames?.content })}>
          {(dialogRenderProps) =>
            renderChildren(children, { ...popoverRenderProps, ...dialogRenderProps })
          }
        </AriaDialog>
      )}
    </AriaPopover>
  )
}

export const PopoverTrigger = AriaDialogTrigger
