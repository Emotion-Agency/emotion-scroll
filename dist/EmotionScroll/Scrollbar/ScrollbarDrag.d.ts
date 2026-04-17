import type { IScrollController } from '../types';
import type { ResolvedScrollbarOpts } from '../opts';
interface ScrollbarElements {
    $scrollbar: HTMLElement;
    $thumb: HTMLElement;
}
/**
 * Pointer-events based drag/jump handler. A single input path covers
 * mouse, touch, and pen; pointer capture keeps the gesture alive even
 * when the cursor leaves the thumb, so we don't need the
 * mousemove/mouseup dance on documentElement that the legacy
 * touch+mouse implementation required.
 */
export declare class ScrollbarDrag {
    private readonly elements;
    private readonly controller;
    private readonly opts;
    private activePointerId;
    constructor(elements: ScrollbarElements, controller: IScrollController, opts: ResolvedScrollbarOpts);
    private get isHorizontal();
    private init;
    /** Map a pointer position (relative to track) to a scroll target. */
    private pointerToScroll;
    private readonly onTrackClick;
    private suppressNextClick;
    private readonly onPointerDown;
    private readonly onPointerMove;
    private readonly onPointerUp;
    destroy(): void;
}
export {};
