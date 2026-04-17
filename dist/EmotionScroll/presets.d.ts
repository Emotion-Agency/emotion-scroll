import type { IOpts } from './types';
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
export declare const iosMomentumPreset: Partial<IOpts>;
