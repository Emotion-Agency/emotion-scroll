/**
 * Convert a raw WheelEvent into pixel deltas with the sign convention
 * used by onVirtualScroll (inverted from DOM: positive deltaY means the
 * user intends to scroll *up*). Handles deltaMode LINE (Firefox notched
 * mouse wheels) and the rarely-emitted PAGE mode.
 */
export declare function normalizeWheel(e: WheelEvent): {
    deltaX: number;
    deltaY: number;
};
