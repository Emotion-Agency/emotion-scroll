import {clamp} from '@emotionagency/utils'

import {getDocument} from 'ssr-window'
import type {IScrollController} from '../types'
import type {ResolvedScrollbarOpts} from '../opts'

const document = getDocument()

interface ScrollbarElements {
  $scrollbar: HTMLElement
  $thumb: HTMLElement
}

/**
 * Pointer-events based drag/jump handler. A single input path covers
 * mouse, touch, and pen; pointer capture keeps the gesture alive even
 * when the cursor leaves the thumb, so we don't need the
 * mousemove/mouseup dance on documentElement that the legacy
 * touch+mouse implementation required.
 */
export class ScrollbarDrag {
  private activePointerId: number | null = null

  constructor(
    private readonly elements: ScrollbarElements,
    private readonly controller: IScrollController,
    private readonly opts: ResolvedScrollbarOpts,
  ) {
    this.init()
  }

  private get isHorizontal(): boolean {
    return this.controller.isHorizontal
  }

  private init(): void {
    this.elements.$scrollbar.addEventListener('pointerdown', this.onPointerDown)
    this.elements.$scrollbar.addEventListener('click', this.onTrackClick)
  }

  /** Map a pointer position (relative to track) to a scroll target. */
  private pointerToScroll(clientX: number, clientY: number): number {
    const rect = this.elements.$scrollbar.getBoundingClientRect()
    const style = getComputedStyle(this.elements.$scrollbar)
    const clientPos = this.isHorizontal ? clientX : clientY

    let trackStart: number
    let trackSize: number
    if (this.isHorizontal) {
      const pl = parseFloat(style.paddingLeft) || 0
      const pr = parseFloat(style.paddingRight) || 0
      trackStart = rect.left + pl
      trackSize = rect.width - pl - pr
    } else {
      const pt = parseFloat(style.paddingTop) || 0
      const pb = parseFloat(style.paddingBottom) || 0
      trackStart = rect.top + pt
      trackSize = rect.height - pt - pb
    }

    const ratio = clamp((clientPos - trackStart) / trackSize, 0, 1)
    return ratio * this.controller.limit
  }

  private readonly onTrackClick = (e: MouseEvent): void => {
    // `click` fires once after a drag on the same element; suppress it so
    // we don't re-scroll to the mouseup position. During a real track
    // click (no drag), activePointerId is already null by pointerup time,
    // so we use a tiny "just-released" flag instead.
    if (this.suppressNextClick) {
      this.suppressNextClick = false
      return
    }
    if (this.controller.isStopped) return
    const target = this.pointerToScroll(e.clientX, e.clientY)
    this.controller.scrollTo(target, {immediate: !this.opts.isSmooth})
  }

  private suppressNextClick = false

  private readonly onPointerDown = (e: PointerEvent): void => {
    // Primary button only (0 = left / touch / pen contact).
    if (e.button !== 0) return
    if (this.activePointerId !== null) return

    this.activePointerId = e.pointerId
    this.elements.$thumb.classList.add('active')

    try {
      this.elements.$scrollbar.setPointerCapture(e.pointerId)
    } catch {
      // setPointerCapture can throw if the pointer was released in the
      // same frame; fall back to document listeners below.
    }

    // preventDefault blocks the browser's default text-selection /
    // scroll-propagation behaviour during drag.
    e.preventDefault()

    document.addEventListener('pointermove', this.onPointerMove)
    document.addEventListener('pointerup', this.onPointerUp)
    document.addEventListener('pointercancel', this.onPointerUp)
  }

  private readonly onPointerMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.activePointerId) return
    if (this.controller.isStopped) return

    const target = this.pointerToScroll(e.clientX, e.clientY)
    this.controller.scrollTo(target, {immediate: !this.opts.isSmooth})

    // Any movement during the gesture means the follow-up `click` event
    // is a drag artifact and should not re-trigger track-click behaviour.
    this.suppressNextClick = true
  }

  private readonly onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.activePointerId) return
    this.activePointerId = null
    this.elements.$thumb.classList.remove('active')

    document.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('pointerup', this.onPointerUp)
    document.removeEventListener('pointercancel', this.onPointerUp)
  }

  destroy(): void {
    this.elements.$scrollbar.removeEventListener('pointerdown', this.onPointerDown)
    this.elements.$scrollbar.removeEventListener('click', this.onTrackClick)
    document.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('pointerup', this.onPointerUp)
    document.removeEventListener('pointercancel', this.onPointerUp)
    if (this.activePointerId !== null) {
      try {
        this.elements.$scrollbar.releasePointerCapture(this.activePointerId)
      } catch {
        /* noop */
      }
      this.activePointerId = null
    }
  }
}
