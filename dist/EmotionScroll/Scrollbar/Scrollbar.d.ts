import type { IScrollController, TRAF } from '../types';
export default class Scrollbar {
    private readonly controller;
    private readonly raf;
    private $scrollbar;
    private $thumb;
    private thumbSize;
    private cachedPadding;
    private readonly createScrollbar;
    private readonly inactivity;
    private drag;
    constructor(controller: IScrollController, raf: TRAF);
    private get isHorizontal();
    private cacheScrollbarPadding;
    /** Inner track size excluding padding. */
    private get trackSize();
    private init;
    private readonly onMouseEnter;
    private readonly setVisibility;
    private readonly onFrame;
    private updateThumbSize;
    private updateThumbPosition;
    reset(): void;
    destroy(): void;
}
