import {clamp} from '@emotionagency/utils'

import {getDocument} from 'ssr-window'
import type {IScrollController} from '../types'

const document = getDocument()

interface ScrollbarElements {
  $scrollbar: HTMLElement
  $thumb: HTMLElement
}

const EVENTS = {
  start: ['mousedown', 'touchstart'] as const,
  move: ['mousemove', 'touchmove'] as const,
  end: ['mouseup', 'touchend'] as const,
}

export class ScrollbarDrag {
  constructor(
    private readonly elements: ScrollbarElements,
    private readonly controller: IScrollController
  ) {
    this.init()
  }

  private get isHorizontal(): boolean {
    return this.controller.isHorizontal
  }

  private init(): void {
    for (const name of EVENTS.start) {
      this.elements.$scrollbar.addEventListener(name, this.onStart, {passive: false})
    }
    for (const name of EVENTS.end) {
      document.documentElement.addEventListener(name, this.onEnd)
    }

    this.elements.$scrollbar.addEventListener('click', this.onTrackClick)
  }

  /** Map a pointer position (relative to track) to a scroll target. */
  private pointerToScroll(clientX: number, clientY: number): number {
    const rect = this.elements.$scrollbar.getBoundingClientRect()
    const style = getComputedStyle(this.elements.$scrollbar)
    const clientPos = this.isHorizontal ? clientX : clientY

    // Account for padding to get the inner content area
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

    // Position within the inner track, normalized to 0..1
    const ratio = clamp((clientPos - trackStart) / trackSize, 0, 1)

    return ratio * this.controller.limit
  }

  private readonly onTrackClick = (e: MouseEvent): void => {
    if (this.controller.isStopped) return
    const target = this.pointerToScroll(e.clientX, e.clientY)
    this.controller.scrollTo(target)
  }

  private readonly onStart = (e: MouseEvent | TouchEvent): void => {
    e.preventDefault()
    for (const name of EVENTS.move) {
      document.documentElement.addEventListener(name, this.onMove)
    }
    this.elements.$thumb.classList.add('active')
  }

  private readonly onMove = (e: MouseEvent | TouchEvent): void => {
    if (this.controller.isStopped) return

    let clientX: number, clientY: number
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = (e as MouseEvent).clientX
      clientY = (e as MouseEvent).clientY
    }

    const target = this.pointerToScroll(clientX, clientY)
    this.controller.scrollTo(target)
  }

  private readonly onEnd = (): void => {
    this.elements.$thumb.classList.remove('active')
    for (const name of EVENTS.move) {
      document.documentElement.removeEventListener(name, this.onMove)
    }
  }

  destroy(): void {
    for (const name of EVENTS.start) {
      this.elements.$scrollbar.removeEventListener(name, this.onStart)
    }
    for (const name of EVENTS.end) {
      document.documentElement.removeEventListener(name, this.onEnd)
    }
    for (const name of EVENTS.move) {
      document.documentElement.removeEventListener(name, this.onMove)
    }
    this.elements.$scrollbar.removeEventListener('click', this.onTrackClick)
  }
}
