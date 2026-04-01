import VirtualScroll from 'virtual-scroll'
import Emitter from 'tiny-emitter/dist/tinyemitter'
import {raf, clamp, modulo} from '@emotionagency/utils'

import {getWindow, getDocument} from 'ssr-window'
import {Animate} from './Animate'
import {Dimensions} from './Dimensions'
import {resolveOpts, type ResolvedOpts} from './opts'
import {keyCodes} from './keyCodes'
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
const document = getDocument()

function shouldPreventScroll(
  node: HTMLElement | null,
  rootEl: HTMLElement,
  opts: ResolvedOpts,
): boolean {
  while (node && node !== rootEl) {
    if (node.hasAttribute?.('data-scroll-ignore')) {
      return true
    }
    if (typeof opts.prevent === 'function' && opts.prevent(node)) {
      return true
    }
    node = node.parentElement
  }
  return false
}

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
  private _time = 0
  private _isMobile = false

  // --- Dependencies ---
  private readonly opts: ResolvedOpts
  private readonly animate = new Animate()
  private readonly emitter = new Emitter()
  private readonly dimensions: Dimensions
  private readonly _raf: TRAF

  private vs: typeof VirtualScroll.prototype | null = null
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
      this.setupVirtualScroll()
      if (this.opts.scrollbar) {
        this.scrollbar = new Scrollbar(this, this._raf)
      }
    }

    if (this.opts.useKeyboardSmooth) {
      window.addEventListener('keydown', this.onKeyDown, false)
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

    // --- Resolve target to a pixel value ---
    let target = this.resolveScrollTarget(_target, offset)
    if (target === null) return

    // Clamp or wrap
    target = this.opts.infinite ? target : clamp(target, 0, this.limit)

    // Already there
    if (target === this.targetScroll) {
      onStart?.(this)
      onComplete?.(this)
      return
    }

    // Reduced motion → force immediate
    if (this._reducedMotion) {
      immediate = true
    }

    if (immediate) {
      this.animatedScroll = this.targetScroll = target
      this.setScroll(this.scroll)
      this.resetState()
      this.preventNextNativeScrollEvent()
      this.emit()
      onComplete?.(this)
      return
    }

    // Use provided values or fall back to instance defaults
    const animLerp = lerp ?? this.opts.lerp
    const animDuration = duration ?? this.opts.duration
    const animEasing = easing ?? this.opts.easing

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

          if (this.opts.saveScrollPosition) {
            this.persistScrollPosition()
          }
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

  /** Call this manually each frame when `autoRaf` is `false`. */
  readonly update = (): void => {
    const now = performance.now()
    const deltaTime = (now - (this._time || now)) * 0.001 // seconds
    this._time = now

    this.animate.advance(deltaTime)
  }

  destroy(): void {
    this._raf.off(this.update)
    this.vs?.destroy()
    this.vs = null
    this.dimensions.destroy()
    this.scrollbar?.destroy()
    this.scrollbar = null

    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('resize', this.onMobileResize)
    this.wrapperElement.removeEventListener('scroll', this.onNativeScroll)

    this._motionQuery?.removeEventListener('change', this.onReducedMotionChange)

    if (this._resetVelocityTimeout !== null) {
      clearTimeout(this._resetVelocityTimeout)
    }

    for (const timer of this._preventTimers) {
      clearTimeout(timer)
    }
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

  private set isScrolling(value: Scrolling) {
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
  // Native scroll integration
  // ---------------------------------------------------------------------------

  private get isWindowScroll(): boolean {
    return this.opts.el === document.documentElement
  }

  private get wrapperElement(): HTMLElement | Window {
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

    // Only track native scroll when not in smooth animation
    if (this._isScrolling !== false && this._isScrolling !== 'native') return

    // In infinite mode, native scroll events are just wrapping side-effects — ignore them
    if (this.opts.infinite) return

    const lastScroll = this.animatedScroll
    this.animatedScroll = this.targetScroll = this.actualScroll
    this.lastVelocity = this.velocity
    this.velocity = this.animatedScroll - lastScroll
    this.direction = Math.sign(this.velocity) as EmotionScroll['direction']

    if (!this._isStopped) {
      this.isScrolling = 'native'
    }

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
      if (this._preventNativeScrollCounter > 0) {
        this._preventNativeScrollCounter--
      }
      this._preventTimers = this._preventTimers.filter(t => t !== timer)
    }, 100)
    this._preventTimers.push(timer)
  }

  // ---------------------------------------------------------------------------
  // Virtual scroll (wheel / touch input)
  // ---------------------------------------------------------------------------

  private setupVirtualScroll(): void {
    this.vs = new VirtualScroll({
      el: this.opts.el === document.documentElement ? undefined : this.opts.el,
      touchMultiplier: this.opts.touchMultiplier,
      passive: this.opts.passive,
      useKeyboard: false,
    })

    this.vs.on(this.onVirtualScroll)
  }

  private readonly onVirtualScroll = (e: {
    deltaX: number
    deltaY: number
    originalEvent: WheelEvent | TouchEvent
  }): void => {
    const event = e.originalEvent
    const isTouch = event.type.includes('touch')
    const isWheel = event.type.includes('wheel')

    // Ctrl+wheel = zoom, not scroll
    if ('ctrlKey' in event && event.ctrlKey) return

    this.isTouching = event.type === 'touchstart' || event.type === 'touchmove'

    // Check if target should be ignored
    if (
      shouldPreventScroll(event.target as HTMLElement, this.opts.el, this.opts)
    ) {
      return
    }

    if (this._isStopped || this._isLocked) return

    const isSmooth =
      (this.opts.syncTouch && isTouch) || (this.opts.smoothWheel && isWheel)

    if (!isSmooth) {
      this.isScrolling = 'native'
      this.animate.stop()
      return
    }

    // Emit virtual-scroll event
    this.emitter.emit('virtual-scroll', {
      deltaX: e.deltaX,
      deltaY: e.deltaY,
      event,
    })

    // Resolve delta based on gesture orientation
    let delta: number
    if (this.opts.gestureOrientation === 'both') {
      delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
    } else if (this.opts.gestureOrientation === 'horizontal') {
      delta = e.deltaX
    } else {
      delta = e.deltaY
    }

    // Ignore zero deltas (taps, unknown gestures)
    if (delta === 0) return

    // Negate: virtual-scroll gives positive delta for scroll-up
    delta = -delta

    // Apply wheel multiplier
    if (isWheel) {
      delta *= this.opts.wheelMultiplier
    }

    // Clamp to prevent jarring jumps from high-precision devices
    delta = clamp(delta, -this.opts.maxScrollDelta, this.opts.maxScrollDelta)

    // Handle touch inertia on touchend
    const isTouchEnd = isTouch && event.type === 'touchend'
    if (isTouchEnd && this.opts.syncTouch) {
      const inertia =
        Math.sign(this.velocity) *
        Math.abs(this.velocity) ** this.opts.touchInertiaExponent

      delta = clamp(
        inertia,
        -this.opts.maxTouchInertia,
        this.opts.maxTouchInertia,
      )
    }

    // Prevent native scroll when we're handling it
    if (
      !this.opts.overscroll ||
      this.opts.infinite ||
      this.isWithinBounds(delta)
    ) {
      if ('cancelable' in event && event.cancelable) {
        event.preventDefault()
      }
    }

    const isSyncTouch = isTouch && this.opts.syncTouch
    const hasTouchInertia = isSyncTouch && isTouchEnd

    this.scrollTo(this.targetScroll + delta, {
      ...(isSyncTouch
        ? {lerp: hasTouchInertia ? this.opts.syncTouchLerp : 1}
        : {
            lerp: this.opts.lerp,
            duration: this.opts.duration,
            easing: this.opts.easing,
          }),
    })
  }

  private isWithinBounds(delta: number): boolean {
    if (this.limit <= 0) return false
    return (
      (this.animatedScroll > 0 && this.animatedScroll < this.limit) ||
      (this.animatedScroll === 0 && delta > 0) ||
      (this.animatedScroll === this.limit && delta < 0)
    )
  }

  // ---------------------------------------------------------------------------
  // Keyboard
  // ---------------------------------------------------------------------------

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    if (this._isStopped || this.limit <= 0) return

    const step = this.opts.keyboardScrollStep
    let target: number | null = null

    switch (e.key) {
      case keyCodes.TAB: {
        const focused = document.activeElement as HTMLElement
        if (focused) {
          const rect = focused.getBoundingClientRect()
          const offset = this.isHorizontal ? rect.left : rect.top
          target = this.animatedScroll + offset
        }
        break
      }
      case keyCodes.UP:
        target = this.targetScroll - step
        break
      case keyCodes.DOWN:
        target = this.targetScroll + step
        break
      case keyCodes.LEFT:
        if (this.isHorizontal) target = this.targetScroll - step
        break
      case keyCodes.RIGHT:
        if (this.isHorizontal) target = this.targetScroll + step
        break
      case keyCodes.PAGEUP:
        target =
          this.targetScroll -
          (this.isHorizontal ? window.innerWidth : window.innerHeight)
        break
      case keyCodes.PAGEDOWN:
        target =
          this.targetScroll +
          (this.isHorizontal ? window.innerWidth : window.innerHeight)
        break
      case keyCodes.HOME:
        target = 0
        break
      case keyCodes.END:
        target = this.limit
        break
    }

    if (target !== null) {
      this.scrollTo(clamp(target, 0, this.limit))
    }
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

  private readonly onMobileResize = (): void => {
    if (!this.opts.breakpoint) return

    const wasMobile = this._isMobile
    this._isMobile = window.innerWidth < this.opts.breakpoint

    if (wasMobile === this._isMobile) return

    if (this._isMobile) {
      this.vs?.destroy()
      this.vs = null
      this.scrollbar?.destroy()
      this.scrollbar = null
    } else {
      if (!this.vs) this.setupVirtualScroll()
      if (!this.scrollbar && this.opts.scrollbar) {
        this.scrollbar = new Scrollbar(this, this._raf)
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Reduced motion
  // ---------------------------------------------------------------------------

  private _motionQuery: MediaQueryList | null = null

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
      if (!Number.isNaN(pos)) {
        this.scrollTo(pos, {immediate: true})
      }
    }
  }

  private persistScrollPosition(): void {
    window.localStorage.setItem(this.STORAGE_KEY, String(this.animatedScroll))
  }

  // ---------------------------------------------------------------------------
  // Scroll target resolution
  // ---------------------------------------------------------------------------

  private resolveScrollTarget(
    target: ScrollTarget,
    offset: number,
  ): number | null {
    // Keywords
    if (typeof target === 'string') {
      if (['top', 'left', 'start'].includes(target)) return 0 + offset
      if (['bottom', 'right', 'end'].includes(target))
        return this.limit + offset

      // CSS selector
      const node = document.querySelector(target) as HTMLElement | null
      if (!node) return null
      return this.getElementScrollOffset(node) + offset
    }

    // HTMLElement
    if (target instanceof HTMLElement) {
      return this.getElementScrollOffset(target) + offset
    }

    // Number
    if (typeof target === 'number') {
      return target + offset
    }

    return null
  }

  private getElementScrollOffset(node: HTMLElement): number {
    const rect = node.getBoundingClientRect()
    const prop = this.isHorizontal ? 'left' : 'top'

    // Account for scroll-margin CSS property
    const style = getComputedStyle(node)
    const scrollMargin =
      parseFloat(
        this.isHorizontal ? style.scrollMarginLeft : style.scrollMarginTop,
      ) || 0

    return rect[prop] + this.animatedScroll - scrollMargin
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  private resetState(): void {
    this._isLocked = false
    this.isScrolling = false

    if (this.opts.infinite) {
      // In infinite mode, snap accumulated scroll to the wrapped value
      // so it doesn't grow unbounded while keeping position consistent
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
