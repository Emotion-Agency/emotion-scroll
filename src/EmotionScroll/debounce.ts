export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined

  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = undefined
      fn.apply(this, args)
    }, delay)
  }
}
