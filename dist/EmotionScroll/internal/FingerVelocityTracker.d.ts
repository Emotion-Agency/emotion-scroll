/**
 * Samples finger position during a touch gesture and computes flick
 * velocity at release time. Velocity is normalised to pixels per ~16.67ms
 * frame so it can be fed into the existing inertia formula, which was
 * tuned for per-frame scroll deltas.
 */
export declare class FingerVelocityTracker {
    private readonly samples;
    reset(): void;
    add(x: number, y: number, now?: number): void;
    /** Returns {x, y} velocity in px/frame, matching host.velocity scale. */
    velocity(now?: number): {
        x: number;
        y: number;
    };
    private trim;
}
