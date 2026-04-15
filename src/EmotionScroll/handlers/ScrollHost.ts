import type {ResolvedOpts} from '../opts'
import type {ScrollTarget, ScrollToOptions, Scrolling} from '../types'

/**
 * Internal surface of EmotionScroll exposed to handlers (keyboard, anchor,
 * virtual-scroll). Not part of the public API — public consumers receive
 * IScrollController and the 'scroll' event payload.
 */
export interface ScrollHost {
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
  scrollTo(target: ScrollTarget, options?: ScrollToOptions): void
  emitVirtualScroll(data: {deltaX: number; deltaY: number; event: Event}): void
  stopAnimation(): void
}
