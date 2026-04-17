import {NATIVE_SCROLL_VELOCITY_RESET_MS} from '../constants'
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
 * Bridges native scroll events into the controller.
 *
 * Native `scroll` events fire both from our own programmatic writes and
 * from user scrolling. We distinguish them by comparing the event's
 * `scrollTop` to the last value we wrote via `markSet()`. Browsers
 * report integer scroll positions, so a 1.5px tolerance covers rounding
 * of the float value we wrote against the integer the browser echoed.
 *
 * After a genuine native-scroll burst, `settleTimer` fires once velocity
 * has stabilised to reset the controller back to the idle state.
 */
export class NativeScrollBridge {
  private settleTimer: ReturnType<typeof setTimeout> | null = null
  private lastSetValue = Number.NaN

  constructor(
    private readonly wrapper: HTMLElement | Window,
    private readonly host: NativeScrollBridgeHost,
  ) {
    this.wrapper.addEventListener('scroll', this.onScroll, {passive: true})
  }

  /** Record the value we're about to write so our own scroll event is
   *  distinguishable from a user-initiated scroll. */
  markSet(value: number): void {
    this.lastSetValue = value
  }

  destroy(): void {
    this.wrapper.removeEventListener('scroll', this.onScroll)
    if (this.settleTimer !== null) {
      clearTimeout(this.settleTimer)
      this.settleTimer = null
    }
  }

  private readonly onScroll = (): void => {
    if (this.settleTimer !== null) {
      clearTimeout(this.settleTimer)
      this.settleTimer = null
    }

    const {host} = this
    const actual = host.getActualScroll()

    if (Math.abs(actual - this.lastSetValue) < 1.5) return

    if (host.isScrolling !== false && host.isScrolling !== 'native') return
    if (host.opts.infinite) return

    const lastScroll = host.animatedScroll
    host.animatedScroll = host.targetScroll = actual
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
