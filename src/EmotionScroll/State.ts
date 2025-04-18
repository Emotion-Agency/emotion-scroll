import {IState} from './types'

export class State implements IState {
  isScrolling?: boolean
  vsPosition?: number
  isScrollbarVisible?: boolean
  position?: number
  disabled?: boolean
  velocity?: number
  constructor() {
    this.isScrolling = false
    this.vsPosition = 0
    this.isScrollbarVisible = false
    this.position = 0
    this.disabled = false
    this.velocity = 0
  }
}
