import type { IOpts } from './types';
export type ResolvedOpts = Required<Omit<IOpts, 'prevent'>> & Pick<IOpts, 'prevent'>;
export declare function resolveOpts(opts?: IOpts): ResolvedOpts;
