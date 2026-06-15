var ot = Object.defineProperty;
var lt = (i, t, e) => t in i ? ot(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var n = (i, t, e) => lt(i, typeof t != "symbol" ? t + "" : t, e);
import { clamp as g, damp as at, raf as ht, modulo as ct } from "@emotionagency/utils";
import { getWindow as d, getDocument as p } from "ssr-window";
function ut(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function T(i) {
  throw new Error('Could not dynamically require "' + i + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Z = { exports: {} };
(function(i, t) {
  (function(e) {
    i.exports = e();
  })(function() {
    return function e(s, r, o) {
      function l(h, u) {
        if (!r[h]) {
          if (!s[h]) {
            var v = typeof T == "function" && T;
            if (!u && v) return v(h, !0);
            if (a) return a(h, !0);
            var y = new Error("Cannot find module '" + h + "'");
            throw y.code = "MODULE_NOT_FOUND", y;
          }
          var k = r[h] = { exports: {} };
          s[h][0].call(k.exports, function(A) {
            var x = s[h][1][A];
            return l(x || A);
          }, k, k.exports, e, s, r, o);
        }
        return r[h].exports;
      }
      for (var a = typeof T == "function" && T, c = 0; c < o.length; c++) l(o[c]);
      return l;
    }({ 1: [function(e, s, r) {
      function o() {
      }
      o.prototype = {
        on: function(l, a, c) {
          var h = this.e || (this.e = {});
          return (h[l] || (h[l] = [])).push({
            fn: a,
            ctx: c
          }), this;
        },
        once: function(l, a, c) {
          var h = this;
          function u() {
            h.off(l, u), a.apply(c, arguments);
          }
          return u._ = a, this.on(l, u, c);
        },
        emit: function(l) {
          var a = [].slice.call(arguments, 1), c = ((this.e || (this.e = {}))[l] || []).slice(), h = 0, u = c.length;
          for (h; h < u; h++)
            c[h].fn.apply(c[h].ctx, a);
          return this;
        },
        off: function(l, a) {
          var c = this.e || (this.e = {}), h = c[l], u = [];
          if (h && a)
            for (var v = 0, y = h.length; v < y; v++)
              h[v].fn !== a && h[v].fn._ !== a && u.push(h[v]);
          return u.length ? c[l] = u : delete c[l], this;
        }
      }, s.exports = o, s.exports.TinyEmitter = o;
    }, {}] }, {}, [1])(1);
  });
})(Z);
var dt = Z.exports;
const pt = /* @__PURE__ */ ut(dt), ft = 400, mt = 1e3, gt = 250, vt = 0.5, St = 60, bt = 100 / 3, yt = 2, Tt = 60, $ = "emotion-scroll-position", Et = 1.5, wt = 0.1, Lt = 0.075, Mt = 1.7, _t = 1, Ht = 1, Pt = 360, zt = 120, Ot = 1e3;
class Rt {
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
    let e = !1;
    if (this.duration && this.easing) {
      this.currentTime += t;
      const r = g(this.currentTime / this.duration, 0, 1);
      e = r >= 1;
      const o = e ? 1 : this.easing(r);
      this.value = this.from + (this.to - this.from) * o;
    } else this.lerp ? (this.value = at(this.value, this.to, this.lerp * St, t), Math.abs(this.value - this.to) < vt && (this.value = this.to, e = !0)) : (this.value = this.to, e = !0);
    e && this.stop(), (s = this.onUpdate) == null || s.call(this, this.value, e);
  }
  fromTo(t, e, s) {
    var r;
    this.from = this.value = t, this.to = e, this.lerp = s.lerp, this.duration = s.duration, this.easing = s.easing, this.currentTime = 0, this.isRunning = !0, this.onUpdate = s.onUpdate, (r = s.onStart) == null || r.call(s);
  }
  stop() {
    this.isRunning = !1;
  }
}
function kt(i, t) {
  let e;
  return function(...s) {
    clearTimeout(e), e = setTimeout(() => {
      e = void 0, i.apply(this, s);
    }, t);
  };
}
const E = d();
class Ct {
  constructor(t, e, {
    autoResize: s = !0,
    debounceDelay: r = gt,
    onResize: o
  } = {}) {
    n(this, "width", 0);
    n(this, "height", 0);
    n(this, "scrollWidth", 0);
    n(this, "scrollHeight", 0);
    n(this, "debouncedResize");
    n(this, "wrapperResizeObserver");
    n(this, "contentResizeObserver");
    n(this, "resize", () => {
      this.wrapper instanceof Window ? (this.width = E.innerWidth, this.height = E.innerHeight, this.scrollWidth = this.content.scrollWidth, this.scrollHeight = this.content.scrollHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight, this.scrollWidth = this.wrapper.scrollWidth, this.scrollHeight = this.wrapper.scrollHeight);
    });
    this.wrapper = t, this.content = e, s && (this.debouncedResize = kt(() => {
      this.resize(), o == null || o();
    }, r), this.wrapper instanceof Window ? E.addEventListener("resize", this.debouncedResize) : typeof ResizeObserver < "u" && (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), typeof ResizeObserver < "u" && (this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content))), this.resize();
  }
  get limit() {
    return {
      x: Math.max(0, this.scrollWidth - this.width),
      y: Math.max(0, this.scrollHeight - this.height)
    };
  }
  destroy() {
    var t, e;
    (t = this.wrapperResizeObserver) == null || t.disconnect(), (e = this.contentResizeObserver) == null || e.disconnect(), this.wrapper instanceof Window && this.debouncedResize && E.removeEventListener("resize", this.debouncedResize);
  }
}
const M = (i) => i, I = (i) => {
  const t = 1 - i;
  return 1 - t * t * t * (1 - i * 0.6);
}, R = (i) => ({
  in: (t) => t ** i,
  out: (t) => 1 - (1 - t) ** i,
  inOut: (t) => t < 0.5 ? 2 ** (i - 1) * t ** i : 1 - (-2 * t + 2) ** i / 2
}), _ = R(2), H = R(3), P = R(4), z = R(5), J = {
  in: (i) => i === 0 ? 0 : 2 ** (10 * i - 10),
  out: (i) => i === 1 ? 1 : 1 - 2 ** (-10 * i),
  inOut: (i) => i === 0 ? 0 : i === 1 ? 1 : i < 0.5 ? 2 ** (20 * i - 10) / 2 : (2 - 2 ** (-20 * i + 10)) / 2
}, tt = {
  in: (i) => 1 - Math.cos(i * Math.PI / 2),
  out: (i) => Math.sin(i * Math.PI / 2),
  inOut: (i) => -(Math.cos(Math.PI * i) - 1) / 2
}, et = {
  in: (i) => 1 - Math.sqrt(1 - i * i),
  out: (i) => Math.sqrt(1 - (i - 1) ** 2),
  inOut: (i) => i < 0.5 ? (1 - Math.sqrt(1 - (2 * i) ** 2)) / 2 : (Math.sqrt(1 - (-2 * i + 2) ** 2) + 1) / 2
}, O = 1.70158, w = O * 1.525, W = O + 1, it = {
  in: (i) => W * i * i * i - O * i * i,
  out: (i) => 1 + W * (i - 1) ** 3 + O * (i - 1) ** 2,
  inOut: (i) => i < 0.5 ? (2 * i) ** 2 * ((w + 1) * 2 * i - w) / 2 : ((2 * i - 2) ** 2 * ((w + 1) * (i * 2 - 2) + w) + 2) / 2
}, N = 2 * Math.PI / 3, U = 2 * Math.PI / 4.5, st = {
  in: (i) => i === 0 ? 0 : i === 1 ? 1 : -(2 ** (10 * i - 10)) * Math.sin((i * 10 - 10.75) * N),
  out: (i) => i === 0 ? 0 : i === 1 ? 1 : 2 ** (-10 * i) * Math.sin((i * 10 - 0.75) * N) + 1,
  inOut: (i) => i === 0 ? 0 : i === 1 ? 1 : i < 0.5 ? -(2 ** (20 * i - 10) * Math.sin((20 * i - 11.125) * U)) / 2 : 2 ** (-20 * i + 10) * Math.sin((20 * i - 11.125) * U) / 2 + 1
}, L = (i) => {
  if (i < 1 / 2.75) return 7.5625 * i * i;
  if (i < 2 / 2.75) {
    const r = i - 0.5454545454545454;
    return 7.5625 * r * r + 0.75;
  }
  if (i < 2.5 / 2.75) {
    const r = i - 0.8181818181818182;
    return 7.5625 * r * r + 0.9375;
  }
  const s = i - 2.625 / 2.75;
  return 7.5625 * s * s + 0.984375;
}, rt = {
  in: (i) => 1 - L(1 - i),
  out: L,
  inOut: (i) => i < 0.5 ? (1 - L(1 - 2 * i)) / 2 : (1 + L(2 * i - 1)) / 2
}, ue = {
  linear: M,
  none: M,
  smooth: I,
  power1: _,
  power2: H,
  power3: P,
  power4: z,
  quad: _,
  cubic: H,
  quart: P,
  quint: z,
  expo: J,
  sine: tt,
  circ: et,
  back: it,
  elastic: st,
  bounce: rt
}, Dt = {
  power1: _,
  power2: H,
  power3: P,
  power4: z,
  quad: _,
  cubic: H,
  quart: P,
  quint: z,
  expo: J,
  sine: tt,
  circ: et,
  back: it,
  elastic: st,
  bounce: rt
};
var Q;
const It = typeof process > "u" || ((Q = process.env) == null ? void 0 : Q.NODE_ENV) !== "production", F = /* @__PURE__ */ new Set();
function X(i, t) {
  !It || F.has(t) || (F.add(t), console.warn(`[emotion-scroll] ${i}`));
}
function nt(i) {
  if (typeof i != "string") return i;
  if (i === "none" || i === "linear") return M;
  if (i === "smooth") return I;
  const [t, e = "out"] = i.split("."), s = Dt[t];
  if (!s)
    return X(
      `Unknown easing "${i}". Falling back to linear.`,
      i
    ), M;
  const r = s[e];
  return r || (X(
    `Unknown easing direction "${e}" for "${t}". Expected "in", "out" or "inOut". Falling back to "${t}.out".`,
    i
  ), s.out);
}
const q = p();
function At(i) {
  return typeof i == "object" && i !== null ? {
    enabled: i.enabled ?? !0,
    isSmooth: i.isSmooth ?? !0
  } : {
    enabled: i ?? !0,
    isSmooth: !0
  };
}
function xt(i = {}) {
  const t = i.orientation ?? "vertical";
  let e = i.duration ?? void 0, s = nt(i.easing);
  return typeof e == "number" && typeof s != "function" ? s = I : typeof s == "function" && typeof e != "number" && (e = Et), {
    el: i.el ?? q.documentElement,
    content: i.content ?? i.el ?? q.documentElement,
    orientation: t,
    gestureOrientation: i.gestureOrientation ?? (t === "horizontal" ? "both" : "vertical"),
    smoothWheel: i.smoothWheel ?? !0,
    syncTouch: i.syncTouch ?? !1,
    syncTouchLerp: i.syncTouchLerp ?? Lt,
    touchInertiaExponent: i.touchInertiaExponent ?? Mt,
    lerp: i.lerp ?? wt,
    duration: e,
    easing: s,
    touchMultiplier: i.touchMultiplier ?? Ht,
    wheelMultiplier: i.wheelMultiplier ?? _t,
    maxScrollDelta: i.maxScrollDelta ?? Pt,
    scrollbar: At(i.scrollbar),
    breakpoint: i.breakpoint ?? null,
    useKeyboardSmooth: i.useKeyboardSmooth ?? !0,
    keyboardScrollStep: i.keyboardScrollStep ?? zt,
    disabled: i.disabled ?? !1,
    raf: i.raf ?? null,
    autoRaf: i.autoRaf ?? !0,
    autoResize: i.autoResize ?? !0,
    saveScrollPosition: i.saveScrollPosition ?? !1,
    prevent: i.prevent,
    overscroll: i.overscroll ?? !0,
    infinite: i.infinite ?? !1,
    passive: i.passive ?? !1,
    maxTouchInertia: i.maxTouchInertia ?? Ot,
    anchors: i.anchors
  };
}
const $t = p();
function Wt(i, t, e, s, r) {
  if (typeof i == "string") {
    if (["top", "left", "start"].includes(i)) return 0 + t;
    if (["bottom", "right", "end"].includes(i)) return e + t;
    const o = $t.querySelector(i);
    return o ? Y(o, s, r) + t : null;
  }
  return i instanceof HTMLElement ? Y(i, s, r) + t : typeof i == "number" ? i + t : null;
}
function Y(i, t, e) {
  const s = i.getBoundingClientRect(), r = t ? "left" : "top", o = getComputedStyle(i), l = parseFloat(t ? o.scrollMarginLeft : o.scrollMarginTop) || 0;
  return s[r] + e - l;
}
const Nt = d(), Ut = p();
class Ft {
  constructor(t, e) {
    n(this, "onClick", (t) => {
      this.handleClick(t);
    });
    this.host = t, this.element = e;
  }
  init() {
    this.element.addEventListener("click", this.onClick);
  }
  destroy() {
    this.element.removeEventListener("click", this.onClick);
  }
  handleClick(t) {
    const e = t.composedPath();
    for (const s of e) {
      if (!(s instanceof HTMLAnchorElement) || !s.href) continue;
      const r = new URL(s.href), o = new URL(Nt.location.href);
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
const S = d(), Xt = p(), f = {
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
class qt {
  constructor(t) {
    n(this, "onKeyDown", (t) => {
      const { host: e } = this;
      if (e.isStopped || e.limit <= 0) return;
      const s = e.opts.keyboardScrollStep;
      let r = null;
      switch (t.key) {
        case f.TAB: {
          const o = Xt.activeElement;
          if (o) {
            const l = o.getBoundingClientRect(), a = e.isHorizontal ? l.left : l.top;
            r = e.animatedScroll + a;
          }
          break;
        }
        case f.UP:
          r = e.targetScroll - s;
          break;
        case f.DOWN:
          r = e.targetScroll + s;
          break;
        case f.LEFT:
          e.isHorizontal && (r = e.targetScroll - s);
          break;
        case f.RIGHT:
          e.isHorizontal && (r = e.targetScroll + s);
          break;
        case f.PAGEUP:
          r = e.targetScroll - (e.isHorizontal ? S.innerWidth : S.innerHeight);
          break;
        case f.PAGEDOWN:
          r = e.targetScroll + (e.isHorizontal ? S.innerWidth : S.innerHeight);
          break;
        case f.HOME:
          r = 0;
          break;
        case f.END:
          r = e.limit;
          break;
      }
      r !== null && e.scrollTo(g(r, 0, e.limit));
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
const Yt = 100, V = 16, Vt = 1e3 / 60;
class Bt {
  constructor() {
    n(this, "samples", []);
  }
  reset() {
    this.samples.length = 0;
  }
  add(t, e, s = performance.now()) {
    this.trim(s), this.samples.push({ x: t, y: e, t: s }), this.samples.length > V && this.samples.splice(0, this.samples.length - V);
  }
  /** Returns {x, y} velocity in px/frame, matching host.velocity scale. */
  velocity(t = performance.now()) {
    if (this.trim(t), this.samples.length < 2) return { x: 0, y: 0 };
    const e = this.samples[0], s = this.samples[this.samples.length - 1], r = s.t - e.t;
    if (r <= 0) return { x: 0, y: 0 };
    const o = Vt / r;
    return {
      x: (s.x - e.x) * o,
      y: (s.y - e.y) * o
    };
  }
  trim(t) {
    const e = t - Yt;
    let s = 0;
    for (; s < this.samples.length && this.samples[s].t < e; ) s++;
    s > 0 && this.samples.splice(0, s);
  }
}
const B = d();
function Kt(i) {
  let t = 1, e = 1;
  return i.deltaMode === 1 ? t = e = bt : i.deltaMode === 2 && (t = B.innerWidth, e = B.innerHeight), { deltaX: -i.deltaX * t, deltaY: -i.deltaY * e };
}
const Gt = p(), jt = d();
function C(i, t, e) {
  var s;
  for (; i && i !== t; ) {
    if ((s = i.hasAttribute) != null && s.call(i, "data-scroll-ignore") || typeof e.prevent == "function" && e.prevent(i))
      return !0;
    i = i.parentElement;
  }
  return !1;
}
class Qt {
  constructor(t) {
    n(this, "eventTarget", null);
    n(this, "listenerOpts", { passive: !1 });
    n(this, "finger", new Bt());
    n(this, "lastTouchX", 0);
    n(this, "lastTouchY", 0);
    n(this, "pendingWheelDelta", 0);
    n(this, "onWheel", (t) => {
      const { deltaX: e, deltaY: s } = Kt(t);
      this.onScrollEvent({ deltaX: e, deltaY: s, originalEvent: t });
    });
    n(this, "onTouchStart", (t) => {
      var o, l;
      const e = ((o = t.targetTouches) == null ? void 0 : o[0]) ?? ((l = t.changedTouches) == null ? void 0 : l[0]);
      if (!e) return;
      const { host: s } = this, { opts: r } = s;
      this.lastTouchX = e.pageX, this.lastTouchY = e.pageY, this.finger.reset(), this.finger.add(e.pageX, e.pageY), !C(t.target, r.el, r) && (s.isTouching = !0, r.syncTouch && !s.isStopped && !s.isLocked && (s.stopAnimation(), s.targetScroll = s.animatedScroll, this.pendingWheelDelta = 0));
    });
    n(this, "onTouchMove", (t) => {
      var l, a;
      const e = ((l = t.targetTouches) == null ? void 0 : l[0]) ?? ((a = t.changedTouches) == null ? void 0 : a[0]);
      if (!e) return;
      const { opts: s } = this.host, r = (e.pageX - this.lastTouchX) * s.touchMultiplier, o = (e.pageY - this.lastTouchY) * s.touchMultiplier;
      this.lastTouchX = e.pageX, this.lastTouchY = e.pageY, this.finger.add(e.pageX, e.pageY), this.onScrollEvent({ deltaX: r, deltaY: o, originalEvent: t });
    });
    n(this, "onTouchEnd", (t) => {
      const { host: e } = this, { opts: s } = e, { x: r, y: o } = this.finger.velocity();
      this.finger.reset();
      const l = e.isTouching;
      if (e.isTouching = !1, !l || !s.syncTouch || C(t.target, s.el, s) || e.isStopped || e.isLocked) return;
      let a;
      if (s.gestureOrientation === "both" ? a = Math.abs(o) > Math.abs(r) ? o : r : s.gestureOrientation === "horizontal" ? a = r : a = o, a = -a * s.touchMultiplier, a === 0) return;
      const c = Math.sign(a) * Math.abs(a) ** s.touchInertiaExponent, h = g(c, -s.maxTouchInertia, s.maxTouchInertia);
      e.scrollTo(e.targetScroll + h, { lerp: s.syncTouchLerp });
    });
    this.host = t;
  }
  setup() {
    const { opts: t } = this.host, e = t.el === Gt.documentElement;
    this.eventTarget = e ? jt : t.el, this.listenerOpts = { passive: t.passive }, this.bindInput(!0);
  }
  destroy() {
    this.bindInput(!1), this.eventTarget = null, this.finger.reset(), this.pendingWheelDelta = 0;
  }
  /**
   * Apply the wheel input accumulated since the previous frame. Clamping
   * the per-frame total (instead of each event) keeps scroll speed
   * independent of how many events a device fires per second; the cap is
   * scaled by the actual frame dt so 120Hz displays don't get a 2× ceiling.
   * Input beyond the cap carries over to subsequent frames instead of
   * being dropped, so a legitimate oversized intent (a page-mode tick is
   * a full viewport) still travels its whole distance — only the rate is
   * limited. Called from the host's RAF update before the animation
   * advances.
   */
  flush(t) {
    const e = this.pendingWheelDelta;
    if (e === 0) return;
    const { host: s } = this, { opts: r } = s;
    if (s.isStopped || s.isLocked) {
      this.pendingWheelDelta = 0;
      return;
    }
    const o = t > 0 ? Math.min(t * 60, yt) : 1, l = r.maxScrollDelta * o, a = g(e, -l, l);
    this.pendingWheelDelta = e - a, s.scrollTo(s.targetScroll + a, {
      lerp: r.lerp,
      duration: r.duration,
      easing: r.easing
    });
  }
  bindInput(t) {
    const e = this.eventTarget;
    if (!e) return;
    const s = t ? "addEventListener" : "removeEventListener";
    e[s]("wheel", this.onWheel, this.listenerOpts), e[s]("touchstart", this.onTouchStart, this.listenerOpts), e[s]("touchmove", this.onTouchMove, this.listenerOpts), e[s]("touchend", this.onTouchEnd, this.listenerOpts), e[s]("touchcancel", this.onTouchEnd, this.listenerOpts);
  }
  onScrollEvent(t) {
    const { host: e } = this, { opts: s } = e, r = t.originalEvent, o = r.type.includes("touch"), l = r.type.includes("wheel");
    if ("ctrlKey" in r && r.ctrlKey || C(r.target, s.el, s) || e.isStopped || e.isLocked) return;
    if (!(s.syncTouch && o || s.smoothWheel && l)) {
      e.isScrolling = "native", e.stopAnimation();
      return;
    }
    e.emitVirtualScroll({ deltaX: t.deltaX, deltaY: t.deltaY, event: r });
    let c;
    if (s.gestureOrientation === "both" ? c = Math.abs(t.deltaY) > Math.abs(t.deltaX) ? t.deltaY : t.deltaX : s.gestureOrientation === "horizontal" ? c = t.deltaX : c = t.deltaY, c !== 0) {
      if (c = -c, l && (c *= s.wheelMultiplier), (!s.overscroll || s.infinite || this.isWithinBounds(c)) && "cancelable" in r && r.cancelable && r.preventDefault(), l) {
        this.pendingWheelDelta += c;
        return;
      }
      c = g(c, -s.maxScrollDelta, s.maxScrollDelta), e.scrollTo(e.targetScroll + c, { lerp: 1 });
    }
  }
  isWithinBounds(t) {
    const { animatedScroll: e, limit: s } = this.host;
    return s <= 0 ? !1 : e > 0 && e < s || e === 0 && t > 0 || e === s && t < 0;
  }
}
function Zt(i, t, e = {}) {
  const s = p(), r = d(), o = i.opts.el, l = o === s.documentElement, { setAsDefault: a = !0 } = e, c = {
    getBoundingClientRect: () => ({
      top: 0,
      left: 0,
      width: r.innerWidth,
      height: r.innerHeight
    }),
    pinType: l ? "fixed" : "transform"
  };
  i.isHorizontal ? c.scrollLeft = function(u) {
    if (arguments.length && typeof u == "number") {
      i.scrollTo(u, { immediate: !0, force: !0 });
      return;
    }
    return i.animatedScroll;
  } : c.scrollTop = function(u) {
    if (arguments.length && typeof u == "number") {
      i.scrollTo(u, { immediate: !0, force: !0 });
      return;
    }
    return i.animatedScroll;
  }, t.scrollerProxy(l ? void 0 : o, c), !l && a && t.defaults({ scroller: o });
  const h = () => {
    t.update();
  };
  return i.on("scroll", h), () => {
    i.off("scroll", h);
  };
}
const b = d();
class Jt {
  constructor(t, e, s) {
    n(this, "isMobile", !1);
    n(this, "query", null);
    n(this, "onQueryChange", (t) => {
      this.setIsMobile(t.matches);
    });
    n(this, "onResize", () => {
      this.setIsMobile(this.evaluate());
    });
    if (this.breakpoint = t, this.onEnter = e, this.onLeave = s, t != null) {
      if (typeof t == "string") {
        if (typeof b.matchMedia != "function") return;
        this.query = b.matchMedia(t), this.isMobile = this.query.matches, this.query.addEventListener("change", this.onQueryChange);
        return;
      }
      this.isMobile = this.evaluate(), b.addEventListener("resize", this.onResize);
    }
  }
  evaluate() {
    return typeof this.breakpoint == "function" ? this.breakpoint() : typeof this.breakpoint == "number" ? b.innerWidth < this.breakpoint : !1;
  }
  setIsMobile(t) {
    this.isMobile !== t && (this.isMobile = t, t ? this.onEnter() : this.onLeave());
  }
  destroy() {
    var t;
    (t = this.query) == null || t.removeEventListener("change", this.onQueryChange), this.query = null, b.removeEventListener("resize", this.onResize);
  }
}
class te {
  constructor(t, e) {
    n(this, "settleTimer", null);
    n(this, "lastSetValue", Number.NaN);
    n(this, "onScroll", () => {
      this.settleTimer !== null && (clearTimeout(this.settleTimer), this.settleTimer = null);
      const { host: t } = this, e = t.getActualScroll();
      if (Math.abs(e - this.lastSetValue) < 1.5 || t.isScrolling !== !1 && t.isScrolling !== "native" || t.opts.infinite) return;
      const s = t.animatedScroll;
      t.animatedScroll = t.targetScroll = e, t.lastVelocity = t.velocity, t.velocity = t.animatedScroll - s, t.direction = Math.sign(t.velocity), t.isStopped || (t.isScrolling = "native"), t.onScrollChanged(), t.velocity !== 0 && (this.settleTimer = setTimeout(() => {
        t.lastVelocity = t.velocity, t.velocity = 0, t.isScrolling = !1, t.onScrollChanged();
      }, ft));
    });
    this.wrapper = t, this.host = e, this.wrapper.addEventListener("scroll", this.onScroll, { passive: !0 });
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
const K = d();
class ee {
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
const G = d();
class ie {
  restore() {
    const t = G.localStorage.getItem($);
    if (t === null) return null;
    const e = Number(t);
    return Number.isNaN(e) ? null : e;
  }
  save(t) {
    G.localStorage.setItem($, String(t));
  }
}
const j = p();
class se {
  constructor() {
    n(this, "scrollbar");
  }
  create(t = !1) {
    this.scrollbar = j.createElement("div");
    const e = j.createElement("span");
    return e.className = "scrollbar__thumb", this.scrollbar.appendChild(e), this.scrollbar.classList.add("scrollbar"), t && this.scrollbar.classList.add("scrollbar--horizontal"), this.scrollbar;
  }
  append(t) {
    t.appendChild(this.scrollbar);
  }
  destroy() {
    this.scrollbar.remove();
  }
}
class re {
  constructor(t, e = 1e3) {
    n(this, "timer", null);
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
const m = p();
class ne {
  constructor(t, e, s) {
    n(this, "activePointerId", null);
    n(this, "onTrackClick", (t) => {
      if (this.suppressNextClick) {
        this.suppressNextClick = !1;
        return;
      }
      if (this.controller.isStopped) return;
      const e = this.pointerToScroll(t.clientX, t.clientY);
      this.controller.scrollTo(e, { immediate: !this.opts.isSmooth });
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
      const e = this.pointerToScroll(t.clientX, t.clientY);
      this.controller.scrollTo(e, { immediate: !this.opts.isSmooth }), this.suppressNextClick = !0;
    });
    n(this, "onPointerUp", (t) => {
      t.pointerId === this.activePointerId && (this.activePointerId = null, this.elements.$thumb.classList.remove("active"), m.removeEventListener("pointermove", this.onPointerMove), m.removeEventListener("pointerup", this.onPointerUp), m.removeEventListener("pointercancel", this.onPointerUp));
    });
    this.elements = t, this.controller = e, this.opts = s, this.init();
  }
  get isHorizontal() {
    return this.controller.isHorizontal;
  }
  init() {
    this.elements.$scrollbar.addEventListener("pointerdown", this.onPointerDown), this.elements.$scrollbar.addEventListener("click", this.onTrackClick);
  }
  /** Map a pointer position (relative to track) to a scroll target. */
  pointerToScroll(t, e) {
    const s = this.elements.$scrollbar.getBoundingClientRect(), r = getComputedStyle(this.elements.$scrollbar), o = this.isHorizontal ? t : e;
    let l, a;
    if (this.isHorizontal) {
      const h = parseFloat(r.paddingLeft) || 0, u = parseFloat(r.paddingRight) || 0;
      l = s.left + h, a = s.width - h - u;
    } else {
      const h = parseFloat(r.paddingTop) || 0, u = parseFloat(r.paddingBottom) || 0;
      l = s.top + h, a = s.height - h - u;
    }
    return g((o - l) / a, 0, 1) * this.controller.limit;
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
const oe = p();
class le {
  constructor(t, e, s) {
    n(this, "$scrollbar");
    n(this, "$thumb");
    n(this, "thumbSize", 0);
    n(this, "createScrollbar", new se());
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
      const { track: t, minThumbSize: e } = this.readGeometry();
      this.updateThumbSize(t, e), this.updateThumbPosition(t), this.controller.isScrolling && this.inactivity.show();
    });
    this.controller = t, this.raf = e, this.opts = s, this.inactivity = new re(this.setVisibility, mt), this.init();
  }
  get isHorizontal() {
    return this.controller.isHorizontal;
  }
  /** Read live geometry in a single getComputedStyle call per frame. */
  readGeometry() {
    const t = getComputedStyle(this.$scrollbar), e = parseFloat(
      this.isHorizontal ? t.paddingLeft : t.paddingTop
    ) || 0, s = parseFloat(
      this.isHorizontal ? t.paddingRight : t.paddingBottom
    ) || 0, r = this.isHorizontal ? this.$scrollbar.clientWidth : this.$scrollbar.clientHeight, o = parseFloat(t.getPropertyValue("--es-thumb-min-size")), l = Number.isFinite(o) && o >= 0 ? o : Tt;
    return { track: r - e - s, minThumbSize: l };
  }
  init() {
    this.$scrollbar = this.createScrollbar.create(this.isHorizontal), this.$thumb = this.$scrollbar.querySelector(".scrollbar__thumb"), this.createScrollbar.append(oe.body), this.$scrollbar.addEventListener("mouseenter", this.onMouseEnter), this.drag = new ne(
      { $scrollbar: this.$scrollbar, $thumb: this.$thumb },
      this.controller,
      this.opts
    ), this.raf.on(this.onFrame);
  }
  updateThumbSize(t, e) {
    const s = this.controller.limit;
    if (s <= 0 || t <= 0) {
      this.thumbSize = 0, this.$thumb.style[this.isHorizontal ? "width" : "height"] = "0px";
      return;
    }
    const r = t / (t + s), o = Math.min(e, t);
    this.thumbSize = g(t * r, o, t), this.$thumb.style[this.isHorizontal ? "width" : "height"] = this.thumbSize + "px";
  }
  updateThumbPosition(t) {
    const e = t - this.thumbSize;
    if (e <= 0) return;
    const o = (g(this.controller.progress, 0, 1) * e).toFixed(2);
    this.isHorizontal ? this.$thumb.style.transform = `translateX(${o}px)` : this.$thumb.style.transform = `translateY(${o}px)`;
  }
  reset() {
    const { track: t, minThumbSize: e } = this.readGeometry();
    this.updateThumbSize(t, e), this.$thumb.style.transform = this.isHorizontal ? "translateX(0px)" : "translateY(0px)";
  }
  destroy() {
    var t;
    (t = this.drag) == null || t.destroy(), this.drag = null, this.$scrollbar.removeEventListener("mouseenter", this.onMouseEnter), this.createScrollbar.destroy(), this.inactivity.destroy(), this.raf.off(this.onFrame);
  }
}
const D = d();
class de {
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
    n(this, "animate", new Rt());
    n(this, "emitter", new pt());
    n(this, "dimensions");
    n(this, "nativeScroll");
    n(this, "reducedMotion", new ee());
    n(this, "mobile");
    n(this, "persistence", new ie());
    // --- Handlers ---
    n(this, "vsHandler", null);
    n(this, "keyboardHandler", null);
    n(this, "anchorHandler", null);
    n(this, "scrollbar", null);
    n(this, "update", () => {
      var s;
      const t = performance.now(), e = (t - (this._time || t)) * 1e-3;
      this._time = t, (s = this.vsHandler) == null || s.flush(e), this.animate.advance(e);
    });
    this.opts = xt(t), this.raf = this.opts.raf || ht, this.dimensions = new Ct(this.wrapperElement, this.opts.content, {
      autoResize: this.opts.autoResize,
      onResize: () => this.syncToDimensions()
    }), this.animatedScroll = this.targetScroll = this.getActualScroll(), this.opts.el.classList.add("es-smooth"), this.nativeScroll = new te(this.wrapperElement, this), this.mobile = new Jt(
      this.opts.breakpoint,
      () => this.teardownDesktopHandlers(),
      () => this.setupDesktopHandlers()
    ), this.mobile.isMobile || this.setupDesktopHandlers(), this.opts.anchors && (this.anchorHandler = new Ft(this, this.wrapperElement), this.anchorHandler.init()), this.opts.useKeyboardSmooth && (this.keyboardHandler = new qt(this), this.keyboardHandler.init()), this.opts.saveScrollPosition && this.restoreScrollPosition(), this.opts.disabled && this.stop(), this.opts.autoRaf && this.raf.on(this.update);
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
    return this.opts.infinite ? ct(this.animatedScroll, this.limit) : this.animatedScroll;
  }
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  get isMobile() {
    return this.mobile.isMobile;
  }
  get wrapperElement() {
    return this.isWindowScroll ? D : this.opts.el;
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
  scrollTo(t, e = {}) {
    const { force: s = !1, onStart: r, onComplete: o } = e;
    if ((this._isStopped || this._isLocked) && !s) return;
    const l = this.resolveTarget(t, e.offset ?? 0);
    if (l === null) return;
    if (l === this.targetScroll) {
      r == null || r(this), o == null || o(this);
      return;
    }
    if (e.immediate || this.reducedMotion.matches) {
      this.performImmediate(l, o);
      return;
    }
    this.performAnimated(l, e);
  }
  start() {
    this._isStopped && (this.resetState(), this._isStopped = !1, this.opts.el.classList.remove("e-fixed"), this.notifyChange());
  }
  stop() {
    this._isStopped || (this.resetState(), this._isStopped = !0, this.opts.el.classList.add("e-fixed"), this.notifyChange());
  }
  resize() {
    this.dimensions.resize(), this.syncToDimensions();
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
  attachScrollTrigger(t, e) {
    return Zt(this, t, e);
  }
  destroy() {
    var t, e;
    this.raf.off(this.update), this.teardownDesktopHandlers(), (t = this.keyboardHandler) == null || t.destroy(), this.keyboardHandler = null, (e = this.anchorHandler) == null || e.destroy(), this.anchorHandler = null, this.dimensions.destroy(), this.nativeScroll.destroy(), this.reducedMotion.destroy(), this.mobile.destroy(), this.opts.el.classList.remove("es-smooth", "es-scrolling", "e-fixed"), this.emitter.off("scroll"), this.emitter.off("virtual-scroll");
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
    return this.isWindowScroll ? this.isHorizontal ? D.scrollX : D.scrollY : this.isHorizontal ? this.opts.el.scrollLeft : this.opts.el.scrollTop;
  }
  onScrollChanged() {
    this.notifyChange();
  }
  // ---------------------------------------------------------------------------
  // Private — scrollTo pipeline
  // ---------------------------------------------------------------------------
  resolveTarget(t, e) {
    const s = Wt(
      t,
      e,
      this.limit,
      this.isHorizontal,
      this.animatedScroll
    );
    return s === null ? null : this.opts.infinite ? s : g(s, 0, this.limit);
  }
  performImmediate(t, e) {
    this.animatedScroll = this.targetScroll = t, this.setScroll(this.scroll), this.resetState(), this.notifyChange(), e == null || e(this);
  }
  performAnimated(t, e) {
    const s = e.lerp ?? this.opts.lerp, r = e.duration ?? this.opts.duration, o = e.easing !== void 0 ? nt(e.easing) : this.opts.easing, l = e.lock ?? !1;
    this.targetScroll = t, this.animate.fromTo(this.animatedScroll, t, {
      lerp: r ? void 0 : s,
      duration: r,
      easing: o,
      onStart: () => {
        var a;
        l && (this._isLocked = !0), this.isScrolling = "smooth", (a = e.onStart) == null || a.call(e, this);
      },
      onUpdate: (a, c) => {
        var h;
        if (this.isScrolling = "smooth", this.lastVelocity = this.velocity, this.velocity = a - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = a, this.setScroll(this.scroll), !c) {
          this.notifyChange();
          return;
        }
        this.resetState(), this.notifyChange(), (h = e.onComplete) == null || h.call(e, this), this.opts.saveScrollPosition && this.persistence.save(this.animatedScroll);
      }
    });
  }
  // ---------------------------------------------------------------------------
  // Private — DOM / state helpers
  // ---------------------------------------------------------------------------
  get isWindowScroll() {
    return this.opts.el === p().documentElement;
  }
  setScroll(t) {
    this.nativeScroll.markSet(t), this.wrapperElement.scrollTo({
      [this.isHorizontal ? "left" : "top"]: t,
      behavior: "instant"
    });
  }
  setupDesktopHandlers() {
    this.vsHandler || (this.vsHandler = new Qt(this), this.vsHandler.setup()), !this.scrollbar && this.opts.scrollbar.enabled && (this.scrollbar = new le(this, this.raf, this.opts.scrollbar));
  }
  teardownDesktopHandlers() {
    var t, e;
    (t = this.vsHandler) == null || t.destroy(), this.vsHandler = null, (e = this.scrollbar) == null || e.destroy(), this.scrollbar = null;
  }
  restoreScrollPosition() {
    const t = this.persistence.restore();
    t !== null && this.scrollTo(t, { immediate: !0 });
  }
  resetState() {
    this._isLocked = !1, this.isScrolling = !1, this.opts.infinite ? this.animatedScroll = this.targetScroll = this.scroll : this.animatedScroll = this.targetScroll = this.getActualScroll(), this.lastVelocity = this.velocity = 0, this.animate.stop();
  }
  syncToDimensions() {
    this.animatedScroll = this.targetScroll = this.getActualScroll(), this.notifyChange();
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
const pe = {
  syncTouch: !0,
  syncTouchLerp: 0.08,
  touchInertiaExponent: 2,
  maxTouchInertia: 3e3
};
export {
  Zt as attachScrollTrigger,
  de as default,
  ue as easings,
  pe as iosMomentumPreset,
  nt as resolveEasing,
  I as smoothEasing
};
