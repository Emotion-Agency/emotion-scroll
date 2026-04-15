import {clamp} from '@emotionagency/utils'

import {getDocument} from 'ssr-window'
import type {IScrollController, TRAF} from '../types'
import type {ResolvedScrollbarOpts} from '../opts'
import {CreateScrollbar} from './CreateScrollbar'
import {Inactivity} from './Inactivity'
import {ScrollbarDrag} from './ScrollbarDrag'

const document = getDocument()

export default class Scrollbar {
  private $scrollbar!: HTMLElement
  private $thumb!: HTMLElement
  private thumbSize = 0
  private thumbMinSize = 60
  private cachedPadding = {top: 0, bottom: 0, left: 0, right: 0}

  private readonly createScrollbar = new CreateScrollbar()
  private readonly inactivity: Inactivity
  private drag: ScrollbarDrag | null = null

  constructor(
    private readonly controller: IScrollController,
    private readonly raf: TRAF,
    private readonly opts: ResolvedScrollbarOpts
  ) {
    this.inactivity = new Inactivity(this.setVisibility)
    this.init()
  }

  private get isHorizontal(): boolean {
    return this.controller.isHorizontal
  }

  private cacheScrollbarPadding(): void {
    const style = getComputedStyle(this.$scrollbar)
    this.cachedPadding = {
      top: parseFloat(style.paddingTop) || 0,
      bottom: parseFloat(style.paddingBottom) || 0,
      left: parseFloat(style.paddingLeft) || 0,
      right: parseFloat(style.paddingRight) || 0,
    }

    const minSize = parseFloat(
      style.getPropertyValue('--es-thumb-min-size')
    )
    if (Number.isFinite(minSize) && minSize >= 0) {
      this.thumbMinSize = minSize
    }
  }

  /** Inner track size excluding padding. */
  private get trackSize(): number {
    if (this.isHorizontal) {
      return this.$scrollbar.clientWidth - this.cachedPadding.left - this.cachedPadding.right
    }
    return this.$scrollbar.clientHeight - this.cachedPadding.top - this.cachedPadding.bottom
  }

  private init(): void {
    this.$scrollbar = this.createScrollbar.create(this.isHorizontal)
    this.$thumb = this.$scrollbar.querySelector('.scrollbar__thumb')!

    this.createScrollbar.append(document.body)
    this.cacheScrollbarPadding()

    this.$scrollbar.addEventListener('mouseenter', this.onMouseEnter)

    this.drag = new ScrollbarDrag(
      {$scrollbar: this.$scrollbar, $thumb: this.$thumb},
      this.controller,
      this.opts
    )

    this.raf.on(this.onFrame)
  }

  private readonly onMouseEnter = (): void => {
    this.inactivity.show()
  }

  private readonly setVisibility = (isActive: boolean): void => {
    this.$thumb.classList.toggle('scrolling', isActive)
  }

  private readonly onFrame = (): void => {
    this.$scrollbar.classList.toggle('hidden', this.controller.isStopped)

    this.updateThumbSize()
    this.updateThumbPosition()

    if (this.controller.isScrolling) {
      this.inactivity.show()
    }
  }

  private updateThumbSize(): void {
    const limit = this.controller.limit
    if (limit <= 0) {
      this.thumbSize = 0
      this.$thumb.style[this.isHorizontal ? 'width' : 'height'] = '0px'
      return
    }

    // Thumb size is proportional: trackSize * (viewable / total)
    // viewable / total = trackSize / (trackSize + limit) simplified
    const track = this.trackSize
    const ratio = track / (track + limit)
    const min = Math.min(this.thumbMinSize, track)
    this.thumbSize = clamp(track * ratio, min, track)

    this.$thumb.style[this.isHorizontal ? 'width' : 'height'] =
      this.thumbSize + 'px'
  }

  private updateThumbPosition(): void {
    const availableTravel = this.trackSize - this.thumbSize
    if (availableTravel <= 0) return

    const progress = clamp(this.controller.progress, 0, 1)
    const offset = progress * availableTravel
    const px = offset.toFixed(2)

    if (this.isHorizontal) {
      this.$thumb.style.transform = `translateX(${px}px)`
    } else {
      this.$thumb.style.transform = `translateY(${px}px)`
    }
  }

  reset(): void {
    this.updateThumbSize()
    this.$thumb.style.transform = this.isHorizontal
      ? 'translateX(0px)'
      : 'translateY(0px)'
  }

  destroy(): void {
    this.drag?.destroy()
    this.drag = null
    this.$scrollbar.removeEventListener('mouseenter', this.onMouseEnter)
    this.createScrollbar.destroy()
    this.inactivity.destroy()
    this.raf.off(this.onFrame)
  }
}
