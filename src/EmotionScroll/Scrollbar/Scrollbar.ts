import {clamp} from '@emotionagency/utils'

import {getDocument} from 'ssr-window'
import {
  SCROLLBAR_INACTIVITY_MS,
  SCROLLBAR_THUMB_MIN_SIZE_PX,
} from '../constants'
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

  private readonly createScrollbar = new CreateScrollbar()
  private readonly inactivity: Inactivity
  private drag: ScrollbarDrag | null = null

  constructor(
    private readonly controller: IScrollController,
    private readonly raf: TRAF,
    private readonly opts: ResolvedScrollbarOpts
  ) {
    this.inactivity = new Inactivity(this.setVisibility, SCROLLBAR_INACTIVITY_MS)
    this.init()
  }

  private get isHorizontal(): boolean {
    return this.controller.isHorizontal
  }

  /** Read live geometry in a single getComputedStyle call per frame. */
  private readGeometry(): {track: number; minThumbSize: number} {
    const style = getComputedStyle(this.$scrollbar)
    const padStart = parseFloat(
      this.isHorizontal ? style.paddingLeft : style.paddingTop
    ) || 0
    const padEnd = parseFloat(
      this.isHorizontal ? style.paddingRight : style.paddingBottom
    ) || 0
    const size = this.isHorizontal
      ? this.$scrollbar.clientWidth
      : this.$scrollbar.clientHeight

    const rawMin = parseFloat(style.getPropertyValue('--es-thumb-min-size'))
    const minThumbSize =
      Number.isFinite(rawMin) && rawMin >= 0 ? rawMin : SCROLLBAR_THUMB_MIN_SIZE_PX

    return {track: size - padStart - padEnd, minThumbSize}
  }

  private init(): void {
    this.$scrollbar = this.createScrollbar.create(this.isHorizontal)
    this.$thumb = this.$scrollbar.querySelector('.scrollbar__thumb')!

    this.createScrollbar.append(document.body)

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

    const {track, minThumbSize} = this.readGeometry()
    this.updateThumbSize(track, minThumbSize)
    this.updateThumbPosition(track)

    if (this.controller.isScrolling) {
      this.inactivity.show()
    }
  }

  private updateThumbSize(track: number, minThumbSize: number): void {
    const limit = this.controller.limit
    if (limit <= 0 || track <= 0) {
      this.thumbSize = 0
      this.$thumb.style[this.isHorizontal ? 'width' : 'height'] = '0px'
      return
    }

    // Thumb size is proportional: trackSize * (viewable / total)
    // viewable / total = trackSize / (trackSize + limit) simplified
    const ratio = track / (track + limit)
    const min = Math.min(minThumbSize, track)
    this.thumbSize = clamp(track * ratio, min, track)

    this.$thumb.style[this.isHorizontal ? 'width' : 'height'] =
      this.thumbSize + 'px'
  }

  private updateThumbPosition(track: number): void {
    const availableTravel = track - this.thumbSize
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
    const {track, minThumbSize} = this.readGeometry()
    this.updateThumbSize(track, minThumbSize)
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
