import type {IOpts} from './types'

/**
 * Tuning that mimics the momentum curve of native iOS scrolling.
 *
 *   - Longer, more elastic inertia after release
 *   - Higher cap so aggressive flicks actually travel far
 *   - Slightly gentler follow-lerp for a settled feel
 *
 * Spread at construction:
 *
 *   new EmotionScroll({ ...iosMomentumPreset })
 */
export const iosMomentumPreset: Partial<IOpts> = {
  syncTouch: true,
  syncTouchLerp: 0.08,
  touchInertiaExponent: 2,
  maxTouchInertia: 3000,
}
