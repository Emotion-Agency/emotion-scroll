import {getWindow} from 'ssr-window'

import {SCROLL_POSITION_STORAGE_KEY} from '../constants'

const window = getWindow()

export class ScrollPersistence {
  restore(): number | null {
    const raw = window.localStorage.getItem(SCROLL_POSITION_STORAGE_KEY)
    if (raw === null) return null
    const value = Number(raw)
    return Number.isNaN(value) ? null : value
  }

  save(value: number): void {
    window.localStorage.setItem(SCROLL_POSITION_STORAGE_KEY, String(value))
  }
}
