import { IEventArgs, IOpts } from './types';
export default class EmotionScroll {
    private vs;
    private scrollbar;
    private emitter;
    private opts;
    private state;
    private _disabled;
    private isMobile;
    private scrollTop;
    private _raf;
    private max;
    private min;
    constructor(opts: IOpts);
    private bounds;
    private init;
    private onResize;
    private detectScrolling;
    get disabled(): boolean;
    set disabled(val: boolean);
    private get maxValue();
    private get canScroll();
    private setupVirtualScroll;
    on(cb: (vars: IEventArgs) => any): void;
    private update;
    private onKeyDown;
    reset(): void;
    destroy(): void;
}
export type TEmotionScroll = typeof EmotionScroll.prototype;
