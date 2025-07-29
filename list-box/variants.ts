import { ClassValue, tv, VariantProps } from "../utils"

export type ListBoxVariantProps = VariantProps<typeof listBoxVariants>
export const listBoxVariants = tv({
  slots: {
    // <ListBox />
    base: ["flex flex-col"],
    // <ListBoxItem />
    item: [],
    // <ListBoxSection />
    section: [],
    // <ListBoxSection /> ... <Header />
    sectionHeader: [],
  },
  variants: {
    variant: {
      "default": {},
      "nav-list": {
        base: ["flex flex-col gap-2"],
        item: [
          "group/list-box-item",
          "flex items-center gap-4 px-8 py-6",
          "font-medium text-canvas-3",
          "cursor-pointer",
          "hover:bg-canvas-1",
          "hover:text-canvas-5",
          "data-drop-target:outline-2",
          "data-selected:!bg-canvas-1",
          "data-selected:text-canvas-7",
          "data-selected:font-semibold",
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
