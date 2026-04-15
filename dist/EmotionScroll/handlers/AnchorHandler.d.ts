import type { ScrollHost } from './ScrollHost';
export declare class AnchorHandler {
    private readonly host;
    private readonly element;
    constructor(host: ScrollHost, element: HTMLElement | Window);
    init(): void;
    destroy(): void;
    private readonly onClick;
    private handleClick;
}
