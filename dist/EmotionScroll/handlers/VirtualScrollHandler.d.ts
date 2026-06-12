import type { ScrollHost } from './ScrollHost';
/**
 * Owns raw wheel + touch input for the scroll pipeline.
 *
 * Wheel is normalised inline (previously via `virtual-scroll`, which was
 * dropped to shrink the bundle and because we only needed its wheel
 * path). Touch is tracked with a dedicated velocity sampler so release
 * inertia reflects actual finger motion rather than the tween's
 * per-frame delta.
 */
export declare class VirtualScrollHandler {
    private readonly host;
    private eventTarget;
    private listenerOpts;
    private readonly finger;
    private lastTouchX;
    private lastTouchY;
    private pendingWheelDelta;
    constructor(host: ScrollHost);
    setup(): void;
    destroy(): void;
    /**
     * Apply the wheel input accumulated since the previous frame. Clamping
     * the per-frame total (instead of each event) keeps scroll speed
     * independent of how many events a device fires per second; the cap is
     * scaled by the actual frame dt so 120Hz displays don't get a 2× ceiling.
     * Input beyond the cap carries over to subsequent frames instead of
     * being dropped, so a legitimate oversized intent (a page-mode tick is
     * a full viewport) still travels its whole distance — only the rate is
     * limited. Called from the host's RAF update before the animation
     * advances.
     */
    flush(deltaTime: number): void;
    private bindInput;
    private readonly onWheel;
    private readonly onTouchStart;
    private readonly onTouchMove;
    private readonly onTouchEnd;
    private onScrollEvent;
    private isWithinBounds;
}
