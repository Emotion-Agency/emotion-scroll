import {clamp, damp} from '@emotionagency/utils'
import type {EasingFunction} from './types'

interface AnimateOptions {
  lerp?: number
  duration?: number
  easing?: EasingFunction
  onStart?: () => void
  onUpdate?: (value: number, completed: boolean) => void
}

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

  advance(deltaTime: number): void {
    if (!this.isRunning) return

    let completed = false

    if (this.duration && this.easing) {
      this.currentTime += deltaTime
      const linearProgress = clamp(this.currentTime / this.duration, 0, 1)
      completed = linearProgress >= 1
      const easedProgress = completed ? 1 : this.easing(linearProgress)
      this.value = this.from + (this.to - this.from) * easedProgress
    } else if (this.lerp) {
      this.value = damp(this.value, this.to, this.lerp * 60, deltaTime)
      if (Math.abs(this.value - this.to) < 0.5) {
        this.value = this.to
        completed = true
      }
    } else {
      this.value = this.to
      completed = true
    }

    if (completed) this.stop()

    this.onUpdate?.(this.value, completed)
  }

  fromTo(from: number, to: number, options: AnimateOptions): void {
    this.from = this.value = from
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
  }
}
