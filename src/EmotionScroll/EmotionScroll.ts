import VirtualScroll from 'virtual-scroll'
import {getWindow, getDocument} from '../window-ssr'

import {raf, resize, clamp, lerp} from '@emotionagency/utils'
import Emitter from 'tiny-emitter/dist/tinyemitter'

import {IEventArgs, IOpts, IState, IVirtualWheelEvent} from './types'
import {getOpts} from './opts'
import {keyCodes} from './keyCodes'
import {State} from './State'
import Scrollbar from './Scrollbar'

const window = getWindow()
const document = getDocument()

function isInsideScrollable(el: HTMLElement | null): boolean {
  while (el) {
    if (el.dataset.scrollIgnore) return true
    el = el.parentElement
  }
  return false
}

export default class EmotionScroll {
  private vs: typeof VirtualScroll.prototype
  private scrollbar: typeof Scrollbar.prototype
  private emitter: any
  private opts: IOpts

  public state: IState
  private _disabled = false
  public isMobile = false
  public scrollTop = 0

  private _raf: any
  public max = 0
  private min = 0

  constructor(opts: IOpts) {
    this.opts = getOpts(opts)
    this.state = new State()

    this._raf = this.opts.raf || raf
    this.emitter = new Emitter()

    this.init()
  }

  private bounds() {
    this.update = this.update.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  private init() {
    this.bounds()

    if (this.opts.saveScrollPosition) {
      this.disabled = true
      this.opts.el.scrollTop = +window.localStorage.getItem('ess') || 0
      this.scrollTop = this.opts.el.scrollTop
      this.state.vsPosition = this.opts.el.scrollTop
      this.state.position = this.opts.el.scrollTop
    }

    this.disabled = this.opts.disabled

    if (this.opts.useKeyboard) {
      window.addEventListener('keydown', this.onKeyDown, false)
    }

    resize.on(this.onResize)

    this._raf.on(this.update)
  }

  private onResize() {
    if (this.opts.breakpoint) {
      this.isMobile = window.innerWidth < this.opts.breakpoint
    }

    if (this.isMobile) {
      this.vs && this.vs.destroy()
      this.vs = null
      this.scrollbar && this.scrollbar.destroy()
      this.scrollbar = null
    }

    if (!this.isMobile && !this.vs) {
      this.setupVirtualScroll()
    }

    if (!this.isMobile && !this.scrollbar && this.opts.scrollbar) {
      this.scrollbar = new Scrollbar(this.opts.el, this.state, this._raf)
    }
  }

  private detectScrolling(): void {
    const dif = Math.abs(
      Math.round(this.state.vsPosition) - Math.round(this.state.position)
    )

    if (dif >= 1 || this.state.isScrollbarVisible) {
      this.state.isScrolling = true
    } else {
      this.state.isScrolling = false
    }
  }

  get disabled(): boolean {
    return this._disabled
  }

  set disabled(val: boolean) {
    this._disabled = val
    this.state.disabled = val

    if (val) {
      this.opts.el.classList.add('e-fixed')
      this.state.vsPosition = this.scrollTop
      this.state.position = this.scrollTop
      this.state.velocity = 0
    } else {
      this.opts.el.classList.remove('e-fixed')
    }
  }

  private get maxValue(): number {
    return this.opts.el.scrollHeight - window.innerHeight
  }

  private get canScroll(): boolean {
    return !this.disabled && this.opts.el.scrollHeight > window.innerHeight
  }

  private setupVirtualScroll() {
    this.vs = new VirtualScroll({...this.opts, useKeyboard: false})

    this.vs.on((e: IVirtualWheelEvent) => {
      if (this.disabled) {
        return
      }

      if (isInsideScrollable(e.originalEvent.target as HTMLElement)) {
        return
      }

      const delta = clamp(
        e.deltaY,
        -this.opts.maxScrollDelta,
        this.opts.maxScrollDelta
      )

      this.state.vsPosition -= delta * this.opts.stepSize

      this.state.vsPosition = clamp(this.state.vsPosition, this.min, this.max)

      if (this.opts.saveScrollPosition) {
        localStorage.setItem('ess', String(this.state.vsPosition))
      }
    })
  }

  on(cb: (vars: IEventArgs) => any) {
    this.emitter.on('update', (vars: IEventArgs) => {
      cb(vars)
    })
  }

  private update() {
    this.detectScrolling()

    this.max = this.maxValue

    if (this.disabled) {
      return
    }

    this.state.position = lerp(
      this.state.position,
      this.state.vsPosition,
      this.opts.friction
    )
    this.state.position = Math.round(this.state.position * 100) / 100
    this.state.velocity = this.state.vsPosition - this.state.position

    if (this.state.isScrolling) {
      this.emitter.emit('update', {
        position: this.state.position,
        direction: this.state.vsPosition > this.state.position ? 1 : -1,
        velocity: this.state.velocity,
        progress: this.state.position / this.max,
      } as IEventArgs)
    }

    if (this.scrollTop !== this.opts.el.scrollTop) {
      this.state.vsPosition = this.opts.el.scrollTop
      this.scrollTop = this.opts.el.scrollTop
      if (this.opts.saveScrollPosition) {
        localStorage.setItem('ess', String(this.state.vsPosition))
      }
      return
    }

    if (this.isMobile) {
      this.state.vsPosition = this.opts.el.scrollTop
      return
    }

    this.opts.el.scrollTop = this.state.position
    this.scrollTop = this.opts.el.scrollTop
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (this.canScroll) {
      switch (e.key) {
        case keyCodes.TAB:
          this.state.vsPosition =
            document.activeElement.getBoundingClientRect().y
          break
        case keyCodes.UP:
          this.state.vsPosition -= 240
          break
        case keyCodes.DOWN:
          this.state.vsPosition += 240
          break
        case keyCodes.PAGEUP:
          this.state.vsPosition -= window.innerHeight
          break
        case keyCodes.PAGEDOWN:
          this.state.vsPosition += window.innerHeight
          break
        case keyCodes.HOME:
          this.state.vsPosition = this.min
          break
        case keyCodes.END:
          this.state.vsPosition = this.max
          break
        default:
          return
      }
    }
    this.state.vsPosition = clamp(this.state.vsPosition, this.min, this.max)
  }

  reset(): void {
    this.state.vsPosition = 0
    this.state.position = 0
    this.opts.el.scrollTop = 0
    this.scrollTop = this.opts.el.scrollTop
    this.scrollbar?.reset()
  }

  destroy() {
    this._raf.off(this.update)
    this.vs && this.vs.destroy()
    resize.off(this.onResize)

    this.scrollbar && this.scrollbar.destroy()

    window.removeEventListener('keydown', this.onKeyDown)
  }
}

export type TEmotionScroll = typeof EmotionScroll.prototype
