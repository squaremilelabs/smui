"use client"

import React from "react"
import {
  Button as AriaButton,
  ButtonProps as AriaButtonProps,
  ButtonRenderProps as AriaButtonRenderProps,
  Group as AriaGroup,
  GroupProps as AriaGroupProps,
  GroupRenderProps as AriaGroupRenderProps,
} from "react-aria-components"
import { DeepPartial, tv, VariantProps, ClassValue, WithDefaultChildren } from "../utils"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/Button.html
https://react-spectrum.adobe.com/react-aria/Group.html

__Notes__
- `Button` has no special modifications from the RAC component.
- There is no `ButtonGroup` RAC. Uses the `Group` component.

__Composition__
- `<Button />` (slots.button)
- `<ButtonGroup />` (slots.group)

__Button__
```tsx
  <Button>
    {children || (renderProps) => children}
  </Button>
```

__ButtonGroup__
```tsx
  <ButtonGroup>
    {(renderProps, classNames) => (
      <>
        <Button className={classNames.button} />
        <Button className={classNames.button} />
        <Button className={classNames.button} />
      </>
    )}
  </ButtonGroup>
```

*/

// # Variants -------------------------------------------------------------------------------------

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
export const buttonVariants = tv({
  slots: {
    // <ButtonGroup />
    group: [],
    // <Button />
    button: [],
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

export type ButtonGroupClassNames = {
  // slots.group
  base: ClassValue
  // slots.button
  button: ClassValue
}

// # Props ----------------------------------------------------------------------------------------

export type ButtonRenderProps = AriaButtonRenderProps
export type ButtonProps = Omit<AriaButtonProps, "className"> & {
  variants?: ButtonVariantProps
  className?: ClassValue
}

export type ButtonGroupRenderProps = AriaGroupRenderProps
export type ButtonGroupProps = Omit<AriaGroupProps, "className" | "children"> & {
  variants?: ButtonVariantProps
  classNames?: DeepPartial<ButtonGroupClassNames>
  children: (
    renderProps: WithDefaultChildren<ButtonGroupRenderProps>,
    classNames: Omit<ButtonGroupClassNames, "base">
  ) => React.ReactNode
}

// # Components -----------------------------------------------------------------------------------

export function Button({ variants, className, ...props }: ButtonProps) {
  const { button: buttonStyles } = buttonVariants(variants)
  return <AriaButton {...props} className={buttonStyles({ className })} />
}

export function ButtonGroup({ variants, classNames, children, ...props }: ButtonGroupProps) {
  const { group: baseStyles, button: buttonStyles } = buttonVariants(variants)

  const baseClassName = baseStyles({ className: classNames?.base })

  const childrenClassNames = {
    button: buttonStyles({ className: classNames?.button }),
  }

  return (
    <AriaGroup {...props} className={baseClassName}>
      {(renderProps) => children(renderProps, childrenClassNames)}
    </AriaGroup>
  )
}
