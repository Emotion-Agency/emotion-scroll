import type { ScrollHost } from './ScrollHost';
export declare class KeyboardHandler {
    private readonly host;
    constructor(host: ScrollHost);
    init(): void;
    destroy(): void;
    private readonly onKeyDown;
}
