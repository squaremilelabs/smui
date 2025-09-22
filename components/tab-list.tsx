import { Tab, TabList, TabListProps, TabRenderProps, Tabs, TabsProps } from "react-aria-components"
import { SlottedClassNames, tv, VariantProps } from "../utils/tailwind"
import { WithDefaultChildren } from "../utils/react-aria"

export type SMUITabListItem<I extends object = object> = {
  id: string
  label: string
  data?: I
}

export type SMUITabListProps<I extends object = object> = {
  ariaLabel: string
  items: SMUITabListItem<I>[]
  dependencies?: TabListProps<I>["dependencies"]
  renderItemContent?: (
    item: SMUITabListItem<I>,
    renderProps: WithDefaultChildren<TabRenderProps>
  ) => React.ReactNode
  classNames?: Partial<SlottedClassNames<typeof smuiTabListStyles>>
  styles?: Partial<VariantProps<typeof smuiTabListStyles>>
} & Omit<TabsProps, "children" | "className">

export function SMUITabList<I extends object = object>({
  ariaLabel,
  items,
  dependencies,
  renderItemContent,
  classNames,
  styles,
  ...props
}: SMUITabListProps<I>) {
  const { base, list, tab } = smuiTabListStyles(styles)

  const baseStyles = base({ className: classNames?.base })
  const listStyles = list({ className: classNames?.list })
  const tabStyles = tab({ className: classNames?.tab })

  return (
    <Tabs aria-label={ariaLabel} className={baseStyles} {...props}>
      <TabList items={items} dependencies={dependencies} className={listStyles}>
        {(item) => {
          return (
            <Tab id={item.id} aria-label={item.label} className={tabStyles}>
              {(renderProps) => {
                return (
                  <>
                    {renderItemContent
                      ? renderItemContent(item, { ...renderProps, defaultChildren: item.label })
                      : item.label}
                  </>
                )
              }}
            </Tab>
          )
        }}
      </TabList>
    </Tabs>
  )
}

export const smuiTabListStyles = tv({
  slots: {
    base: "",
    list: "",
    tab: "",
  },
})
