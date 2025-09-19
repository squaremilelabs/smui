/**
 * Dialog primitives for Square Mile UI, built on top of react-aria-components (RAC).
 *
 * This module exports a single generic component, `SMUIDialog`, plus
 * `SMUIDialogTrigger` (a re-export of RAC's `DialogTrigger`).
 *
 * What it does:
 * - Renders either a Modal or a Popover based on `renderType`.
 * - Resolves a visual presentation via `visualType` (string or responsive { desktop, mobile }).
 * - Provides tv()-driven slot classes and a strongly-typed `styles` variant API.
 * - Adds smooth enter/exit transitions and an underlay for popovers.
 * - Surfaces the parent `OverlayTriggerState` to children for imperative close/open if needed.
 *
 * Notable details:
 * - Use `styles` (not `variants`) to configure slot variants such as `width`,
 *   `underlayAppearance`, and visualType-specific options.
 * - Children may be a function receiving `{ overlayState, resolvedVisualType }`.
 * - For popovers, an underlay element is portaled to `document.body` when open.
 *
 * See the JSDoc of `SMUIDialog` and `SMUIDialogProps` for a full API and examples.
 */
"use client"

import { useContext, useEffect, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
  ModalOverlayProps,
  OverlayTriggerState,
  OverlayTriggerStateContext,
  Popover,
  PopoverProps,
} from "react-aria-components"
import { createPortal } from "react-dom"
import { useDebounceCallback } from "usehooks-ts"
import { ClassValue, SlottedClassNames, tv, twm, VariantProps } from "../utils/tailwind"
import { useIsMobile } from "../hooks/use-is-mobile"
import { ChildrenOrFunction, composeChildren, composeClassValue } from "../utils/react-aria"

/**
 * Transition duration in milliseconds for enter/exit animations.
 */
const TRANSITION_DURATION = 300
/**
 * Tailwind class used to keep transition duration in sync with `TRANSITION_DURATION`.
 */
const TRANSITION_DURATION_CLASSNAME = "duration-300"

/**
 * Determines how the dialog is instantiated in the DOM: as a Modal or a Popover.
 */
type DialogRenderType = "modal" | "popover"
/**
 * Visual presentation options for a given render type.
 *
 * - For renderType="popover": allows "modal" | "popover" | "sheet" (sheet useful on mobile)
 * - For renderType="modal": allows "modal" | "sheet"
 */
type DialogVisualType<R extends DialogRenderType> = R extends "popover"
  ? "modal" | "popover" | "sheet"
  : "modal" | "sheet"
/**
 * Responsive visual type.
 * Use to render differently on desktop vs mobile (e.g., modal on desktop, sheet on mobile).
 */
type DialogResponsiveVisualType<R extends DialogRenderType> = {
  desktop: DialogVisualType<R>
  mobile: DialogVisualType<R>
}

/**
 * # SMUIDialogProps
 *
 * @template R Render type: "modal" or "popover".
 * @property ariaLabel Accessible name for the dialog when no visible title is provided.
 * @property children Dialog contents. If a function is provided, it receives an object with:
 * - `overlayState`: the parent `OverlayTriggerState` (nullable), useful for `.close()`/`.open()`.
 * - `resolvedVisualType`: the runtime-resolved visual type for styling/branching.
 * @property renderType Whether to render as a RAC `Modal` or `Popover`.
 * @property visualType Controls the visual presentation. Can be a single value
 * or a responsive object with `{ desktop, mobile }` variants.
 * @property styles Tailwind Variants overrides for slots and variants (excluding `visualType` and
 * internal `isMounting`). Use this to set things like `width` (e.g. "sm"|"md"|"screen")
 * or `underlayAppearance`.
 * @property classNames Slot class overrides. Each slot can be a string or a function
 * of `{ resolvedVisualType }` returning a string.
 *
 * Extends:
 * - For `renderType="modal"`: RAC `ModalOverlayProps` (excluding `children` and `className`).
 * - For `renderType="popover"`: RAC `PopoverProps` (excluding `children` and `className`).
 */
export type SMUIDialogProps<R extends DialogRenderType> = {
  ariaLabel: string
  children?: ChildrenOrFunction<{
    overlayState: OverlayTriggerState | null
    resolvedVisualType: DialogVisualType<R>
  }>
  renderType: R
  visualType?: DialogVisualType<R> | DialogResponsiveVisualType<R>
  styles?: Omit<VariantProps<typeof dialogStyles>, "visualType" | "isMounting">
  classNames?: Partial<
    SlottedClassNames<typeof dialogStyles, { resolvedVisualType: DialogVisualType<R> }>
  >
} & (R extends "modal"
  ? Omit<ModalOverlayProps, "children" | "className">
  : Omit<PopoverProps, "children" | "className">)

