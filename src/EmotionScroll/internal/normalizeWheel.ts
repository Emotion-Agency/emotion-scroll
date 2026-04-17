/**
 * Convert a raw WheelEvent into pixel deltas with the sign convention
 * used by onVirtualScroll (inverted from DOM: positive deltaY means the
 * user intends to scroll *up*). Handles deltaMode LINE (Firefox notched
 * mouse wheels) and the rarely-emitted PAGE mode.
 */

const LINE_HEIGHT_PX = 40
const PAGE_FALLBACK_PX = 800

export function normalizeWheel(
  e: WheelEvent,
): {deltaX: number; deltaY: number} {
  let dx = e.deltaX
  let dy = e.deltaY

  if (e.deltaMode === 1) {
    dx *= LINE_HEIGHT_PX
    dy *= LINE_HEIGHT_PX
  } else if (e.deltaMode === 2) {
    const pageH =
      typeof window !== 'undefined' && window.innerHeight
        ? window.innerHeight
        : PAGE_FALLBACK_PX
    dx *= pageH
    dy *= pageH
  }

  return {deltaX: -dx, deltaY: -dy}
}
