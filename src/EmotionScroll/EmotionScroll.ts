import Emitter from 'tiny-emitter/dist/tinyemitter'
import {raf, clamp, modulo} from '@emotionagency/utils'

import {getWindow, getDocument} from 'ssr-window'
import {Animate} from './Animate'
import {Dimensions} from './Dimensions'
import {resolveEasing} from './easings'
import {resolveOpts, type ResolvedOpts} from './opts'
import {resolveScrollTarget} from './ScrollTarget'
import {VirtualScrollHandler} from './handlers/VirtualScrollHandler'
import {KeyboardHandler} from './handlers/KeyboardHandler'
import {AnchorHandler} from './handlers/AnchorHandler'
import Scrollbar from './Scrollbar'
import type {
  IOpts,
  IEventArgs,
  IScrollController,
  ScrollToOptions,
  ScrollTarget,
  Scrolling,
  TRAF,
} from './types'

const window = getWindow()

export default class EmotionScroll implements IScrollController {
  // --- Public state ---
  animatedScroll = 0
  targetScroll = 0
  velocity = 0
  lastVelocity = 0
  direction: 1 | -1 | 0 = 0
  isTouching = false

  // --- Private state ---
  private _isScrolling: Scrolling = false
  private _isStopped = false
  private _isLocked = false
  private _preventNativeScrollCounter = 0
  private _preventTimers: ReturnType<typeof setTimeout>[] = []
  private _resetVelocityTimeout: ReturnType<typeof setTimeout> | null = null
  private _reducedMotion = false
  private _motionQuery: MediaQueryList | null = null
  private _time = 0
  private _isMobile = false

  // --- Dependencies ---
  readonly opts: ResolvedOpts
  private readonly animate = new Animate()
  private readonly emitter = new Emitter()
  private readonly dimensions: Dimensions
  private readonly _raf: TRAF

  // --- Handlers ---
  private vsHandler: VirtualScrollHandler | null = null
  private keyboardHandler: KeyboardHandler | null = null
  private anchorHandler: AnchorHandler | null = null
  private scrollbar: typeof Scrollbar.prototype | null = null