/**
 * Re-export of react-aria-components `DialogTrigger` for convenience.
 * Use this to pair a trigger element with `SMUIDialog`.
 */
export const SMUIDialogTrigger = DialogTrigger

/**
 * Generic dialog component that renders a RAC Modal or Popover with SMUI styling,
 * transitions, and responsive visual control.
 *
 * Behavior:
 * - Uses `renderType` to select RAC's Modal or Popover under the hood.
 * - Resolves `visualType` from string or responsive object at runtime (desktop vs mobile).
 * - Applies tv-based slot classes with overrides via `styles` and `classNames`.
 * - When `children` is a function, injects `{ overlayState, resolvedVisualType }`.
 *
 * @template R Render type: "modal" or "popover".
 * @param props Component props; see `SMUIDialogProps`.
 * @returns A JSX element rendering a Dialog within Modal/Popover primitives.
 *
 * @example
 * // Modal example
 * <SMUIDialogTrigger>
 *   <button>Open</button>
 *   <SMUIDialog
 *     ariaLabel="Example modal"
 *     renderType="modal"
 *     visualType={{ desktop: "modal", mobile: "sheet" }}
 *   >
 *     {({ overlayState }) => (
 *       <div>
 *         <h2 className="p-4 text-lg font-bold">Title</h2>
 *         <button onClick={() => overlayState?.close()}>Close</button>
 *       </div>
 *     )}
 *   </SMUIDialog>
 * </SMUIDialogTrigger>
 *
 * @example
 * // Popover example
 * <SMUIDialogTrigger>
 *   <button>Open</button>
 *   <SMUIDialog
 *     ariaLabel="Example popover"
 *     renderType="popover"
 *     visualType="popover"
 *     styles={{ width: "trigger" }}
 *   >
 *     <div className="p-3">Hello</div>
 *   </SMUIDialog>
 * </SMUIDialogTrigger>
 */
