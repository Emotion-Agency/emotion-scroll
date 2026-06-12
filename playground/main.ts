import EmotionScroll from '../src/index'

const scroll = new EmotionScroll()

declare global {
  interface Window {
    scroll_: EmotionScroll
    ES: typeof EmotionScroll
    vsLog: Array<{deltaX: number; deltaY: number}>
  }
}
window.scroll_ = scroll
window.ES = EmotionScroll
window.vsLog = []

scroll.on('virtual-scroll', data => {
  window.vsLog.push(data as {deltaX: number; deltaY: number})
})

const hud = document.getElementById('hud')!
scroll.on('scroll', () => {
  hud.textContent =
    `target: ${scroll.targetScroll.toFixed(1)}\n` +
    `animated: ${scroll.animatedScroll.toFixed(1)}\n` +
    `velocity: ${scroll.velocity.toFixed(2)}`
})
