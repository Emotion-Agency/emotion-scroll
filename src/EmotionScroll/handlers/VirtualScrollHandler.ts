import {clamp} from '@emotionagency/utils'

import {getDocument, getWindow} from 'ssr-window'
import {MAX_FRAME_DT_FACTOR} from '../constants'
import {FingerVelocityTracker} from '../internal/FingerVelocityTracker'
import {normalizeWheel} from '../internal/normalizeWheel'
import type {ResolvedOpts} from '../opts'
import type {ScrollHost} from './ScrollHost'

const document = getDocument()
const window = getWindow()

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

type EventTargetEl = HTMLElement | Window

/**
 * Owns raw wheel + touch input for the scroll pipeline.
 *
 * Wheel is normalised inline (previously via `virtual-scroll`, which was
 * dropped to shrink the bundle and because we only needed its wheel
 * path). Touch is tracked with a dedicated velocity sampler so release
 * inertia reflects actual finger motion rather than the tween's
 * per-frame delta.
 */
export class VirtualScrollHandler {
  private eventTarget: EventTargetEl | null = null
  private listenerOpts: AddEventListenerOptions = {passive: false}

  private readonly finger = new FingerVelocityTracker()
  private lastTouchX = 0
  private lastTouchY = 0
  private pendingWheelDelta = 0

  constructor(private readonly host: ScrollHost) {}

  setup(): void {
    const {opts} = this.host
    const isWindowScroll = opts.el === document.documentElement

    this.eventTarget = isWindowScroll ? window : opts.el
    this.listenerOpts = {passive: opts.passive}
    this.bindInput(true)
  }

  destroy(): void {
    this.bindInput(false)
    this.eventTarget = null
    this.finger.reset()
    this.pendingWheelDelta = 0
  }

  /**
   * Apply the wheel input accumulated since the previous frame. Clamping
   * the per-frame total (instead of each event) keeps scroll speed
   * independent of how many events a device fires per second; the cap is
   * scaled by the actual frame dt so 120Hz displays don't get a 2× ceiling.
   * Input beyond the cap carries over to subsequent frames instead of
   * being dropped, so a legitimate oversized intent (a page-mode tick is
   * a full viewport) still travels its whole distance — only the rate is
   * limited. Called from the host's RAF update before the animation
   * advances.
   */
  flush(deltaTime: number): void {
    const pending = this.pendingWheelDelta
    if (pending === 0) return

    const {host} = this
    const {opts} = host
    if (host.isStopped || host.isLocked) {
      this.pendingWheelDelta = 0
      return
    }

    const dtFactor =
      deltaTime > 0 ? Math.min(deltaTime * 60, MAX_FRAME_DT_FACTOR) : 1
    const cap = opts.maxScrollDelta * dtFactor
    const delta = clamp(pending, -cap, cap)
    this.pendingWheelDelta = pending - delta

    host.scrollTo(host.targetScroll + delta, {
      lerp: opts.lerp,
      duration: opts.duration,
      easing: opts.easing,
    })
  }

  private bindInput(attach: boolean): void {
    const target = this.eventTarget as EventTarget | null
    if (!target) return
    const method = attach ? 'addEventListener' : 'removeEventListener'

    target[method]('wheel', this.onWheel as EventListener, this.listenerOpts)
    target[method]('touchstart', this.onTouchStart as EventListener, this.listenerOpts)
    target[method]('touchmove', this.onTouchMove as EventListener, this.listenerOpts)
    target[method]('touchend', this.onTouchEnd as EventListener, this.listenerOpts)
    target[method]('touchcancel', this.onTouchEnd as EventListener, this.listenerOpts)
  }

  private readonly onWheel = (e: WheelEvent): void => {
    const {deltaX, deltaY} = normalizeWheel(e)
    this.onScrollEvent({deltaX, deltaY, originalEvent: e})
  }

  private readonly onTouchStart = (e: TouchEvent): void => {
    const t = e.targetTouches?.[0] ?? e.changedTouches?.[0]
    if (!t) return

    const {host} = this
    const {opts} = host

    this.lastTouchX = t.pageX
    this.lastTouchY = t.pageY
    this.finger.reset()
    this.finger.add(t.pageX, t.pageY)

    if (shouldPreventScroll(e.target as HTMLElement, opts.el, opts)) return

    host.isTouching = true

    // Tap-to-stop: halt any in-flight smooth animation so the gesture
    // starts from the current visual position instead of chasing a
    // stale target left over from a previous scrollTo.
    if (opts.syncTouch && !host.isStopped && !host.isLocked) {
      host.stopAnimation()
      host.targetScroll = host.animatedScroll
      this.pendingWheelDelta = 0
    }
  }

  private readonly onTouchMove = (e: TouchEvent): void => {
    const t = e.targetTouches?.[0] ?? e.changedTouches?.[0]
    if (!t) return

    const {opts} = this.host
    const deltaX = (t.pageX - this.lastTouchX) * opts.touchMultiplier
    const deltaY = (t.pageY - this.lastTouchY) * opts.touchMultiplier
    this.lastTouchX = t.pageX
    this.lastTouchY = t.pageY
    this.finger.add(t.pageX, t.pageY)

    this.onScrollEvent({deltaX, deltaY, originalEvent: e})
  }

  private readonly onTouchEnd = (e: TouchEvent): void => {
    const {host} = this
    const {opts} = host

    const {x: rawVx, y: rawVy} = this.finger.velocity()
    this.finger.reset()

    const wasTouching = host.isTouching
    host.isTouching = false

    if (!wasTouching) return
    if (!opts.syncTouch) return
    if (shouldPreventScroll(e.target as HTMLElement, opts.el, opts)) return
    if (host.isStopped || host.isLocked) return

    let velocity: number
    if (opts.gestureOrientation === 'both') {
      velocity = Math.abs(rawVy) > Math.abs(rawVx) ? rawVy : rawVx
    } else if (opts.gestureOrientation === 'horizontal') {
      velocity = rawVx
    } else {
      velocity = rawVy
    }

    // Sign flip mirrors `delta = -deltaY` in onScrollEvent so inertia
    // continues in the direction of the flick. touchMultiplier keeps the
    // scale consistent with the scaled deltas accumulated during touchmove.
    velocity = -velocity * opts.touchMultiplier
    if (velocity === 0) return

    const inertia =
      Math.sign(velocity) * Math.abs(velocity) ** opts.touchInertiaExponent
    const delta = clamp(inertia, -opts.maxTouchInertia, opts.maxTouchInertia)

    host.scrollTo(host.targetScroll + delta, {lerp: opts.syncTouchLerp})
  }

  private onScrollEvent(e: {
    deltaX: number
    deltaY: number
    originalEvent: WheelEvent | TouchEvent
  }): void {
    const {host} = this
    const {opts} = host
    const event = e.originalEvent
    const isTouch = event.type.includes('touch')
    const isWheel = event.type.includes('wheel')

    if ('ctrlKey' in event && event.ctrlKey) return

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

    if (!opts.overscroll || opts.infinite || this.isWithinBounds(delta)) {
      if ('cancelable' in event && event.cancelable) {
        event.preventDefault()
      }
    }

    if (isWheel) {
      this.pendingWheelDelta += delta
      return
    }

    // Touch deltas telescope to the actual finger displacement, so event
    // rate can't affect speed — apply immediately (buffering would also
    // race with the inertia kick-off in onTouchEnd). The clamp only
    // guards against anomalous single jumps.
    delta = clamp(delta, -opts.maxScrollDelta, opts.maxScrollDelta)

    host.scrollTo(host.targetScroll + delta, {lerp: 1})
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
