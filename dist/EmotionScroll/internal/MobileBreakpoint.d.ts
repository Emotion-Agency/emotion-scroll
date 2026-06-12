export type BreakpointMatcher = number | string | (() => boolean) | null;
/**
 * Decides when smooth scroll yields to native scroll.
 *
 * - `number`  — viewport width: mobile when `innerWidth < breakpoint`,
 *   re-evaluated on `resize` (legacy behaviour)
 * - `string`  — media query (e.g. `'(pointer: coarse)'`), tracked via
 *   its `change` event so input-type switches are caught without resize
 * - `function` — custom predicate, re-evaluated on `resize`
 * - `null`    — never mobile
 */
export declare class MobileBreakpoint {
    private readonly breakpoint;
    private readonly onEnter;
    private readonly onLeave;
    isMobile: boolean;
    private query;
    constructor(breakpoint: BreakpointMatcher, onEnter: () => void, onLeave: () => void);
    private evaluate;
    private readonly onQueryChange;
    private readonly onResize;
    private setIsMobile;
    destroy(): void;
}
