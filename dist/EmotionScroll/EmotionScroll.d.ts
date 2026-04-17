import { type ResolvedOpts } from './opts';
import { type AttachScrollTriggerOptions, type ScrollTriggerStatic } from './integrations/ScrollTrigger';
import type { IOpts, IScrollController, ScrollTarget, ScrollToOptions, Scrolling } from './types';
type Direction = 1 | -1 | 0;
export default class EmotionScroll implements IScrollController {
    animatedScroll: number;
    targetScroll: number;
    velocity: number;
    lastVelocity: number;
    direction: Direction;
    isTouching: boolean;
    private _isScrolling;
    private _isStopped;
    private _isLocked;
    private _time;
    readonly opts: ResolvedOpts;
    private readonly raf;
    private readonly animate;
    private readonly emitter;
    private readonly dimensions;
    private readonly nativeScroll;
    private readonly reducedMotion;
    private readonly mobile;
    private readonly persistence;
    private vsHandler;
    private keyboardHandler;
    private anchorHandler;
    private scrollbar;
    constructor(opts?: IOpts);
    get isScrolling(): Scrolling;
    set isScrolling(value: Scrolling);
    get isStopped(): boolean;
    get isLocked(): boolean;
    get isHorizontal(): boolean;
    get limit(): number;
    get scroll(): number;
    get progress(): number;
    get isMobile(): boolean;
    get wrapperElement(): HTMLElement | Window;
    on(event: string, cb: (...args: unknown[]) => void): void;
    off(event: string, cb: (...args: unknown[]) => void): void;
    scrollTo(_target: ScrollTarget, options?: ScrollToOptions): void;
    start(): void;
    stop(): void;
    resize(): void;
    reset(): void;
    /**
     * Register this instance as the source of truth for GSAP ScrollTrigger.
     * Sets up `scrollerProxy` and forwards scroll events to `ScrollTrigger.update()`.
     * Returns a detach function that removes the scroll listener.
     */
    attachScrollTrigger(ScrollTrigger: ScrollTriggerStatic, options?: AttachScrollTriggerOptions): () => void;
    readonly update: () => void;
    destroy(): void;
    emitVirtualScroll(data: {
        deltaX: number;
        deltaY: number;
        event: Event;
    }): void;
    stopAnimation(): void;
    getActualScroll(): number;
    onScrollChanged(): void;
    private resolveTarget;
    private performImmediate;
    private performAnimated;
    private get isWindowScroll();
    private setScroll;
    private setupDesktopHandlers;
    private teardownDesktopHandlers;
    private restoreScrollPosition;
    private resetState;
    private notifyChange;
}
export {};
