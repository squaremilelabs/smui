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

const TRANSITION_DURATION = 300
const TRANSITION_DURATION_CLASSNAME = "duration-300"

export type SMUIDialogRenderType = "modal" | "popover"

export type SMUIDialogVisualType<R extends SMUIDialogRenderType> = R extends "popover"
  ? "modal" | "popover" | "sheet"
  : "modal" | "sheet"

export type SMUIDialogResponsiveVisualType<R extends SMUIDialogRenderType> = {
  desktop: SMUIDialogVisualType<R>
  mobile: SMUIDialogVisualType<R>
}

export type SMUIDialogProps<R extends SMUIDialogRenderType> = {
  ariaLabel: string
  children?: ChildrenOrFunction<{
    overlayState: OverlayTriggerState | null
    resolvedVisualType: SMUIDialogVisualType<R>
  }>
  renderType: R
  visualType?: SMUIDialogVisualType<R> | SMUIDialogResponsiveVisualType<R>
  styles?: Omit<VariantProps<typeof smuiDialogStyles>, "visualType" | "isMounting">
  classNames?: Partial<
    SlottedClassNames<typeof smuiDialogStyles, { resolvedVisualType: SMUIDialogVisualType<R> }>
  >
} & (R extends "modal"
  ? Omit<ModalOverlayProps, "children" | "className">
  : Omit<PopoverProps, "children" | "className">)

export const SMUIDialogTrigger = DialogTrigger

export function SMUIDialog<R extends SMUIDialogRenderType>({
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
  let resolvedVisualType = renderType as SMUIDialogVisualType<R>
  if (typeof visualType === "string") {
    resolvedVisualType = visualType
  }
  if (typeof visualType === "object") {
    resolvedVisualType = isMobile ? visualType.mobile : visualType.desktop
  }

  // Prepare slotted styles
  const { underlay, overlay, content } = smuiDialogStyles({
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
              resolvedVisualType: resolvedVisualType as SMUIDialogVisualType<"modal">,
            })}
          </Dialog>
        </Modal>
      </ModalOverlay>
    )
  }

  // Render Popover
  if (renderType === "popover") {
    return (
      <Popover
        className={overlayStyles}
        offset={4}
        containerPadding={0}
        {...(props as PopoverProps)}
      >
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

function PopoverUnderlay({ className, isOpen }: { className: ClassValue; isOpen: boolean }) {
  if (!isOpen) return null
  if (typeof document === "undefined") return null
  return createPortal(<div id="popover-underlay" className={twm(className)} />, document.body)
}

export const smuiDialogStyles = tv({
  slots: {
    underlay: [
      "fixed inset-0 h-dvh w-dvw",
      "opacity-100",
      "data-entering:opacity-0 data-exiting:opacity-0 starting:opacity-0",
      "transition-opacity",
      TRANSITION_DURATION_CLASSNAME,
    ],
    overlay: ["transition-all", TRANSITION_DURATION_CLASSNAME],
    content: ["!outline-none", "transition-all flex h-full w-full flex-col"],
  },
  variants: {
    visualType: {
      modal: {
        underlay: [
          "p-space-xl flex flex-col items-center-safe",
          "bg-neutral-muted-bg/50 backdrop-blur-xs",
        ],
        overlay: ["max-h-full w-sm max-w-full"],
        content: ["bg-base-bg rounded-md border"],
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
        content: ["rounded-md border", "bg-base-bg"],
      },
      sheet: {
        underlay: ["bg-neutral-muted-bg/50 backdrop-blur-xs"],
        overlay: [
          "!fixed !top-auto !bottom-0 !left-0",
          "h-[50dvh] !max-h-[50dvh] w-dvw",
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
    size: {
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
      size: "xs",
      className: { overlay: ["w-xs"], content: ["rounded-xs"] },
    },
    {
      visualType: "modal",
      size: "sm",
      className: { overlay: ["w-sm"], content: ["rounded-sm"] },
    },
    {
      visualType: "modal",
      size: "md",
      className: { overlay: ["w-md"], content: ["rounded-md"] },
    },
    {
      visualType: "modal",
      size: "lg",
      className: { overlay: ["w-lg"], content: ["rounded-lg"] },
    },
    {
      visualType: "modal",
      size: "screen",
      className: {
        underlay: ["p-0"],
        overlay: ["h-dvh w-dvw"],
        content: ["rounded-none border-none"],
      },
    },
    {
      visualType: "popover",
      size: "trigger",
      className: { overlay: ["w-(--trigger-width)"] },
    },
    {
      visualType: "popover",
      size: "sm",
      className: { overlay: ["w-[150px]"] },
    },
    {
      visualType: "popover",
      size: "md",
      className: { overlay: ["w-[300px]"] },
    },
  ],
})
