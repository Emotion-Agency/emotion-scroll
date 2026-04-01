import {getWindow} from 'ssr-window'

import {debounce} from './debounce'

const window = getWindow()

interface DimensionsOptions {
  autoResize?: boolean
  debounceDelay?: number
}

export class Dimensions {
  width = 0
  height = 0
  scrollWidth = 0
  scrollHeight = 0

  private debouncedResize?: (...args: unknown[]) => void
  private wrapperResizeObserver?: ResizeObserver
  private contentResizeObserver?: ResizeObserver

  constructor(
    private wrapper: HTMLElement | Window,
    private content: HTMLElement,
    {autoResize = true, debounceDelay = 250}: DimensionsOptions = {}
  ) {
    if (autoResize) {
      this.debouncedResize = debounce(this.resize, debounceDelay)

      if (this.wrapper instanceof Window) {
        window.addEventListener('resize', this.debouncedResize)
      } else if (typeof ResizeObserver !== 'undefined') {
        this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize)
        this.wrapperResizeObserver.observe(this.wrapper)
      }

      if (typeof ResizeObserver !== 'undefined') {
        this.contentResizeObserver = new ResizeObserver(this.debouncedResize)
        this.contentResizeObserver.observe(this.content)
      }
    }

    this.resize()
  }

  get limit(): {x: number; y: number} {
    return {
      x: Math.max(0, this.scrollWidth - this.width),
      y: Math.max(0, this.scrollHeight - this.height),
    }
  }

  resize = (): void => {
    if (this.wrapper instanceof Window) {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.scrollWidth = this.content.scrollWidth
      this.scrollHeight = this.content.scrollHeight
    } else {
      this.width = this.wrapper.clientWidth
      this.height = this.wrapper.clientHeight
      this.scrollWidth = this.wrapper.scrollWidth
      this.scrollHeight = this.wrapper.scrollHeight
    }
  }

  destroy(): void {
    this.wrapperResizeObserver?.disconnect()
    this.contentResizeObserver?.disconnect()

    if (this.wrapper instanceof Window && this.debouncedResize) {
      window.removeEventListener('resize', this.debouncedResize)
    }
  }
}
