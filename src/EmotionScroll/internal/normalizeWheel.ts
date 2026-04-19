/**
 * Convert a raw WheelEvent into pixel deltas with the sign convention
 * used by the scroll pipeline (inverted from DOM: positive deltaY means
 * the user intends to scroll *up*).
 *
 * Matches virtual-scroll@2.2.1's `_onWheel` semantics so wheel feel
 * stays identical after the lib was dropped from dependencies:
 *   - Prefer the non-standard `wheelDeltaX/Y` when present. Chrome and
 *     Safari keep it and its magnitude (~1.2× the standard `deltaX/Y`)
 *     is what the library's defaults were tuned against. Firefox
 *     removed it — the `-delta*` fallback covers that.
 *   - On Firefox's notched mouse-wheel path (deltaMode LINE), multiply
 *     by 15 as virtual-scroll's `firefoxMultiplier` did.
 */

interface LegacyWheelEvent extends WheelEvent {
  wheelDeltaX?: number
  wheelDeltaY?: number
}

const FIREFOX_LINE_MULTIPLIER = 15

export function normalizeWheel(
  e: WheelEvent,
): {deltaX: number; deltaY: number} {
  const le = e as LegacyWheelEvent
  let dx = le.wheelDeltaX || -e.deltaX
  let dy = le.wheelDeltaY || -e.deltaY

  if (e.deltaMode === 1) {
    dx *= FIREFOX_LINE_MULTIPLIER
    dy *= FIREFOX_LINE_MULTIPLIER
  }

  return {deltaX: dx, deltaY: dy}
}
