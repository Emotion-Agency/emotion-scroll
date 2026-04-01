import type { ScrollTarget } from './types';
export declare function resolveScrollTarget(target: ScrollTarget, offset: number, limit: number, isHorizontal: boolean, animatedScroll: number): number | null;
export declare function getElementScrollOffset(node: HTMLElement, isHorizontal: boolean, animatedScroll: number): number;
