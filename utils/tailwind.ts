import { extendTailwindMerge } from "tailwind-merge"
import { ClassValue, VariantProps, createTV } from "tailwind-variants"
import { ClassNameOrFunction } from "./react-aria"

/**
 * Tailwind Merge configuration to be applied to
 * global `tv` function & utility `twm` functions below.
 */

const twMergeConfig: Parameters<typeof extendTailwindMerge>[0] = {
  extend: {
    theme: {
      spacing: [
        "space-xs",
        "space-sm",
        "space-md",
        "space-lg",
        "space-xl",
        "content-xs",
        "content-sm",
        "content-md",
        "content-lg",
        "content-xl",
        "box-xs",
        "box-sm",
        "box-md",
        "box-lg",
        "box-xl",
      ],
    },
  },
}

export const tv = createTV({ twMergeConfig })
export const twm = (...inputs: ClassValue[]) => extendTailwindMerge(twMergeConfig)(...inputs)

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Can't create a generic tv return type without passing
export type SlottedClassNames<T extends (...args: any[]) => any, P extends object | null = null> = {
  [K in keyof ReturnType<T>]: P extends null ? ClassValue : ClassNameOrFunction<P>
}

/** Re-export of TV types for usage in components */
export type { ClassValue, VariantProps }
