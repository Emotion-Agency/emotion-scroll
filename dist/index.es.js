var P = Object.defineProperty;
var O = (s, t, e) => t in s ? P(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var r = (s, t, e) => O(s, typeof t != "symbol" ? t + "" : t, e);
import { clamp as b, damp as N, raf as W, modulo as D } from "@emotionagency/utils";
import { getWindow as H, getDocument as p } from "ssr-window";
import V from "virtual-scroll";
function A(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
function _(s) {
  throw new Error('Could not dynamically require "' + s + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var x = { exports: {} };
(function(s, t) {
  (function(e) {
    s.exports = e();
  })(function() {
    return function e(i, o, h) {
      function a(n, u) {
        if (!o[n]) {
          if (!i[n]) {
            var d = typeof _ == "function" && _;
            if (!u && d) return d(n, !0);
            if (c) return c(n, !0);
            var v = new Error("Cannot find module '" + n + "'");
            throw v.code = "MODULE_NOT_FOUND", v;
          }
          var S = o[n] = { exports: {} };
          i[n][0].call(S.exports, function(w) {
            var E = i[n][1][w];
            return a(E || w);
          }, S, S.exports, e, i, o, h);
        }
        return o[n].exports;
      }
      for (var c = typeof _ == "function" && _, l = 0; l < h.length; l++) a(h[l]);
      return a;
    }({ 1: [function(e, i, o) {
      function h() {
      }
      h.prototype = {
        on: function(a, c, l) {
          var n = this.e || (this.e = {});
          return (n[a] || (n[a] = [])).push({
            fn: c,
            ctx: l
          }), this;
        },
        once: function(a, c, l) {
          var n = this;
          function u() {
            n.off(a, u), c.apply(l, arguments);
          }
          return u._ = c, this.on(a, u, l);
        },
        emit: function(a) {
          var c = [].slice.call(arguments, 1), l = ((this.e || (this.e = {}))[a] || []).slice(), n = 0, u = l.length;
          for (n; n < u; n++)
            l[n].fn.apply(l[n].ctx, c);
          return this;
        },
        off: function(a, c) {
          var l = this.e || (this.e = {}), n = l[a], u = [];
          if (n && c)
            for (var d = 0, v = n.length; d < v; d++)
              n[d].fn !== c && n[d].fn._ !== c && u.push(n[d]);
          return u.length ? l[a] = u : delete l[a], this;
        }
      }, i.exports = h, i.exports.TinyEmitter = h;
    }, {}] }, {}, [1])(1);
  });
})(x);
var F = x.exports;
const C = /* @__PURE__ */ A(F);
class U {
  constructor() {
    r(this, "isRunning", !1);
    r(this, "value", 0);
    r(this, "from", 0);
    r(this, "to", 0);
    r(this, "currentTime", 0);
    r(this, "lerp");
    r(this, "duration");
    r(this, "easing");
    r(this, "onUpdate");
  }
  advance(t) {
    var i;
    if (!this.isRunning) return;
    let e = !1;
    if (this.duration && this.easing) {
      this.currentTime += t;
      const o = b(this.currentTime / this.duration, 0, 1);
      e = o >= 1;
      const h = e ? 1 : this.easing(o);
      this.value = this.from + (this.to - this.from) * h;
    } else this.lerp ? (this.value = N(this.value, this.to, this.lerp * 60, t), Math.abs(this.value - this.to) < 0.5 && (this.value = this.to, e = !0)) : (this.value = this.to, e = !0);
    e && this.stop(), (i = this.onUpdate) == null || i.call(this, this.value, e);
  }
  fromTo(t, e, i) {
    var o;
    this.from = this.value = t, this.to = e, this.lerp = i.lerp, this.duration = i.duration, this.easing = i.easing, this.currentTime = 0, this.isRunning = !0, this.onUpdate = i.onUpdate, (o = i.onStart) == null || o.call(i);
  }
  stop() {
    this.isRunning = !1;
  }
}
function Y(s, t) {
  let e;
  return function(...i) {
    clearTimeout(e), e = setTimeout(() => {
      e = void 0, s.apply(this, i);
    }, t);
  };
}
const z = H();
class I {
  constructor(t, e, { autoResize: i = !0, debounceDelay: o = 250 } = {}) {
    r(this, "width", 0);
    r(this, "height", 0);
    r(this, "scrollWidth", 0);
    r(this, "scrollHeight", 0);
    r(this, "debouncedResize");
    r(this, "wrapperResizeObserver");
    r(this, "contentResizeObserver");
    r(this, "resize", () => {
      this.wrapper instanceof Window ? (this.width = z.innerWidth, this.height = z.innerHeight, this.scrollWidth = this.content.scrollWidth, this.scrollHeight = this.content.scrollHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight, this.scrollWidth = this.wrapper.scrollWidth, this.scrollHeight = this.wrapper.scrollHeight);
    });
    this.wrapper = t, this.content = e, i && (this.debouncedResize = Y(this.resize, o), this.wrapper instanceof Window ? z.addEventListener("resize", this.debouncedResize) : typeof ResizeObserver < "u" && (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), typeof ResizeObserver < "u" && (this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content))), this.resize();
  }
  get limit() {
    return {
      x: Math.max(0, this.scrollWidth - this.width),
      y: Math.max(0, this.scrollHeight - this.height)
    };
  }
  destroy() {
    var t, e;
    (t = this.wrapperResizeObserver) == null || t.disconnect(), (e = this.contentResizeObserver) == null || e.disconnect(), this.wrapper instanceof Window && this.debouncedResize && z.removeEventListener("resize", this.debouncedResize);
  }
}
const M = p(), K = (s) => {
  const t = 1 - s;
  return 1 - t * t * t * (1 - s * 0.6);
};
function X(s = {}) {
  const t = s.orientation ?? "vertical";
  let e = s.duration ?? void 0, i = s.easing ?? void 0;
  return typeof e == "number" && typeof i != "function" ? i = K : typeof i == "function" && typeof e != "number" && (e = 1.5), {
    el: s.el ?? M.documentElement,
    content: s.content ?? s.el ?? M.documentElement,
    orientation: t,
    gestureOrientation: s.gestureOrientation ?? (t === "horizontal" ? "both" : "vertical"),
    smoothWheel: s.smoothWheel ?? !0,
    syncTouch: s.syncTouch ?? !1,
    syncTouchLerp: s.syncTouchLerp ?? 0.075,
    touchInertiaExponent: s.touchInertiaExponent ?? 1.7,
    lerp: s.lerp ?? 0.1,
    duration: e,
    easing: i,
    touchMultiplier: s.touchMultiplier ?? 1,
    wheelMultiplier: s.wheelMultiplier ?? 1,
    maxScrollDelta: s.maxScrollDelta ?? 120,
    scrollbar: s.scrollbar ?? !0,
    breakpoint: s.breakpoint ?? null,
    useKeyboardSmooth: s.useKeyboardSmooth ?? !0,
    keyboardScrollStep: s.keyboardScrollStep ?? 120,
    disabled: s.disabled ?? !1,
    raf: s.raf ?? null,
    autoRaf: s.autoRaf ?? !0,
    autoResize: s.autoResize ?? !0,
    saveScrollPosition: s.saveScrollPosition ?? !1,
    prevent: s.prevent,
    overscroll: s.overscroll ?? !0,
    infinite: s.infinite ?? !1,
    passive: s.passive ?? !1,
    maxTouchInertia: s.maxTouchInertia ?? 1e3,
    anchors: s.anchors
  };
}
const G = p();
function q(s, t, e, i, o) {
  if (typeof s == "string") {
    if (["top", "left", "start"].includes(s)) return 0 + t;
    if (["bottom", "right", "end"].includes(s)) return e + t;
    const h = G.querySelector(s);
    return h ? k(h, i, o) + t : null;
  }
  return s instanceof HTMLElement ? k(s, i, o) + t : typeof s == "number" ? s + t : null;
}
function k(s, t, e) {
  const i = s.getBoundingClientRect(), o = t ? "left" : "top", h = getComputedStyle(s), a = parseFloat(t ? h.scrollMarginLeft : h.scrollMarginTop) || 0;
  return i[o] + e - a;
}
const B = p();
function j(s, t, e) {
  var i;
  for (; s && s !== t; ) {
    if ((i = s.hasAttribute) != null && i.call(s, "data-scroll-ignore") || typeof e.prevent == "function" && e.prevent(s))
      return !0;
    s = s.parentElement;
  }
  return !1;
}
class Q {
  constructor(t) {
    r(this, "vs", null);
    r(this, "onVirtualScroll", (t) => {
      const { host: e } = this, { opts: i } = e, o = t.originalEvent, h = o.type.includes("touch"), a = o.type.includes("wheel");
      if ("ctrlKey" in o && o.ctrlKey || (e.isTouching = o.type === "touchstart" || o.type === "touchmove", j(o.target, i.el, i)) || e.isStopped || e.isLocked) return;
      if (!(i.syncTouch && h || i.smoothWheel && a)) {
        e.isScrolling = "native", e.stopAnimation();
        return;
      }
      e.emitVirtualScroll({ deltaX: t.deltaX, deltaY: t.deltaY, event: o });
      let l;
      if (i.gestureOrientation === "both" ? l = Math.abs(t.deltaY) > Math.abs(t.deltaX) ? t.deltaY : t.deltaX : i.gestureOrientation === "horizontal" ? l = t.deltaX : l = t.deltaY, l === 0) return;
      l = -l, a && (l *= i.wheelMultiplier), l = b(l, -i.maxScrollDelta, i.maxScrollDelta);
      const n = h && o.type === "touchend";
      if (n && i.syncTouch) {
        const v = Math.sign(e.velocity) * Math.abs(e.velocity) ** i.touchInertiaExponent;
        l = b(v, -i.maxTouchInertia, i.maxTouchInertia);
      }
      (!i.overscroll || i.infinite || this.isWithinBounds(l)) && "cancelable" in o && o.cancelable && o.preventDefault();
      const u = h && i.syncTouch, d = u && n;
      e.scrollTo(e.targetScroll + l, {
        ...u ? { lerp: d ? i.syncTouchLerp : 1 } : { lerp: i.lerp, duration: i.duration, easing: i.easing }
      });
    });
    this.host = t;
  }
  setup() {
    const { opts: t } = this.host;
    this.vs = new V({
      el: t.el === B.documentElement ? void 0 : t.el,
      touchMultiplier: t.touchMultiplier,
      passive: t.passive,
      useKeyboard: !1
    }), this.vs.on(this.onVirtualScroll);
  }
  destroy() {
    var t;
    (t = this.vs) == null || t.destroy(), this.vs = null;
  }
  isWithinBounds(t) {
    const { animatedScroll: e, limit: i } = this.host;
    return i <= 0 ? !1 : e > 0 && e < i || e === 0 && t > 0 || e === i && t < 0;
  }
}
const f = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  TAB: "Tab",
  PAGEUP: "PageUp",
  PAGEDOWN: "PageDown",
  HOME: "Home",
  END: "End"
}, y = H(), J = p();
class Z {
  constructor(t) {
    r(this, "onKeyDown", (t) => {
      const { host: e } = this;
      if (e.isStopped || e.limit <= 0) return;
      const i = e.opts.keyboardScrollStep;
      let o = null;
      switch (t.key) {
        case f.TAB: {
          const h = J.activeElement;
          if (h) {
            const a = h.getBoundingClientRect(), c = e.isHorizontal ? a.left : a.top;
            o = e.animatedScroll + c;
          }
          break;
        }
        case f.UP:
          o = e.targetScroll - i;
          break;
        case f.DOWN:
          o = e.targetScroll + i;
          break;
        case f.LEFT:
          e.isHorizontal && (o = e.targetScroll - i);
          break;
        case f.RIGHT:
          e.isHorizontal && (o = e.targetScroll + i);
          break;
        case f.PAGEUP:
          o = e.targetScroll - (e.isHorizontal ? y.innerWidth : y.innerHeight);
          break;
        case f.PAGEDOWN:
          o = e.targetScroll + (e.isHorizontal ? y.innerWidth : y.innerHeight);
          break;
        case f.HOME:
          o = 0;
          break;
        case f.END:
          o = e.limit;
          break;
      }
      o !== null && e.scrollTo(b(o, 0, e.limit));
    });
    this.host = t;
  }
  init() {
    y.addEventListener("keydown", this.onKeyDown, !1);
  }
  destroy() {
    y.removeEventListener("keydown", this.onKeyDown);
  }
}
const tt = H(), et = p();
class it {
  constructor(t, e) {
    r(this, "onClick", (t) => {
      const e = t.composedPath();
      for (const i of e) {
        if (!(i instanceof HTMLAnchorElement) || !i.href) continue;
        const o = new URL(i.href), h = new URL(tt.location.href);
        if (o.host !== h.host || o.pathname !== h.pathname || !o.hash) continue;
        const a = o.hash;
        if (!et.querySelector(a)) continue;
        t.preventDefault();
        const c = typeof this.host.opts.anchors == "object" ? this.host.opts.anchors : void 0;
        this.host.scrollTo(a, c), history.pushState(null, "", a);
        break;
      }
    });
    this.host = t, this.element = e;
  }
  init() {
    this.element.addEventListener("click", this.onClick);
  }
  destroy() {
    this.element.removeEventListener("click", this.onClick);
  }
}
const L = p();
class st {
  constructor() {
    r(this, "scrollbar");
  }
  create(t = !1) {
    this.scrollbar = L.createElement("div");
    const e = L.createElement("span");
    return e.className = "scrollbar__thumb", this.scrollbar.appendChild(e), this.scrollbar.classList.add("scrollbar"), t && this.scrollbar.classList.add("scrollbar--horizontal"), this.scrollbar;
  }
  append(t) {
    if (!t) {
      L.body.appendChild(this.scrollbar);
      return;
    }
    t.appendChild(this.scrollbar);
  }
  destroy() {
    this.scrollbar.remove();
  }
}
class rt {
  constructor(t, e = 1e3) {
    r(this, "timer", null);
    this.cb = t, this.delay = e;
  }
  show() {
    this.timer !== null && clearTimeout(this.timer), this.cb(!0), this.timer = setTimeout(() => {
      this.cb(!1), this.timer = null;
    }, this.delay);
  }
  destroy() {
    this.timer !== null && (clearTimeout(this.timer), this.timer = null);
  }
}
const T = p(), g = {
  start: ["mousedown", "touchstart"],
  move: ["mousemove", "touchmove"],
  end: ["mouseup", "touchend"]
};
class ot {
  constructor(t, e) {
    r(this, "onTrackClick", (t) => {
      if (this.controller.isStopped) return;
      const e = this.pointerToScroll(t.clientX, t.clientY);
      this.controller.scrollTo(e);
    });
    r(this, "onStart", (t) => {
      t.preventDefault();
      for (const e of g.move)
        T.documentElement.addEventListener(e, this.onMove);
      this.elements.$thumb.classList.add("active");
    });
    r(this, "onMove", (t) => {
      if (this.controller.isStopped) return;
      let e, i;
      "touches" in t && t.touches.length > 0 ? (e = t.touches[0].clientX, i = t.touches[0].clientY) : (e = t.clientX, i = t.clientY);
      const o = this.pointerToScroll(e, i);
      this.controller.scrollTo(o);
    });
    r(this, "onEnd", () => {
      this.elements.$thumb.classList.remove("active");
      for (const t of g.move)
        T.documentElement.removeEventListener(t, this.onMove);
    });
    this.elements = t, this.controller = e, this.init();
  }
  get isHorizontal() {
    return this.controller.isHorizontal;
  }
  init() {
    for (const t of g.start)
      this.elements.$scrollbar.addEventListener(t, this.onStart, { passive: !1 });
    for (const t of g.end)
      T.documentElement.addEventListener(t, this.onEnd);
    this.elements.$scrollbar.addEventListener("click", this.onTrackClick);
  }
  /** Map a pointer position (relative to track) to a scroll target. */
  pointerToScroll(t, e) {
    const i = this.elements.$scrollbar.getBoundingClientRect(), o = getComputedStyle(this.elements.$scrollbar), h = this.isHorizontal ? t : e;
    let a, c;
    if (this.isHorizontal) {
      const n = parseFloat(o.paddingLeft) || 0, u = parseFloat(o.paddingRight) || 0;
      a = i.left + n, c = i.width - n - u;
    } else {
      const n = parseFloat(o.paddingTop) || 0, u = parseFloat(o.paddingBottom) || 0;
      a = i.top + n, c = i.height - n - u;
    }
    return b((h - a) / c, 0, 1) * this.controller.limit;
  }
  destroy() {
    for (const t of g.start)
      this.elements.$scrollbar.removeEventListener(t, this.onStart);
    for (const t of g.end)
      T.documentElement.removeEventListener(t, this.onEnd);
    for (const t of g.move)
      T.documentElement.removeEventListener(t, this.onMove);
    this.elements.$scrollbar.removeEventListener("click", this.onTrackClick);
  }
}
const nt = p();
class R {
  constructor(t, e) {
    r(this, "$scrollbar");
    r(this, "$thumb");
    r(this, "thumbSize", 0);
    r(this, "cachedPadding", { top: 0, bottom: 0, left: 0, right: 0 });
    r(this, "createScrollbar", new st());
    r(this, "inactivity");
    r(this, "drag", null);
    r(this, "onMouseEnter", () => {
      this.inactivity.show();
    });
    r(this, "setVisibility", (t) => {
      this.$thumb.classList.toggle("scrolling", t);
    });
    r(this, "onFrame", () => {
      this.$scrollbar.classList.toggle("hidden", this.controller.isStopped), this.updateThumbSize(), this.updateThumbPosition(), this.controller.isScrolling && this.inactivity.show();
    });
    this.controller = t, this.raf = e, this.inactivity = new rt(this.setVisibility), this.init();
  }
  get isHorizontal() {
    return this.controller.isHorizontal;
  }
  cacheScrollbarPadding() {
    const t = getComputedStyle(this.$scrollbar);
    this.cachedPadding = {
      top: parseFloat(t.paddingTop) || 0,
      bottom: parseFloat(t.paddingBottom) || 0,
      left: parseFloat(t.paddingLeft) || 0,
      right: parseFloat(t.paddingRight) || 0
    };
  }
  /** Inner track size excluding padding. */
  get trackSize() {
    return this.isHorizontal ? this.$scrollbar.clientWidth - this.cachedPadding.left - this.cachedPadding.right : this.$scrollbar.clientHeight - this.cachedPadding.top - this.cachedPadding.bottom;
  }
  init() {
    this.$scrollbar = this.createScrollbar.create(this.isHorizontal), this.$thumb = this.$scrollbar.querySelector(".scrollbar__thumb"), this.createScrollbar.append(nt.body), this.cacheScrollbarPadding(), this.$scrollbar.addEventListener("mouseenter", this.onMouseEnter), this.drag = new ot(
      { $scrollbar: this.$scrollbar, $thumb: this.$thumb },
      this.controller
    ), this.raf.on(this.onFrame);
  }
  updateThumbSize() {
    const t = this.controller.limit;
    if (t <= 0) {
      this.thumbSize = 0, this.$thumb.style[this.isHorizontal ? "width" : "height"] = "0px";
      return;
    }
    const e = this.trackSize, i = e / (e + t);
    this.thumbSize = Math.max(e * i, 20), this.$thumb.style[this.isHorizontal ? "width" : "height"] = this.thumbSize + "px";
  }
  updateThumbPosition() {
    const t = this.trackSize - this.thumbSize;
    if (t <= 0) return;
    const o = (b(this.controller.progress, 0, 1) * t).toFixed(2);
    this.isHorizontal ? this.$thumb.style.transform = `translateX(${o}px)` : this.$thumb.style.transform = `translateY(${o}px)`;
  }
  reset() {
    this.updateThumbSize(), this.$thumb.style.transform = this.isHorizontal ? "translateX(0px)" : "translateY(0px)";
  }
  destroy() {
    var t;
    (t = this.drag) == null || t.destroy(), this.drag = null, this.$scrollbar.removeEventListener("mouseenter", this.onMouseEnter), this.createScrollbar.destroy(), this.inactivity.destroy(), this.raf.off(this.onFrame);
  }
}
const m = H();
class ut {
  constructor(t = {}) {
    // --- Public state ---
    r(this, "animatedScroll", 0);
    r(this, "targetScroll", 0);
    r(this, "velocity", 0);
    r(this, "lastVelocity", 0);
    r(this, "direction", 0);
    r(this, "isTouching", !1);
    // --- Private state ---
    r(this, "_isScrolling", !1);
    r(this, "_isStopped", !1);
    r(this, "_isLocked", !1);
    r(this, "_preventNativeScrollCounter", 0);
    r(this, "_preventTimers", []);
    r(this, "_resetVelocityTimeout", null);
    r(this, "_reducedMotion", !1);
    r(this, "_motionQuery", null);
    r(this, "_time", 0);
    r(this, "_isMobile", !1);
    // --- Dependencies ---
    r(this, "opts");
    r(this, "animate", new U());
    r(this, "emitter", new C());
    r(this, "dimensions");
    r(this, "_raf");
    // --- Handlers ---
    r(this, "vsHandler", null);
    r(this, "keyboardHandler", null);
    r(this, "anchorHandler", null);
    r(this, "scrollbar", null);
    r(this, "update", () => {
      const t = performance.now(), e = (t - (this._time || t)) * 1e-3;
      this._time = t, this.animate.advance(e);
    });
    r(this, "onNativeScroll", () => {
      if (this._resetVelocityTimeout !== null && (clearTimeout(this._resetVelocityTimeout), this._resetVelocityTimeout = null), this._preventNativeScrollCounter > 0) {
        this._preventNativeScrollCounter--;
        return;
      }
      if (this._isScrolling !== !1 && this._isScrolling !== "native" || this.opts.infinite) return;
      const t = this.animatedScroll;
      this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity, this.velocity = this.animatedScroll - t, this.direction = Math.sign(this.velocity), this._isStopped || (this.isScrolling = "native"), this.emit(), this.velocity !== 0 && (this._resetVelocityTimeout = setTimeout(() => {
        this.lastVelocity = this.velocity, this.velocity = 0, this.isScrolling = !1, this.emit();
      }, 400));
    });
    r(this, "onMobileResize", () => {
      var e, i;
      if (!this.opts.breakpoint) return;
      const t = this._isMobile;
      this._isMobile = m.innerWidth < this.opts.breakpoint, t !== this._isMobile && (this._isMobile ? ((e = this.vsHandler) == null || e.destroy(), this.vsHandler = null, (i = this.scrollbar) == null || i.destroy(), this.scrollbar = null) : (this.vsHandler || this.initVirtualScroll(), !this.scrollbar && this.opts.scrollbar && (this.scrollbar = new R(this, this._raf))));
    });
    r(this, "onReducedMotionChange", (t) => {
      this._reducedMotion = t.matches;
    });
    // ---------------------------------------------------------------------------
    // Scroll position persistence
    // ---------------------------------------------------------------------------
    r(this, "STORAGE_KEY", "emotion-scroll-position");
    this.opts = X(t), this._raf = this.opts.raf || W, this.dimensions = new I(this.wrapperElement, this.opts.content, {
      autoResize: this.opts.autoResize
    }), this.animatedScroll = this.targetScroll = this.actualScroll, this.opts.el.classList.add("es-smooth"), this.initReducedMotion(), this.initNativeListeners(), this.initMobileCheck(), this._isMobile || (this.initVirtualScroll(), this.opts.scrollbar && (this.scrollbar = new R(this, this._raf))), this.opts.anchors && (this.anchorHandler = new it(this, this.wrapperElement), this.anchorHandler.init()), this.opts.useKeyboardSmooth && (this.keyboardHandler = new Z(this), this.keyboardHandler.init()), this.opts.saveScrollPosition && this.restoreScrollPosition(), this.opts.disabled && this.stop(), this.opts.autoRaf && this._raf.on(this.update);
  }
  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------
  on(t, e) {
    this.emitter.on(t, e);
  }
  off(t, e) {
    this.emitter.off(t, e);
  }
  scrollTo(t, {
    offset: e = 0,
    immediate: i = !1,
    lock: o = !1,
    duration: h,
    easing: a,
    lerp: c,
    onStart: l,
    onComplete: n,
    force: u = !1
  } = {}) {
    if ((this._isStopped || this._isLocked) && !u) return;
    let d = q(
      t,
      e,
      this.limit,
      this.isHorizontal,
      this.animatedScroll
    );
    if (d === null) return;
    if (d = this.opts.infinite ? d : b(d, 0, this.limit), d === this.targetScroll) {
      l == null || l(this), n == null || n(this);
      return;
    }
    if (this._reducedMotion && (i = !0), i) {
      this.animatedScroll = this.targetScroll = d, this.setScroll(this.scroll), this.resetState(), this.preventNextNativeScrollEvent(), this.emit(), n == null || n(this);
      return;
    }
    const v = c ?? this.opts.lerp, S = h ?? this.opts.duration, w = a ?? this.opts.easing;
    this.targetScroll = d, this.animate.fromTo(this.animatedScroll, d, {
      lerp: S ? void 0 : v,
      duration: S,
      easing: w,
      onStart: () => {
        o && (this._isLocked = !0), this.isScrolling = "smooth", l == null || l(this);
      },
      onUpdate: (E, $) => {
        this.isScrolling = "smooth", this.lastVelocity = this.velocity, this.velocity = E - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = E, this.setScroll(this.scroll), $ ? (this.resetState(), this.emit(), n == null || n(this), this.preventNextNativeScrollEvent(), this.opts.saveScrollPosition && this.persistScrollPosition()) : this.emit();
      }
    });
  }
  start() {
    this._isStopped && (this.resetState(), this._isStopped = !1, this.opts.el.classList.remove("e-fixed"), this.emit());
  }
  stop() {
    this._isStopped || (this.resetState(), this._isStopped = !0, this.opts.el.classList.add("e-fixed"), this.emit());
  }
  resize() {
    this.dimensions.resize(), this.animatedScroll = this.targetScroll = this.actualScroll, this.emit();
  }
  reset() {
    var t;
    this.scrollTo(0, { immediate: !0 }), (t = this.scrollbar) == null || t.reset();
  }
  destroy() {
    var t, e, i, o, h;
    this._raf.off(this.update), (t = this.vsHandler) == null || t.destroy(), this.vsHandler = null, (e = this.keyboardHandler) == null || e.destroy(), this.keyboardHandler = null, (i = this.anchorHandler) == null || i.destroy(), this.anchorHandler = null, (o = this.scrollbar) == null || o.destroy(), this.scrollbar = null, this.dimensions.destroy(), m.removeEventListener("resize", this.onMobileResize), this.wrapperElement.removeEventListener("scroll", this.onNativeScroll), (h = this._motionQuery) == null || h.removeEventListener("change", this.onReducedMotionChange), this._resetVelocityTimeout !== null && clearTimeout(this._resetVelocityTimeout);
    for (const a of this._preventTimers) clearTimeout(a);
    this._preventTimers = [], this.opts.el.classList.remove("es-smooth", "es-scrolling", "e-fixed"), this.emitter.off("scroll"), this.emitter.off("virtual-scroll");
  }
  // ---------------------------------------------------------------------------
  // Read-only properties (IScrollController)
  // ---------------------------------------------------------------------------
  get isScrolling() {
    return this._isScrolling;
  }
  set isScrolling(t) {
    this._isScrolling !== t && (this._isScrolling = t, this.opts.el.classList.toggle("es-scrolling", !!t));
  }
  get isStopped() {
    return this._isStopped;
  }
  get isLocked() {
    return this._isLocked;
  }
  get isHorizontal() {
    return this.opts.orientation === "horizontal";
  }
  get limit() {
    return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
  }
  get scroll() {
    return this.opts.infinite ? D(this.animatedScroll, this.limit) : this.animatedScroll;
  }
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  get isMobile() {
    return this._isMobile;
  }
  // ---------------------------------------------------------------------------
  // VirtualScrollHost interface (used by VirtualScrollHandler)
  // ---------------------------------------------------------------------------
  emitVirtualScroll(t) {
    this.emitter.emit("virtual-scroll", t);
  }
  stopAnimation() {
    this.animate.stop();
  }
  // ---------------------------------------------------------------------------
  // Native scroll integration
  // ---------------------------------------------------------------------------
  get isWindowScroll() {
    const t = p();
    return this.opts.el === t.documentElement;
  }
  get wrapperElement() {
    return this.isWindowScroll ? m : this.opts.el;
  }
  get actualScroll() {
    return this.isWindowScroll ? this.isHorizontal ? m.scrollX : m.scrollY : this.isHorizontal ? this.opts.el.scrollLeft : this.opts.el.scrollTop;
  }
  setScroll(t) {
    this.wrapperElement.scrollTo({
      [this.isHorizontal ? "left" : "top"]: t,
      behavior: "instant"
    });
  }
  initNativeListeners() {
    this.wrapperElement.addEventListener("scroll", this.onNativeScroll, {
      passive: !0
    });
  }
  preventNextNativeScrollEvent() {
    this._preventNativeScrollCounter++;
    const t = setTimeout(() => {
      this._preventNativeScrollCounter > 0 && this._preventNativeScrollCounter--, this._preventTimers = this._preventTimers.filter((e) => e !== t);
    }, 100);
    this._preventTimers.push(t);
  }
  // ---------------------------------------------------------------------------
  // Mobile breakpoint
  // ---------------------------------------------------------------------------
  initMobileCheck() {
    this.opts.breakpoint && (this._isMobile = m.innerWidth < this.opts.breakpoint, m.addEventListener("resize", this.onMobileResize));
  }
  initVirtualScroll() {
    this.vsHandler = new Q(this), this.vsHandler.setup();
  }
  // ---------------------------------------------------------------------------
  // Reduced motion
  // ---------------------------------------------------------------------------
  initReducedMotion() {
    typeof m.matchMedia == "function" && (this._motionQuery = m.matchMedia("(prefers-reduced-motion: reduce)"), this._reducedMotion = this._motionQuery.matches, this._motionQuery.addEventListener("change", this.onReducedMotionChange));
  }
  restoreScrollPosition() {
    const t = m.localStorage.getItem(this.STORAGE_KEY);
    if (t !== null) {
      const e = Number(t);
      Number.isNaN(e) || this.scrollTo(e, { immediate: !0 });
    }
  }
  persistScrollPosition() {
    m.localStorage.setItem(this.STORAGE_KEY, String(this.animatedScroll));
  }
  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------
  resetState() {
    if (this._isLocked = !1, this.isScrolling = !1, this.opts.infinite) {
      const t = this.scroll;
      this.animatedScroll = this.targetScroll = t;
    } else
      this.animatedScroll = this.targetScroll = this.actualScroll;
    this.lastVelocity = this.velocity = 0, this.animate.stop();
  }
  emit() {
    this.emitter.emit("scroll", {
      position: this.scroll,
      direction: this.direction,
      velocity: this.velocity,
      progress: this.progress
    });
  }
}
export {
  ut as default
};
