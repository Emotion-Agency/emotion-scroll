import type { IOpts } from './types';
export type ResolvedOpts = Required<Omit<IOpts, 'prevent' | 'anchors'>> & Pick<IOpts, 'prevent' | 'anchors'>;
export declare function resolveOpts(opts?: IOpts): ResolvedOpts;