  constructor(opts: IOpts = {}) {
    this.opts = resolveOpts(opts)
    this._raf = this.opts.raf || raf

    this.dimensions = new Dimensions(this.wrapperElement, this.opts.content, {
      autoResize: this.opts.autoResize,
    })

    this.animatedScroll = this.targetScroll = this.actualScroll

    this.opts.el.classList.add('es-smooth')
    this.initReducedMotion()
    this.initNativeListeners()
    this.initMobileCheck()

    if (!this._isMobile) {
      this.initVirtualScroll()
      if (this.opts.scrollbar.enabled) {
        this.scrollbar = new Scrollbar(this, this._raf, this.opts.scrollbar)
      }
    }

    if (this.opts.anchors) {
      this.anchorHandler = new AnchorHandler(this, this.wrapperElement)
      this.anchorHandler.init()
    }

    if (this.opts.useKeyboardSmooth) {
      this.keyboardHandler = new KeyboardHandler(this)
      this.keyboardHandler.init()
    }

    if (this.opts.saveScrollPosition) {
      this.restoreScrollPosition()
    }

    if (this.opts.disabled) {
      this.stop()
    }

    if (this.opts.autoRaf) {
      this._raf.on(this.update)
    }
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  on(event: string, cb: (...args: unknown[]) => void): void {
    this.emitter.on(event, cb)
  }

  off(event: string, cb: (...args: unknown[]) => void): void {
    this.emitter.off(event, cb)
  }

  scrollTo(
    _target: ScrollTarget,
    {
      offset = 0,
      immediate = false,
      lock = false,
      duration,
      easing,
      lerp,
      onStart,
      onComplete,
      force = false,
    }: ScrollToOptions = {},
  ): void {
    if ((this._isStopped || this._isLocked) && !force) return

    let target = resolveScrollTarget(
      _target,
      offset,
      this.limit,
      this.isHorizontal,
      this.animatedScroll,
    )
    if (target === null) return

    target = this.opts.infinite ? target : clamp(target, 0, this.limit)

    if (target === this.targetScroll) {
      onStart?.(this)
      onComplete?.(this)
      return
    }

    if (this._reducedMotion) immediate = true

    if (immediate) {
      this.animatedScroll = this.targetScroll = target
      this.setScroll(this.scroll)
      this.resetState()
      this.preventNextNativeScrollEvent()
      this.emit()
      onComplete?.(this)
      return
    }

    const animLerp = lerp ?? this.opts.lerp
    const animDuration = duration ?? this.opts.duration
    const animEasing = easing !== undefined ? resolveEasing(easing) : this.opts.easing

    this.targetScroll = target

    this.animate.fromTo(this.animatedScroll, target, {
      lerp: animDuration ? undefined : animLerp,
      duration: animDuration,
      easing: animEasing,
      onStart: () => {
        if (lock) this._isLocked = true
        this.isScrolling = 'smooth'
        onStart?.(this)
      },
      onUpdate: (value: number, completed: boolean) => {
        this.isScrolling = 'smooth'
        this.lastVelocity = this.velocity
        this.velocity = value - this.animatedScroll
        this.direction = Math.sign(this.velocity) as EmotionScroll['direction']
        this.animatedScroll = value
        this.setScroll(this.scroll)

        if (!completed) {
          this.emit()
        } else {
          this.resetState()
          this.emit()
          onComplete?.(this)
          this.preventNextNativeScrollEvent()
          if (this.opts.saveScrollPosition) this.persistScrollPosition()
        }
      },
    })
  }

  start(): void {
    if (!this._isStopped) return
    this.resetState()
    this._isStopped = false
    this.opts.el.classList.remove('e-fixed')
    this.emit()
  }

  stop(): void {
    if (this._isStopped) return
    this.resetState()
    this._isStopped = true
    this.opts.el.classList.add('e-fixed')
    this.emit()
  }

  resize(): void {
    this.dimensions.resize()
    this.animatedScroll = this.targetScroll = this.actualScroll
    this.emit()
  }

  reset(): void {
    this.scrollTo(0, {immediate: true})
    this.scrollbar?.reset()
  }

  readonly update = (): void => {
    const now = performance.now()
    const deltaTime = (now - (this._time || now)) * 0.001
    this._time = now
    this.animate.advance(deltaTime)
  }

  destroy(): void {
    this._raf.off(this.update)
    this.vsHandler?.destroy()
    this.vsHandler = null
    this.keyboardHandler?.destroy()
    this.keyboardHandler = null
    this.anchorHandler?.destroy()
    this.anchorHandler = null
    this.scrollbar?.destroy()
    this.scrollbar = null
    this.dimensions.destroy()

    window.removeEventListener('resize', this.onMobileResize)
    this.wrapperElement.removeEventListener('scroll', this.onNativeScroll)
    this._motionQuery?.removeEventListener('change', this.onReducedMotionChange)

    if (this._resetVelocityTimeout !== null) {
      clearTimeout(this._resetVelocityTimeout)
    }
    for (const timer of this._preventTimers) clearTimeout(timer)
    this._preventTimers = []

    this.opts.el.classList.remove('es-smooth', 'es-scrolling', 'e-fixed')
    this.emitter.off('scroll')
    this.emitter.off('virtual-scroll')
  }

  // ---------------------------------------------------------------------------
  // Read-only properties (IScrollController)
  // ---------------------------------------------------------------------------

  get isScrolling(): Scrolling {
    return this._isScrolling
  }

  set isScrolling(value: Scrolling) {
    if (this._isScrolling === value) return
    this._isScrolling = value
    this.opts.el.classList.toggle('es-scrolling', !!value)
  }

  get isStopped(): boolean {
    return this._isStopped
  }

  get isLocked(): boolean {
    return this._isLocked
  }

  get isHorizontal(): boolean {
    return this.opts.orientation === 'horizontal'
  }

  get limit(): number {
    return this.dimensions.limit[this.isHorizontal ? 'x' : 'y']
  }

  get scroll(): number {
    return this.opts.infinite
      ? modulo(this.animatedScroll, this.limit)
      : this.animatedScroll
  }

  get progress(): number {
    if (this.limit === 0) return 1
    return this.scroll / this.limit
  }

  get isMobile(): boolean {
    return this._isMobile
  }

  // ---------------------------------------------------------------------------
  // VirtualScrollHost interface (used by VirtualScrollHandler)
  // ---------------------------------------------------------------------------

  emitVirtualScroll(data: {
    deltaX: number
    deltaY: number
    event: Event
  }): void {
    this.emitter.emit('virtual-scroll', data)
  }

  stopAnimation(): void {
    this.animate.stop()
  }

  // ---------------------------------------------------------------------------
  // Native scroll integration
  // ---------------------------------------------------------------------------

  private get isWindowScroll(): boolean {
    const document = getDocument()
    return this.opts.el === document.documentElement
  }

  get wrapperElement(): HTMLElement | Window {
    return this.isWindowScroll ? window : this.opts.el
  }

  private get actualScroll(): number {
    if (this.isWindowScroll) {
      return this.isHorizontal ? window.scrollX : window.scrollY
    }
    return this.isHorizontal ? this.opts.el.scrollLeft : this.opts.el.scrollTop
  }

  private setScroll(value: number): void {
    this.wrapperElement.scrollTo({
      [this.isHorizontal ? 'left' : 'top']: value,
      behavior: 'instant' as ScrollBehavior,
    })
  }

  private initNativeListeners(): void {
    this.wrapperElement.addEventListener('scroll', this.onNativeScroll, {
      passive: true,
    })
  }

  private readonly onNativeScroll = (): void => {
    if (this._resetVelocityTimeout !== null) {
      clearTimeout(this._resetVelocityTimeout)
      this._resetVelocityTimeout = null
    }

    if (this._preventNativeScrollCounter > 0) {
      this._preventNativeScrollCounter--
      return
    }

    if (this._isScrolling !== false && this._isScrolling !== 'native') return
    if (this.opts.infinite) return

    const lastScroll = this.animatedScroll
    this.animatedScroll = this.targetScroll = this.actualScroll
    this.lastVelocity = this.velocity
    this.velocity = this.animatedScroll - lastScroll
    this.direction = Math.sign(this.velocity) as EmotionScroll['direction']

    if (!this._isStopped) this.isScrolling = 'native'
    this.emit()

    if (this.velocity !== 0) {
      this._resetVelocityTimeout = setTimeout(() => {
        this.lastVelocity = this.velocity
        this.velocity = 0
        this.isScrolling = false
        this.emit()
      }, 400)
    }
  }

  private preventNextNativeScrollEvent(): void {
    this._preventNativeScrollCounter++
    const timer = setTimeout(() => {
      if (this._preventNativeScrollCounter > 0) this._preventNativeScrollCounter--
      this._preventTimers = this._preventTimers.filter(t => t !== timer)
    }, 100)
    this._preventTimers.push(timer)
  }

  // ---------------------------------------------------------------------------
  // Mobile breakpoint
  // ---------------------------------------------------------------------------

  private initMobileCheck(): void {
    if (this.opts.breakpoint) {
      this._isMobile = window.innerWidth < this.opts.breakpoint
      window.addEventListener('resize', this.onMobileResize)
    }
  }

  private initVirtualScroll(): void {
    this.vsHandler = new VirtualScrollHandler(this)
    this.vsHandler.setup()
  }

  private readonly onMobileResize = (): void => {
    if (!this.opts.breakpoint) return

    const wasMobile = this._isMobile
    this._isMobile = window.innerWidth < this.opts.breakpoint

    if (wasMobile === this._isMobile) return

    if (this._isMobile) {
      this.vsHandler?.destroy()
      this.vsHandler = null
      this.scrollbar?.destroy()
      this.scrollbar = null
    } else {
      if (!this.vsHandler) this.initVirtualScroll()
      if (!this.scrollbar && this.opts.scrollbar.enabled) {
        this.scrollbar = new Scrollbar(this, this._raf, this.opts.scrollbar)
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Reduced motion
  // ---------------------------------------------------------------------------

  private initReducedMotion(): void {
    if (typeof window.matchMedia !== 'function') return
    this._motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    this._reducedMotion = this._motionQuery.matches
    this._motionQuery.addEventListener('change', this.onReducedMotionChange)
  }

  private readonly onReducedMotionChange = (e: MediaQueryListEvent): void => {
    this._reducedMotion = e.matches
  }

  // ---------------------------------------------------------------------------
  // Scroll position persistence
  // ---------------------------------------------------------------------------

  private readonly STORAGE_KEY = 'emotion-scroll-position'

  private restoreScrollPosition(): void {
    const saved = window.localStorage.getItem(this.STORAGE_KEY)
    if (saved !== null) {
      const pos = Number(saved)
      if (!Number.isNaN(pos)) this.scrollTo(pos, {immediate: true})
    }
  }

  private persistScrollPosition(): void {
    window.localStorage.setItem(this.STORAGE_KEY, String(this.animatedScroll))
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  private resetState(): void {
    this._isLocked = false
    this.isScrolling = false

    if (this.opts.infinite) {
      const wrapped = this.scroll
      this.animatedScroll = this.targetScroll = wrapped
    } else {
      this.animatedScroll = this.targetScroll = this.actualScroll
    }

    this.lastVelocity = this.velocity = 0
    this.animate.stop()
  }

  private emit(): void {
    this.emitter.emit('scroll', {
      position: this.scroll,
      direction: this.direction,
      velocity: this.velocity,
      progress: this.progress,
    } as IEventArgs)
  }
}
