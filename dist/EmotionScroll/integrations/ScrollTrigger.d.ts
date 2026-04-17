import type EmotionScroll from '../EmotionScroll';
interface ScrollerProxyConfig {
    scrollTop?: (value?: number) => number | void;
    scrollLeft?: (value?: number) => number | void;
    getBoundingClientRect?: () => {
        top: number;
        left: number;
        width: number;
        height: number;
    };
    pinType?: 'fixed' | 'transform';
}
/**
 * Minimal surface of `gsap/ScrollTrigger` that this integration relies on.
 * Accepted as a parameter so the lib does not have to depend on gsap.
 */
export interface ScrollTriggerStatic {
    scrollerProxy(scroller: Element | string | undefined, config?: ScrollerProxyConfig): unknown;
    defaults(config: {
        scroller?: Element | string | null;
    }): unknown;
    update(): unknown;
}
export interface AttachScrollTriggerOptions {
    /**
     * When `el !== document.documentElement`, register it as the default
     * scroller so `ScrollTrigger.create({trigger: ...})` picks it up without
     * an explicit `scroller` arg. Defaults to `true`.
     */
    setAsDefault?: boolean;
}
/**
 * Wire an EmotionScroll instance into GSAP ScrollTrigger.
 *
 *   - Registers a `scrollerProxy` so ScrollTrigger reads the animated
 *     scroll position instead of native DOM scrollTop. This matters even
 *     for window-scroll, because the animated value can be ahead of the
 *     DOM between frames.
 *   - Calls `ScrollTrigger.update()` on every emitted scroll event so
 *     triggers stay in sync with the smooth position in real time.
 *
 * Returns a detach function that removes the scroll listener. The
 * `scrollerProxy` registration itself is not torn down — call
 * `ScrollTrigger.scrollerProxy(el)` in the consumer if a full reset is
 * needed.
 */
export declare function attachScrollTrigger(scroll: EmotionScroll, ScrollTrigger: ScrollTriggerStatic, options?: AttachScrollTriggerOptions): () => void;
export {};
