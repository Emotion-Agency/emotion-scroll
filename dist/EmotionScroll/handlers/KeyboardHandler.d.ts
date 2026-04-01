import type { ScrollToOptions } from '../types';
export interface KeyboardHost {
    readonly opts: {
        keyboardScrollStep: number;
    };
    readonly targetScroll: number;
    readonly animatedScroll: number;
    readonly limit: number;
    readonly isHorizontal: boolean;
    readonly isStopped: boolean;
    scrollTo(target: number, options?: ScrollToOptions): void;
}
export declare class KeyboardHandler {
    private readonly host;
    constructor(host: KeyboardHost);
    init(): void;
    destroy(): void;
    private readonly onKeyDown;
}
