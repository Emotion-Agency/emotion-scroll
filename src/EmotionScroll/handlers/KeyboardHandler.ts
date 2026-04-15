import {clamp} from '@emotionagency/utils'
import {getWindow, getDocument} from 'ssr-window'

import type {ScrollHost} from './ScrollHost'

const window = getWindow()
const document = getDocument()

const KEY = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  TAB: 'Tab',
  PAGEUP: 'PageUp',
  PAGEDOWN: 'PageDown',
  HOME: 'Home',
  END: 'End',
} as const

export class KeyboardHandler {
  constructor(private readonly host: ScrollHost) {}

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
      case KEY.TAB: {
        const focused = document.activeElement as HTMLElement
        if (focused) {
          const rect = focused.getBoundingClientRect()
          const offset = host.isHorizontal ? rect.left : rect.top
          target = host.animatedScroll + offset
        }
        break
      }
      case KEY.UP:
        target = host.targetScroll - step
        break
      case KEY.DOWN:
        target = host.targetScroll + step
        break
      case KEY.LEFT:
        if (host.isHorizontal) target = host.targetScroll - step
        break
      case KEY.RIGHT:
        if (host.isHorizontal) target = host.targetScroll + step
        break
      case KEY.PAGEUP:
        target =
          host.targetScroll -
          (host.isHorizontal ? window.innerWidth : window.innerHeight)
        break
      case KEY.PAGEDOWN:
        target =
          host.targetScroll +
          (host.isHorizontal ? window.innerWidth : window.innerHeight)
        break
      case KEY.HOME:
        target = 0
        break
      case KEY.END:
        target = host.limit
        break
    }

    if (target !== null) {
      host.scrollTo(clamp(target, 0, host.limit))
    }
  }
}
