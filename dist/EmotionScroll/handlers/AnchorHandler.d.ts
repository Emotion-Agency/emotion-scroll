import type { ScrollToOptions } from '../types';
export interface AnchorHost {
    readonly opts: {
        anchors?: boolean | ScrollToOptions;
    };
    scrollTo(target: string, options?: ScrollToOptions): void;
}
export declare class AnchorHandler {
    private readonly host;
    private readonly element;
    constructor(host: AnchorHost, element: HTMLElement | Window);
    init(): void;
    destroy(): void;
    private readonly onClick;
}
