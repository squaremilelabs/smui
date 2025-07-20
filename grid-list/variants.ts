import { tv, ClassValue, VariantProps } from "../utils"

export type GridListVariantProps = VariantProps<typeof gridListVariants>
export const gridListVariants = tv({
  slots: {
    // <GridList />
    base: [],
    // <GridListItem />
    item: [],
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

export type GridListClassNames = {
  // slots.base
  base: ClassValue
  // slots.item
  item: ClassValue
}
