import type { EasingFunction, EasingName } from './types';
/**
 * Default easing used when `duration` is set without an explicit easing.
 * Smooth initial acceleration with a long, gentle deceleration tail —
 * feels more organic than standard exponential ease-out.
 */
export declare const smoothEasing: EasingFunction;
/**
 * GSAP-style easing library. Use directly (`easings.power2.out`) or pass the
 * name as a string to any `easing` option (`'power2.out'`).
 */
export declare const easings: {
    readonly linear: EasingFunction;
    readonly none: EasingFunction;
    readonly smooth: EasingFunction;
    readonly power1: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly power2: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly power3: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly power4: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly quad: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly cubic: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly quart: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly quint: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly expo: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly sine: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly circ: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly back: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly elastic: {
        in: (t: number) => number;
        out: (t: number) => number;
        inOut: (t: number) => number;
    };
    readonly bounce: {
        in: (t: number) => number;
        out: EasingFunction;
        inOut: (t: number) => number;
    };
};
export declare function resolveEasing(easing: EasingFunction | EasingName | undefined): EasingFunction | undefined;
