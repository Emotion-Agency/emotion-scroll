import type {EasingFunction, EasingName} from './types'

const linear: EasingFunction = (t) => t

/**
 * Default easing used when `duration` is set without an explicit easing.
 * Smooth initial acceleration with a long, gentle deceleration tail —
 * feels more organic than standard exponential ease-out.
 */
export const smoothEasing: EasingFunction = (t) => {
  const inv = 1 - t
  return 1 - inv * inv * inv * (1 - t * 0.6)
}

const createPower = (power: number) => ({
  in: (t: number): number => t ** power,
  out: (t: number): number => 1 - (1 - t) ** power,
  inOut: (t: number): number =>
    t < 0.5
      ? 2 ** (power - 1) * t ** power
      : 1 - (-2 * t + 2) ** power / 2,
})

const power1 = createPower(2)
const power2 = createPower(3)
const power3 = createPower(4)
const power4 = createPower(5)

const expo = {
  in: (t: number): number => (t === 0 ? 0 : 2 ** (10 * t - 10)),
  out: (t: number): number => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
  inOut: (t: number): number => {
    if (t === 0) return 0
    if (t === 1) return 1
    return t < 0.5
      ? 2 ** (20 * t - 10) / 2
      : (2 - 2 ** (-20 * t + 10)) / 2
  },
}

const sine = {
  in: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),
  out: (t: number): number => Math.sin((t * Math.PI) / 2),
  inOut: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,
}

const circ = {
  in: (t: number): number => 1 - Math.sqrt(1 - t * t),
  out: (t: number): number => Math.sqrt(1 - (t - 1) ** 2),
  inOut: (t: number): number =>
    t < 0.5
      ? (1 - Math.sqrt(1 - (2 * t) ** 2)) / 2
      : (Math.sqrt(1 - (-2 * t + 2) ** 2) + 1) / 2,
}

const BACK_C1 = 1.70158
const BACK_C2 = BACK_C1 * 1.525
const BACK_C3 = BACK_C1 + 1

const back = {
  in: (t: number): number => BACK_C3 * t * t * t - BACK_C1 * t * t,
  out: (t: number): number =>
    1 + BACK_C3 * (t - 1) ** 3 + BACK_C1 * (t - 1) ** 2,
  inOut: (t: number): number =>
    t < 0.5
      ? ((2 * t) ** 2 * ((BACK_C2 + 1) * 2 * t - BACK_C2)) / 2
      : ((2 * t - 2) ** 2 * ((BACK_C2 + 1) * (t * 2 - 2) + BACK_C2) + 2) / 2,
}

const ELASTIC_C4 = (2 * Math.PI) / 3
const ELASTIC_C5 = (2 * Math.PI) / 4.5

const elastic = {
  in: (t: number): number => {
    if (t === 0) return 0
    if (t === 1) return 1
    return -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * ELASTIC_C4)
  },
  out: (t: number): number => {
    if (t === 0) return 0
    if (t === 1) return 1
    return 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * ELASTIC_C4) + 1
  },
  inOut: (t: number): number => {
    if (t === 0) return 0
    if (t === 1) return 1
    return t < 0.5
      ? -(2 ** (20 * t - 10) * Math.sin((20 * t - 11.125) * ELASTIC_C5)) / 2
      : (2 ** (-20 * t + 10) * Math.sin((20 * t - 11.125) * ELASTIC_C5)) / 2 + 1
  },
}

const bounceOut: EasingFunction = (t) => {
  const n1 = 7.5625
  const d1 = 2.75
  if (t < 1 / d1) return n1 * t * t
  if (t < 2 / d1) {
    const v = t - 1.5 / d1
    return n1 * v * v + 0.75
  }
  if (t < 2.5 / d1) {
    const v = t - 2.25 / d1
    return n1 * v * v + 0.9375
  }
  const v = t - 2.625 / d1
  return n1 * v * v + 0.984375
}

const bounce = {
  in: (t: number): number => 1 - bounceOut(1 - t),
  out: bounceOut,
  inOut: (t: number): number =>
    t < 0.5
      ? (1 - bounceOut(1 - 2 * t)) / 2
      : (1 + bounceOut(2 * t - 1)) / 2,
}

type EaseGroup = {in: EasingFunction; out: EasingFunction; inOut: EasingFunction}

/**
 * GSAP-style easing library. Use directly (`easings.power2.out`) or pass the
 * name as a string to any `easing` option (`'power2.out'`).
 */
export const easings = {
  linear,
  none: linear,
  smooth: smoothEasing,
  power1,
  power2,
  power3,
  power4,
  quad: power1,
  cubic: power2,
  quart: power3,
  quint: power4,
  expo,
  sine,
  circ,
  back,
  elastic,
  bounce,
} as const

const GROUPS: Record<string, EaseGroup> = {
  power1,
  power2,
  power3,
  power4,
  quad: power1,
  cubic: power2,
  quart: power3,
  quint: power4,
  expo,
  sine,
  circ,
  back,
  elastic,
  bounce,
}

// Warn once per unknown easing name, only outside production builds.
const isDev =
  typeof process === 'undefined' || process.env?.NODE_ENV !== 'production'
const warnedNames = new Set<string>()

function warnOnce(message: string, key: string): void {
  if (!isDev || warnedNames.has(key)) return
  warnedNames.add(key)
  console.warn(`[emotion-scroll] ${message}`)
}

export function resolveEasing(
  easing: EasingFunction | EasingName | undefined,
): EasingFunction | undefined {
  if (typeof easing !== 'string') return easing
  if (easing === 'none' || easing === 'linear') return linear
  if (easing === 'smooth') return smoothEasing

  const [name, direction = 'out'] = easing.split('.') as [string, string?]
  const group = GROUPS[name]

  if (!group) {
    warnOnce(
      `Unknown easing "${easing}". Falling back to linear.`,
      easing,
    )
    return linear
  }

  const fn = group[direction as keyof EaseGroup]
  if (!fn) {
    warnOnce(
      `Unknown easing direction "${direction}" for "${name}". ` +
        `Expected "in", "out" or "inOut". Falling back to "${name}.out".`,
      easing,
    )
    return group.out
  }

  return fn
}
