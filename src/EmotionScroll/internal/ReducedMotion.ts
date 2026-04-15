import {getWindow} from 'ssr-window'

const window = getWindow()

export class ReducedMotion {
  matches = false
  private query: MediaQueryList | null = null

  constructor() {
    if (typeof window.matchMedia !== 'function') return
    this.query = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.matches = this.query.matches
    this.query.addEventListener('change', this.onChange)
  }

  private readonly onChange = (e: MediaQueryListEvent): void => {
    this.matches = e.matches
  }

  destroy(): void {
    this.query?.removeEventListener('change', this.onChange)
    this.query = null
  }
}
