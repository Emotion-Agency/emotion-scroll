import {getWindow, getDocument} from 'ssr-window'

import type {ScrollHost} from './ScrollHost'

const window = getWindow()
const document = getDocument()

export class AnchorHandler {
  constructor(
    private readonly host: ScrollHost,
    private readonly element: HTMLElement | Window,
  ) {}

  init(): void {
    this.element.addEventListener('click', this.onClick)
  }

  destroy(): void {
    this.element.removeEventListener('click', this.onClick)
  }

  private readonly onClick: EventListener = (e): void => {
    this.handleClick(e as MouseEvent)
  }

  private handleClick(e: MouseEvent): void {
    const path = e.composedPath()

    for (const node of path) {
      if (!(node instanceof HTMLAnchorElement) || !node.href) continue

      const url = new URL(node.href)
      const current = new URL(window.location.href)

      if (url.host !== current.host || url.pathname !== current.pathname)
        continue
      if (!url.hash) continue

      const target = url.hash
      if (!document.querySelector(target)) continue

      e.preventDefault()

      const anchorOpts =
        typeof this.host.opts.anchors === 'object'
          ? this.host.opts.anchors
          : undefined
      this.host.scrollTo(target, anchorOpts)

      history.pushState(null, '', target)
      break
    }
  }
}
