import type { ResolvedOpts } from '../opts';
import type { ScrollToOptions, Scrolling } from '../types';
export interface VirtualScrollHost {
    readonly opts: ResolvedOpts;
    animatedScroll: number;
    targetScroll: number;
    velocity: number;
    readonly limit: number;
    readonly isHorizontal: boolean;
    readonly isStopped: boolean;
    readonly isLocked: boolean;
    isScrolling: Scrolling;
    isTouching: boolean;
    scrollTo(target: number, options?: ScrollToOptions): void;
    emitVirtualScroll(data: {
        deltaX: number;
        deltaY: number;
        event: Event;
    }): void;
    stopAnimation(): void;
}
export declare class VirtualScrollHandler {
    private readonly host;
    private vs;
    constructor(host: VirtualScrollHost);
    setup(): void;
    destroy(): void;
    private readonly onVirtualScroll;
    private isWithinBounds;
}
