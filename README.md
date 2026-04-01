# @emotionagency/emotion-scroll

Smooth scroll library with native scroll integration and custom scrollbar. Built on top of `virtual-scroll` for input normalization, with frame-rate independent animation and full CSS variable customization.

## Installation

```bash
npm i @emotionagency/emotion-scroll
```

## Quick start

```js
import EmotionScroll from '@emotionagency/emotion-scroll'
import '@emotionagency/emotion-scroll/css'

const scroll = new EmotionScroll()

// Listen to scroll events
scroll.on('scroll', ({position, direction, velocity, progress}) => {
  console.log({position, direction, velocity, progress})
})

// Scroll to a target
scroll.scrollTo('#section-2', {offset: -100})

// Cleanup
scroll.destroy()
```

## Options

| Option                 | Type                                   | Default                    | Description                                                      |
| ---------------------- | -------------------------------------- | -------------------------- | ---------------------------------------------------------------- |
| `el`                   | `HTMLElement`                          | `document.documentElement` | Scroll wrapper element                                           |
| `content`              | `HTMLElement`                          | `el`                       | Content element for dimension tracking                           |
| `orientation`          | `'vertical' \| 'horizontal'`           | `'vertical'`               | Scroll axis                                                      |
| `gestureOrientation`   | `'vertical' \| 'horizontal' \| 'both'` | auto                       | Which gesture axes to capture                                    |
| `smoothWheel`          | `boolean`                              | `true`                     | Enable smooth wheel scrolling                                    |
| `syncTouch`            | `boolean`                              | `false`                    | Enable smooth touch scrolling with inertia                       |
| `syncTouchLerp`        | `number`                               | `0.075`                    | Lerp factor for touch inertia animation                          |
| `touchInertiaExponent` | `number`                               | `1.7`                      | Exponent for touch velocity inertia                              |
| `lerp`                 | `number`                               | `0.1`                      | Lerp factor for scroll animation (0-1, higher = faster)          |
| `duration`             | `number`                               | `undefined`                | Fixed animation duration in seconds (alternative to lerp)        |
| `easing`               | `(t: number) => number`                | `undefined`                | Easing function, used with `duration`                            |
| `touchMultiplier`      | `number`                               | `1`                        | Touch input multiplier                                           |
| `wheelMultiplier`      | `number`                               | `1`                        | Wheel input multiplier                                           |
| `maxScrollDelta`       | `number`                               | `120`                      | Max pixels per wheel event (prevents jarring jumps)              |
| `scrollbar`            | `boolean`                              | `true`                     | Show custom scrollbar                                            |
| `breakpoint`           | `number \| null`                       | `null`                     | Viewport width below which smooth scroll is disabled             |
| `useKeyboardSmooth`    | `boolean`                              | `true`                     | Enable keyboard navigation (arrows, Page Up/Down, Home/End, Tab) |
| `keyboardScrollStep`   | `number`                               | `120`                      | Arrow key scroll distance in pixels                              |
| `disabled`             | `boolean`                              | `false`                    | Start in disabled state                                          |
| `raf`                  | `{ on, off }`                          | `null`                     | Custom RAF instance. Uses `@emotionagency/utils` raf by default  |
| `autoRaf`              | `boolean`                              | `true`                     | Auto-attach to RAF loop. Set `false` to call `raf()` manually    |
| `autoResize`           | `boolean`                              | `true`                     | Auto-track size changes via ResizeObserver                       |
| `saveScrollPosition`   | `boolean`                              | `false`                    | Persist scroll position in localStorage                          |
| `prevent`              | `(node: HTMLElement) => boolean`       | `undefined`                | Callback to prevent smooth scroll on specific elements           |
| `overscroll`           | `boolean`                              | `true`                     | Allow overscroll (native bounce) at boundaries                   |
| `infinite`             | `boolean`                              | `false`                    | Enable infinite (looping) scroll                                 |
| `passive`              | `boolean`                              | `false`                    | Use passive event listeners                                      |
| `maxTouchInertia`      | `number`                               | `1000`                     | Max inertia delta after touch release                            |

## Methods

### `scrollTo(target, options?)`

Scroll to a target with animation.

