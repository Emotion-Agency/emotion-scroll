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
 * Bridges native scroll events into the controller.
 *
 * Native `scroll` events fire both from our own programmatic writes and
 * from user scrolling. We distinguish them by comparing the event's
 * `scrollTop` to the last value we wrote via `markSet()`. Browsers
 * report integer scroll positions, so a 1.5px tolerance covers rounding
 * of the float value we wrote against the integer the browser echoed.
 *
 * After a genuine native-scroll burst, `settleTimer` fires once velocity
 * has stabilised to reset the controller back to the idle state.
 */
export declare class NativeScrollBridge {
    private readonly wrapper;
    private readonly host;
    private settleTimer;
    private lastSetValue;
    constructor(wrapper: HTMLElement | Window, host: NativeScrollBridgeHost);
    /** Record the value we're about to write so our own scroll event is
     *  distinguishable from a user-initiated scroll. */
    markSet(value: number): void;
    destroy(): void;
    private readonly onScroll;
}
