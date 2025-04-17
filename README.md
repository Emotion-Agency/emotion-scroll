A library that animates the native scroll value using Virtual Scroll and custom scrollbar

# Instalation

`npm i @emotionagency/emotion-scroll`

or

`yarn add @emotionagency/emotion-scroll`

# Usage

Basic example

```
import EmotionScroll from '@emotionagency/emotion-scroll'

const scroll = new EmotionScroll()
```

Destroy instance

```
import EmotionScroll from '@emotionagency/emotion-scroll'

const scroll = new EmotionScroll()

scroll.destroy()
```

## Instance options

| Option               | Type      | Default             | Description                                                                                                                       |
| -------------------- | --------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `el`                 | `DOM el`  | `#scroll-container` | Scroll container element.                                                                                                         |
| `touchMultiplier`    | `number`  | `3.8`               | Mutiply the touch action by this modifier to make scroll faster than finger movement (Virtual Scroll API).                        |
| `firefoxMultiplier`  | `number`  | `40`                | Firefox on Windows needs a boost, since scrolling is very slow.                                                                   |
| `preventTouch`       | `boolean` | `true`              | If true, automatically call e.preventDefault on touchMove.                                                                        |
| `scrollbar`          | `boolean` | `true`              | Custom scrollbar.                                                                                                                 |
| `friction`           | `number`  | `0.08`              | Factor that affects the speed and smoothness of the scroll animation.                                                             |
| `stepSize`           | `number`  | `1`                 | A coefficient that affects the distance that will be scrolled at one time. The smaller the coefficient, the shorter the distance. |
| `breakpoint`         | `number`  | `null`              | If you pass a numeric value here, the smooth scroll will work until this breakpoint.                                              |
| `saveScrollPosition` | `boolean` | `false`             | Saving scroll position after page reload                                                                                          |
| `disabled`           | `boolean` | `false`             | Disabling scroll                                                                                                                  |
| `useKeyboard`        | `boolean` | `true`              | Ability to scroll the page using the keys (tab, space, arrows)                                                                    |
| `maxScrollDelta`     | `number`  | `120`               | What is the maximum number of pixels that can be scrolled in one scroll of the mouse wheel                                        |

## Reset scroll position

(for example, can be called when navigating between pages)

```
import EmotionScroll from '@emotionagency/emotion-scroll'

const scroll = new EmotionScroll()

scroll.reset()
```

## Scrolling hook

```
import EmotionScroll from '@emotionagency/emotion-scroll'

const scroll = new EmotionScroll()

scroll.on(({direction, position, progress, velocity}) => {
  console.log({direction, position, progress, velocity})
})
```

## Disable scroll over element

When you need to disable scroll over element, you can use the

```
data-scroll-ignore="true"
```

attribute to the element.

## Recomended styles

### Scroll Container

```
.e-fixed {
  overflow: hidden !important;
}

#scroll-container {
  will-change: scroll-position;
  overflow: hidden;
  @media (max-width: $br1) {
    overflow-x: hidden;
    overflow-y: auto;
  }
}
```

### Scrollbar

```
/* Hide scrollbar for Chrome, Safari and Opera */
#scroll-container::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
#scroll-container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10000000 !important;
  height: 100vh;
  height: 100dvh;
  width: 12px;
  user-select: none;
  overflow: hidden;
  padding: 2px;
  padding-left: 0px;
  @media screen and (min-width: 960px)) {
    &:hover {
      .scrollbar__thumb {
        width: 10px;
        opacity: 0.7;
        border-radius: 10px;
        background-color: #9047ff;
      }
    }
  }
  &.hidden {
    display: none;
  }
}

.scrollbar__thumb {
  width: 6px;
  border-radius: 7px;
  pointer-events: none;
  height: 100px;
  background: #6b6b6b;
  display: block;
  position: relative;
  user-select: none;
  transition: width 0.2s ease, opacity 0.3s ease, border-radius 0.3s ease,
    background-color 0.3s ease;
  right: 0;
  opacity: 0;
  float: right;
  &.scrolling {
    opacity: 0.7;
  }
  &.active {
    width: 10px;
    opacity: 0.7;
    border-radius: 10px;
    background-color: #9047ff;
  }
}

```
