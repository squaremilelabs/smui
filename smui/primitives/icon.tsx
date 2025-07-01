"use client"

import React from "react"
import { tv, VariantProps, ClassValue } from "../utils"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/Form.html

__Notes__
- Not an RAC component. Simple `span` wrapper for icons.

```tsx
  <Icon content={<ExternalLibraryIcon />} />
```

*/

// # Variants -------------------------------------------------------------------------------------

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

// # Props ----------------------------------------------------------------------------------------

export type IconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "className"> & {
  variants?: IconVariantProps
  className?: ClassValue
  icon: React.ReactNode
}

// # Components -----------------------------------------------------------------------------------

export function Icon({ variants, className, icon }: IconProps) {
  return <span className={iconVariants({ ...variants, className })}>{icon}</span>
}
