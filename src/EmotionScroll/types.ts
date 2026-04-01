export type Orientation = 'vertical' | 'horizontal'
export type GestureOrientation = 'vertical' | 'horizontal' | 'both'
export type EasingFunction = (time: number) => number
export type Scrolling = false | 'native' | 'smooth'

export type TRAF = {
  on: (cb: () => void) => void
  off: (cb: () => void) => void
}

/** What the Scrollbar receives — minimal contract for scroll control. */
export interface IScrollController {
  scrollTo(target: number, options?: ScrollToOptions): void
  readonly animatedScroll: number
  readonly limit: number
  readonly isScrolling: Scrolling
  readonly isStopped: boolean
  readonly isHorizontal: boolean
  readonly progress: number
}

/** Scroll state emitted to consumers via the 'scroll' event. */
export interface IEventArgs {
  position: number
  direction: 1 | -1 | 0
  velocity: number
  progress: number
}

/** Virtual scroll data emitted via the 'virtual-scroll' event. */
export interface IVirtualScrollData {
  deltaX: number
  deltaY: number
  event: WheelEvent | TouchEvent
}

/** Constructor options. */
export interface IOpts {
  /** Scroll wrapper element. Defaults to `document.documentElement`. */
  el?: HTMLElement
  /** Content element for dimension tracking. Defaults to `el`. */
  content?: HTMLElement
  /** Scroll axis. */
  orientation?: Orientation
  /** Which gesture axes to capture. Defaults to `'vertical'` (or `'both'` if horizontal). */
  gestureOrientation?: GestureOrientation
  /** Enable smooth wheel scrolling. */
  smoothWheel?: boolean
  /** Enable smooth touch scrolling with inertia. */
  syncTouch?: boolean
  /** Lerp factor for touch inertia animation. */
  syncTouchLerp?: number
  /** Exponent applied to touch velocity for inertia distance. */
  touchInertiaExponent?: number
  /** Lerp factor for scroll animation (0-1). Higher = faster. */
  lerp?: number
  /** Fixed animation duration in seconds (alternative to lerp). */
  duration?: number
  /** Easing function used with `duration`. */
  easing?: EasingFunction
  /** Touch input multiplier. */
  touchMultiplier?: number
  /** Wheel input multiplier. */
  wheelMultiplier?: number
  /** Max pixels per single wheel delta (prevents jarring jumps). */
  maxScrollDelta?: number
  /** Show custom scrollbar. */
  scrollbar?: boolean
  /** Viewport width below which smooth scroll is disabled. `null` = always enabled. */
  breakpoint?: number | null
  /** Enable keyboard navigation (arrows, Page Up/Down, Home/End, Tab). */
  useKeyboardSmooth?: boolean
  /** Scroll distance for arrow keys in pixels. */
  keyboardScrollStep?: number
  /** Start in disabled state. */
  disabled?: boolean
  /** Custom RAF instance with on/off interface. */
  raf?: TRAF | null
  /** Automatically attach to RAF loop. Set `false` to call `raf()` manually. */
  autoRaf?: boolean
  /** Auto-track size changes via ResizeObserver. */
  autoResize?: boolean
  /** Persist scroll position in localStorage across page reloads. */
  saveScrollPosition?: boolean
  /** Callback to prevent smooth scrolling on specific elements. Return `true` to prevent. */
  prevent?: (node: HTMLElement) => boolean
  /** Allow overscroll (native bounce) at scroll boundaries. */
  overscroll?: boolean
  /** Enable infinite (looping) scroll. */
  infinite?: boolean
  /** Use passive event listeners. */
  passive?: boolean
  /** Max inertia delta after touch release (prevents extreme jumps). */
  maxTouchInertia?: number
  /** Auto-intercept anchor link clicks and smooth-scroll to target. Pass `ScrollToOptions` to customize. */
  anchors?: boolean | ScrollToOptions
}

/** Options for `scrollTo()`. */
export interface ScrollToOptions {
  /** Additional offset in pixels. */
  offset?: number
  /** Jump instantly without animation. */
  immediate?: boolean
  /** Lock scroll at target until animation completes. */
  lock?: boolean
  /** Override animation duration. */
  duration?: number
  /** Override easing function. */
  easing?: EasingFunction
  /** Override lerp factor. */
  lerp?: number
  /** Callback when animation starts. */
  onStart?: (instance: unknown) => void
  /** Callback when animation completes. */
  onComplete?: (instance: unknown) => void
  /** Scroll even when stopped/locked. */
  force?: boolean
}

export type ScrollTarget = number | string | HTMLElement
