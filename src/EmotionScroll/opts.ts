import {getDocument} from 'ssr-window'

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

export function resolveOpts(opts: IOpts = {}): ResolvedOpts {
  const orientation = opts.orientation ?? 'vertical'

  // When duration is set without easing, use default easing.
  // When easing is set without duration, use 1s duration.
  let duration = opts.duration ?? undefined
  let easing: EasingFunction | undefined = resolveEasing(opts.easing)

  if (typeof duration === 'number' && typeof easing !== 'function') {
    easing = smoothEasing
  } else if (typeof easing === 'function' && typeof duration !== 'number') {
    duration = 1.5
  }

  return {
    el: opts.el ?? document.documentElement,
    content: opts.content ?? opts.el ?? document.documentElement,
    orientation,
    gestureOrientation:
      opts.gestureOrientation ??
      (orientation === 'horizontal' ? 'both' : 'vertical'),
    smoothWheel: opts.smoothWheel ?? true,
    syncTouch: opts.syncTouch ?? false,
    syncTouchLerp: opts.syncTouchLerp ?? 0.075,
    touchInertiaExponent: opts.touchInertiaExponent ?? 1.7,
    lerp: opts.lerp ?? 0.1,
    duration,
    easing,
    touchMultiplier: opts.touchMultiplier ?? 1,
    wheelMultiplier: opts.wheelMultiplier ?? 1,
    maxScrollDelta: opts.maxScrollDelta ?? 120,
    scrollbar: resolveScrollbarOpts(opts.scrollbar),
    breakpoint: opts.breakpoint ?? null,
    useKeyboardSmooth: opts.useKeyboardSmooth ?? true,
    keyboardScrollStep: opts.keyboardScrollStep ?? 120,
    disabled: opts.disabled ?? false,
    raf: opts.raf ?? null,
    autoRaf: opts.autoRaf ?? true,
    autoResize: opts.autoResize ?? true,
    saveScrollPosition: opts.saveScrollPosition ?? false,
    prevent: opts.prevent,
    overscroll: opts.overscroll ?? true,
    infinite: opts.infinite ?? false,
    passive: opts.passive ?? false,
    maxTouchInertia: opts.maxTouchInertia ?? 1000,
    anchors: opts.anchors,
  }
}
