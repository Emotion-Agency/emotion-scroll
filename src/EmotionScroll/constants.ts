// Timer & animation tuning
export const NATIVE_SCROLL_VELOCITY_RESET_MS = 400
export const SCROLLBAR_INACTIVITY_MS = 1000
export const DIMENSIONS_DEBOUNCE_MS = 250
export const LERP_COMPLETION_EPSILON = 0.5
export const LERP_RATE_PER_SECOND = 60

// Momentum blend-in: when a new tween interrupts an in-flight one, the
// inherited per-second velocity decays at this rate so the new curve
// picks up the old trajectory instead of snapping to zero velocity.
// Rate 30 → ~95% settled after 100ms, ~99% after 150ms.
export const MOMENTUM_DECAY_RATE_PER_SECOND = 30
export const MOMENTUM_VELOCITY_EPSILON = 1
export const SCROLLBAR_THUMB_MIN_SIZE_PX = 60
export const SCROLL_POSITION_STORAGE_KEY = 'emotion-scroll-position'

// IOpts defaults
export const DEFAULT_EASED_DURATION_SEC = 1.5
export const DEFAULT_LERP = 0.1
export const DEFAULT_SYNC_TOUCH_LERP = 0.075
export const DEFAULT_TOUCH_INERTIA_EXPONENT = 1.7
export const DEFAULT_WHEEL_MULTIPLIER = 1
export const DEFAULT_TOUCH_MULTIPLIER = 1
export const DEFAULT_MAX_SCROLL_DELTA = 120
export const DEFAULT_KEYBOARD_STEP_PX = 120
export const DEFAULT_MAX_TOUCH_INERTIA = 1000
