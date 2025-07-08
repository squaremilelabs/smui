"use client"

import React from "react"
import {
  MenuTrigger as AriaMenuTrigger,
  MenuTriggerProps as AriaMenuTriggerProps,
  Menu as AriaMenu,
  MenuProps as AriaMenuProps,
  MenuItem as AriaMenuItem,
  MenuItemProps as AriaMenuItemProps,
  MenuItemRenderProps as AriaMenuItemRenderProps,
  MenuSection as AriaMenuSection,
  MenuSectionProps as AriaMenuSectionProps,
  Header as AriaHeader,
  Collection as AriaCollection,
  Popover as AriaPopover,
  PopoverProps as AriaPopoverProps,
  Key,
} from "react-aria-components"
import { cn, DeepPartial, WithDefaultChildren, ClassValue, tv, VariantProps } from "../utils"
import { PopoverVariantProps, popoverVariants } from "./popover"

/** # Usage ---------------------------------------------------------------------------------------

https://react-spectrum.adobe.com/react-aria/Menu.html

__Notes__
- Enforces dynamic items (no static)
- For sections, passes `Header` as a prop instead of an expected child
- Inherits `popoverVariants` for the `MenuPopover`
- Reduces the RAC composition (`MenuPopover` and `Menu`) to a single component (`Menu`)
- Does not support Submenus (yet)

__Composition__
- `<MenuTrigger />` (unstyled trigger component)
- `<Menu />` (slots.base)
- `<Menu />` ... `<AriaPopover />` (slots.popover - INTERNAL, inherits `popoverVariants`)
- `<MenuItem />` (slots.item)
- `<MenuSection />` (slots.section)
- `<MenuSection />` ... `<AriaHeader />` (slots.sectionHeader - INTERNAL)

__Basic__
```tsx
  <MenuTrigger>
    <Button>Menu</Button>
    <Menu 
      items={items} 
      variants={{} as MenuVariantProps} 
    >
      {(item, classNames) => (
        <MenuItem
          id={item.id}
          textValue={item.name}
          className={classNames.item}
        >
          {children || (renderProps) => children}
        </MenuItem>
      )}
    </Menu>
  </MenuTrigger>
```

__With Sections__
```tsx
  <MenuTrigger>
    <Button>Menu</Button>
    <Menu items={sections}>
      {(section, classNames) => (
        <MenuSection
          id={section.id}
          items={section.items}
          classNames={classNames.section}
          header={(<p>{section.name}</p>)}
        >
          {(item) => <MenuItem />} // Shortened for brevity. See basic usage example above.
        </MenuSection>
      )}
    </Menu>
  </MenuTrigger>
```

```

*/

// # Variants -------------------------------------------------------------------------------------

type BaseMenuVariantProps = VariantProps<typeof menuVariants>
export type MenuVariantProps = BaseMenuVariantProps & { popover?: PopoverVariantProps }

export const menuVariants = tv({
  slots: {
    // <Menu />
    base: [],
    // <MenuItem />
    item: [],
    // <MenuSection />
    section: [],
    // <MenuSection /> ... <AriaHeader />
    sectionHeader: [],
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

export type MenuClassNames = {
  // slots.base
  base: ClassValue
  // passed to AriaPopover after poopverVariants are applied
  popover: ClassValue
  // slots.item
  item: ClassValue
  section: {
    // slots.section
    base: ClassValue
    // slots.sectionHeader
    header: ClassValue
  }
}

// # Props ----------------------------------------------------------------------------------------

export type MenuTriggerProps = AriaMenuTriggerProps

export type MenuPopoverProps = Omit<AriaPopoverProps, "className"> & {
  variants?: PopoverVariantProps
  className?: ClassValue
}

export type MenuProps<T extends object> = Omit<
  AriaMenuProps<T>,
  "children" | "className" | "items"
> & {
  variants?: MenuVariantProps
  classNames?: DeepPartial<MenuClassNames>
  items: Array<T> // enforced
  children: (item: T, classNames: Omit<MenuClassNames, "base">) => React.ReactNode
}

export type MenuItemRenderProps = WithDefaultChildren<AriaMenuItemRenderProps>
export type MenuItemProps = Omit<AriaMenuItemProps, "id" | "textValue" | "className"> & {
  id: Key // enforced
  textValue: string // enforced
  className: ClassValue
}

export type MenuSectionProps<T extends object> = Omit<
  AriaMenuSectionProps<T>,
  "id" | "items" | "children" | "className"
> & {
  id: Key // enforced
  items: Array<T> // enforced
  classNames: MenuClassNames["section"]
  header?: React.ReactNode
  children: (item: T) => React.ReactNode
}

// # Components -----------------------------------------------------------------------------------

export function MenuTrigger({ children, ...props }: MenuTriggerProps) {
  return <AriaMenuTrigger {...props}>{children}</AriaMenuTrigger>
}

export function Menu<T extends object>({
  variants,
  classNames,
  items,
  children,
  ...props
}: MenuProps<T>) {
  const {
    base: baseStyles,
    item: itemStyles,
    section: sectionStyles,
    sectionHeader: sectionHeaderStyles,
  } = menuVariants(variants)

  const baseClassName = baseStyles({ className: classNames?.base })

  const { popover: popoverStyles } = popoverVariants(variants?.popover)
  const popoverClassName = popoverStyles({ className: classNames?.popover })

  const childrenClassNames = {
    popover: popoverClassName,
    item: itemStyles({ className: classNames?.item }),
    section: {
      base: sectionStyles({ className: classNames?.section?.base }),
      header: sectionHeaderStyles({ className: classNames?.section?.header }),
    },
  }

  return (
    <AriaPopover className={popoverClassName}>
      <AriaMenu {...props} items={items} className={baseClassName}>
        {(item) => children(item, childrenClassNames)}
      </AriaMenu>
    </AriaPopover>
  )
}

export function MenuItem({ className, ...props }: MenuItemProps) {
  return <AriaMenuItem {...props} className={cn(className)} />
}

export function MenuSection<T extends object>({
  id,
  classNames,
  items,
  header,
  children,
  ...props
}: MenuSectionProps<T>) {
  return (
    <AriaMenuSection {...props} id={id} className={cn(classNames?.base)}>
      {header && <AriaHeader className={cn(classNames?.header)}>{header}</AriaHeader>}
      <AriaCollection items={items}>{children}</AriaCollection>
    </AriaMenuSection>
  )
}
