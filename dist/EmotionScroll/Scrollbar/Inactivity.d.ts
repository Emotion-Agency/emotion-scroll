export declare class Inactivity {
    private readonly cb;
    private readonly delay;
    private timer;
    constructor(cb: (isActive: boolean) => void, delay?: number);
    show(): void;
    destroy(): void;
}
