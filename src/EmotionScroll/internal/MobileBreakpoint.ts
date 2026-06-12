import {getWindow} from 'ssr-window'

const window = getWindow()

export type BreakpointMatcher = number | string | (() => boolean) | null

/**
 * Decides when smooth scroll yields to native scroll.
 *
 * - `number`  — viewport width: mobile when `innerWidth < breakpoint`,
 *   re-evaluated on `resize` (legacy behaviour)
 * - `string`  — media query (e.g. `'(pointer: coarse)'`), tracked via
 *   its `change` event so input-type switches are caught without resize
 * - `function` — custom predicate, re-evaluated on `resize`
 * - `null`    — never mobile
 */
export class MobileBreakpoint {
  isMobile = false
  private query: MediaQueryList | null = null

  constructor(
    private readonly breakpoint: BreakpointMatcher,
    private readonly onEnter: () => void,
    private readonly onLeave: () => void,
  ) {
    if (breakpoint == null) return

    if (typeof breakpoint === 'string') {
      if (typeof window.matchMedia !== 'function') return
      this.query = window.matchMedia(breakpoint)
      this.isMobile = this.query.matches
      this.query.addEventListener('change', this.onQueryChange)
      return
    }

    this.isMobile = this.evaluate()
    window.addEventListener('resize', this.onResize)
  }

  private evaluate(): boolean {
    if (typeof this.breakpoint === 'function') return this.breakpoint()
    if (typeof this.breakpoint === 'number') {
      return window.innerWidth < this.breakpoint
    }
    return false
  }

  private readonly onQueryChange = (e: MediaQueryListEvent): void => {
    this.setIsMobile(e.matches)
  }

  private readonly onResize = (): void => {
    this.setIsMobile(this.evaluate())
  }

  private setIsMobile(value: boolean): void {
    if (this.isMobile === value) return
    this.isMobile = value
    if (value) this.onEnter()
    else this.onLeave()
  }

  destroy(): void {
    this.query?.removeEventListener('change', this.onQueryChange)
    this.query = null
    window.removeEventListener('resize', this.onResize)
  }
}
