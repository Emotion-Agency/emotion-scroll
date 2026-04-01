import {getDocument} from 'ssr-window'

import type {IOpts} from './types'

const document = getDocument()

/**
 * Custom ease-out curve with a smooth initial acceleration
 * and a long, gentle deceleration tail.
 * Feels more organic than standard exponential ease-out.
 */
const DEFAULT_EASING = (t: number): number => {
  const inv = 1 - t
  return 1 - inv * inv * inv * (1 - t * 0.6)
}

export type ResolvedOpts = Required<Omit<IOpts, 'prevent'>> & Pick<IOpts, 'prevent'>

export function resolveOpts(opts: IOpts = {}): ResolvedOpts {
  const orientation = opts.orientation ?? 'vertical'

  // When duration is set without easing, use default easing.
  // When easing is set without duration, use 1s duration.
  let duration = opts.duration ?? undefined
  let easing = opts.easing ?? undefined

  if (typeof duration === 'number' && typeof easing !== 'function') {
    easing = DEFAULT_EASING
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
    scrollbar: opts.scrollbar ?? true,
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
  }
}
