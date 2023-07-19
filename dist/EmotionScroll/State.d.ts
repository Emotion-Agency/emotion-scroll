import { IState } from './types';
export declare class State implements IState {
    isScrolling?: boolean;
    vsPosition?: number;
    isScrollbarVisible?: boolean;
    position?: number;
    disabled?: boolean;
    constructor();
}
