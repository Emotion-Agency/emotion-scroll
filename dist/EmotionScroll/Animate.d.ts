import type { EasingFunction } from './types';
interface AnimateOptions {
    lerp?: number;
    duration?: number;
    easing?: EasingFunction;
    onStart?: () => void;
    onUpdate?: (value: number, completed: boolean) => void;
}
/**
 * Frame-rate independent tween supporting either exponential-lerp or
 * fixed-duration-with-easing modes.
 *
 * When a new `fromTo()` interrupts an in-flight tween, the inherited
 * per-second velocity is captured and added to subsequent frames while
 * it decays exponentially toward zero. This prevents the visible
 * deceleration spike that would otherwise occur when a programmatic
 * scrollTo (e.g. a snap) lands on top of a user-driven lerp.
 */
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
    private previousValue;
    private lastDeltaTime;
    private momentumVelocity;
    advance(deltaTime: number): void;
    fromTo(from: number, to: number, options: AnimateOptions): void;
    stop(): void;
}
export {};
