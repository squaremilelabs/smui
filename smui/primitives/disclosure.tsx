"use client"

import {
  Disclosure as AriaDisclosure,
  DisclosureProps as AriaDisclosureProps,
  DisclosureRenderProps as AriaDisclosureRenderProps,
  DisclosurePanel as AriaDisclosurePanel,
  DisclosurePanelProps as AriaDisclosurePanelProps,
  Heading as AriaHeading,
  HeadingProps as AriaHeadingProps,
} from "react-aria-components"
import { tv, cn, VariantProps, ClassValue, WithDefaultChildren } from "../utils"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/Disclosure.html

__Notes__
- Same as RAC, is expecting a `Button` with `slot="trigger"` to be provided in `DisclosureHeading`

```tsx
  <Disclosure>
    {(renderProps, classNames) => (
      <>
        <DisclosureHeading className={classNames.heading}>
          <Button slot="trigger" />
        </DisclosureHeading>
        <DisclosurePanel className={classNames.panel}>
          {children || (renderProps) => children}
        </DisclosurePanel>
      </>
    )}
  </Disclosure>
```

*/

// # Variants -------------------------------------------------------------------------------------

export type DisclosureVariantProps = VariantProps<typeof disclosureVariants>
export const disclosureVariants = tv({
  slots: {
    // <Disclosure>
    base: [],
    // <DisclosureHeading>
    heading: [],
    // <DisclosurePanel>
    panel: [],
  },
})

// # ClassNames -----------------------------------------------------------------------------------

export type DisclosureClassNames = {
  // slots.base
  base: ClassValue
  // slots.heading
  heading: ClassValue
  // slots.panel
  panel: ClassValue
}

// # Props ----------------------------------------------------------------------------------------

export type DisclosureRenderProps = WithDefaultChildren<AriaDisclosureRenderProps>
export type DisclosureProps = Omit<AriaDisclosureProps, "className" | "children"> & {
  variants?: DisclosureVariantProps
  classNames?: Partial<DisclosureClassNames>
  children: (
    renderProps: DisclosureRenderProps,
    classNames: Omit<DisclosureClassNames, "base">
  ) => React.ReactNode
}

export type DisclosureHeadingProps = Omit<AriaHeadingProps, "className"> & {
  className: ClassValue
}

export type DisclosurePanelProps = Omit<AriaDisclosurePanelProps, "className"> & {
  className: ClassValue
}

// # Components -----------------------------------------------------------------------------------

export function Disclosure({ variants, classNames, children, ...props }: DisclosureProps) {
  const {
    base: baseStyles,
    heading: headingStyles,
    panel: panelStyles,
  } = disclosureVariants(variants)

  const baseClassName = baseStyles({ className: classNames?.base })

  const childrenClassNames = {
    heading: headingStyles({ className: classNames?.heading }),
    panel: panelStyles({ className: classNames?.panel }),
  }

  return (
    <AriaDisclosure {...props} className={baseClassName}>
      {(renderProps) => children(renderProps, childrenClassNames)}
    </AriaDisclosure>
  )
}

export function DisclsoureHeading({ className, ...props }: DisclosureHeadingProps) {
  return <AriaHeading {...props} className={cn(className)} />
}

export function DisclosurePanel({ className, ...props }: DisclosurePanelProps) {
  return <AriaDisclosurePanel {...props} className={cn(className)} />
}
