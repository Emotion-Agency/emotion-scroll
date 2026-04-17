import Emitter from 'tiny-emitter/dist/tinyemitter'
import {raf, clamp, modulo} from '@emotionagency/utils'

import {getWindow, getDocument} from 'ssr-window'
import {Animate} from './Animate'
import {Dimensions} from './Dimensions'
import {resolveEasing} from './easings'
import {resolveOpts, type ResolvedOpts} from './opts'
import {resolveScrollTarget} from './ScrollTarget'
import {AnchorHandler} from './handlers/AnchorHandler'
import {KeyboardHandler} from './handlers/KeyboardHandler'
import {VirtualScrollHandler} from './handlers/VirtualScrollHandler'
import {MobileBreakpoint} from './internal/MobileBreakpoint'
import {NativeScrollBridge} from './internal/NativeScrollBridge'
import {ReducedMotion} from './internal/ReducedMotion'
import {ScrollPersistence} from './internal/ScrollPersistence'
import Scrollbar from './Scrollbar'
import type {
  IEventArgs,
  IOpts,
  IScrollController,
  ScrollTarget,
  ScrollToOptions,
  Scrolling,
  TRAF,
} from './types'

const window = getWindow()

type Direction = 1 | -1 | 0

export default class EmotionScroll implements IScrollController {
  // --- Public state ---
  animatedScroll = 0
  targetScroll = 0
  velocity = 0
  lastVelocity = 0
  direction: Direction = 0
  isTouching = false

  // --- Private state ---
  private _isScrolling: Scrolling = false
  private _isStopped = false
  private _isLocked = false
  private _time = 0

  // --- Dependencies ---
  readonly opts: ResolvedOpts
  private readonly raf: TRAF
  private readonly animate = new Animate()
  private readonly emitter = new Emitter()
  private readonly dimensions: Dimensions
  private readonly nativeScroll: NativeScrollBridge
  private readonly reducedMotion = new ReducedMotion()
  private readonly mobile: MobileBreakpoint
  private readonly persistence = new ScrollPersistence()

  // --- Handlers ---
  private vsHandler: VirtualScrollHandler | null = null
  private keyboardHandler: KeyboardHandler | null = null
  private anchorHandler: AnchorHandler | null = null
  private scrollbar: Scrollbar | null = null

  constructor(opts: IOpts = {}) {
    this.opts = resolveOpts(opts)
    this.raf = this.opts.raf || raf

    this.dimensions = new Dimensions(this.wrapperElement, this.opts.content, {
      autoResize: this.opts.autoResize,
    })

    this.animatedScroll = this.targetScroll = this.getActualScroll()

    this.opts.el.classList.add('es-smooth')

    this.nativeScroll = new NativeScrollBridge(this.wrapperElement, this)

    this.mobile = new MobileBreakpoint(
      this.opts.breakpoint,
      () => this.teardownDesktopHandlers(),
      () => this.setupDesktopHandlers(),
    )

    if (!this.mobile.isMobile) this.setupDesktopHandlers()

    if (this.opts.anchors) {
      this.anchorHandler = new AnchorHandler(this, this.wrapperElement)
      this.anchorHandler.init()
    }

    if (this.opts.useKeyboardSmooth) {
      this.keyboardHandler = new KeyboardHandler(this)
      this.keyboardHandler.init()
    }

    if (this.opts.saveScrollPosition) this.restoreScrollPosition()
    if (this.opts.disabled) this.stop()
    if (this.opts.autoRaf) this.raf.on(this.update)
  }

