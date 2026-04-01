import {getDocument} from 'ssr-window'

import type {ScrollTarget} from './types'

const document = getDocument()

export function resolveScrollTarget(
  target: ScrollTarget,
  offset: number,
  limit: number,
  isHorizontal: boolean,
  animatedScroll: number,
): number | null {
  if (typeof target === 'string') {
    if (['top', 'left', 'start'].includes(target)) return 0 + offset
    if (['bottom', 'right', 'end'].includes(target)) return limit + offset

    const node = document.querySelector(target) as HTMLElement | null
    if (!node) return null
    return getElementScrollOffset(node, isHorizontal, animatedScroll) + offset
  }

  if (target instanceof HTMLElement) {
    return getElementScrollOffset(target, isHorizontal, animatedScroll) + offset
  }

  if (typeof target === 'number') {
    return target + offset
  }

  return null
}

export function getElementScrollOffset(
  node: HTMLElement,
  isHorizontal: boolean,
  animatedScroll: number,
): number {
  const rect = node.getBoundingClientRect()
  const prop = isHorizontal ? 'left' : 'top'

  const style = getComputedStyle(node)
  const scrollMargin =
    parseFloat(isHorizontal ? style.scrollMarginLeft : style.scrollMarginTop) ||
    0

  return rect[prop] + animatedScroll - scrollMargin
}
