import {getDocument} from 'ssr-window'

import {
  DEFAULT_EASED_DURATION_SEC,
  DEFAULT_KEYBOARD_STEP_PX,
  DEFAULT_LERP,
  DEFAULT_MAX_SCROLL_DELTA,
  DEFAULT_MAX_TOUCH_INERTIA,
  DEFAULT_SYNC_TOUCH_LERP,
  DEFAULT_TOUCH_INERTIA_EXPONENT,
  DEFAULT_TOUCH_MULTIPLIER,
  DEFAULT_WHEEL_MULTIPLIER,
} from './constants'
import {resolveEasing, smoothEasing} from './easings'
import type {EasingFunction, IOpts, IScrollbarOpts} from './types'

const document = getDocument()

export type ResolvedScrollbarOpts = Required<IScrollbarOpts>

export type ResolvedOpts =
  Required<Omit<IOpts, 'prevent' | 'anchors' | 'scrollbar' | 'easing'>> &
  Pick<IOpts, 'prevent' | 'anchors'> &
  {scrollbar: ResolvedScrollbarOpts; easing: EasingFunction | undefined}

function resolveScrollbarOpts(
  input: IOpts['scrollbar']
): ResolvedScrollbarOpts {
  if (typeof input === 'object' && input !== null) {
    return {
      enabled: input.enabled ?? true,
      isSmooth: input.isSmooth ?? true,
    }
  }
  return {
    enabled: input as boolean | undefined ?? true,
    isSmooth: true,
  }
}

function resolveContent(content: IOpts['content'], el: HTMLElement): HTMLElement {
  if (content) return content

  // Window scroll: the document element is both viewport and content.
  if (el === document.documentElement) return el

  // Element scroll: the `el` is a fixed-height overflow container, so a
  // ResizeObserver on it never fires when the inner content grows. Observe
  // the inner wrapper that actually changes height instead. Falls back to
  // `el` for childless containers; pass `content` explicitly for layouts
  // with multiple top-level children.
  return (el.firstElementChild as HTMLElement | null) ?? el
}

export function resolveOpts(opts: IOpts = {}): ResolvedOpts {
  const orientation = opts.orientation ?? 'vertical'

  // `duration` and `easing` behave as a pair:
  //   - duration only  -> use smoothEasing
  //   - easing only    -> use DEFAULT_EASED_DURATION_SEC
  //   - neither        -> lerp-based path (both remain undefined)
  let duration = opts.duration ?? undefined
  let easing: EasingFunction | undefined = resolveEasing(opts.easing)

  if (typeof duration === 'number' && typeof easing !== 'function') {
    easing = smoothEasing
  } else if (typeof easing === 'function' && typeof duration !== 'number') {
    duration = DEFAULT_EASED_DURATION_SEC
  }

  const el = opts.el ?? document.documentElement

  return {
    el,
    content: resolveContent(opts.content, el),
    orientation,
    gestureOrientation:
      opts.gestureOrientation ??
      (orientation === 'horizontal' ? 'both' : 'vertical'),
    smoothWheel: opts.smoothWheel ?? true,
    syncTouch: opts.syncTouch ?? false,
    syncTouchLerp: opts.syncTouchLerp ?? DEFAULT_SYNC_TOUCH_LERP,
    touchInertiaExponent: opts.touchInertiaExponent ?? DEFAULT_TOUCH_INERTIA_EXPONENT,
    lerp: opts.lerp ?? DEFAULT_LERP,
    duration,
    easing,
    touchMultiplier: opts.touchMultiplier ?? DEFAULT_TOUCH_MULTIPLIER,
    wheelMultiplier: opts.wheelMultiplier ?? DEFAULT_WHEEL_MULTIPLIER,
    maxScrollDelta: opts.maxScrollDelta ?? DEFAULT_MAX_SCROLL_DELTA,
    scrollbar: resolveScrollbarOpts(opts.scrollbar),
    breakpoint: opts.breakpoint ?? null,
    useKeyboardSmooth: opts.useKeyboardSmooth ?? true,
    keyboardScrollStep: opts.keyboardScrollStep ?? DEFAULT_KEYBOARD_STEP_PX,
    disabled: opts.disabled ?? false,
    raf: opts.raf ?? null,
    autoRaf: opts.autoRaf ?? true,
    autoResize: opts.autoResize ?? true,
    saveScrollPosition: opts.saveScrollPosition ?? false,
    prevent: opts.prevent,
    overscroll: opts.overscroll ?? true,
    infinite: opts.infinite ?? false,
    passive: opts.passive ?? false,
    maxTouchInertia: opts.maxTouchInertia ?? DEFAULT_MAX_TOUCH_INERTIA,
    anchors: opts.anchors,
  }
}
