# Changelog

## 4.0.1

### Fixed

- **Auto-resize now reaches the controller.** The internal `ResizeObserver`
  updated cached dimensions but never re-clamped the scroll position or
  emitted a `scroll` event, so dynamically added/removed content left
  `progress`, ScrollTrigger and other subscribers stale until the next
  manual scroll. `Dimensions` now reports back to `EmotionScroll`, which
  syncs and notifies on every observed resize.

## 4.0.0

Scroll-speed normalization across input devices. No API signatures were
removed, but **default feel changes** — hence the major bump.

### Breaking / feel changes

- **Wheel normalization now uses the standard `deltaX/Y` only.** The
  legacy `wheelDeltaX/Y` (which Chrome/Safari report ~3× larger on
  trackpads but only ~1.2× on mouse notches) is ignored. All browsers
  and devices now land on the same pixel scale:
  - `DOM_DELTA_LINE` → ~33.3px per line (3 lines/notch ≈ Chrome's
    ~100px per notch; replaces the ad-hoc ×15 Firefox multiplier)
  - `DOM_DELTA_PAGE` → one viewport per tick (was unhandled)

  **Mac trackpads on Chrome/Safari will feel ~3× slower than 3.2.x**
  (they were silently amplified before). Compensate per project with
  `wheelMultiplier` if you want the old speed back, e.g.
  `wheelMultiplier: 3`.
- **`'virtual-scroll'` event magnitudes change accordingly** for
  trackpads on Chrome/Safari (~3× smaller). The sign convention is
  unchanged (positive deltaY = scroll up).
- **`maxScrollDelta` is now a per-frame cap, not per-event.** Wheel
  deltas accumulate between RAF frames and the frame total is clamped,
  so scroll speed no longer depends on how many events a device fires
  per second. The cap is normalized to 60fps and scaled by the actual
  frame dt (high-refresh displays get the same px/sec ceiling). Input
  beyond the cap carries over to subsequent frames instead of being
  dropped — an oversized legitimate intent (e.g. a page-mode tick of a
  full viewport) still travels its whole distance, only the rate is
  limited. Default raised `120` → `360`. If you set `maxScrollDelta`
  explicitly, revisit the value — an explicit `120` now caps mouse
  notches too.

### Added

- **`breakpoint` accepts a media query string or a predicate** in
  addition to a number:
  - `breakpoint: '(hover: none) and (pointer: coarse)'` — switch to
    native scroll by input type (tracked via the media query's `change`
    event, so touch laptops/tablets are handled regardless of width)
  - `breakpoint: () => myCheck()` — custom predicate, re-evaluated on
    resize
  - `breakpoint: 960` — legacy width behavior, unchanged
- `npm test` (vitest) with unit coverage for the wheel normalizer.

### Notes

- Touch inertia defaults are intentionally unchanged; use
  `iosMomentumPreset` for stronger, iOS-like momentum on `syncTouch`.
