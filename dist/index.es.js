var $ = Object.defineProperty;
var O = (s, t, e) => t in s ? $(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var r = (s, t, e) => O(s, typeof t != "symbol" ? t + "" : t, e);
import P from "virtual-scroll";
import { clamp as v, damp as N, raf as W, modulo as D } from "@emotionagency/utils";
import { getWindow as k, getDocument as E } from "ssr-window";
function V(s) {
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
    return function e(i, l, c) {
      function n(o, u) {
        if (!l[o]) {
          if (!i[o]) {
            var d = typeof _ == "function" && _;
            if (!u && d) return d(o, !0);
            if (a) return a(o, !0);
            var g = new Error("Cannot find module '" + o + "'");
            throw g.code = "MODULE_NOT_FOUND", g;
          }
          var b = l[o] = { exports: {} };
          i[o][0].call(b.exports, function(T) {
            var S = i[o][1][T];
            return n(S || T);
          }, b, b.exports, e, i, l, c);
        }
        return l[o].exports;
      }
      for (var a = typeof _ == "function" && _, h = 0; h < c.length; h++) n(c[h]);
      return n;
    }({ 1: [function(e, i, l) {
      function c() {
      }
      c.prototype = {
        on: function(n, a, h) {
          var o = this.e || (this.e = {});
          return (o[n] || (o[n] = [])).push({
            fn: a,
            ctx: h
          }), this;
        },
        once: function(n, a, h) {
          var o = this;
          function u() {
            o.off(n, u), a.apply(h, arguments);
          }
          return u._ = a, this.on(n, u, h);
        },
        emit: function(n) {
          var a = [].slice.call(arguments, 1), h = ((this.e || (this.e = {}))[n] || []).slice(), o = 0, u = h.length;
          for (o; o < u; o++)
            h[o].fn.apply(h[o].ctx, a);
          return this;
        },
        off: function(n, a) {
          var h = this.e || (this.e = {}), o = h[n], u = [];
          if (o && a)
            for (var d = 0, g = o.length; d < g; d++)
              o[d].fn !== a && o[d].fn._ !== a && u.push(o[d]);
          return u.length ? h[n] = u : delete h[n], this;
        }
      }, i.exports = c, i.exports.TinyEmitter = c;
    }, {}] }, {}, [1])(1);
  });
})(x);
var A = x.exports;
const F = /* @__PURE__ */ V(A);
class Y {
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
      const l = v(this.currentTime / this.duration, 0, 1);
      e = l >= 1;
      const c = e ? 1 : this.easing(l);
      this.value = this.from + (this.to - this.from) * c;
    } else this.lerp ? (this.value = N(this.value, this.to, this.lerp * 60, t), Math.abs(this.value - this.to) < 0.5 && (this.value = this.to, e = !0)) : (this.value = this.to, e = !0);
    e && this.stop(), (i = this.onUpdate) == null || i.call(this, this.value, e);
  }
  fromTo(t, e, i) {
    var l;
    this.from = this.value = t, this.to = e, this.lerp = i.lerp, this.duration = i.duration, this.easing = i.easing, this.currentTime = 0, this.isRunning = !0, this.onUpdate = i.onUpdate, (l = i.onStart) == null || l.call(i);
  }
  stop() {
    this.isRunning = !1;
  }
}
function C(s, t) {
  let e;
  return function(...i) {
    clearTimeout(e), e = setTimeout(() => {
      e = void 0, s.apply(this, i);
    }, t);
  };
}
const w = k();
class I {
  constructor(t, e, { autoResize: i = !0, debounceDelay: l = 250 } = {}) {
    r(this, "width", 0);
    r(this, "height", 0);
    r(this, "scrollWidth", 0);
    r(this, "scrollHeight", 0);
    r(this, "debouncedResize");
    r(this, "wrapperResizeObserver");
    r(this, "contentResizeObserver");
    r(this, "resize", () => {
      this.wrapper instanceof Window ? (this.width = w.innerWidth, this.height = w.innerHeight, this.scrollWidth = this.content.scrollWidth, this.scrollHeight = this.content.scrollHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight, this.scrollWidth = this.wrapper.scrollWidth, this.scrollHeight = this.wrapper.scrollHeight);
    });
    this.wrapper = t, this.content = e, i && (this.debouncedResize = C(this.resize, l), this.wrapper instanceof Window ? w.addEventListener("resize", this.debouncedResize) : typeof ResizeObserver < "u" && (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), typeof ResizeObserver < "u" && (this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content))), this.resize();
  }
  get limit() {
    return {
      x: Math.max(0, this.scrollWidth - this.width),
      y: Math.max(0, this.scrollHeight - this.height)
    };
  }
  destroy() {
    var t, e;
    (t = this.wrapperResizeObserver) == null || t.disconnect(), (e = this.contentResizeObserver) == null || e.disconnect(), this.wrapper instanceof Window && this.debouncedResize && w.removeEventListener("resize", this.debouncedResize);
  }
}
const L = E(), U = (s) => {
  const t = 1 - s;
  return 1 - t * t * t * (1 - s * 0.6);
};
function K(s = {}) {
  const t = s.orientation ?? "vertical";
  let e = s.duration ?? void 0, i = s.easing ?? void 0;
  return typeof e == "number" && typeof i != "function" ? i = U : typeof i == "function" && typeof e != "number" && (e = 1.5), {
    el: s.el ?? L.documentElement,
    content: s.content ?? s.el ?? L.documentElement,
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
    maxTouchInertia: s.maxTouchInertia ?? 1e3
  };
}
const p = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  TAB: "Tab",
  PAGEUP: "PageUp",
  PAGEDOWN: "PageDown",
  HOME: "Home",
  END: "End"
}, M = E();
class X {
  constructor() {
    r(this, "scrollbar");
  }
  create(t = !1) {
    this.scrollbar = M.createElement("div");
    const e = M.createElement("span");
    return e.className = "scrollbar__thumb", this.scrollbar.appendChild(e), this.scrollbar.classList.add("scrollbar"), t && this.scrollbar.classList.add("scrollbar--horizontal"), this.scrollbar;
  }
  append(t) {
    if (!t) {
      M.body.appendChild(this.scrollbar);
      return;
    }
    t.appendChild(this.scrollbar);
  }
  destroy() {
    this.scrollbar.remove();
  }
}
class G {
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
const y = E(), f = {
  start: ["mousedown", "touchstart"],
  move: ["mousemove", "touchmove"],
  end: ["mouseup", "touchend"]
};
class B {
  constructor(t, e) {
    r(this, "onTrackClick", (t) => {
      if (this.controller.isStopped) return;
      const e = this.pointerToScroll(t.clientX, t.clientY);
      this.controller.scrollTo(e);
    });
    r(this, "onStart", (t) => {
      t.preventDefault();
      for (const e of f.move)
        y.documentElement.addEventListener(e, this.onMove);
      this.elements.$thumb.classList.add("active");
    });
    r(this, "onMove", (t) => {
      if (this.controller.isStopped) return;
      let e, i;
      "touches" in t && t.touches.length > 0 ? (e = t.touches[0].clientX, i = t.touches[0].clientY) : (e = t.clientX, i = t.clientY);
      const l = this.pointerToScroll(e, i);
      this.controller.scrollTo(l);
    });
    r(this, "onEnd", () => {
      this.elements.$thumb.classList.remove("active");
      for (const t of f.move)
        y.documentElement.removeEventListener(t, this.onMove);
    });
    this.elements = t, this.controller = e, this.init();
  }
  get isHorizontal() {
    return this.controller.isHorizontal;
  }
  init() {
    for (const t of f.start)
      this.elements.$scrollbar.addEventListener(t, this.onStart, { passive: !1 });
    for (const t of f.end)
      y.documentElement.addEventListener(t, this.onEnd);
    this.elements.$scrollbar.addEventListener("click", this.onTrackClick);
  }
  /** Map a pointer position (relative to track) to a scroll target. */
  pointerToScroll(t, e) {
    const i = this.elements.$scrollbar.getBoundingClientRect(), l = getComputedStyle(this.elements.$scrollbar), c = this.isHorizontal ? t : e;
    let n, a;
    if (this.isHorizontal) {
      const o = parseFloat(l.paddingLeft) || 0, u = parseFloat(l.paddingRight) || 0;
      n = i.left + o, a = i.width - o - u;
    } else {
      const o = parseFloat(l.paddingTop) || 0, u = parseFloat(l.paddingBottom) || 0;
      n = i.top + o, a = i.height - o - u;
    }
    return v((c - n) / a, 0, 1) * this.controller.limit;
  }
  destroy() {
    for (const t of f.start)
      this.elements.$scrollbar.removeEventListener(t, this.onStart);
    for (const t of f.end)
      y.documentElement.removeEventListener(t, this.onEnd);
    for (const t of f.move)
      y.documentElement.removeEventListener(t, this.onMove);
    this.elements.$scrollbar.removeEventListener("click", this.onTrackClick);
  }
}
const q = E();
class R {
  constructor(t, e) {
    r(this, "$scrollbar");
    r(this, "$thumb");
    r(this, "thumbSize", 0);
    r(this, "cachedPadding", { top: 0, bottom: 0, left: 0, right: 0 });
    r(this, "createScrollbar", new X());
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
    this.controller = t, this.raf = e, this.inactivity = new G(this.setVisibility), this.init();
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
    this.$scrollbar = this.createScrollbar.create(this.isHorizontal), this.$thumb = this.$scrollbar.querySelector(".scrollbar__thumb"), this.createScrollbar.append(q.body), this.cacheScrollbarPadding(), this.$scrollbar.addEventListener("mouseenter", this.onMouseEnter), this.drag = new B(
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
    const l = (v(this.controller.progress, 0, 1) * t).toFixed(2);
    this.isHorizontal ? this.$thumb.style.transform = `translateX(${l}px)` : this.$thumb.style.transform = `translateY(${l}px)`;
  }
  reset() {
    this.updateThumbSize(), this.$thumb.style.transform = this.isHorizontal ? "translateX(0px)" : "translateY(0px)";
  }
  destroy() {
    var t;
    (t = this.drag) == null || t.destroy(), this.drag = null, this.$scrollbar.removeEventListener("mouseenter", this.onMouseEnter), this.createScrollbar.destroy(), this.inactivity.destroy(), this.raf.off(this.onFrame);
  }
}
const m = k(), z = E();
function Q(s, t, e) {
  var i;
  for (; s && s !== t; ) {
    if ((i = s.hasAttribute) != null && i.call(s, "data-scroll-ignore") || typeof e.prevent == "function" && e.prevent(s))
      return !0;
    s = s.parentElement;
  }
  return !1;
}
class et {
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
    r(this, "_time", 0);
    r(this, "_isMobile", !1);
    // --- Dependencies ---
    r(this, "opts");
    r(this, "animate", new Y());
    r(this, "emitter", new F());
    r(this, "dimensions");
    r(this, "_raf");
    r(this, "vs", null);
    r(this, "scrollbar", null);
    /** Call this manually each frame when `autoRaf` is `false`. */
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
    r(this, "onVirtualScroll", (t) => {
      const e = t.originalEvent, i = e.type.includes("touch"), l = e.type.includes("wheel");
      if ("ctrlKey" in e && e.ctrlKey || (this.isTouching = e.type === "touchstart" || e.type === "touchmove", Q(e.target, this.opts.el, this.opts)) || this._isStopped || this._isLocked) return;
      if (!(this.opts.syncTouch && i || this.opts.smoothWheel && l)) {
        this.isScrolling = "native", this.animate.stop();
        return;
      }
      this.emitter.emit("virtual-scroll", {
        deltaX: t.deltaX,
        deltaY: t.deltaY,
        event: e
      });
      let n;
      if (this.opts.gestureOrientation === "both" ? n = Math.abs(t.deltaY) > Math.abs(t.deltaX) ? t.deltaY : t.deltaX : this.opts.gestureOrientation === "horizontal" ? n = t.deltaX : n = t.deltaY, n === 0) return;
      n = -n, l && (n *= this.opts.wheelMultiplier), n = v(n, -this.opts.maxScrollDelta, this.opts.maxScrollDelta);
      const a = i && e.type === "touchend";
      if (a && this.opts.syncTouch) {
        const u = Math.sign(this.velocity) * Math.abs(this.velocity) ** this.opts.touchInertiaExponent;
        n = v(
          u,
          -this.opts.maxTouchInertia,
          this.opts.maxTouchInertia
        );
      }
      (!this.opts.overscroll || this.opts.infinite || this.isWithinBounds(n)) && "cancelable" in e && e.cancelable && e.preventDefault();
      const h = i && this.opts.syncTouch, o = h && a;
      this.scrollTo(this.targetScroll + n, {
        ...h ? { lerp: o ? this.opts.syncTouchLerp : 1 } : {
          lerp: this.opts.lerp,
          duration: this.opts.duration,
          easing: this.opts.easing
        }
      });
    });
    // ---------------------------------------------------------------------------
    // Keyboard
    // ---------------------------------------------------------------------------
    r(this, "onKeyDown", (t) => {
      if (this._isStopped || this.limit <= 0) return;
      const e = this.opts.keyboardScrollStep;
      let i = null;
      switch (t.key) {
        case p.TAB: {
          const l = z.activeElement;
          if (l) {
            const c = l.getBoundingClientRect(), n = this.isHorizontal ? c.left : c.top;
            i = this.animatedScroll + n;
          }
          break;
        }
        case p.UP:
          i = this.targetScroll - e;
          break;
        case p.DOWN:
          i = this.targetScroll + e;
          break;
        case p.LEFT:
          this.isHorizontal && (i = this.targetScroll - e);
          break;
        case p.RIGHT:
          this.isHorizontal && (i = this.targetScroll + e);
          break;
        case p.PAGEUP:
          i = this.targetScroll - (this.isHorizontal ? m.innerWidth : m.innerHeight);
          break;
        case p.PAGEDOWN:
          i = this.targetScroll + (this.isHorizontal ? m.innerWidth : m.innerHeight);
          break;
        case p.HOME:
          i = 0;
          break;
        case p.END:
          i = this.limit;
          break;
      }
      i !== null && this.scrollTo(v(i, 0, this.limit));
    });
    r(this, "onMobileResize", () => {
      var e, i;
      if (!this.opts.breakpoint) return;
      const t = this._isMobile;
      this._isMobile = m.innerWidth < this.opts.breakpoint, t !== this._isMobile && (this._isMobile ? ((e = this.vs) == null || e.destroy(), this.vs = null, (i = this.scrollbar) == null || i.destroy(), this.scrollbar = null) : (this.vs || this.setupVirtualScroll(), !this.scrollbar && this.opts.scrollbar && (this.scrollbar = new R(this, this._raf))));
    });
    // ---------------------------------------------------------------------------
    // Reduced motion
    // ---------------------------------------------------------------------------
    r(this, "_motionQuery", null);
    r(this, "onReducedMotionChange", (t) => {
      this._reducedMotion = t.matches;
    });
    // ---------------------------------------------------------------------------
    // Scroll position persistence
    // ---------------------------------------------------------------------------
    r(this, "STORAGE_KEY", "emotion-scroll-position");
    this.opts = K(t), this._raf = this.opts.raf || W, this.dimensions = new I(this.wrapperElement, this.opts.content, {
      autoResize: this.opts.autoResize
    }), this.animatedScroll = this.targetScroll = this.actualScroll, this.opts.el.classList.add("es-smooth"), this.initReducedMotion(), this.initNativeListeners(), this.initMobileCheck(), this._isMobile || (this.setupVirtualScroll(), this.opts.scrollbar && (this.scrollbar = new R(this, this._raf))), this.opts.useKeyboardSmooth && m.addEventListener("keydown", this.onKeyDown, !1), this.opts.saveScrollPosition && this.restoreScrollPosition(), this.opts.disabled && this.stop(), this.opts.autoRaf && this._raf.on(this.update);
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
    lock: l = !1,
    duration: c,
    easing: n,
    lerp: a,
    onStart: h,
    onComplete: o,
    force: u = !1
  } = {}) {
    if ((this._isStopped || this._isLocked) && !u) return;
    let d = this.resolveScrollTarget(t, e);
    if (d === null) return;
    if (d = this.opts.infinite ? d : v(d, 0, this.limit), d === this.targetScroll) {
      h == null || h(this), o == null || o(this);
      return;
    }
    if (this._reducedMotion && (i = !0), i) {
      this.animatedScroll = this.targetScroll = d, this.setScroll(this.scroll), this.resetState(), this.preventNextNativeScrollEvent(), this.emit(), o == null || o(this);
      return;
    }
    const g = a ?? this.opts.lerp, b = c ?? this.opts.duration, T = n ?? this.opts.easing;
    this.targetScroll = d, this.animate.fromTo(this.animatedScroll, d, {
      lerp: b ? void 0 : g,
      duration: b,
      easing: T,
      onStart: () => {
        l && (this._isLocked = !0), this.isScrolling = "smooth", h == null || h(this);
      },
      onUpdate: (S, H) => {
        this.isScrolling = "smooth", this.lastVelocity = this.velocity, this.velocity = S - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = S, this.setScroll(this.scroll), H ? (this.resetState(), this.emit(), o == null || o(this), this.preventNextNativeScrollEvent(), this.opts.saveScrollPosition && this.persistScrollPosition()) : this.emit();
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
    var t, e, i;
    this._raf.off(this.update), (t = this.vs) == null || t.destroy(), this.vs = null, this.dimensions.destroy(), (e = this.scrollbar) == null || e.destroy(), this.scrollbar = null, m.removeEventListener("keydown", this.onKeyDown), m.removeEventListener("resize", this.onMobileResize), this.wrapperElement.removeEventListener("scroll", this.onNativeScroll), (i = this._motionQuery) == null || i.removeEventListener("change", this.onReducedMotionChange), this._resetVelocityTimeout !== null && clearTimeout(this._resetVelocityTimeout);
    for (const l of this._preventTimers)
      clearTimeout(l);
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
  // Native scroll integration
  // ---------------------------------------------------------------------------
  get isWindowScroll() {
    return this.opts.el === z.documentElement;
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
  // Virtual scroll (wheel / touch input)
  // ---------------------------------------------------------------------------
  setupVirtualScroll() {
    this.vs = new P({
      el: this.opts.el === z.documentElement ? void 0 : this.opts.el,
      touchMultiplier: this.opts.touchMultiplier,
      passive: this.opts.passive,
      useKeyboard: !1
    }), this.vs.on(this.onVirtualScroll);
  }
  isWithinBounds(t) {
    return this.limit <= 0 ? !1 : this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && t > 0 || this.animatedScroll === this.limit && t < 0;
  }
  // ---------------------------------------------------------------------------
  // Mobile breakpoint
  // ---------------------------------------------------------------------------
  initMobileCheck() {
    this.opts.breakpoint && (this._isMobile = m.innerWidth < this.opts.breakpoint, m.addEventListener("resize", this.onMobileResize));
  }
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
  // Scroll target resolution
  // ---------------------------------------------------------------------------
  resolveScrollTarget(t, e) {
    if (typeof t == "string") {
      if (["top", "left", "start"].includes(t)) return 0 + e;
      if (["bottom", "right", "end"].includes(t))
        return this.limit + e;
      const i = z.querySelector(t);
      return i ? this.getElementScrollOffset(i) + e : null;
    }
    return t instanceof HTMLElement ? this.getElementScrollOffset(t) + e : typeof t == "number" ? t + e : null;
  }
  getElementScrollOffset(t) {
    const e = t.getBoundingClientRect(), i = this.isHorizontal ? "left" : "top", l = getComputedStyle(t), c = parseFloat(
      this.isHorizontal ? l.scrollMarginLeft : l.scrollMarginTop
    ) || 0;
    return e[i] + this.animatedScroll - c;
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
  et as default
};
