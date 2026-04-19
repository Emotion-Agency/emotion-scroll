var ot = Object.defineProperty;
var lt = (e, t, i) => t in e ? ot(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var n = (e, t, i) => lt(e, typeof t != "symbol" ? t + "" : t, i);
import { clamp as v, damp as at, raf as ct, modulo as ht } from "@emotionagency/utils";
import { getWindow as f, getDocument as d } from "ssr-window";
function ut(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function y(e) {
  throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var J = { exports: {} };
(function(e, t) {
  (function(i) {
    e.exports = i();
  })(function() {
    return function i(s, r, o) {
      function l(c, u) {
        if (!r[c]) {
          if (!s[c]) {
            var g = typeof y == "function" && y;
            if (!u && g) return g(c, !0);
            if (a) return a(c, !0);
            var b = new Error("Cannot find module '" + c + "'");
            throw b.code = "MODULE_NOT_FOUND", b;
          }
          var k = r[c] = { exports: {} };
          s[c][0].call(k.exports, function(D) {
            var x = s[c][1][D];
            return l(x || D);
          }, k, k.exports, i, s, r, o);
        }
        return r[c].exports;
      }
      for (var a = typeof y == "function" && y, h = 0; h < o.length; h++) l(o[h]);
      return l;
    }({ 1: [function(i, s, r) {
      function o() {
      }
      o.prototype = {
        on: function(l, a, h) {
          var c = this.e || (this.e = {});
          return (c[l] || (c[l] = [])).push({
            fn: a,
            ctx: h
          }), this;
        },
        once: function(l, a, h) {
          var c = this;
          function u() {
            c.off(l, u), a.apply(h, arguments);
          }
          return u._ = a, this.on(l, u, h);
        },
        emit: function(l) {
          var a = [].slice.call(arguments, 1), h = ((this.e || (this.e = {}))[l] || []).slice(), c = 0, u = h.length;
          for (c; c < u; c++)
            h[c].fn.apply(h[c].ctx, a);
          return this;
        },
        off: function(l, a) {
          var h = this.e || (this.e = {}), c = h[l], u = [];
          if (c && a)
            for (var g = 0, b = c.length; g < b; g++)
              c[g].fn !== a && c[g].fn._ !== a && u.push(c[g]);
          return u.length ? h[l] = u : delete h[l], this;
        }
      }, s.exports = o, s.exports.TinyEmitter = o;
    }, {}] }, {}, [1])(1);
  });
})(J);
var dt = J.exports;
const pt = /* @__PURE__ */ ut(dt), mt = 400, ft = 1e3, gt = 250, vt = 0.5, St = 60, bt = 60, $ = "emotion-scroll-position", yt = 1.5, Tt = 0.1, Et = 0.075, wt = 1.7, Lt = 1, Mt = 1, _t = 120, zt = 120, Pt = 1e3;
class Ot {
  constructor() {
    n(this, "isRunning", !1);
    n(this, "value", 0);
    n(this, "from", 0);
    n(this, "to", 0);
    n(this, "currentTime", 0);
    n(this, "lerp");
    n(this, "duration");
    n(this, "easing");
    n(this, "onUpdate");
  }
  advance(t) {
    var s;
    if (!this.isRunning) return;
    let i = !1;
    if (this.duration && this.easing) {
      this.currentTime += t;
      const r = v(this.currentTime / this.duration, 0, 1);
      i = r >= 1;
      const o = i ? 1 : this.easing(r);
      this.value = this.from + (this.to - this.from) * o;
    } else this.lerp ? (this.value = at(this.value, this.to, this.lerp * St, t), Math.abs(this.value - this.to) < vt && (this.value = this.to, i = !0)) : (this.value = this.to, i = !0);
    i && this.stop(), (s = this.onUpdate) == null || s.call(this, this.value, i);
  }
  fromTo(t, i, s) {
    var r;
    this.from = this.value = t, this.to = i, this.lerp = s.lerp, this.duration = s.duration, this.easing = s.easing, this.currentTime = 0, this.isRunning = !0, this.onUpdate = s.onUpdate, (r = s.onStart) == null || r.call(s);
  }
  stop() {
    this.isRunning = !1;
  }
}
function Ht(e, t) {
  let i;
  return function(...s) {
    clearTimeout(i), i = setTimeout(() => {
      i = void 0, e.apply(this, s);
    }, t);
  };
}
const T = f();
class Rt {
  constructor(t, i, { autoResize: s = !0, debounceDelay: r = gt } = {}) {
    n(this, "width", 0);
    n(this, "height", 0);
    n(this, "scrollWidth", 0);
    n(this, "scrollHeight", 0);
    n(this, "debouncedResize");
    n(this, "wrapperResizeObserver");
    n(this, "contentResizeObserver");
    n(this, "resize", () => {
      this.wrapper instanceof Window ? (this.width = T.innerWidth, this.height = T.innerHeight, this.scrollWidth = this.content.scrollWidth, this.scrollHeight = this.content.scrollHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight, this.scrollWidth = this.wrapper.scrollWidth, this.scrollHeight = this.wrapper.scrollHeight);
    });
    this.wrapper = t, this.content = i, s && (this.debouncedResize = Ht(this.resize, r), this.wrapper instanceof Window ? T.addEventListener("resize", this.debouncedResize) : typeof ResizeObserver < "u" && (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), typeof ResizeObserver < "u" && (this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content))), this.resize();
  }
  get limit() {
    return {
      x: Math.max(0, this.scrollWidth - this.width),
      y: Math.max(0, this.scrollHeight - this.height)
    };
  }
  destroy() {
    var t, i;
    (t = this.wrapperResizeObserver) == null || t.disconnect(), (i = this.contentResizeObserver) == null || i.disconnect(), this.wrapper instanceof Window && this.debouncedResize && T.removeEventListener("resize", this.debouncedResize);
  }
}
const M = (e) => e, A = (e) => {
  const t = 1 - e;
  return 1 - t * t * t * (1 - e * 0.6);
}, R = (e) => ({
  in: (t) => t ** e,
  out: (t) => 1 - (1 - t) ** e,
  inOut: (t) => t < 0.5 ? 2 ** (e - 1) * t ** e : 1 - (-2 * t + 2) ** e / 2
}), _ = R(2), z = R(3), P = R(4), O = R(5), Q = {
  in: (e) => e === 0 ? 0 : 2 ** (10 * e - 10),
  out: (e) => e === 1 ? 1 : 1 - 2 ** (-10 * e),
  inOut: (e) => e === 0 ? 0 : e === 1 ? 1 : e < 0.5 ? 2 ** (20 * e - 10) / 2 : (2 - 2 ** (-20 * e + 10)) / 2
}, tt = {
  in: (e) => 1 - Math.cos(e * Math.PI / 2),
  out: (e) => Math.sin(e * Math.PI / 2),
  inOut: (e) => -(Math.cos(Math.PI * e) - 1) / 2
}, et = {
  in: (e) => 1 - Math.sqrt(1 - e * e),
  out: (e) => Math.sqrt(1 - (e - 1) ** 2),
  inOut: (e) => e < 0.5 ? (1 - Math.sqrt(1 - (2 * e) ** 2)) / 2 : (Math.sqrt(1 - (-2 * e + 2) ** 2) + 1) / 2
}, H = 1.70158, E = H * 1.525, U = H + 1, it = {
  in: (e) => U * e * e * e - H * e * e,
  out: (e) => 1 + U * (e - 1) ** 3 + H * (e - 1) ** 2,
  inOut: (e) => e < 0.5 ? (2 * e) ** 2 * ((E + 1) * 2 * e - E) / 2 : ((2 * e - 2) ** 2 * ((E + 1) * (e * 2 - 2) + E) + 2) / 2
}, N = 2 * Math.PI / 3, W = 2 * Math.PI / 4.5, st = {
  in: (e) => e === 0 ? 0 : e === 1 ? 1 : -(2 ** (10 * e - 10)) * Math.sin((e * 10 - 10.75) * N),
  out: (e) => e === 0 ? 0 : e === 1 ? 1 : 2 ** (-10 * e) * Math.sin((e * 10 - 0.75) * N) + 1,
  inOut: (e) => e === 0 ? 0 : e === 1 ? 1 : e < 0.5 ? -(2 ** (20 * e - 10) * Math.sin((20 * e - 11.125) * W)) / 2 : 2 ** (-20 * e + 10) * Math.sin((20 * e - 11.125) * W) / 2 + 1
}, w = (e) => {
  if (e < 1 / 2.75) return 7.5625 * e * e;
  if (e < 2 / 2.75) {
    const r = e - 0.5454545454545454;
    return 7.5625 * r * r + 0.75;
  }
  if (e < 2.5 / 2.75) {
    const r = e - 0.8181818181818182;
    return 7.5625 * r * r + 0.9375;
  }
  const s = e - 2.625 / 2.75;
  return 7.5625 * s * s + 0.984375;
}, rt = {
  in: (e) => 1 - w(1 - e),
  out: w,
  inOut: (e) => e < 0.5 ? (1 - w(1 - 2 * e)) / 2 : (1 + w(2 * e - 1)) / 2
}, ce = {
  linear: M,
  none: M,
  smooth: A,
  power1: _,
  power2: z,
  power3: P,
  power4: O,
  quad: _,
  cubic: z,
  quart: P,
  quint: O,
  expo: Q,
  sine: tt,
  circ: et,
  back: it,
  elastic: st,
  bounce: rt
}, kt = {
  power1: _,
  power2: z,
  power3: P,
  power4: O,
  quad: _,
  cubic: z,
  quart: P,
  quint: O,
  expo: Q,
  sine: tt,
  circ: et,
  back: it,
  elastic: st,
  bounce: rt
};
var Z;
const It = typeof process > "u" || ((Z = process.env) == null ? void 0 : Z.NODE_ENV) !== "production", F = /* @__PURE__ */ new Set();
function X(e, t) {
  !It || F.has(t) || (F.add(t), console.warn(`[emotion-scroll] ${e}`));
}
function nt(e) {
  if (typeof e != "string") return e;
  if (e === "none" || e === "linear") return M;
  if (e === "smooth") return A;
  const [t, i = "out"] = e.split("."), s = kt[t];
  if (!s)
    return X(
      `Unknown easing "${e}". Falling back to linear.`,
      e
    ), M;
  const r = s[i];
  return r || (X(
    `Unknown easing direction "${i}" for "${t}". Expected "in", "out" or "inOut". Falling back to "${t}.out".`,
    e
  ), s.out);
}
const Y = d();
function Ct(e) {
  return typeof e == "object" && e !== null ? {
    enabled: e.enabled ?? !0,
    isSmooth: e.isSmooth ?? !0
  } : {
    enabled: e ?? !0,
    isSmooth: !0
  };
}
function At(e = {}) {
  const t = e.orientation ?? "vertical";
  let i = e.duration ?? void 0, s = nt(e.easing);
  return typeof i == "number" && typeof s != "function" ? s = A : typeof s == "function" && typeof i != "number" && (i = yt), {
    el: e.el ?? Y.documentElement,
    content: e.content ?? e.el ?? Y.documentElement,
    orientation: t,
    gestureOrientation: e.gestureOrientation ?? (t === "horizontal" ? "both" : "vertical"),
    smoothWheel: e.smoothWheel ?? !0,
    syncTouch: e.syncTouch ?? !1,
    syncTouchLerp: e.syncTouchLerp ?? Et,
    touchInertiaExponent: e.touchInertiaExponent ?? wt,
    lerp: e.lerp ?? Tt,
    duration: i,
    easing: s,
    touchMultiplier: e.touchMultiplier ?? Mt,
    wheelMultiplier: e.wheelMultiplier ?? Lt,
    maxScrollDelta: e.maxScrollDelta ?? _t,
    scrollbar: Ct(e.scrollbar),
    breakpoint: e.breakpoint ?? null,
    useKeyboardSmooth: e.useKeyboardSmooth ?? !0,
    keyboardScrollStep: e.keyboardScrollStep ?? zt,
    disabled: e.disabled ?? !1,
    raf: e.raf ?? null,
    autoRaf: e.autoRaf ?? !0,
    autoResize: e.autoResize ?? !0,
    saveScrollPosition: e.saveScrollPosition ?? !1,
    prevent: e.prevent,
    overscroll: e.overscroll ?? !0,
    infinite: e.infinite ?? !1,
    passive: e.passive ?? !1,
    maxTouchInertia: e.maxTouchInertia ?? Pt,
    anchors: e.anchors
  };
}
const Dt = d();
function xt(e, t, i, s, r) {
  if (typeof e == "string") {
    if (["top", "left", "start"].includes(e)) return 0 + t;
    if (["bottom", "right", "end"].includes(e)) return i + t;
    const o = Dt.querySelector(e);
    return o ? q(o, s, r) + t : null;
  }
  return e instanceof HTMLElement ? q(e, s, r) + t : typeof e == "number" ? e + t : null;
}
function q(e, t, i) {
  const s = e.getBoundingClientRect(), r = t ? "left" : "top", o = getComputedStyle(e), l = parseFloat(t ? o.scrollMarginLeft : o.scrollMarginTop) || 0;
  return s[r] + i - l;
}
const $t = f(), Ut = d();
class Nt {
  constructor(t, i) {
    n(this, "onClick", (t) => {
      this.handleClick(t);
    });
    this.host = t, this.element = i;
  }
  init() {
    this.element.addEventListener("click", this.onClick);
  }
  destroy() {
    this.element.removeEventListener("click", this.onClick);
  }
  handleClick(t) {
    const i = t.composedPath();
    for (const s of i) {
      if (!(s instanceof HTMLAnchorElement) || !s.href) continue;
      const r = new URL(s.href), o = new URL($t.location.href);
      if (r.host !== o.host || r.pathname !== o.pathname || !r.hash) continue;
      const l = r.hash;
      if (!Ut.querySelector(l)) continue;
      t.preventDefault();
      const a = typeof this.host.opts.anchors == "object" ? this.host.opts.anchors : void 0;
      this.host.scrollTo(l, a), history.pushState(null, "", l);
      break;
    }
  }
}
const S = f(), Wt = d(), p = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  TAB: "Tab",
  PAGEUP: "PageUp",
  PAGEDOWN: "PageDown",
  HOME: "Home",
  END: "End"
};
class Ft {
  constructor(t) {
    n(this, "onKeyDown", (t) => {
      const { host: i } = this;
      if (i.isStopped || i.limit <= 0) return;
      const s = i.opts.keyboardScrollStep;
      let r = null;
      switch (t.key) {
        case p.TAB: {
          const o = Wt.activeElement;
          if (o) {
            const l = o.getBoundingClientRect(), a = i.isHorizontal ? l.left : l.top;
            r = i.animatedScroll + a;
          }
          break;
        }
        case p.UP:
          r = i.targetScroll - s;
          break;
        case p.DOWN:
          r = i.targetScroll + s;
          break;
        case p.LEFT:
          i.isHorizontal && (r = i.targetScroll - s);
          break;
        case p.RIGHT:
          i.isHorizontal && (r = i.targetScroll + s);
          break;
        case p.PAGEUP:
          r = i.targetScroll - (i.isHorizontal ? S.innerWidth : S.innerHeight);
          break;
        case p.PAGEDOWN:
          r = i.targetScroll + (i.isHorizontal ? S.innerWidth : S.innerHeight);
          break;
        case p.HOME:
          r = 0;
          break;
        case p.END:
          r = i.limit;
          break;
      }
      r !== null && i.scrollTo(v(r, 0, i.limit));
    });
    this.host = t;
  }
  init() {
    S.addEventListener("keydown", this.onKeyDown, !1);
  }
  destroy() {
    S.removeEventListener("keydown", this.onKeyDown);
  }
}
const Xt = 100, V = 16, Yt = 1e3 / 60;
class qt {
  constructor() {
    n(this, "samples", []);
  }
  reset() {
    this.samples.length = 0;
  }
  add(t, i, s = performance.now()) {
    this.trim(s), this.samples.push({ x: t, y: i, t: s }), this.samples.length > V && this.samples.splice(0, this.samples.length - V);
  }
  /** Returns {x, y} velocity in px/frame, matching host.velocity scale. */
  velocity(t = performance.now()) {
    if (this.trim(t), this.samples.length < 2) return { x: 0, y: 0 };
    const i = this.samples[0], s = this.samples[this.samples.length - 1], r = s.t - i.t;
    if (r <= 0) return { x: 0, y: 0 };
    const o = Yt / r;
    return {
      x: (s.x - i.x) * o,
      y: (s.y - i.y) * o
    };
  }
  trim(t) {
    const i = t - Xt;
    let s = 0;
    for (; s < this.samples.length && this.samples[s].t < i; ) s++;
    s > 0 && this.samples.splice(0, s);
  }
}
const B = 15;
function Vt(e) {
  const t = e;
  let i = t.wheelDeltaX || -e.deltaX, s = t.wheelDeltaY || -e.deltaY;
  return e.deltaMode === 1 && (i *= B, s *= B), { deltaX: i, deltaY: s };
}
const Bt = d(), Kt = f();
function I(e, t, i) {
  var s;
  for (; e && e !== t; ) {
    if ((s = e.hasAttribute) != null && s.call(e, "data-scroll-ignore") || typeof i.prevent == "function" && i.prevent(e))
      return !0;
    e = e.parentElement;
  }
  return !1;
}
class Gt {
  constructor(t) {
    n(this, "eventTarget", null);
    n(this, "listenerOpts", { passive: !1 });
    n(this, "finger", new qt());
    n(this, "lastTouchX", 0);
    n(this, "lastTouchY", 0);
    n(this, "onWheel", (t) => {
      const { deltaX: i, deltaY: s } = Vt(t);
      this.onScrollEvent({ deltaX: i, deltaY: s, originalEvent: t });
    });
    n(this, "onTouchStart", (t) => {
      var o, l;
      const i = ((o = t.targetTouches) == null ? void 0 : o[0]) ?? ((l = t.changedTouches) == null ? void 0 : l[0]);
      if (!i) return;
      const { host: s } = this, { opts: r } = s;
      this.lastTouchX = i.pageX, this.lastTouchY = i.pageY, this.finger.reset(), this.finger.add(i.pageX, i.pageY), !I(t.target, r.el, r) && (s.isTouching = !0, r.syncTouch && !s.isStopped && !s.isLocked && (s.stopAnimation(), s.targetScroll = s.animatedScroll));
    });
    n(this, "onTouchMove", (t) => {
      var l, a;
      const i = ((l = t.targetTouches) == null ? void 0 : l[0]) ?? ((a = t.changedTouches) == null ? void 0 : a[0]);
      if (!i) return;
      const { opts: s } = this.host, r = (i.pageX - this.lastTouchX) * s.touchMultiplier, o = (i.pageY - this.lastTouchY) * s.touchMultiplier;
      this.lastTouchX = i.pageX, this.lastTouchY = i.pageY, this.finger.add(i.pageX, i.pageY), this.onScrollEvent({ deltaX: r, deltaY: o, originalEvent: t });
    });
    n(this, "onTouchEnd", (t) => {
      const { host: i } = this, { opts: s } = i, { x: r, y: o } = this.finger.velocity();
      this.finger.reset();
      const l = i.isTouching;
      if (i.isTouching = !1, !l || !s.syncTouch || I(t.target, s.el, s) || i.isStopped || i.isLocked) return;
      let a;
      if (s.gestureOrientation === "both" ? a = Math.abs(o) > Math.abs(r) ? o : r : s.gestureOrientation === "horizontal" ? a = r : a = o, a = -a * s.touchMultiplier, a === 0) return;
      const h = Math.sign(a) * Math.abs(a) ** s.touchInertiaExponent, c = v(h, -s.maxTouchInertia, s.maxTouchInertia);
      i.scrollTo(i.targetScroll + c, { lerp: s.syncTouchLerp });
    });
    this.host = t;
  }
  setup() {
    const { opts: t } = this.host, i = t.el === Bt.documentElement;
    this.eventTarget = i ? Kt : t.el, this.listenerOpts = { passive: t.passive }, this.bindInput(!0);
  }
  destroy() {
    this.bindInput(!1), this.eventTarget = null, this.finger.reset();
  }
  bindInput(t) {
    const i = this.eventTarget;
    if (!i) return;
    const s = t ? "addEventListener" : "removeEventListener";
    i[s]("wheel", this.onWheel, this.listenerOpts), i[s]("touchstart", this.onTouchStart, this.listenerOpts), i[s]("touchmove", this.onTouchMove, this.listenerOpts), i[s]("touchend", this.onTouchEnd, this.listenerOpts), i[s]("touchcancel", this.onTouchEnd, this.listenerOpts);
  }
  onScrollEvent(t) {
    const { host: i } = this, { opts: s } = i, r = t.originalEvent, o = r.type.includes("touch"), l = r.type.includes("wheel");
    if ("ctrlKey" in r && r.ctrlKey || I(r.target, s.el, s) || i.isStopped || i.isLocked) return;
    if (!(s.syncTouch && o || s.smoothWheel && l)) {
      i.isScrolling = "native", i.stopAnimation();
      return;
    }
    i.emitVirtualScroll({ deltaX: t.deltaX, deltaY: t.deltaY, event: r });
    let h;
    if (s.gestureOrientation === "both" ? h = Math.abs(t.deltaY) > Math.abs(t.deltaX) ? t.deltaY : t.deltaX : s.gestureOrientation === "horizontal" ? h = t.deltaX : h = t.deltaY, h === 0) return;
    h = -h, l && (h *= s.wheelMultiplier), h = v(h, -s.maxScrollDelta, s.maxScrollDelta), (!s.overscroll || s.infinite || this.isWithinBounds(h)) && "cancelable" in r && r.cancelable && r.preventDefault();
    const c = o && s.syncTouch;
    i.scrollTo(i.targetScroll + h, {
      ...c ? { lerp: 1 } : { lerp: s.lerp, duration: s.duration, easing: s.easing }
    });
  }
  isWithinBounds(t) {
    const { animatedScroll: i, limit: s } = this.host;
    return s <= 0 ? !1 : i > 0 && i < s || i === 0 && t > 0 || i === s && t < 0;
  }
}
function jt(e, t, i = {}) {
  const s = d(), r = f(), o = e.opts.el, l = o === s.documentElement, { setAsDefault: a = !0 } = i, h = {
    getBoundingClientRect: () => ({
      top: 0,
      left: 0,
      width: r.innerWidth,
      height: r.innerHeight
    }),
    pinType: l ? "fixed" : "transform"
  };
  e.isHorizontal ? h.scrollLeft = function(u) {
    if (arguments.length && typeof u == "number") {
      e.scrollTo(u, { immediate: !0, force: !0 });
      return;
    }
    return e.animatedScroll;
  } : h.scrollTop = function(u) {
    if (arguments.length && typeof u == "number") {
      e.scrollTo(u, { immediate: !0, force: !0 });
      return;
    }
    return e.animatedScroll;
  }, t.scrollerProxy(l ? void 0 : o, h), !l && a && t.defaults({ scroller: o });
  const c = () => {
    t.update();
  };
  return e.on("scroll", c), () => {
    e.off("scroll", c);
  };
}
const L = f();
class Zt {
  constructor(t, i, s) {
    n(this, "isMobile", !1);
    n(this, "onResize", () => {
      if (this.breakpoint == null) return;
      const t = this.isMobile;
      this.isMobile = L.innerWidth < this.breakpoint, t !== this.isMobile && (this.isMobile ? this.onEnter() : this.onLeave());
    });
    this.breakpoint = t, this.onEnter = i, this.onLeave = s, t != null && (this.isMobile = L.innerWidth < t, L.addEventListener("resize", this.onResize));
  }
  destroy() {
    L.removeEventListener("resize", this.onResize);
  }
}
class Jt {
  constructor(t, i) {
    n(this, "settleTimer", null);
    n(this, "lastSetValue", Number.NaN);
    n(this, "onScroll", () => {
      this.settleTimer !== null && (clearTimeout(this.settleTimer), this.settleTimer = null);
      const { host: t } = this, i = t.getActualScroll();
      if (Math.abs(i - this.lastSetValue) < 1.5 || t.isScrolling !== !1 && t.isScrolling !== "native" || t.opts.infinite) return;
      const s = t.animatedScroll;
      t.animatedScroll = t.targetScroll = i, t.lastVelocity = t.velocity, t.velocity = t.animatedScroll - s, t.direction = Math.sign(t.velocity), t.isStopped || (t.isScrolling = "native"), t.onScrollChanged(), t.velocity !== 0 && (this.settleTimer = setTimeout(() => {
        t.lastVelocity = t.velocity, t.velocity = 0, t.isScrolling = !1, t.onScrollChanged();
      }, mt));
    });
    this.wrapper = t, this.host = i, this.wrapper.addEventListener("scroll", this.onScroll, { passive: !0 });
  }
  /** Record the value we're about to write so our own scroll event is
   *  distinguishable from a user-initiated scroll. */
  markSet(t) {
    this.lastSetValue = t;
  }
  destroy() {
    this.wrapper.removeEventListener("scroll", this.onScroll), this.settleTimer !== null && (clearTimeout(this.settleTimer), this.settleTimer = null);
  }
}
const K = f();
class Qt {
  constructor() {
    n(this, "matches", !1);
    n(this, "query", null);
    n(this, "onChange", (t) => {
      this.matches = t.matches;
    });
    typeof K.matchMedia == "function" && (this.query = K.matchMedia("(prefers-reduced-motion: reduce)"), this.matches = this.query.matches, this.query.addEventListener("change", this.onChange));
  }
  destroy() {
    var t;
    (t = this.query) == null || t.removeEventListener("change", this.onChange), this.query = null;
  }
}
const G = f();
class te {
  restore() {
    const t = G.localStorage.getItem($);
    if (t === null) return null;
    const i = Number(t);
    return Number.isNaN(i) ? null : i;
  }
  save(t) {
    G.localStorage.setItem($, String(t));
  }
}
const j = d();
class ee {
  constructor() {
    n(this, "scrollbar");
  }
  create(t = !1) {
    this.scrollbar = j.createElement("div");
    const i = j.createElement("span");
    return i.className = "scrollbar__thumb", this.scrollbar.appendChild(i), this.scrollbar.classList.add("scrollbar"), t && this.scrollbar.classList.add("scrollbar--horizontal"), this.scrollbar;
  }
  append(t) {
    t.appendChild(this.scrollbar);
  }
  destroy() {
    this.scrollbar.remove();
  }
}
class ie {
  constructor(t, i = 1e3) {
    n(this, "timer", null);
    this.cb = t, this.delay = i;
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
const m = d();
class se {
  constructor(t, i, s) {
    n(this, "activePointerId", null);
    n(this, "onTrackClick", (t) => {
      if (this.suppressNextClick) {
        this.suppressNextClick = !1;
        return;
      }
      if (this.controller.isStopped) return;
      const i = this.pointerToScroll(t.clientX, t.clientY);
      this.controller.scrollTo(i, { immediate: !this.opts.isSmooth });
    });
    n(this, "suppressNextClick", !1);
    n(this, "onPointerDown", (t) => {
      if (t.button === 0 && this.activePointerId === null) {
        this.activePointerId = t.pointerId, this.elements.$thumb.classList.add("active");
        try {
          this.elements.$scrollbar.setPointerCapture(t.pointerId);
        } catch {
        }
        t.preventDefault(), m.addEventListener("pointermove", this.onPointerMove), m.addEventListener("pointerup", this.onPointerUp), m.addEventListener("pointercancel", this.onPointerUp);
      }
    });
    n(this, "onPointerMove", (t) => {
      if (t.pointerId !== this.activePointerId || this.controller.isStopped) return;
      const i = this.pointerToScroll(t.clientX, t.clientY);
      this.controller.scrollTo(i, { immediate: !this.opts.isSmooth }), this.suppressNextClick = !0;
    });
    n(this, "onPointerUp", (t) => {
      t.pointerId === this.activePointerId && (this.activePointerId = null, this.elements.$thumb.classList.remove("active"), m.removeEventListener("pointermove", this.onPointerMove), m.removeEventListener("pointerup", this.onPointerUp), m.removeEventListener("pointercancel", this.onPointerUp));
    });
    this.elements = t, this.controller = i, this.opts = s, this.init();
  }
  get isHorizontal() {
    return this.controller.isHorizontal;
  }
  init() {
    this.elements.$scrollbar.addEventListener("pointerdown", this.onPointerDown), this.elements.$scrollbar.addEventListener("click", this.onTrackClick);
  }
  /** Map a pointer position (relative to track) to a scroll target. */
  pointerToScroll(t, i) {
    const s = this.elements.$scrollbar.getBoundingClientRect(), r = getComputedStyle(this.elements.$scrollbar), o = this.isHorizontal ? t : i;
    let l, a;
    if (this.isHorizontal) {
      const c = parseFloat(r.paddingLeft) || 0, u = parseFloat(r.paddingRight) || 0;
      l = s.left + c, a = s.width - c - u;
    } else {
      const c = parseFloat(r.paddingTop) || 0, u = parseFloat(r.paddingBottom) || 0;
      l = s.top + c, a = s.height - c - u;
    }
    return v((o - l) / a, 0, 1) * this.controller.limit;
  }
  destroy() {
    if (this.elements.$scrollbar.removeEventListener("pointerdown", this.onPointerDown), this.elements.$scrollbar.removeEventListener("click", this.onTrackClick), m.removeEventListener("pointermove", this.onPointerMove), m.removeEventListener("pointerup", this.onPointerUp), m.removeEventListener("pointercancel", this.onPointerUp), this.activePointerId !== null) {
      try {
        this.elements.$scrollbar.releasePointerCapture(this.activePointerId);
      } catch {
      }
      this.activePointerId = null;
    }
  }
}
const re = d();
class ne {
  constructor(t, i, s) {
    n(this, "$scrollbar");
    n(this, "$thumb");
    n(this, "thumbSize", 0);
    n(this, "createScrollbar", new ee());
    n(this, "inactivity");
    n(this, "drag", null);
    n(this, "onMouseEnter", () => {
      this.inactivity.show();
    });
    n(this, "setVisibility", (t) => {
      this.$thumb.classList.toggle("scrolling", t);
    });
    n(this, "onFrame", () => {
      this.$scrollbar.classList.toggle("hidden", this.controller.isStopped);
      const { track: t, minThumbSize: i } = this.readGeometry();
      this.updateThumbSize(t, i), this.updateThumbPosition(t), this.controller.isScrolling && this.inactivity.show();
    });
    this.controller = t, this.raf = i, this.opts = s, this.inactivity = new ie(this.setVisibility, ft), this.init();
  }
  get isHorizontal() {
    return this.controller.isHorizontal;
  }
  /** Read live geometry in a single getComputedStyle call per frame. */
  readGeometry() {
    const t = getComputedStyle(this.$scrollbar), i = parseFloat(
      this.isHorizontal ? t.paddingLeft : t.paddingTop
    ) || 0, s = parseFloat(
      this.isHorizontal ? t.paddingRight : t.paddingBottom
    ) || 0, r = this.isHorizontal ? this.$scrollbar.clientWidth : this.$scrollbar.clientHeight, o = parseFloat(t.getPropertyValue("--es-thumb-min-size")), l = Number.isFinite(o) && o >= 0 ? o : bt;
    return { track: r - i - s, minThumbSize: l };
  }
  init() {
    this.$scrollbar = this.createScrollbar.create(this.isHorizontal), this.$thumb = this.$scrollbar.querySelector(".scrollbar__thumb"), this.createScrollbar.append(re.body), this.$scrollbar.addEventListener("mouseenter", this.onMouseEnter), this.drag = new se(
      { $scrollbar: this.$scrollbar, $thumb: this.$thumb },
      this.controller,
      this.opts
    ), this.raf.on(this.onFrame);
  }
  updateThumbSize(t, i) {
    const s = this.controller.limit;
    if (s <= 0 || t <= 0) {
      this.thumbSize = 0, this.$thumb.style[this.isHorizontal ? "width" : "height"] = "0px";
      return;
    }
    const r = t / (t + s), o = Math.min(i, t);
    this.thumbSize = v(t * r, o, t), this.$thumb.style[this.isHorizontal ? "width" : "height"] = this.thumbSize + "px";
  }
  updateThumbPosition(t) {
    const i = t - this.thumbSize;
    if (i <= 0) return;
    const o = (v(this.controller.progress, 0, 1) * i).toFixed(2);
    this.isHorizontal ? this.$thumb.style.transform = `translateX(${o}px)` : this.$thumb.style.transform = `translateY(${o}px)`;
  }
  reset() {
    const { track: t, minThumbSize: i } = this.readGeometry();
    this.updateThumbSize(t, i), this.$thumb.style.transform = this.isHorizontal ? "translateX(0px)" : "translateY(0px)";
  }
  destroy() {
    var t;
    (t = this.drag) == null || t.destroy(), this.drag = null, this.$scrollbar.removeEventListener("mouseenter", this.onMouseEnter), this.createScrollbar.destroy(), this.inactivity.destroy(), this.raf.off(this.onFrame);
  }
}
const C = f();
class he {
  constructor(t = {}) {
    // --- Public state ---
    n(this, "animatedScroll", 0);
    n(this, "targetScroll", 0);
    n(this, "velocity", 0);
    n(this, "lastVelocity", 0);
    n(this, "direction", 0);
    n(this, "isTouching", !1);
    // --- Private state ---
    n(this, "_isScrolling", !1);
    n(this, "_isStopped", !1);
    n(this, "_isLocked", !1);
    n(this, "_time", 0);
    // --- Dependencies ---
    n(this, "opts");
    n(this, "raf");
    n(this, "animate", new Ot());
    n(this, "emitter", new pt());
    n(this, "dimensions");
    n(this, "nativeScroll");
    n(this, "reducedMotion", new Qt());
    n(this, "mobile");
    n(this, "persistence", new te());
    // --- Handlers ---
    n(this, "vsHandler", null);
    n(this, "keyboardHandler", null);
    n(this, "anchorHandler", null);
    n(this, "scrollbar", null);
    n(this, "update", () => {
      const t = performance.now(), i = (t - (this._time || t)) * 1e-3;
      this._time = t, this.animate.advance(i);
    });
    this.opts = At(t), this.raf = this.opts.raf || ct, this.dimensions = new Rt(this.wrapperElement, this.opts.content, {
      autoResize: this.opts.autoResize
    }), this.animatedScroll = this.targetScroll = this.getActualScroll(), this.opts.el.classList.add("es-smooth"), this.nativeScroll = new Jt(this.wrapperElement, this), this.mobile = new Zt(
      this.opts.breakpoint,
      () => this.teardownDesktopHandlers(),
      () => this.setupDesktopHandlers()
    ), this.mobile.isMobile || this.setupDesktopHandlers(), this.opts.anchors && (this.anchorHandler = new Nt(this, this.wrapperElement), this.anchorHandler.init()), this.opts.useKeyboardSmooth && (this.keyboardHandler = new Ft(this), this.keyboardHandler.init()), this.opts.saveScrollPosition && this.restoreScrollPosition(), this.opts.disabled && this.stop(), this.opts.autoRaf && this.raf.on(this.update);
  }
  // ---------------------------------------------------------------------------
  // Read-only projections (IScrollController)
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
    return this.opts.infinite ? ht(this.animatedScroll, this.limit) : this.animatedScroll;
  }
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  get isMobile() {
    return this.mobile.isMobile;
  }
  get wrapperElement() {
    return this.isWindowScroll ? C : this.opts.el;
  }
  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------
  on(t, i) {
    this.emitter.on(t, i);
  }
  off(t, i) {
    this.emitter.off(t, i);
  }
  scrollTo(t, i = {}) {
    const { force: s = !1, onStart: r, onComplete: o } = i;
    if ((this._isStopped || this._isLocked) && !s) return;
    const l = this.resolveTarget(t, i.offset ?? 0);
    if (l === null) return;
    if (l === this.targetScroll) {
      r == null || r(this), o == null || o(this);
      return;
    }
    if (i.immediate || this.reducedMotion.matches) {
      this.performImmediate(l, o);
      return;
    }
    this.performAnimated(l, i);
  }
  start() {
    this._isStopped && (this.resetState(), this._isStopped = !1, this.opts.el.classList.remove("e-fixed"), this.notifyChange());
  }
  stop() {
    this._isStopped || (this.resetState(), this._isStopped = !0, this.opts.el.classList.add("e-fixed"), this.notifyChange());
  }
  resize() {
    this.dimensions.resize(), this.animatedScroll = this.targetScroll = this.getActualScroll(), this.notifyChange();
  }
  reset() {
    var t;
    this.scrollTo(0, { immediate: !0 }), (t = this.scrollbar) == null || t.reset();
  }
  /**
   * Register this instance as the source of truth for GSAP ScrollTrigger.
   * Sets up `scrollerProxy` and forwards scroll events to `ScrollTrigger.update()`.
   * Returns a detach function that removes the scroll listener.
   */
  attachScrollTrigger(t, i) {
    return jt(this, t, i);
  }
  destroy() {
    var t, i;
    this.raf.off(this.update), this.teardownDesktopHandlers(), (t = this.keyboardHandler) == null || t.destroy(), this.keyboardHandler = null, (i = this.anchorHandler) == null || i.destroy(), this.anchorHandler = null, this.dimensions.destroy(), this.nativeScroll.destroy(), this.reducedMotion.destroy(), this.mobile.destroy(), this.opts.el.classList.remove("es-smooth", "es-scrolling", "e-fixed"), this.emitter.off("scroll"), this.emitter.off("virtual-scroll");
  }
  // ---------------------------------------------------------------------------
  // Handler-facing surface (ScrollHost / NativeScrollBridgeHost contracts)
  // ---------------------------------------------------------------------------
  emitVirtualScroll(t) {
    this.emitter.emit("virtual-scroll", t);
  }
  stopAnimation() {
    this.animate.stop();
  }
  getActualScroll() {
    return this.isWindowScroll ? this.isHorizontal ? C.scrollX : C.scrollY : this.isHorizontal ? this.opts.el.scrollLeft : this.opts.el.scrollTop;
  }
  onScrollChanged() {
    this.notifyChange();
  }
  // ---------------------------------------------------------------------------
  // Private — scrollTo pipeline
  // ---------------------------------------------------------------------------
  resolveTarget(t, i) {
    const s = xt(
      t,
      i,
      this.limit,
      this.isHorizontal,
      this.animatedScroll
    );
    return s === null ? null : this.opts.infinite ? s : v(s, 0, this.limit);
  }
  performImmediate(t, i) {
    this.animatedScroll = this.targetScroll = t, this.setScroll(this.scroll), this.resetState(), this.notifyChange(), i == null || i(this);
  }
  performAnimated(t, i) {
    const s = i.lerp ?? this.opts.lerp, r = i.duration ?? this.opts.duration, o = i.easing !== void 0 ? nt(i.easing) : this.opts.easing, l = i.lock ?? !1;
    this.targetScroll = t, this.animate.fromTo(this.animatedScroll, t, {
      lerp: r ? void 0 : s,
      duration: r,
      easing: o,
      onStart: () => {
        var a;
        l && (this._isLocked = !0), this.isScrolling = "smooth", (a = i.onStart) == null || a.call(i, this);
      },
      onUpdate: (a, h) => {
        var c;
        if (this.isScrolling = "smooth", this.lastVelocity = this.velocity, this.velocity = a - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = a, this.setScroll(this.scroll), !h) {
          this.notifyChange();
          return;
        }
        this.resetState(), this.notifyChange(), (c = i.onComplete) == null || c.call(i, this), this.opts.saveScrollPosition && this.persistence.save(this.animatedScroll);
      }
    });
  }
  // ---------------------------------------------------------------------------
  // Private — DOM / state helpers
  // ---------------------------------------------------------------------------
  get isWindowScroll() {
    return this.opts.el === d().documentElement;
  }
  setScroll(t) {
    this.nativeScroll.markSet(t), this.wrapperElement.scrollTo({
      [this.isHorizontal ? "left" : "top"]: t,
      behavior: "instant"
    });
  }
  setupDesktopHandlers() {
    this.vsHandler || (this.vsHandler = new Gt(this), this.vsHandler.setup()), !this.scrollbar && this.opts.scrollbar.enabled && (this.scrollbar = new ne(this, this.raf, this.opts.scrollbar));
  }
  teardownDesktopHandlers() {
    var t, i;
    (t = this.vsHandler) == null || t.destroy(), this.vsHandler = null, (i = this.scrollbar) == null || i.destroy(), this.scrollbar = null;
  }
  restoreScrollPosition() {
    const t = this.persistence.restore();
    t !== null && this.scrollTo(t, { immediate: !0 });
  }
  resetState() {
    this._isLocked = !1, this.isScrolling = !1, this.opts.infinite ? this.animatedScroll = this.targetScroll = this.scroll : this.animatedScroll = this.targetScroll = this.getActualScroll(), this.lastVelocity = this.velocity = 0, this.animate.stop();
  }
  notifyChange() {
    this.emitter.emit("scroll", {
      position: this.scroll,
      direction: this.direction,
      velocity: this.velocity,
      progress: this.progress
    });
  }
}
const ue = {
  syncTouch: !0,
  syncTouchLerp: 0.08,
  touchInertiaExponent: 2,
  maxTouchInertia: 3e3
};
export {
  jt as attachScrollTrigger,
  he as default,
  ce as easings,
  ue as iosMomentumPreset,
  nt as resolveEasing,
  A as smoothEasing
};
