"use client"

import {
  Tooltip as AriaTooltip,
  TooltipProps as AriaTooltipProps,
  TooltipRenderProps as AriaTooltipRenderProps,
  TooltipTrigger as AriaTooltipTrigger,
  TooltipTriggerComponentProps as AriaTooltipTriggerComponentProps,
} from "react-aria-components"
import { tv, VariantProps, ClassValue } from "../utils"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/Tooltip.html

__Notes__
- Does not implement an `OverlayArrow`
- Otherwise, No special modifications from the RAC component.

__Usage__
```tsx
  <TooltipTrigger>
    <Button>Hover</Button>
    <Tooltip>
      {children || (renderProps) => children}
    </Tooltip>
  </TooltipTrigger>
```

*/

// # Variants -------------------------------------------------------------------------------------

export type TooltipVariantProps = VariantProps<typeof tooltipVariants>
export const tooltipVariants = tv({
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

// # ClassNames -----------------------------------------------------------------------------------

// No special slots

// # Props ----------------------------------------------------------------------------------------

export type TooltipRenderProps = AriaTooltipRenderProps
export type TooltipProps = Omit<AriaTooltipProps, "className"> & {
  variants?: TooltipVariantProps
  className?: ClassValue
}

export type TooltipTriggerProps = AriaTooltipTriggerComponentProps

// # Components -----------------------------------------------------------------------------------

export function Tooltip({ variants, className, ...props }: TooltipProps) {
  return <AriaTooltip {...props} className={tooltipVariants({ ...variants, className })} />
}

export const TooltipTrigger = AriaTooltipTrigger
