import { IEventArgs, IOpts, IState } from './types';
export default class EmotionScroll {
    private vs;
    private scrollbar;
    private emitter;
    private opts;
    state: IState;
    private _disabled;
    isMobile: boolean;
    scrollTop: number;
    private _raf;
    max: number;
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