```js
// Scroll to a pixel position
scroll.scrollTo(500)

// Scroll to an element
scroll.scrollTo(document.getElementById('section'))

// Scroll to a CSS selector
scroll.scrollTo('#section-2')

// Scroll to keywords
scroll.scrollTo('top') // or 'start', 'left'
scroll.scrollTo('bottom') // or 'end', 'right'

// With options
scroll.scrollTo('#section', {
  offset: -100, // additional offset in px
  immediate: true, // jump without animation
  duration: 1.5, // override animation duration
  easing: t => t, // override easing
  lerp: 0.05, // override lerp
  lock: true, // lock scroll until animation completes
  force: true, // scroll even when stopped
  onStart: instance => {},
  onComplete: instance => {},
})
```

### `on(event, callback)` / `off(event, callback)`

Subscribe/unsubscribe to events.

```js
const handler = ({position, direction, velocity, progress}) => {
  console.log(position)
}

scroll.on('scroll', handler)
scroll.off('scroll', handler)

// Virtual scroll events (raw wheel/touch input)
scroll.on('virtual-scroll', ({deltaX, deltaY, event}) => {
  console.log(deltaX, deltaY)
})
```

### `start()` / `stop()`

Programmatically enable/disable scrolling.

```js
// Disable (adds .e-fixed class)
scroll.stop()

// Re-enable
scroll.start()
```

### `reset()`

Reset scroll position to 0.

```js
scroll.reset()
```

### `resize()`

Manually trigger a resize recalculation.

```js
scroll.resize()
```

### `destroy()`

Clean up all event listeners and DOM elements.

```js
scroll.destroy()
```

## Properties

| Property         | Type                            | Description                                             |
| ---------------- | ------------------------------- | ------------------------------------------------------- |
| `animatedScroll` | `number`                        | Current animated scroll position                        |
| `targetScroll`   | `number`                        | Target scroll position                                  |
| `velocity`       | `number`                        | Current scroll velocity                                 |
| `direction`      | `1 \| -1 \| 0`                  | Scroll direction                                        |
| `progress`       | `number`                        | Scroll progress (0 to 1)                                |
| `limit`          | `number`                        | Maximum scrollable distance                             |
| `scroll`         | `number`                        | Scroll position (with modulo wrapping in infinite mode) |
| `isScrolling`    | `false \| 'native' \| 'smooth'` | Current scrolling state                                 |
| `isStopped`      | `boolean`                       | Whether scrolling is stopped                            |
| `isHorizontal`   | `boolean`                       | Whether orientation is horizontal                       |
| `isMobile`       | `boolean`                       | Whether below breakpoint                                |

## Styles

Import the built-in CSS:

```js
import '@emotionagency/emotion-scroll/css'
```

This provides base styles for the scroll container, native scrollbar hiding, and the custom scrollbar with sensible defaults.

### CSS variables

Override these variables to customize the scrollbar appearance:

```css
:root {
  /* Scrollbar track */
  --es-scrollbar-width: 12px;
  --es-scrollbar-height: 100%; /* set to e.g. 300px for a shorter track */
  --es-scrollbar-top: 0;
  --es-scrollbar-right: 0;
  --es-scrollbar-padding: 2px;
  --es-scrollbar-bg: transparent;
  --es-scrollbar-z-index: 100000;

  /* Thumb */
  --es-thumb-width: 6px;
  --es-thumb-width-hover: 10px;
  --es-thumb-bg: #6b6b6b;
  --es-thumb-bg-hover: #8b5cf6;
  --es-thumb-border-radius: 7px;
  --es-thumb-border-radius-hover: 10px;
  --es-thumb-opacity: 0.7;
}
```

### CSS classes applied automatically

| Class           | Applied to     | When                            |
| --------------- | -------------- | ------------------------------- |
| `.es-smooth`    | scroll element | always (hides native scrollbar) |
| `.es-scrolling` | scroll element | during scroll animation         |
| `.e-fixed`      | scroll element | when `stop()` is called         |

## Prevent smooth scroll on elements

Add a data attribute to elements that should use native scrolling (e.g., modals, dropdowns, nested scrollable areas):

```html
<div data-scroll-ignore>
  <!-- native scroll inside here -->
</div>
```

Or use the `prevent` callback:

```js
const scroll = new EmotionScroll({
  prevent: node => node.classList.contains('modal'),
})
```

## Manual RAF

For integration with an external render loop:

```js
const scroll = new EmotionScroll({autoRaf: false})

function animate() {
  scroll.update()
  requestAnimationFrame(animate)
}

animate()
```

## License

MIT
