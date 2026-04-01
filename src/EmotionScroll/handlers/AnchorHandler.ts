import {getWindow, getDocument} from 'ssr-window'

import type {ScrollToOptions} from '../types'

const window = getWindow()
const document = getDocument()

export interface AnchorHost {
  readonly opts: {anchors?: boolean | ScrollToOptions}
  scrollTo(target: string, options?: ScrollToOptions): void
}

export class AnchorHandler {
  constructor(
    private readonly host: AnchorHost,
    private readonly element: HTMLElement | Window,
  ) {}

  init(): void {
    this.element.addEventListener('click', this.onClick as EventListener)
  }

  destroy(): void {
    this.element.removeEventListener('click', this.onClick as EventListener)
  }

  private readonly onClick = (e: MouseEvent): void => {
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
