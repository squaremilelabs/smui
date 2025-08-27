import { ClassValue, tv, VariantProps } from "../utils"

export type ListBoxVariantProps = VariantProps<typeof listBoxVariants>
export const listBoxVariants = tv({
  slots: {
    // <ListBox />
    base: [],
    // <ListBoxItem />
    item: [],
    // <ListBoxSection />
    section: [],
    // <ListBoxSection /> ... <Header />
    sectionHeader: [],
  },
  variants: {
    variant: {
      default: {},
      flat: {
        base: ["flex flex-col gap-2"],
        item: [
          "group/list-box-item",
          "flex items-center gap-4 px-8 py-6",
          "cursor-pointer",
          "rounded-sm",
          "hover:bg-neutral-muted-bg/50",
          "data-drop-target:outline-2",
          "data-selected:bg-neutral-muted-bg",
        ],
      },
      select: {
        base: ["max-h-300 overflow-auto"],
        item: [
          "flex items-center gap-8 text-sm",
          "not-data-disabled:cursor-pointer not-data-disabled:hover:bg-neutral-muted-bg",
          "px-8 py-4 rounded-sm text-neutral-text",
          "data-selected:text-base-text data-selected:font-medium data-selected:border",
        ],
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export type ListBoxClassNames = {
  // slots.base
  base: ClassValue
  // slots.item
  item: ClassValue
  section: {
    // slots.section
    base: ClassValue
    // slots.sectionHeader
    header: ClassValue
  }
}
