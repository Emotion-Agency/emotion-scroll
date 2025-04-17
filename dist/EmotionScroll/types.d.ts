export type TFunc = () => void;
export type TRAF = {
    on: (cb: TFunc) => void;
    off: (cb: TFunc) => void;
};
export interface IOpts {
    el?: HTMLElement;
    touchMultiplier?: number;
    firefoxMultiplier?: number;
    preventTouch?: boolean;
    scrollbar?: boolean;
    friction?: number;
    stepSize?: number;
    breakpoint?: number;
    passive?: boolean;
    useKeyboard?: boolean;
    disabled?: boolean;
    raf?: TRAF;
    maxScrollDelta?: number;
    saveScrollPosition?: boolean;
}
export interface IState {
    isScrolling?: boolean;
    vsPosition?: number;
    isScrollbarVisible?: boolean;
    position?: number;
    disabled?: boolean;
    velocity?: number;
}
export interface IEventArgs {
    position: number;
    direction: 1 | -1;
    velocity: number;
    progress: number;
}
export interface IVirtualWheelEvent {
    deltaX: number;
    deltaY: number;
    x: number;
    y: number;
    originalEvent: WheelEvent;
}
