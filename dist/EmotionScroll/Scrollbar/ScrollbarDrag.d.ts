import type { IScrollController } from '../types';
import type { ResolvedScrollbarOpts } from '../opts';
interface ScrollbarElements {
    $scrollbar: HTMLElement;
    $thumb: HTMLElement;
}
export declare class ScrollbarDrag {
    private readonly elements;
    private readonly controller;
    private readonly opts;
    constructor(elements: ScrollbarElements, controller: IScrollController, opts: ResolvedScrollbarOpts);
    private get isHorizontal();
    private init;
    /** Map a pointer position (relative to track) to a scroll target. */
    private pointerToScroll;
    private readonly onTrackClick;
    private readonly onStart;
    private readonly onMove;
    private readonly onEnd;
    destroy(): void;
}
export {};
