import {getWindow} from 'ssr-window'

const window = getWindow()

export class MobileBreakpoint {
  isMobile = false

  constructor(
    private readonly breakpoint: number | null,
    private readonly onEnter: () => void,
    private readonly onLeave: () => void,
  ) {
    if (breakpoint == null) return
    this.isMobile = window.innerWidth < breakpoint
    window.addEventListener('resize', this.onResize)
  }

  private readonly onResize = (): void => {
    if (this.breakpoint == null) return
    const wasMobile = this.isMobile
    this.isMobile = window.innerWidth < this.breakpoint
    if (wasMobile === this.isMobile) return
    if (this.isMobile) this.onEnter()
    else this.onLeave()
  }

  destroy(): void {
    window.removeEventListener('resize', this.onResize)
  }
}
