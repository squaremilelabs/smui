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
import { cn, DeepPartial, ClassValue, WithDefaultChildren } from "../../utils"
import { TabsVariantProps, TabsClassNames, tabsVariants } from "./variants"

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
