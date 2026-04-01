import type { EasingFunction } from './types';
interface AnimateOptions {
    lerp?: number;
    duration?: number;
    easing?: EasingFunction;
    onStart?: () => void;
    onUpdate?: (value: number, completed: boolean) => void;
}
export declare class Animate {
    isRunning: boolean;
    value: number;
    private from;
    private to;
    private currentTime;
    private lerp?;
    private duration?;
    private easing?;
    private onUpdate?;
    advance(deltaTime: number): void;
    fromTo(from: number, to: number, options: AnimateOptions): void;
    stop(): void;
}
export {};
