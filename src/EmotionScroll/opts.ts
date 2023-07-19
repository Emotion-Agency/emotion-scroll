import { getDocument } from 'ssr-window'
import { IOpts } from './types'

const document = getDocument()

export const getOpts = (opts: IOpts | undefined): IOpts => {
  return {
    el: opts?.el ?? document.documentElement,
    touchMultiplier: opts?.touchMultiplier ?? 3.8,
    firefoxMultiplier: opts?.firefoxMultiplier ?? 40,
    preventTouch: opts?.preventTouch ?? true,
    scrollbar: opts?.scrollbar ?? true,
    friction: opts?.friction ?? 0.08,
    stepSize: opts?.stepSize ?? 1,
    breakpoint: opts?.breakpoint ?? null,
    passive: opts?.passive ?? false,
    useKeyboard: opts?.useKeyboard ?? true,
    disabled: opts?.disabled ?? false,
    raf: opts?.raf ?? null,
    maxScrollDelta: opts?.maxScrollDelta ?? 120,
    saveScrollPosition: opts?.saveScrollPosition ?? false,
  }
}
