/**
 * Samples finger position during a touch gesture and computes flick
 * velocity at release time. Velocity is normalised to pixels per ~16.67ms
 * frame so it can be fed into the existing inertia formula, which was
 * tuned for per-frame scroll deltas.
 */

interface Sample {
  x: number
  y: number
  t: number
}

/**
 * Window used to compute release velocity. Long enough to smooth out
 * jitter at 60Hz touch sampling, short enough to reflect the final
 * acceleration of the flick rather than the full gesture.
 */
const WINDOW_MS = 100

/** Hard cap to bound memory/CPU when touch events fire in a burst. */
const MAX_SAMPLES = 16

const FRAME_MS = 1000 / 60

export class FingerVelocityTracker {
  private readonly samples: Sample[] = []

  reset(): void {
    this.samples.length = 0
  }

  add(x: number, y: number, now: number = performance.now()): void {
    this.trim(now)
    this.samples.push({x, y, t: now})
    if (this.samples.length > MAX_SAMPLES) {
      this.samples.splice(0, this.samples.length - MAX_SAMPLES)
    }
  }

  /** Returns {x, y} velocity in px/frame, matching host.velocity scale. */
  velocity(now: number = performance.now()): {x: number; y: number} {
    this.trim(now)
    if (this.samples.length < 2) return {x: 0, y: 0}

    const first = this.samples[0]
    const last = this.samples[this.samples.length - 1]
    const dt = last.t - first.t
    if (dt <= 0) return {x: 0, y: 0}

    const scale = FRAME_MS / dt
    return {
      x: (last.x - first.x) * scale,
      y: (last.y - first.y) * scale,
    }
  }

  private trim(now: number): void {
    const cutoff = now - WINDOW_MS
    let drop = 0
    while (drop < this.samples.length && this.samples[drop].t < cutoff) drop++
    if (drop > 0) this.samples.splice(0, drop)
  }
}
