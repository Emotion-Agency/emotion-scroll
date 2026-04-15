import {
  NATIVE_SCROLL_GUARD_MS,
  NATIVE_SCROLL_VELOCITY_RESET_MS,
} from '../constants'
import type {Scrolling} from '../types'

export interface NativeScrollBridgeHost {
  readonly isStopped: boolean
  readonly opts: {infinite: boolean}
  isScrolling: Scrolling
  animatedScroll: number
  targetScroll: number
  velocity: number
  lastVelocity: number
  direction: 1 | -1 | 0
  getActualScroll(): number
  onScrollChanged(): void
}

/**
 * Bridges native scroll events to the controller:
 *  - debounces velocity decay after the user stops scrolling natively,
 *  - guards against the feedback loop when the controller itself drives
 *    `element.scrollTo(...)` (see `preventNext()`).
 */
export class NativeScrollBridge {
  private guardCounter = 0
  private guardTimers: ReturnType<typeof setTimeout>[] = []
  private settleTimer: ReturnType<typeof setTimeout> | null = null

  constructor(
    private readonly wrapper: HTMLElement | Window,
    private readonly host: NativeScrollBridgeHost,
  ) {
    this.wrapper.addEventListener('scroll', this.onScroll, {passive: true})
  }

  preventNext(): void {
    this.guardCounter++
    const timer = setTimeout(() => {
      if (this.guardCounter > 0) this.guardCounter--
      this.guardTimers = this.guardTimers.filter(t => t !== timer)
    }, NATIVE_SCROLL_GUARD_MS)
    this.guardTimers.push(timer)
  }

  destroy(): void {
    this.wrapper.removeEventListener('scroll', this.onScroll)
    if (this.settleTimer !== null) {
      clearTimeout(this.settleTimer)
      this.settleTimer = null
    }
    for (const timer of this.guardTimers) clearTimeout(timer)
    this.guardTimers = []
    this.guardCounter = 0
  }

  private readonly onScroll = (): void => {
    if (this.settleTimer !== null) {
      clearTimeout(this.settleTimer)
      this.settleTimer = null
    }

    if (this.guardCounter > 0) {
      this.guardCounter--
      return
    }

    const {host} = this
    if (host.isScrolling !== false && host.isScrolling !== 'native') return
    if (host.opts.infinite) return

    const lastScroll = host.animatedScroll
    host.animatedScroll = host.targetScroll = host.getActualScroll()
    host.lastVelocity = host.velocity
    host.velocity = host.animatedScroll - lastScroll
    host.direction = Math.sign(host.velocity) as 1 | -1 | 0

    if (!host.isStopped) host.isScrolling = 'native'
    host.onScrollChanged()

    if (host.velocity !== 0) {
      this.settleTimer = setTimeout(() => {
        host.lastVelocity = host.velocity
        host.velocity = 0
        host.isScrolling = false
        host.onScrollChanged()
      }, NATIVE_SCROLL_VELOCITY_RESET_MS)
    }
  }
}
