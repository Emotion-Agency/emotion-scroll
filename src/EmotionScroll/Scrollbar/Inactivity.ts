export class Inactivity {
  private timer: ReturnType<typeof setTimeout> | null = null

  constructor(
    private readonly cb: (isActive: boolean) => void,
    private readonly delay = 1000
  ) {}

  show(): void {
    if (this.timer !== null) clearTimeout(this.timer)
    this.cb(true)
    this.timer = setTimeout(() => {
      this.cb(false)
      this.timer = null
    }, this.delay)
  }

  destroy(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
}
