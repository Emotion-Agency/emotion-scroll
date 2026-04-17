import EmotionScroll from './EmotionScroll/EmotionScroll'

export {easings, smoothEasing, resolveEasing} from './EmotionScroll/easings'
export {
  attachScrollTrigger,
} from './EmotionScroll/integrations/ScrollTrigger'
export {iosMomentumPreset} from './EmotionScroll/presets'

import type {
  IOpts,
  IEventArgs,
  IScrollController,
  IVirtualScrollData,
  ScrollToOptions,
  ScrollTarget,
  Scrolling,
  Orientation,
  GestureOrientation,
  EasingFunction,
  Easing,
  EasingName,
  EasingDirection,
  EasingGroupName,
} from './EmotionScroll/types'
import type {
  AttachScrollTriggerOptions,
  ScrollTriggerStatic,
} from './EmotionScroll/integrations/ScrollTrigger'

export type {
  IOpts,
  IEventArgs,
  IScrollController,
  IVirtualScrollData,
  ScrollToOptions,
  ScrollTarget,
  Scrolling,
  Orientation,
  GestureOrientation,
  EasingFunction,
  Easing,
  EasingName,
  EasingDirection,
  EasingGroupName,
  AttachScrollTriggerOptions,
  ScrollTriggerStatic,
}

export default EmotionScroll
