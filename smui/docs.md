# `@smui`
It's pronounced "smooey"

## Motivations

First, IMO, [React Aria](https://react-spectrum.adobe.com/react-aria/components.html) has the best Component API and is the superior choice for accessibility. Plus, it doesn't force styles on you.

I started dabbling with [HeroUI](https://www.heroui.com/) (fka NextUI) because it's built on **React Aria**, but adds a useful layer of styling structure with [Tailwind Variants](https://www.tailwind-variants.org/docs/introduction) which **React Aria** intentionally leaves behind. But it is still just another component library with opinionated styling and limited customizability.

Enter: [shadcn](https://ui.shadcn.com/). They are really onto something by developing a **code distribution platform**, not a **component library**. You don't install a package, you copy primitive code into your app and modify.

But a few remaining issues with **shadcn**:

1. It's built on top of [RadixUI](https://www.radix-ui.com/primitives), and again, I'm set on **React Aria**. (I did find [JollyUI](https://www.jollyui.dev/), which is an RAC alternative, but the next point is actually the more important issue).

2. It still comes with predetermined themes & styles. Each component has Tailwind classes written inline and relies on a set of decided theme tokens to be defined globally. To clarify, while the theme _values_ are indeed customizable, the theme _tokens_ (`primary`, `primary-foreground`, etc.) are not. This forces developers into that tokenized design system.

So I'm building a **shadcn**-like set of reusable components, but...

1. I'm using **React Aria** instead of **RadixUI**. I'm mainly exposing the full Component API, but in some scenarios, I've decided to narrow down or modify it's usage for a consistent DX.

2. I'm providing styling _structure_ with **Tailwind Variants**, but keeping `classNames` empty for a truly-unstyled starting point. Developers define their own theme tokens and fill in their own variants.

^ That's `@smui`.


__🚧 DOCS BELOW ARE WIP 🚧__
--

## Usage

### Initial Setup
1. Install core dependencies (there are only 3!). Note that some components have additional dependencies. Install as needed.

```bash
pnpm add react-aria-components tailwind-variants tailwind-merge
```

2. Copy the smui directory contents into your app (including the `utils` file). Or, pick and choose specific components – just like shadcn.

3. (Optional) Customize the [`twMergeConfig`](https://github.com/dcastil/tailwind-merge/blob/v3.3.1/docs/configuration.md) in `utils` if relevant.

### Component-Level Styling

Each component is _completely unstyled_ out of the box.

Each component file has a designated __Variants__ section intended to be customized with tailwind classes using [__Tailwind Variants__](https://www.tailwind-variants.org/).

Below is a starting example from `list-box`. Notice how each `slot` is labeled with a comment indicating which component it will be applied to. The actual slot keys should not be modified, only the values.

```tsx
// # Variants -------------------------------------------------------------------------------------

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
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

```

Below is an example of how you might populate the variants. This is just a minimum example. Refer to the __Tailwind Variants__ docs for complete usage.

```tsx
export const listBoxVariants = tv({
  /** 
   * ⚙️ Apply base level styles that would apply to all variants 
   * The actual slot keys should not be modified.
   * */
  slots: {
    // <ListBox />
    base: ["flex flex-col"],
    // <ListBoxItem />
    item: ["flex items-center"],
    // <ListBoxSection />
    section: ["flex flex-col"],
    // <ListBoxSection /> ... <Header />
    sectionHeader: ["font-bold"],
  },
  /** 
   * ⚙️ Define your variants 
   * A default variant is added as a placeholder to all components, but it does not need to be used. 
   * */
  variants: {
    variant: {
      default: {
        base: ["divide-neutral-300 border-neutral-300 border divide-y"],
        item: ["data-selected:bg-neutral-50"],
        sectionHeader: ["border-neutral-300"]
      },
      flat: {
        base: ["border-0 divide-0"],
        item: ["data-selected:border"],
        sectionHeader: ["border-b"]
      },
    },
    size: {
      sm: { ... },
      md: { ... },
      lg: { ... }
    },
  },
  /** ⚙️ Add compound variants if relevant  */
  compoundVariants: [],
  /** ⚙️ Customize default variants  */
  defaultVariants: {
    variant: "default",
    size: "md"
  },
})
```

### Application Usage

Each component takes a `variants` prop for your component-defined `tv` styles.

Theoretically, you would have captured all relevant styling at the component-level, but each slotted component also accepts an optional `classNames` prop with the anatomical structure in case you need to make app-level styling edits. (Unslotted components accept a plain `className` as expected).

See below example for how styles then get passed down with a `classNames` argument provided to a children function.

Beyond the above, each component exposes the corresponding __React Aria__ component props. Refer to the RAC docs for complete usage. As mentioned in __Motivations__ above, some components have slightly altered APIs for consistent DX. Refer to the __Usage__ section at the top of each file for key modifications.

```tsx
import { ListBox, ListBoxSection, ListBoxItem } from "{PATH_TO_SMUI_COMPONENTS}/list-box"

function App(){
  return (
    <ListBox
      variants={{ variant: "flat", size: "sm" }}
      classNames={{ 
        base: "bg-white",
        item: "data-focus-visible:border",
        section: { 
          base: "bg-blue-100", 
          header: "text-blue-500" 
        }
      }}
      items={sections}
      selectionMode="multiple"
    >
      {(section, classNames) => (
        <ListBoxSection
          id={section.id}
          items={section.items}
          classNames={classNames.section}
          header="HEADER"
        >
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.label} className={classNames.item}> 
              {({ isSelected }) => `${item.value}${isSelected ? " (Selected)" : ""}` } 
            </ListBoxItem>
          )}
        </ListBoxSection>
      )}
    </ListBox>
  )
}

```

## Library Development Instructions (For LLMs)

### Overview

You are tasked with implementing SMUI primitive components based on React Aria Components (RAC). Each component should follow the established patterns and structure found in existing primitives. **Always review 2-3 existing primitive files first** to understand the current coding style, structure, and patterns before implementing any new component.

### Pre-Implementation Steps

1. **Study Existing Primitives**: Before writing any code, examine existing primitive files (e.g., `select.tsx`, `button.tsx`, `list-box.tsx`, `modal.tsx`) to understand:
   - File structure and section organization
   - Import patterns and naming conventions
   - Type definition patterns
   - Component implementation patterns
   - How variants and classNames are handled
   At this step, you should also review the related RAC docs for those components to see how the developer has been applying them.

2. **Check for "Notes to LLM"**: Look for any special notes in the Usage section that provide component-specific guidance. These notes will be removed after implementation.

3. **Review RAC Documentation**: Reference the React Aria Components documentation link provided in the Usage section to understand the base component API and behavior.

### File Structure

Every primitive file must follow this exact structure with these section headers:

```tsx
"use client"

// Standard imports
// Component-specific imports

/** # Usage --------------------------------------------------------------------------------------- 
[Pre-written by developer - DO NOT MODIFY]
*/

// # Variants -------------------------------------------------------------------------------------
// [Follow the "Composition" subsection of # Usage]

// # ClassNames -----------------------------------------------------------------------------------
// [Follow the "Composition" subsection of # Usage]

// # Props ----------------------------------------------------------------------------------------

// # Components -----------------------------------------------------------------------------------
```

### Implementation Guidelines

#### 1. Imports
- Always start with `"use client"` directive
- Import React if needed: `import React from "react"`
- Import RAC components with consistent naming: `Component as AriaComponent, ComponentProps as AriaComponentProps, etc.`
- Import from utils: `{ cn, tv, VariantProps, ClassValue, DeepPartial, WithDefaultChildren }`
- Import icons from `lucide-react` if needed
- Import field variants if the component supports field integration

#### 2. Icons Section (Ignore)
- You may see some components have Icons sections. Ignore these for now and do not write them in.

#### 3. Variants Section
- Export variant props type: `export type [Component]VariantProps = VariantProps<typeof [component]Variants>`
- Create variants using `tv()` with empty arrays `[]` for slot values
- Use inline comments for each slot indicating which component it applies to (see how this is written in other files)
- Note that the user will write "Composition" notes in Usage. Always follow this and do not create your own.
- Follow the `defaultVariant` placeholder pattern – do not extend or modify beyond placeholders.

#### 4. ClassNames Section
- Define type for component classNames structure
- Use `ClassValue` for simple className properties
- Use nested objects for complex components with multiple sub-components
- Use inline comments for each key indicating which slot it applies to (see how this is written in other files).
- Note that the user will write "Composition" notes in Usage. Always follow this and do not create your own.

#### 5. Props Section
- Extend from RAC props, omitting `children` and `className` when using render prop pattern
- Add `variants` prop with component's variant type
- Add `classNames` prop using `DeepPartial<ClassNames>` for complex structures
- For render prop components: define children as function with `renderProps` and `classNames` parameters
- Use `WithDefaultChildren<>` for render props when appropriate
- Enforce required props that RAC makes optional when it makes sense (e.g., `id`, `items`)

#### 6. Components Section
- Extract styles using the variants function
- Build className using appropriate variant slots
- For render prop components: create `childrenClassNames` object to pass to children function
- Use `cn()` utility for className merging
- Maintain RAC component API while adding SMUI enhancements
- Handle field integration when `fieldVariants` are provided

### Key Patterns

#### Render Prop Pattern
Most complex components use render props to provide styling structure:

```tsx
export function Component({ variants, classNames, children, ...props }: ComponentProps) {
  const { slot1: styles1, slot2: styles2 } = componentVariants(variants)
  
  const baseClassName = styles1({ className: classNames?.base })
  
  const childrenClassNames = {
    subComponent: styles2({ className: classNames?.subComponent }),
  }

  return (
    <AriaComponent {...props} className={baseClassName}>
      {(renderProps) => children(renderProps, childrenClassNames)}
    </AriaComponent>
  )
}
```

#### Simple Component Pattern
For simpler components without complex internal structure:

```tsx
export function Component({ variants, className, ...props }: ComponentProps) {
  const { component: componentStyles } = componentVariants(variants)
  return <AriaComponent {...props} className={componentStyles({ className })} />
}
```

#### Field Integration Pattern
For components that can integrate with field components:

```tsx
// In variants, include field styles when fieldVariants provided
const baseClassName = cn(
  baseStyles({ className: classNames?.base }),
  fieldVariants && fieldBaseStyles({ className: classNames?.field?.base })
)

// Include field classNames in children classNames
const childrenClassNames = {
  // ... component classNames
  field: {
    label: fieldLabelStyles({ className: classNames?.field?.label }),
    inputBox: fieldInputBoxStyles({ className: classNames?.field?.inputBox }),
    description: fieldDescriptionStyles({ className: classNames?.field?.description }),
    error: fieldErrorStyles({ className: classNames?.field?.error }),
  },
}
```

### Common Mistakes to Avoid

1. **Don't modify the Usage section** - this is pre-written by the developer
2. **Don't use non-empty arrays in variant slots** - keep them as empty arrays `[]`
3. **Don't forget `"use client"` directive** for all component files
4. **Don't use `...existing code...` comments** in actual implementation
5. **Don't skip the consistent section headers** - they must match exactly
6. **Don't forget to handle field integration** when mentioned in Usage notes
7. **Don't create overly complex APIs** - follow the established patterns from existing primitives

### Handoff to Developer

The developer will be the one to test and modify. You do not need to waste time trying to test the code. You also don't need to provide a summary of what you've done. Your goal is to handoff to the developer as efficiently as possible.

