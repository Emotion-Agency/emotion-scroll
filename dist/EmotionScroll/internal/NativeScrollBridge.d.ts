import type { Scrolling } from '../types';
export interface NativeScrollBridgeHost {
    readonly isStopped: boolean;
    readonly opts: {
        infinite: boolean;
    };
    isScrolling: Scrolling;
    animatedScroll: number;
    targetScroll: number;
    velocity: number;
    lastVelocity: number;
    direction: 1 | -1 | 0;
    getActualScroll(): number;
    onScrollChanged(): void;
}
/**
 * Bridges native scroll events to the controller:
 *  - debounces velocity decay after the user stops scrolling natively,
 *  - guards against the feedback loop when the controller itself drives
 *    `element.scrollTo(...)` (see `preventNext()`).
 */
export declare class NativeScrollBridge {
    private readonly wrapper;
    private readonly host;
    private guardCounter;
    private guardTimers;
    private settleTimer;
    constructor(wrapper: HTMLElement | Window, host: NativeScrollBridgeHost);
    preventNext(): void;
    destroy(): void;
    private readonly onScroll;
}
