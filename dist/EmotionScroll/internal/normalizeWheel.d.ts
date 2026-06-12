/**
 * Convert a raw WheelEvent into pixel deltas with the sign convention
 * used by the scroll pipeline (inverted from DOM: positive deltaY means
 * the user intends to scroll *up*).
 *
 * Uses the standard `deltaX/Y` only — the legacy `wheelDeltaX/Y` is
 * intentionally ignored: Chrome/Safari report it ~3× larger than the
 * standard delta on trackpads but only ~1.2× on mouse notches, which
 * made scroll speed depend on the input device. `deltaMode` units are
 * converted to pixels so every browser/device lands on the same scale:
 *   - DOM_DELTA_LINE  → ~33.3px per line (3 lines/notch ≈ Chrome's
 *     ~100px per notch)
 *   - DOM_DELTA_PAGE  → one viewport per tick
 */
export declare function normalizeWheel(e: WheelEvent): {
    deltaX: number;
    deltaY: number;
};
