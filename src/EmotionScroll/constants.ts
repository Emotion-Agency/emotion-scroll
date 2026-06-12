// Timer & animation tuning
export const NATIVE_SCROLL_VELOCITY_RESET_MS = 400
export const SCROLLBAR_INACTIVITY_MS = 1000
export const DIMENSIONS_DEBOUNCE_MS = 250
export const LERP_COMPLETION_EPSILON = 0.5
export const LERP_RATE_PER_SECOND = 60

// Wheel normalization
// 3 lines per notch × 33.3px ≈ 100px — parity with Chrome's per-notch deltaY.
export const WHEEL_LINE_HEIGHT_PX = 100 / 3
// Cap on dt scaling of the per-frame wheel clamp so a stalled frame
// can't multiply the allowed delta unboundedly.
export const MAX_FRAME_DT_FACTOR = 2
export const SCROLLBAR_THUMB_MIN_SIZE_PX = 60
export const SCROLL_POSITION_STORAGE_KEY = 'emotion-scroll-position'

// IOpts defaults
export const DEFAULT_EASED_DURATION_SEC = 1.5
export const DEFAULT_LERP = 0.1
export const DEFAULT_SYNC_TOUCH_LERP = 0.075
export const DEFAULT_TOUCH_INERTIA_EXPONENT = 1.7
export const DEFAULT_WHEEL_MULTIPLIER = 1
export const DEFAULT_TOUCH_MULTIPLIER = 1
// Max accumulated wheel input applied per frame, normalized to 60fps.
// A safety net against anomalous jumps, not a speed governor — a mouse
// notch with aggressive OS multipliers must pass unclamped.
export const DEFAULT_MAX_SCROLL_DELTA = 360
export const DEFAULT_KEYBOARD_STEP_PX = 120
export const DEFAULT_MAX_TOUCH_INERTIA = 1000
