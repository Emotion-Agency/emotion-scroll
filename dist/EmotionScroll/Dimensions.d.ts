interface DimensionsOptions {
    autoResize?: boolean;
    debounceDelay?: number;
    onResize?: () => void;
}
export declare class Dimensions {
    private wrapper;
    private content;
    width: number;
    height: number;
    scrollWidth: number;
    scrollHeight: number;
    private debouncedResize?;
    private wrapperResizeObserver?;
    private contentResizeObserver?;
    constructor(wrapper: HTMLElement | Window, content: HTMLElement, { autoResize, debounceDelay, onResize, }?: DimensionsOptions);
    get limit(): {
        x: number;
        y: number;
    };
    resize: () => void;
    destroy(): void;
}
export {};
