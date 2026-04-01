import {getDocument} from 'ssr-window'

const document = getDocument()

export class CreateScrollbar {
  scrollbar: HTMLElement

  create(isHorizontal = false): HTMLElement {
    this.scrollbar = document.createElement('div')
    const thumb = document.createElement('span')
    thumb.className = 'scrollbar__thumb'
    this.scrollbar.appendChild(thumb)

    this.scrollbar.classList.add('scrollbar')

    if (isHorizontal) {
      this.scrollbar.classList.add('scrollbar--horizontal')
    }

    return this.scrollbar
  }

  append($el: HTMLElement | Element | null): void {
    if (!$el) {
      document.body.appendChild(this.scrollbar)
      return
    }

    $el.appendChild(this.scrollbar)
  }

  destroy(): void {
    this.scrollbar.remove()
  }
}
