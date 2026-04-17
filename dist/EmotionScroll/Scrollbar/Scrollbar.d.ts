import type { IScrollController, TRAF } from '../types';
import type { ResolvedScrollbarOpts } from '../opts';
export default class Scrollbar {
    private readonly controller;
    private readonly raf;
    private readonly opts;
    private $scrollbar;
    private $thumb;
    private thumbSize;
    private readonly createScrollbar;
    private readonly inactivity;
    private drag;
    constructor(controller: IScrollController, raf: TRAF, opts: ResolvedScrollbarOpts);
    private get isHorizontal();
    /** Read live geometry in a single getComputedStyle call per frame. */
    private readGeometry;
    private init;
    private readonly onMouseEnter;
    private readonly setVisibility;
    private readonly onFrame;
    private updateThumbSize;
    private updateThumbPosition;
    reset(): void;
    destroy(): void;
}