export function SMUIDialog<R extends DialogRenderType>({
  children,
  ariaLabel,
  renderType,
  visualType,
  classNames,
  styles,
  ...props
}: SMUIDialogProps<R>) {
  const overlayState = useContext(OverlayTriggerStateContext)

  // Delayed mounted state for transitioning style & behavior purposes
  const isOpen = props.isOpen ?? !!overlayState?.isOpen
  const [isMounted, setIsMounted] = useState(false)
  const delayedMount = useDebounceCallback(() => setIsMounted(true), TRANSITION_DURATION)
  useEffect(() => {
    if (isOpen) delayedMount()
    else setIsMounted(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
  const isMounting = isOpen && !isMounted

  // Resolve the visual type
  const isMobile = useIsMobile()
  let resolvedVisualType = renderType as DialogVisualType<R>
  if (typeof visualType === "string") {
    resolvedVisualType = visualType
  }
  if (typeof visualType === "object") {
    resolvedVisualType = isMobile ? visualType.mobile : visualType.desktop
  }

  // Prepare slotted styles
  const { underlay, overlay, content } = dialogStyles({
    ...styles,
    isMounting,
    visualType: resolvedVisualType,
  })
  const underlayStyles = underlay({
    className: composeClassValue(classNames?.underlay, { resolvedVisualType }),
  })
  const overlayStyles = overlay({
    className: composeClassValue(classNames?.overlay, { resolvedVisualType }),
  })
  const contentStyles = content({
    className: composeClassValue(classNames?.content, { resolvedVisualType }),
  })

  // Render Modal
  if (renderType === "modal") {
    return (
      <ModalOverlay className={underlayStyles} {...(props as ModalOverlayProps)}>
        <Modal className={overlayStyles}>
          <Dialog aria-label={ariaLabel} className={contentStyles}>
            {composeChildren(children, {
              overlayState,
              resolvedVisualType: resolvedVisualType as DialogVisualType<"modal">,
            })}
          </Dialog>
        </Modal>
      </ModalOverlay>
    )
  }

  // Render Popover
  if (renderType === "popover") {
    return (
      <Popover className={overlayStyles} offset={4} {...(props as PopoverProps)}>
        {/* Though this is nested inside of Popover, it renders as a portal behind the overlay */}
        <PopoverUnderlay className={underlayStyles} isOpen={isOpen} />
        <Dialog aria-label={ariaLabel} className={contentStyles}>
          {composeChildren(children, {
            overlayState,
            resolvedVisualType,
          })}
        </Dialog>
      </Popover>
    )
  }
}

/**
 * Underlay element for popovers.
 *
 * RAC's `Popover` does not provide an underlay node by default. This helper renders
 * a full-screen underlay into `document.body` via a React portal whenever the parent
 * `OverlayTriggerState` is open. It uses the same tv slot styling as modal underlays.
 */
function PopoverUnderlay({ className, isOpen }: { className: ClassValue; isOpen: boolean }) {
  if (!isOpen) return null
  if (typeof document === "undefined") return null
  return createPortal(<div id="popover-underlay" className={twm(className)} />, document.body)
}

/**
 * Tailwind Variants configuration for dialog slots and variants.
 *
 * Slots:
 * - underlay: the full-screen backdrop or click-catcher under a popover
 * - overlay: the positioned container that holds the content (modal sheet/popover panel)
 * - content: the focusable dialog content itself
 *
 * Variants:
 * - visualType: modal | popover | sheet — controls overall presentation
 * - underlayAppearance: transparent | blur | dim — visual styling of the underlay
 * - modalWidth: xs | sm | md | lg | screen — size presets for modal presentation
 * - matchTriggerWidth: when true for popovers, matches the trigger width
 */
const dialogStyles = tv({
  slots: {
    underlay: [
      "fixed inset-0 h-dvh w-dvw",
      "opacity-100",
      "data-entering:opacity-0 data-exiting:opacity-0 starting:opacity-0",
      "transition-opacity",
      TRANSITION_DURATION_CLASSNAME,
    ],
    overlay: ["transition-all", TRANSITION_DURATION_CLASSNAME],
    content: ["!outline-none", "flex h-full w-full flex-col"],
  },
  variants: {
    visualType: {
      modal: {
        underlay: [
          "p-space-xl flex flex-col items-center-safe",
          "bg-neutral-muted-bg/50 backdrop-blur-xs",
        ],
        overlay: ["max-h-full w-sm max-w-full"],
        content: ["bg-base-bg rounded-sm border-2"],
      },
      popover: {
        underlay: [],
        overlay: [
          "w-[300px]",
          "origin-(--trigger-anchor-point)",
          "data-entering:opacity-0 data-exiting:opacity-0",
          "data-[placement=bottom]:data-entering:-translate-y-4 data-[placement=bottom]:data-exiting:-translate-y-4",
          "data-[placement=top]:data-entering:translate-y-4 data-[placement=top]:data-exiting:translate-y-4",
          "data-[placement=right]:data-entering:-translate-x-4 data-[placement=right]:data-exiting:-translate-x-4",
          "data-[placement=left]:data-entering:translate-x-4 data-[placement=left]:data-exiting:translate-x-4",
        ],
        content: ["rounded-sm border-2", "bg-base-bg/30 backdrop-blur-sm"],
      },
      sheet: {
        underlay: ["bg-neutral-muted-bg/50 backdrop-blur-xs"],
        overlay: [
          "!fixed !top-auto !bottom-0 !left-0 h-[50dvh] !max-h-[50dvh] w-dvw",
          "data-entering:h-0 data-exiting:h-0",
          "data-entering:overflow-hidden data-exiting:overflow-hidden",
        ],
        content: ["bg-base-bg rounded-t-lg border"],
      },
    },
    underlayAppearance: {
      transparent: {
        underlay: ["!bg-transparent !backdrop-blur-none"],
      },
      blur: {
        underlay: ["bg-neutral-muted-bg/50 backdrop-blur-xs"],
      },
      dim: {
        underlay: ["bg-neutral-bg/50"],
      },
    },
    width: {
      xs: {},
      sm: {},
      md: {},
      lg: {},
      screen: {},
      trigger: {},
    },
    isMounting: {
      true: {
        content: ["pointer-events-none [&_*]:pointer-events-none"],
      },
    },
  },
  compoundVariants: [
    // Modal Sizes
    {
      visualType: "modal",
      width: "xs",
      className: { overlay: ["w-xs"], content: ["rounded-xs"] },
    },
    {
      visualType: "modal",
      width: "sm",
      className: { overlay: ["w-sm"], content: ["rounded-sm"] },
    },
    {
      visualType: "modal",
      width: "md",
      className: { overlay: ["w-md"], content: ["rounded-md"] },
    },
    {
      visualType: "modal",
      width: "lg",
      className: { overlay: ["w-lg"], content: ["rounded-lg"] },
    },
    {
      visualType: "modal",
      width: "screen",
      className: {
        underlay: ["p-0"],
        overlay: ["h-dvh w-dvw"],
        content: ["rounded-none border-none"],
      },
    },
    {
      visualType: "popover",
      width: "trigger",
      className: { overlay: ["w-(--trigger-width)"] },
    },
    {
      visualType: "popover",
      width: "sm",
      className: { overlay: ["w-[150px]"] },
    },
    {
      visualType: "popover",
      width: "md",
      className: { overlay: ["w-[300px]"] },
    },
  ],
})
