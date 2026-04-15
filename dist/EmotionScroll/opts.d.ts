import type { EasingFunction, IOpts, IScrollbarOpts } from './types';
export type ResolvedScrollbarOpts = Required<IScrollbarOpts>;
export type ResolvedOpts = Required<Omit<IOpts, 'prevent' | 'anchors' | 'scrollbar' | 'easing'>> & Pick<IOpts, 'prevent' | 'anchors'> & {
    scrollbar: ResolvedScrollbarOpts;
    easing: EasingFunction | undefined;
};
export declare function resolveOpts(opts?: IOpts): ResolvedOpts;
