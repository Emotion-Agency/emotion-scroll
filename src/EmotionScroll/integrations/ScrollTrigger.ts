import {getDocument, getWindow} from 'ssr-window'

import type EmotionScroll from '../EmotionScroll'

interface ScrollerProxyConfig {
  scrollTop?: (value?: number) => number | void
  scrollLeft?: (value?: number) => number | void
  getBoundingClientRect?: () => {
    top: number
    left: number
    width: number
    height: number
  }
  pinType?: 'fixed' | 'transform'
}

/**
 * Minimal surface of `gsap/ScrollTrigger` that this integration relies on.
 * Accepted as a parameter so the lib does not have to depend on gsap.
 */
export interface ScrollTriggerStatic {
  scrollerProxy(
    scroller: Element | string | undefined,
    config?: ScrollerProxyConfig,
  ): unknown
  defaults(config: {scroller?: Element | string | null}): unknown
  update(): unknown
}

export interface AttachScrollTriggerOptions {
  /**
   * When `el !== document.documentElement`, register it as the default
   * scroller so `ScrollTrigger.create({trigger: ...})` picks it up without
   * an explicit `scroller` arg. Defaults to `true`.
   */
  setAsDefault?: boolean
}

/**
 * Wire an EmotionScroll instance into GSAP ScrollTrigger.
 *
 *   - Registers a `scrollerProxy` so ScrollTrigger reads the animated
 *     scroll position instead of native DOM scrollTop. This matters even
 *     for window-scroll, because the animated value can be ahead of the
 *     DOM between frames.
 *   - Calls `ScrollTrigger.update()` on every emitted scroll event so
 *     triggers stay in sync with the smooth position in real time.
 *
 * Returns a detach function that removes the scroll listener. The
 * `scrollerProxy` registration itself is not torn down — call
 * `ScrollTrigger.scrollerProxy(el)` in the consumer if a full reset is
 * needed.
 */
export function attachScrollTrigger(
  scroll: EmotionScroll,
  ScrollTrigger: ScrollTriggerStatic,
  options: AttachScrollTriggerOptions = {},
): () => void {
  const doc = getDocument()
  const win = getWindow()
  const el = scroll.opts.el
  const isWindowScroll = el === doc.documentElement
  const {setAsDefault = true} = options

  const proxy: ScrollerProxyConfig = {
    getBoundingClientRect: () => ({
      top: 0,
      left: 0,
      width: win.innerWidth,
      height: win.innerHeight,
    }),
    pinType: isWindowScroll ? 'fixed' : 'transform',
  }

  // Regular (non-arrow) function so ScrollTrigger can distinguish get
  // (no args) from set (one arg) via `arguments.length`.
  if (scroll.isHorizontal) {
    proxy.scrollLeft = function (value) {
      if (arguments.length && typeof value === 'number') {
        scroll.scrollTo(value, {immediate: true, force: true})
        return
      }
      return scroll.animatedScroll
    }
  } else {
    proxy.scrollTop = function (value) {
      if (arguments.length && typeof value === 'number') {
        scroll.scrollTo(value, {immediate: true, force: true})
        return
      }
      return scroll.animatedScroll
    }
  }

  ScrollTrigger.scrollerProxy(isWindowScroll ? undefined : el, proxy)

  if (!isWindowScroll && setAsDefault) {
    ScrollTrigger.defaults({scroller: el})
  }

  const onScroll = (): void => {
    ScrollTrigger.update()
  }
  scroll.on('scroll', onScroll)

  return () => {
    scroll.off('scroll', onScroll)
  }
}
