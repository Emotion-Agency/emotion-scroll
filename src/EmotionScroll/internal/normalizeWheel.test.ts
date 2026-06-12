import {describe, expect, it} from 'vitest'

import {WHEEL_LINE_HEIGHT_PX} from '../constants'

// normalizeWheel captures `window` via ssr-window at module load, so the
// stub must exist before the module is imported (tests run in node env).
;(globalThis as {window?: unknown}).window = {
  innerWidth: 1024,
  innerHeight: 768,
}
const {normalizeWheel} = await import('./normalizeWheel')

interface WheelLike {
  deltaX?: number
  deltaY?: number
  deltaMode?: number
  wheelDeltaX?: number
  wheelDeltaY?: number
}

function wheel(partial: WheelLike): WheelEvent {
  return {deltaX: 0, deltaY: 0, deltaMode: 0, ...partial} as WheelEvent
}

describe('normalizeWheel', () => {
  it('passes pixel deltas (deltaMode 0) through with inverted sign', () => {
    expect(normalizeWheel(wheel({deltaX: 10, deltaY: 100}))).toEqual({
      deltaX: -10,
      deltaY: -100,
    })
  })

  it('ignores the legacy wheelDeltaX/Y', () => {
    const result = normalizeWheel(
      wheel({deltaY: 100, wheelDeltaY: 360, wheelDeltaX: 30}),
    )
    expect(result).toEqual({deltaX: -0, deltaY: -100})
  })

  it('converts DOM_DELTA_LINE so 3 lines ≈ 100px (Chrome notch parity)', () => {
    const {deltaY} = normalizeWheel(wheel({deltaY: 3, deltaMode: 1}))
    expect(deltaY).toBeCloseTo(-100)
    expect(deltaY).toBe(-3 * WHEEL_LINE_HEIGHT_PX)
  })

  it('converts DOM_DELTA_PAGE to one viewport per tick, per axis', () => {
    expect(normalizeWheel(wheel({deltaY: 1, deltaMode: 2}))).toEqual({
      deltaX: -0,
      deltaY: -768,
    })
    expect(normalizeWheel(wheel({deltaX: 1, deltaMode: 2}))).toEqual({
      deltaX: -1024,
      deltaY: -0,
    })
  })

  it('keeps the inverted sign convention (scroll down → negative)', () => {
    expect(normalizeWheel(wheel({deltaY: -120})).deltaY).toBe(120)
  })
})
