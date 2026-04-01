import {clamp} from '@emotionagency/utils'
import {getWindow, getDocument} from 'ssr-window'

import {keyCodes} from '../keyCodes'
import type {ScrollToOptions} from '../types'

const window = getWindow()
const document = getDocument()

export interface KeyboardHost {
  readonly opts: {keyboardScrollStep: number}
  readonly targetScroll: number
  readonly animatedScroll: number
  readonly limit: number
  readonly isHorizontal: boolean
  readonly isStopped: boolean
  scrollTo(target: number, options?: ScrollToOptions): void
}

export class KeyboardHandler {
  constructor(private readonly host: KeyboardHost) {}

  init(): void {
    window.addEventListener('keydown', this.onKeyDown, false)
  }

  destroy(): void {
    window.removeEventListener('keydown', this.onKeyDown)
  }

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    const {host} = this
    if (host.isStopped || host.limit <= 0) return

    const step = host.opts.keyboardScrollStep
    let target: number | null = null

    switch (e.key) {
      case keyCodes.TAB: {
        const focused = document.activeElement as HTMLElement
        if (focused) {
          const rect = focused.getBoundingClientRect()
          const offset = host.isHorizontal ? rect.left : rect.top
          target = host.animatedScroll + offset
        }
        break
      }
      case keyCodes.UP:
        target = host.targetScroll - step
        break
      case keyCodes.DOWN:
        target = host.targetScroll + step
        break
      case keyCodes.LEFT:
        if (host.isHorizontal) target = host.targetScroll - step
        break
      case keyCodes.RIGHT:
        if (host.isHorizontal) target = host.targetScroll + step
        break
      case keyCodes.PAGEUP:
        target =
          host.targetScroll -
          (host.isHorizontal ? window.innerWidth : window.innerHeight)
        break
      case keyCodes.PAGEDOWN:
        target =
          host.targetScroll +
          (host.isHorizontal ? window.innerWidth : window.innerHeight)
        break
      case keyCodes.HOME:
        target = 0
        break
      case keyCodes.END:
        target = host.limit
        break
    }

    if (target !== null) {
      host.scrollTo(clamp(target, 0, host.limit))
    }
  }
}
