import {clamp, damp} from '@emotionagency/utils'

import {
  LERP_COMPLETION_EPSILON,
  LERP_RATE_PER_SECOND,
  MOMENTUM_DECAY_RATE_PER_SECOND,
  MOMENTUM_VELOCITY_EPSILON,
} from './constants'
import type {EasingFunction} from './types'

interface AnimateOptions {
  lerp?: number
  duration?: number
  easing?: EasingFunction
  onStart?: () => void
  onUpdate?: (value: number, completed: boolean) => void
}

/**
 * Frame-rate independent tween supporting either exponential-lerp or
 * fixed-duration-with-easing modes.
 *
 * When a new `fromTo()` interrupts an in-flight tween, the inherited
 * per-second velocity is captured and added to subsequent frames while
 * it decays exponentially toward zero. This prevents the visible
 * deceleration spike that would otherwise occur when a programmatic
 * scrollTo (e.g. a snap) lands on top of a user-driven lerp.
 */
export class Animate {
  isRunning = false
  value = 0

  private from = 0
  private to = 0
  private currentTime = 0
  private lerp?: number
  private duration?: number
  private easing?: EasingFunction
  private onUpdate?: (value: number, completed: boolean) => void

  // Momentum carryover state
  private previousValue = 0
  private lastDeltaTime = 0
  private momentumVelocity = 0

  advance(deltaTime: number): void {
    if (!this.isRunning) return

    this.previousValue = this.value
    this.lastDeltaTime = deltaTime

    let completed = false

    if (this.duration && this.easing) {
      this.currentTime += deltaTime
      const linearProgress = clamp(this.currentTime / this.duration, 0, 1)
      completed = linearProgress >= 1
      const easedProgress = completed ? 1 : this.easing(linearProgress)
      this.value = this.from + (this.to - this.from) * easedProgress
    } else if (this.lerp) {
      this.value = damp(this.value, this.to, this.lerp * LERP_RATE_PER_SECOND, deltaTime)
    } else {
      this.value = this.to
      completed = true
    }

    if (this.momentumVelocity !== 0) {
      this.momentumVelocity = damp(
        this.momentumVelocity,
        0,
        MOMENTUM_DECAY_RATE_PER_SECOND,
        deltaTime,
      )
      this.value += this.momentumVelocity * deltaTime
      if (Math.abs(this.momentumVelocity) < MOMENTUM_VELOCITY_EPSILON) {
        this.momentumVelocity = 0
      }
    }

    // Lerp-mode completion is deferred until momentum has settled so the
    // epsilon snap doesn't fire while the blend is still contributing.
    if (
      !completed &&
      this.lerp &&
      !this.duration &&
      this.momentumVelocity === 0 &&
      Math.abs(this.value - this.to) < LERP_COMPLETION_EPSILON
    ) {
      this.value = this.to
      completed = true
    }

    if (completed) this.stop()

    this.onUpdate?.(this.value, completed)
  }

  fromTo(from: number, to: number, options: AnimateOptions): void {
    this.momentumVelocity =
      this.isRunning && this.lastDeltaTime > 0
        ? (this.value - this.previousValue) / this.lastDeltaTime
        : 0

    this.from = this.value = this.previousValue = from
    this.to = to
    this.lerp = options.lerp
    this.duration = options.duration
    this.easing = options.easing
    this.currentTime = 0
    this.isRunning = true
    this.onUpdate = options.onUpdate

    options.onStart?.()
  }

  stop(): void {
    this.isRunning = false
    this.momentumVelocity = 0
  }
}