  // ---------------------------------------------------------------------------
  // Read-only projections (IScrollController)
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
    return this.mobile.isMobile
  }

  get wrapperElement(): HTMLElement | Window {
    return this.isWindowScroll ? window : this.opts.el
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

  scrollTo(_target: ScrollTarget, options: ScrollToOptions = {}): void {
    const {force = false, onStart, onComplete} = options

    if ((this._isStopped || this._isLocked) && !force) return

    const target = this.resolveTarget(_target, options.offset ?? 0)
    if (target === null) return

    if (target === this.targetScroll) {
      onStart?.(this)
      onComplete?.(this)
      return
    }

    const immediate = options.immediate || this.reducedMotion.matches
    if (immediate) {
      this.performImmediate(target, onComplete)
      return
    }

    this.performAnimated(target, options)
  }

  start(): void {
    if (!this._isStopped) return
    this.resetState()
    this._isStopped = false
    this.opts.el.classList.remove('e-fixed')
    this.notifyChange()
  }

  stop(): void {
    if (this._isStopped) return
    this.resetState()
    this._isStopped = true
    this.opts.el.classList.add('e-fixed')
    this.notifyChange()
  }

  resize(): void {
    this.dimensions.resize()
    this.animatedScroll = this.targetScroll = this.getActualScroll()
    this.notifyChange()
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
    this.raf.off(this.update)
    this.teardownDesktopHandlers()
    this.keyboardHandler?.destroy()
    this.keyboardHandler = null
    this.anchorHandler?.destroy()
    this.anchorHandler = null
    this.dimensions.destroy()
    this.nativeScroll.destroy()
    this.reducedMotion.destroy()
    this.mobile.destroy()

    this.opts.el.classList.remove('es-smooth', 'es-scrolling', 'e-fixed')
    this.emitter.off('scroll')
    this.emitter.off('virtual-scroll')
  }

  // ---------------------------------------------------------------------------
  // Handler-facing surface (ScrollHost / NativeScrollBridgeHost contracts)
  // ---------------------------------------------------------------------------

  emitVirtualScroll(data: {deltaX: number; deltaY: number; event: Event}): void {
    this.emitter.emit('virtual-scroll', data)
  }

  stopAnimation(): void {
    this.animate.stop()
  }

  getActualScroll(): number {
    if (this.isWindowScroll) {
      return this.isHorizontal ? window.scrollX : window.scrollY
    }
    return this.isHorizontal ? this.opts.el.scrollLeft : this.opts.el.scrollTop
  }

  onScrollChanged(): void {
    this.notifyChange()
  }

  // ---------------------------------------------------------------------------
  // Private — scrollTo pipeline
  // ---------------------------------------------------------------------------

  private resolveTarget(target: ScrollTarget, offset: number): number | null {
    const resolved = resolveScrollTarget(
      target,
      offset,
      this.limit,
      this.isHorizontal,
      this.animatedScroll,
    )
    if (resolved === null) return null
    return this.opts.infinite ? resolved : clamp(resolved, 0, this.limit)
  }

  private performImmediate(
    target: number,
    onComplete?: (i: unknown) => void,
  ): void {
    this.animatedScroll = this.targetScroll = target
    this.setScroll(this.scroll)
    this.resetState()
    this.notifyChange()
    onComplete?.(this)
  }

  private performAnimated(target: number, options: ScrollToOptions): void {
    const animLerp = options.lerp ?? this.opts.lerp
    const animDuration = options.duration ?? this.opts.duration
    const animEasing =
      options.easing !== undefined ? resolveEasing(options.easing) : this.opts.easing
    const lock = options.lock ?? false

    this.targetScroll = target

    this.animate.fromTo(this.animatedScroll, target, {
      lerp: animDuration ? undefined : animLerp,
      duration: animDuration,
      easing: animEasing,
      onStart: () => {
        if (lock) this._isLocked = true
        this.isScrolling = 'smooth'
        options.onStart?.(this)
      },
      onUpdate: (value, completed) => {
        this.isScrolling = 'smooth'
        this.lastVelocity = this.velocity
        this.velocity = value - this.animatedScroll
        this.direction = Math.sign(this.velocity) as Direction
        this.animatedScroll = value
        this.setScroll(this.scroll)

        if (!completed) {
          this.notifyChange()
          return
        }

        this.resetState()
        this.notifyChange()
        options.onComplete?.(this)
        if (this.opts.saveScrollPosition) {
          this.persistence.save(this.animatedScroll)
        }
      },
    })
  }

  // ---------------------------------------------------------------------------
  // Private — DOM / state helpers
  // ---------------------------------------------------------------------------

  private get isWindowScroll(): boolean {
    return this.opts.el === getDocument().documentElement
  }

  private setScroll(value: number): void {
    this.nativeScroll.markSet(value)
    this.wrapperElement.scrollTo({
      [this.isHorizontal ? 'left' : 'top']: value,
      behavior: 'instant' as ScrollBehavior,
    })
  }

  private setupDesktopHandlers(): void {
    if (!this.vsHandler) {
      this.vsHandler = new VirtualScrollHandler(this)
      this.vsHandler.setup()
    }
    if (!this.scrollbar && this.opts.scrollbar.enabled) {
      this.scrollbar = new Scrollbar(this, this.raf, this.opts.scrollbar)
    }
  }

  private teardownDesktopHandlers(): void {
    this.vsHandler?.destroy()
    this.vsHandler = null
    this.scrollbar?.destroy()
    this.scrollbar = null
  }

  private restoreScrollPosition(): void {
    const saved = this.persistence.restore()
    if (saved !== null) this.scrollTo(saved, {immediate: true})
  }

  private resetState(): void {
    this._isLocked = false
    this.isScrolling = false

    if (this.opts.infinite) {
      this.animatedScroll = this.targetScroll = this.scroll
    } else {
      this.animatedScroll = this.targetScroll = this.getActualScroll()
    }

    this.lastVelocity = this.velocity = 0
    this.animate.stop()
  }

  private notifyChange(): void {
    this.emitter.emit('scroll', {
      position: this.scroll,
      direction: this.direction,
      velocity: this.velocity,
      progress: this.progress,
    } as IEventArgs)
  }
}
