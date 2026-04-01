import VirtualScroll from 'virtual-scroll'
import {clamp} from '@emotionagency/utils'

import {getDocument} from 'ssr-window'
import type {ResolvedOpts} from '../opts'
import type {ScrollToOptions, Scrolling} from '../types'

const document = getDocument()

export interface VirtualScrollHost {
  readonly opts: ResolvedOpts
  animatedScroll: number
  targetScroll: number
  velocity: number
  readonly limit: number
  readonly isHorizontal: boolean
  readonly isStopped: boolean
  readonly isLocked: boolean
  isScrolling: Scrolling
  isTouching: boolean
  scrollTo(target: number, options?: ScrollToOptions): void
  emitVirtualScroll(data: {
    deltaX: number
    deltaY: number
    event: Event
  }): void
  stopAnimation(): void
}

function shouldPreventScroll(
  node: HTMLElement | null,
  rootEl: HTMLElement,
  opts: ResolvedOpts,
): boolean {
  while (node && node !== rootEl) {
    if (node.hasAttribute?.('data-scroll-ignore')) {
      return true
    }
    if (typeof opts.prevent === 'function' && opts.prevent(node)) {
      return true
    }
    node = node.parentElement
  }
  return false
}

export class VirtualScrollHandler {
  private vs: typeof VirtualScroll.prototype | null = null

  constructor(private readonly host: VirtualScrollHost) {}

  setup(): void {
    const {opts} = this.host
    this.vs = new VirtualScroll({
      el: opts.el === document.documentElement ? undefined : opts.el,
      touchMultiplier: opts.touchMultiplier,
      passive: opts.passive,
      useKeyboard: false,
    })

    this.vs.on(this.onVirtualScroll)
  }

  destroy(): void {
    this.vs?.destroy()
    this.vs = null
  }

  private readonly onVirtualScroll = (e: {
    deltaX: number
    deltaY: number
    originalEvent: WheelEvent | TouchEvent
  }): void => {
    const {host} = this
    const {opts} = host
    const event = e.originalEvent
    const isTouch = event.type.includes('touch')
    const isWheel = event.type.includes('wheel')

    if ('ctrlKey' in event && event.ctrlKey) return

    host.isTouching = event.type === 'touchstart' || event.type === 'touchmove'

    if (shouldPreventScroll(event.target as HTMLElement, opts.el, opts)) return
    if (host.isStopped || host.isLocked) return

    const isSmooth =
      (opts.syncTouch && isTouch) || (opts.smoothWheel && isWheel)

    if (!isSmooth) {
      host.isScrolling = 'native'
      host.stopAnimation()
      return
    }

    host.emitVirtualScroll({deltaX: e.deltaX, deltaY: e.deltaY, event})

    let delta: number
    if (opts.gestureOrientation === 'both') {
      delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
    } else if (opts.gestureOrientation === 'horizontal') {
      delta = e.deltaX
    } else {
      delta = e.deltaY
    }

    if (delta === 0) return

    delta = -delta

    if (isWheel) {
      delta *= opts.wheelMultiplier
    }

    delta = clamp(delta, -opts.maxScrollDelta, opts.maxScrollDelta)

    const isTouchEnd = isTouch && event.type === 'touchend'
    if (isTouchEnd && opts.syncTouch) {
      const inertia =
        Math.sign(host.velocity) *
        Math.abs(host.velocity) ** opts.touchInertiaExponent

      delta = clamp(inertia, -opts.maxTouchInertia, opts.maxTouchInertia)
    }

    if (!opts.overscroll || opts.infinite || this.isWithinBounds(delta)) {
      if ('cancelable' in event && event.cancelable) {
        event.preventDefault()
      }
    }

    const isSyncTouch = isTouch && opts.syncTouch
    const hasTouchInertia = isSyncTouch && isTouchEnd

    host.scrollTo(host.targetScroll + delta, {
      ...(isSyncTouch
        ? {lerp: hasTouchInertia ? opts.syncTouchLerp : 1}
        : {lerp: opts.lerp, duration: opts.duration, easing: opts.easing}),
    })
  }

  private isWithinBounds(delta: number): boolean {
    const {animatedScroll, limit} = this.host
    if (limit <= 0) return false
    return (
      (animatedScroll > 0 && animatedScroll < limit) ||
      (animatedScroll === 0 && delta > 0) ||
      (animatedScroll === limit && delta < 0)
    )
  }
}
