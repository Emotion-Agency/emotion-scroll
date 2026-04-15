export declare class MobileBreakpoint {
    private readonly breakpoint;
    private readonly onEnter;
    private readonly onLeave;
    isMobile: boolean;
    constructor(breakpoint: number | null, onEnter: () => void, onLeave: () => void);
    private readonly onResize;
    destroy(): void;
}
