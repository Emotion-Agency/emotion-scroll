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
    constructor(host: ScrollHost);
    setup(): void;
    destroy(): void;
    private bindInput;
    private readonly onWheel;
    private readonly onTouchStart;
    private readonly onTouchMove;
    private readonly onTouchEnd;
    private onScrollEvent;
    private isWithinBounds;
}
