"use client"

import React from "react"
import {
  Tabs as AriaTabs,
  TabsProps as AriaTabsProps,
  TabList as AriaTabList,
  Tab as AriaTab,
  TabProps as AriaTabProps,
  TabRenderProps as AriaTabRenderProps,
} from "react-aria-components"
import { cn, DeepPartial, ClassValue, tv, VariantProps, WithDefaultChildren } from "../utils"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/Tabs.html

__Notes__
- Does NOT implement the `TabPanel` component. (Just hook it up to state and render content)
- Reduces the RAC Composition (`Tabs`, `TabList`) to a single component, `Tabs`

__Composition__
- `<Tabs />` (slots.base)
- `<Tabs />` ... `<AriaTabList />` (slots.tabList - INTERNAL)
- `<Tab />` (slots.tab)

```tsx
  <Tabs items={items}>
    {(item, classNames) => (
      <Tab 
        id={item.id} 
        textValue={item.name}
        className={classNames.tab}
      >
        {children || (renderProps) => children}
      </Tab>
    )}
  </Tabs>
```

*/

// # Variants -------------------------------------------------------------------------------------

export type TabsVariantProps = VariantProps<typeof tabsVariants>
export const tabsVariants = tv({
  slots: {
    // <Tabs />
    base: [],
    // <Tabs /> ... <AriaTabList />
    tabList: [],
    // <Tab />
    tab: [],
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

export type TabsClassNames = {
  // slots.base
  base: ClassValue
  // slots.tabList
  tabList: ClassValue
  // slots.tab
  tab: ClassValue
}

// # Props ----------------------------------------------------------------------------------------

export type TabsRenderProps = WithDefaultChildren<object>
export type TabsProps<T extends object> = Omit<AriaTabsProps, "children" | "className"> & {
  variants?: TabsVariantProps
  classNames?: DeepPartial<TabsClassNames>
  items: Array<T>
  children: (item: T, classNames: Omit<TabsClassNames, "base" | "tabList">) => React.ReactNode
}

export type TabRenderProps = WithDefaultChildren<AriaTabRenderProps>
export type TabProps = Omit<AriaTabProps, "className"> & {
  id: string // enforced
  textValue: string // enforced
  className: ClassValue
}

// # Components -----------------------------------------------------------------------------------

export function Tabs<T extends object>({
  variants,
  classNames,
  children,
  items,
  ...props
}: TabsProps<T>) {
  const { base: baseStyles, tabList: tabListStyles, tab: tabStyles } = tabsVariants(variants)

  const baseClassName = baseStyles({ className: classNames?.base })
  const tabListClassName = tabListStyles({ className: classNames?.tabList })

  const childrenClassNames = {
    tab: tabStyles({ className: classNames?.tab }),
  }

  return (
    <AriaTabs {...props} className={baseClassName}>
      <AriaTabList className={tabListClassName} items={items}>
        {(item) => children(item, childrenClassNames)}
      </AriaTabList>
    </AriaTabs>
  )
}

export function Tab({ className, ...props }: TabProps) {
  return <AriaTab {...props} className={cn(className)} />
}
