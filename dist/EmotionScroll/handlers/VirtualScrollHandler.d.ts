import type { ScrollHost } from './ScrollHost';
export declare class VirtualScrollHandler {
    private readonly host;
    private vs;
    constructor(host: ScrollHost);
    setup(): void;
    destroy(): void;
    private readonly onVirtualScroll;
    private isWithinBounds;
}
