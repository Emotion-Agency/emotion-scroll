var it = Object.defineProperty;
var st = (t, e, i) => e in t ? it(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var o = (t, e, i) => st(t, typeof e != "symbol" ? e + "" : e, i);
import { clamp as b, damp as rt, raf as ot, modulo as nt } from "@emotionagency/utils";
import { getWindow as x, getDocument as p } from "ssr-window";
import lt from "virtual-scroll";
function at(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function _(t) {
  throw new Error('Could not dynamically require "' + t + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var B = { exports: {} };
(function(t, e) {
  (function(i) {
    t.exports = i();
  })(function() {
    return function i(s, r, c) {
      function a(n, u) {
        if (!r[n]) {
          if (!s[n]) {
            var d = typeof _ == "function" && _;
            if (!u && d) return d(n, !0);
            if (h) return h(n, !0);
            var v = new Error("Cannot find module '" + n + "'");
            throw v.code = "MODULE_NOT_FOUND", v;
          }
          var g = r[n] = { exports: {} };
          s[n][0].call(g.exports, function(T) {
            var E = s[n][1][T];
            return a(E || T);
          }, g, g.exports, i, s, r, c);
        }
        return r[n].exports;
      }
      for (var h = typeof _ == "function" && _, l = 0; l < c.length; l++) a(c[l]);
      return a;
    }({ 1: [function(i, s, r) {
      function c() {
      }
      c.prototype = {
        on: function(a, h, l) {
          var n = this.e || (this.e = {});
          return (n[a] || (n[a] = [])).push({
            fn: h,
            ctx: l
          }), this;
        },
        once: function(a, h, l) {
          var n = this;
          function u() {
            n.off(a, u), h.apply(l, arguments);
          }
          return u._ = h, this.on(a, u, l);
        },
        emit: function(a) {
          var h = [].slice.call(arguments, 1), l = ((this.e || (this.e = {}))[a] || []).slice(), n = 0, u = l.length;
          for (n; n < u; n++)
            l[n].fn.apply(l[n].ctx, h);
          return this;
        },
        off: function(a, h) {
          var l = this.e || (this.e = {}), n = l[a], u = [];
          if (n && h)
            for (var d = 0, v = n.length; d < v; d++)
              n[d].fn !== h && n[d].fn._ !== h && u.push(n[d]);
          return u.length ? l[a] = u : delete l[a], this;
        }
      }, s.exports = c, s.exports.TinyEmitter = c;
    }, {}] }, {}, [1])(1);
  });
})(B);
var ct = B.exports;
const ht = /* @__PURE__ */ at(ct);
class ut {
  constructor() {
    o(this, "isRunning", !1);
    o(this, "value", 0);
    o(this, "from", 0);
    o(this, "to", 0);
    o(this, "currentTime", 0);
    o(this, "lerp");
    o(this, "duration");
    o(this, "easing");
    o(this, "onUpdate");
  }
  advance(e) {
    var s;
    if (!this.isRunning) return;
    let i = !1;
    if (this.duration && this.easing) {
      this.currentTime += e;
      const r = b(this.currentTime / this.duration, 0, 1);
      i = r >= 1;
      const c = i ? 1 : this.easing(r);
      this.value = this.from + (this.to - this.from) * c;
    } else this.lerp ? (this.value = rt(this.value, this.to, this.lerp * 60, e), Math.abs(this.value - this.to) < 0.5 && (this.value = this.to, i = !0)) : (this.value = this.to, i = !0);
    i && this.stop(), (s = this.onUpdate) == null || s.call(this, this.value, i);
  }
  fromTo(e, i, s) {
    var r;
    this.from = this.value = e, this.to = i, this.lerp = s.lerp, this.duration = s.duration, this.easing = s.easing, this.currentTime = 0, this.isRunning = !0, this.onUpdate = s.onUpdate, (r = s.onStart) == null || r.call(s);
  }
  stop() {
    this.isRunning = !1;
  }
}
function dt(t, e) {
  let i;
  return function(...s) {
    clearTimeout(i), i = setTimeout(() => {
      i = void 0, t.apply(this, s);
    }, e);
  };
}
const M = x();
class mt {
  constructor(e, i, { autoResize: s = !0, debounceDelay: r = 250 } = {}) {
    o(this, "width", 0);
    o(this, "height", 0);
    o(this, "scrollWidth", 0);
    o(this, "scrollHeight", 0);
    o(this, "debouncedResize");
    o(this, "wrapperResizeObserver");
    o(this, "contentResizeObserver");
    o(this, "resize", () => {
      this.wrapper instanceof Window ? (this.width = M.innerWidth, this.height = M.innerHeight, this.scrollWidth = this.content.scrollWidth, this.scrollHeight = this.content.scrollHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight, this.scrollWidth = this.wrapper.scrollWidth, this.scrollHeight = this.wrapper.scrollHeight);
    });
    this.wrapper = e, this.content = i, s && (this.debouncedResize = dt(this.resize, r), this.wrapper instanceof Window ? M.addEventListener("resize", this.debouncedResize) : typeof ResizeObserver < "u" && (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), typeof ResizeObserver < "u" && (this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content))), this.resize();
  }
  get limit() {
    return {
      x: Math.max(0, this.scrollWidth - this.width),
      y: Math.max(0, this.scrollHeight - this.height)
    };
  }
  destroy() {
    var e, i;
    (e = this.wrapperResizeObserver) == null || e.disconnect(), (i = this.contentResizeObserver) == null || i.disconnect(), this.wrapper instanceof Window && this.debouncedResize && M.removeEventListener("resize", this.debouncedResize);
  }
}
const H = (t) => t, D = (t) => {
  const e = 1 - t;
  return 1 - e * e * e * (1 - t * 0.6);
}, N = (t) => ({
  in: (e) => e ** t,
  out: (e) => 1 - (1 - e) ** t,
  inOut: (e) => e < 0.5 ? 2 ** (t - 1) * e ** t : 1 - (-2 * e + 2) ** t / 2
}), k = N(2), R = N(3), O = N(4), $ = N(5), X = {
  in: (t) => t === 0 ? 0 : 2 ** (10 * t - 10),
  out: (t) => t === 1 ? 1 : 1 - 2 ** (-10 * t),
  inOut: (t) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2
}, G = {
  in: (t) => 1 - Math.cos(t * Math.PI / 2),
  out: (t) => Math.sin(t * Math.PI / 2),
  inOut: (t) => -(Math.cos(Math.PI * t) - 1) / 2
}, j = {
  in: (t) => 1 - Math.sqrt(1 - t * t),
  out: (t) => Math.sqrt(1 - (t - 1) ** 2),
  inOut: (t) => t < 0.5 ? (1 - Math.sqrt(1 - (2 * t) ** 2)) / 2 : (Math.sqrt(1 - (-2 * t + 2) ** 2) + 1) / 2
}, P = 1.70158, z = P * 1.525, C = P + 1, Q = {
  in: (t) => C * t * t * t - P * t * t,
  out: (t) => 1 + C * (t - 1) ** 3 + P * (t - 1) ** 2,
  inOut: (t) => t < 0.5 ? (2 * t) ** 2 * ((z + 1) * 2 * t - z) / 2 : ((2 * t - 2) ** 2 * ((z + 1) * (t * 2 - 2) + z) + 2) / 2
}, V = 2 * Math.PI / 3, A = 2 * Math.PI / 4.5, J = {
  in: (t) => t === 0 ? 0 : t === 1 ? 1 : -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * V),
  out: (t) => t === 0 ? 0 : t === 1 ? 1 : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * V) + 1,
  inOut: (t) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? -(2 ** (20 * t - 10) * Math.sin((20 * t - 11.125) * A)) / 2 : 2 ** (-20 * t + 10) * Math.sin((20 * t - 11.125) * A) / 2 + 1
}, L = (t) => {
  if (t < 1 / 2.75) return 7.5625 * t * t;
  if (t < 2 / 2.75) {
    const r = t - 0.5454545454545454;
    return 7.5625 * r * r + 0.75;
  }
  if (t < 2.5 / 2.75) {
    const r = t - 0.8181818181818182;
    return 7.5625 * r * r + 0.9375;
  }
  const s = t - 2.625 / 2.75;
  return 7.5625 * s * s + 0.984375;
}, Z = {
  in: (t) => 1 - L(1 - t),
  out: L,
  inOut: (t) => t < 0.5 ? (1 - L(1 - 2 * t)) / 2 : (1 + L(2 * t - 1)) / 2
}, Wt = {
  linear: H,
  none: H,
  smooth: D,
  power1: k,
  power2: R,
  power3: O,
  power4: $,
  quad: k,
  cubic: R,
  quart: O,
  quint: $,
  expo: X,
  sine: G,
  circ: j,
  back: Q,
  elastic: J,
  bounce: Z
}, ft = {
  power1: k,
  power2: R,
  power3: O,
  power4: $,
  quad: k,
  cubic: R,
  quart: O,
  quint: $,
  expo: X,
  sine: G,
  circ: j,
  back: Q,
  elastic: J,
  bounce: Z
};
var Y;
const pt = typeof process > "u" || ((Y = process.env) == null ? void 0 : Y.NODE_ENV) !== "production", F = /* @__PURE__ */ new Set();
function I(t, e) {
  !pt || F.has(e) || (F.add(e), console.warn(`[emotion-scroll] ${t}`));
}
function tt(t) {
  if (typeof t != "string") return t;
  if (t === "none" || t === "linear") return H;
  if (t === "smooth") return D;
  const [e, i = "out"] = t.split("."), s = ft[e];
  if (!s)
    return I(
      `Unknown easing "${t}". Falling back to linear.`,
      t
    ), H;
  const r = s[i];
  return r || (I(
    `Unknown easing direction "${i}" for "${e}". Expected "in", "out" or "inOut". Falling back to "${e}.out".`,
    t
  ), s.out);
}
const q = p();
function vt(t) {
  return typeof t == "object" && t !== null ? {
    enabled: t.enabled ?? !0,
    isSmooth: t.isSmooth ?? !0
  } : {
    enabled: t ?? !0,
    isSmooth: !0
  };
}
function bt(t = {}) {
  const e = t.orientation ?? "vertical";
  let i = t.duration ?? void 0, s = tt(t.easing);
  return typeof i == "number" && typeof s != "function" ? s = D : typeof s == "function" && typeof i != "number" && (i = 1.5), {
    el: t.el ?? q.documentElement,
    content: t.content ?? t.el ?? q.documentElement,
    orientation: e,
    gestureOrientation: t.gestureOrientation ?? (e === "horizontal" ? "both" : "vertical"),
    smoothWheel: t.smoothWheel ?? !0,
    syncTouch: t.syncTouch ?? !1,
    syncTouchLerp: t.syncTouchLerp ?? 0.075,
    touchInertiaExponent: t.touchInertiaExponent ?? 1.7,
    lerp: t.lerp ?? 0.1,
    duration: i,
    easing: s,
    touchMultiplier: t.touchMultiplier ?? 1,
    wheelMultiplier: t.wheelMultiplier ?? 1,
    maxScrollDelta: t.maxScrollDelta ?? 120,
    scrollbar: vt(t.scrollbar),
    breakpoint: t.breakpoint ?? null,
    useKeyboardSmooth: t.useKeyboardSmooth ?? !0,
    keyboardScrollStep: t.keyboardScrollStep ?? 120,
    disabled: t.disabled ?? !1,
    raf: t.raf ?? null,
    autoRaf: t.autoRaf ?? !0,
    autoResize: t.autoResize ?? !0,
    saveScrollPosition: t.saveScrollPosition ?? !1,
    prevent: t.prevent,
    overscroll: t.overscroll ?? !0,
    infinite: t.infinite ?? !1,
    passive: t.passive ?? !1,
    maxTouchInertia: t.maxTouchInertia ?? 1e3,
    anchors: t.anchors
  };
}
const St = p();
function gt(t, e, i, s, r) {
  if (typeof t == "string") {
    if (["top", "left", "start"].includes(t)) return 0 + e;
    if (["bottom", "right", "end"].includes(t)) return i + e;
    const c = St.querySelector(t);
    return c ? U(c, s, r) + e : null;
  }
  return t instanceof HTMLElement ? U(t, s, r) + e : typeof t == "number" ? t + e : null;
}
function U(t, e, i) {
  const s = t.getBoundingClientRect(), r = e ? "left" : "top", c = getComputedStyle(t), a = parseFloat(e ? c.scrollMarginLeft : c.scrollMarginTop) || 0;
  return s[r] + i - a;
}
const yt = p();
function Et(t, e, i) {
  var s;
  for (; t && t !== e; ) {
    if ((s = t.hasAttribute) != null && s.call(t, "data-scroll-ignore") || typeof i.prevent == "function" && i.prevent(t))
      return !0;
    t = t.parentElement;
  }
  return !1;
}
class wt {
  constructor(e) {
    o(this, "vs", null);
    o(this, "onVirtualScroll", (e) => {
      const { host: i } = this, { opts: s } = i, r = e.originalEvent, c = r.type.includes("touch"), a = r.type.includes("wheel");
      if ("ctrlKey" in r && r.ctrlKey || (i.isTouching = r.type === "touchstart" || r.type === "touchmove", Et(r.target, s.el, s)) || i.isStopped || i.isLocked) return;
      if (!(s.syncTouch && c || s.smoothWheel && a)) {
        i.isScrolling = "native", i.stopAnimation();
        return;
      }
      i.emitVirtualScroll({ deltaX: e.deltaX, deltaY: e.deltaY, event: r });
      let l;
      if (s.gestureOrientation === "both" ? l = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX : s.gestureOrientation === "horizontal" ? l = e.deltaX : l = e.deltaY, l === 0) return;
      l = -l, a && (l *= s.wheelMultiplier), l = b(l, -s.maxScrollDelta, s.maxScrollDelta);
      const n = c && r.type === "touchend";
      if (n && s.syncTouch) {
        const v = Math.sign(i.velocity) * Math.abs(i.velocity) ** s.touchInertiaExponent;
        l = b(v, -s.maxTouchInertia, s.maxTouchInertia);
      }
      (!s.overscroll || s.infinite || this.isWithinBounds(l)) && "cancelable" in r && r.cancelable && r.preventDefault();
      const u = c && s.syncTouch, d = u && n;
      i.scrollTo(i.targetScroll + l, {
        ...u ? { lerp: d ? s.syncTouchLerp : 1 } : { lerp: s.lerp, duration: s.duration, easing: s.easing }
      });
    });
    this.host = e;
  }
  setup() {
    const { opts: e } = this.host;
    this.vs = new lt({
      el: e.el === yt.documentElement ? void 0 : e.el,
      touchMultiplier: e.touchMultiplier,
      passive: e.passive,
      useKeyboard: !1
    }), this.vs.on(this.onVirtualScroll);
  }
  destroy() {
    var e;
    (e = this.vs) == null || e.destroy(), this.vs = null;
  }
  isWithinBounds(e) {
    const { animatedScroll: i, limit: s } = this.host;
    return s <= 0 ? !1 : i > 0 && i < s || i === 0 && e > 0 || i === s && e < 0;
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
}, y = x(), Tt = p();
class _t {
  constructor(e) {
    o(this, "onKeyDown", (e) => {
      const { host: i } = this;
      if (i.isStopped || i.limit <= 0) return;
      const s = i.opts.keyboardScrollStep;
      let r = null;
      switch (e.key) {
        case f.TAB: {
          const c = Tt.activeElement;
          if (c) {
            const a = c.getBoundingClientRect(), h = i.isHorizontal ? a.left : a.top;
            r = i.animatedScroll + h;
          }
          break;
        }
        case f.UP:
          r = i.targetScroll - s;
          break;
        case f.DOWN:
          r = i.targetScroll + s;
          break;
        case f.LEFT:
          i.isHorizontal && (r = i.targetScroll - s);
          break;
        case f.RIGHT:
          i.isHorizontal && (r = i.targetScroll + s);
          break;
        case f.PAGEUP:
          r = i.targetScroll - (i.isHorizontal ? y.innerWidth : y.innerHeight);
          break;
        case f.PAGEDOWN:
          r = i.targetScroll + (i.isHorizontal ? y.innerWidth : y.innerHeight);
          break;
        case f.HOME:
          r = 0;
          break;
        case f.END:
          r = i.limit;
          break;
      }
      r !== null && i.scrollTo(b(r, 0, i.limit));
    });
    this.host = e;
  }
  init() {
    y.addEventListener("keydown", this.onKeyDown, !1);
  }
  destroy() {
    y.removeEventListener("keydown", this.onKeyDown);
  }
}
const Mt = x(), zt = p();
class Lt {
  constructor(e, i) {
    o(this, "onClick", (e) => {
      const i = e.composedPath();
      for (const s of i) {
        if (!(s instanceof HTMLAnchorElement) || !s.href) continue;
        const r = new URL(s.href), c = new URL(Mt.location.href);
        if (r.host !== c.host || r.pathname !== c.pathname || !r.hash) continue;
        const a = r.hash;
        if (!zt.querySelector(a)) continue;
        e.preventDefault();
        const h = typeof this.host.opts.anchors == "object" ? this.host.opts.anchors : void 0;
        this.host.scrollTo(a, h), history.pushState(null, "", a);
        break;
      }
    });
    this.host = e, this.element = i;
  }
  init() {
    this.element.addEventListener("click", this.onClick);
  }
  destroy() {
    this.element.removeEventListener("click", this.onClick);
  }
}
const W = p();
class Ht {
  constructor() {
    o(this, "scrollbar");
  }
  create(e = !1) {
    this.scrollbar = W.createElement("div");
    const i = W.createElement("span");
    return i.className = "scrollbar__thumb", this.scrollbar.appendChild(i), this.scrollbar.classList.add("scrollbar"), e && this.scrollbar.classList.add("scrollbar--horizontal"), this.scrollbar;
  }
  append(e) {
    if (!e) {
      W.body.appendChild(this.scrollbar);
      return;
    }
    e.appendChild(this.scrollbar);
  }
  destroy() {
    this.scrollbar.remove();
  }
}
class kt {
  constructor(e, i = 1e3) {
    o(this, "timer", null);
    this.cb = e, this.delay = i;
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
const w = p(), S = {
  start: ["mousedown", "touchstart"],
  move: ["mousemove", "touchmove"],
  end: ["mouseup", "touchend"]
};
class Rt {
  constructor(e, i, s) {
    o(this, "onTrackClick", (e) => {
      if (this.controller.isStopped) return;
      const i = this.pointerToScroll(e.clientX, e.clientY);
      this.controller.scrollTo(i, { immediate: !this.opts.isSmooth });
    });
    o(this, "onStart", (e) => {
      e.preventDefault();
      for (const i of S.move)
        w.documentElement.addEventListener(i, this.onMove);
      this.elements.$thumb.classList.add("active");
    });
    o(this, "onMove", (e) => {
      if (this.controller.isStopped) return;
      let i, s;
      "touches" in e && e.touches.length > 0 ? (i = e.touches[0].clientX, s = e.touches[0].clientY) : (i = e.clientX, s = e.clientY);
      const r = this.pointerToScroll(i, s);
      this.controller.scrollTo(r, { immediate: !this.opts.isSmooth });
    });
    o(this, "onEnd", () => {
      this.elements.$thumb.classList.remove("active");
      for (const e of S.move)
        w.documentElement.removeEventListener(e, this.onMove);
    });
    this.elements = e, this.controller = i, this.opts = s, this.init();
  }
  get isHorizontal() {
    return this.controller.isHorizontal;
  }
  init() {
    for (const e of S.start)
      this.elements.$scrollbar.addEventListener(e, this.onStart, { passive: !1 });
    for (const e of S.end)
      w.documentElement.addEventListener(e, this.onEnd);
    this.elements.$scrollbar.addEventListener("click", this.onTrackClick);
  }
  /** Map a pointer position (relative to track) to a scroll target. */
  pointerToScroll(e, i) {
    const s = this.elements.$scrollbar.getBoundingClientRect(), r = getComputedStyle(this.elements.$scrollbar), c = this.isHorizontal ? e : i;
    let a, h;
    if (this.isHorizontal) {
      const n = parseFloat(r.paddingLeft) || 0, u = parseFloat(r.paddingRight) || 0;
      a = s.left + n, h = s.width - n - u;
    } else {
      const n = parseFloat(r.paddingTop) || 0, u = parseFloat(r.paddingBottom) || 0;
      a = s.top + n, h = s.height - n - u;
    }
    return b((c - a) / h, 0, 1) * this.controller.limit;
  }
  destroy() {
    for (const e of S.start)
      this.elements.$scrollbar.removeEventListener(e, this.onStart);
    for (const e of S.end)
      w.documentElement.removeEventListener(e, this.onEnd);
    for (const e of S.move)
      w.documentElement.removeEventListener(e, this.onMove);
    this.elements.$scrollbar.removeEventListener("click", this.onTrackClick);
  }
}
const Ot = p();
class K {
  constructor(e, i, s) {
    o(this, "$scrollbar");
    o(this, "$thumb");
    o(this, "thumbSize", 0);
    o(this, "thumbMinSize", 60);
    o(this, "cachedPadding", { top: 0, bottom: 0, left: 0, right: 0 });
    o(this, "createScrollbar", new Ht());
    o(this, "inactivity");
    o(this, "drag", null);
    o(this, "onMouseEnter", () => {
      this.inactivity.show();
    });
    o(this, "setVisibility", (e) => {
      this.$thumb.classList.toggle("scrolling", e);
    });
    o(this, "onFrame", () => {
      this.$scrollbar.classList.toggle("hidden", this.controller.isStopped), this.updateThumbSize(), this.updateThumbPosition(), this.controller.isScrolling && this.inactivity.show();
    });
    this.controller = e, this.raf = i, this.opts = s, this.inactivity = new kt(this.setVisibility), this.init();
  }
  get isHorizontal() {
    return this.controller.isHorizontal;
  }
  cacheScrollbarPadding() {
    const e = getComputedStyle(this.$scrollbar);
    this.cachedPadding = {
      top: parseFloat(e.paddingTop) || 0,
      bottom: parseFloat(e.paddingBottom) || 0,
      left: parseFloat(e.paddingLeft) || 0,
      right: parseFloat(e.paddingRight) || 0
    };
    const i = parseFloat(
      e.getPropertyValue("--es-thumb-min-size")
    );
    Number.isFinite(i) && i >= 0 && (this.thumbMinSize = i);
  }
  /** Inner track size excluding padding. */
  get trackSize() {
    return this.isHorizontal ? this.$scrollbar.clientWidth - this.cachedPadding.left - this.cachedPadding.right : this.$scrollbar.clientHeight - this.cachedPadding.top - this.cachedPadding.bottom;
  }
  init() {
    this.$scrollbar = this.createScrollbar.create(this.isHorizontal), this.$thumb = this.$scrollbar.querySelector(".scrollbar__thumb"), this.createScrollbar.append(Ot.body), this.cacheScrollbarPadding(), this.$scrollbar.addEventListener("mouseenter", this.onMouseEnter), this.drag = new Rt(
      { $scrollbar: this.$scrollbar, $thumb: this.$thumb },
      this.controller,
      this.opts
    ), this.raf.on(this.onFrame);
  }
  updateThumbSize() {
    const e = this.controller.limit;
    if (e <= 0) {
      this.thumbSize = 0, this.$thumb.style[this.isHorizontal ? "width" : "height"] = "0px";
      return;
    }
    const i = this.trackSize, s = i / (i + e), r = Math.min(this.thumbMinSize, i);
    this.thumbSize = b(i * s, r, i), this.$thumb.style[this.isHorizontal ? "width" : "height"] = this.thumbSize + "px";
  }
  updateThumbPosition() {
    const e = this.trackSize - this.thumbSize;
    if (e <= 0) return;
    const r = (b(this.controller.progress, 0, 1) * e).toFixed(2);
    this.isHorizontal ? this.$thumb.style.transform = `translateX(${r}px)` : this.$thumb.style.transform = `translateY(${r}px)`;
  }
  reset() {
    this.updateThumbSize(), this.$thumb.style.transform = this.isHorizontal ? "translateX(0px)" : "translateY(0px)";
  }
  destroy() {
    var e;
    (e = this.drag) == null || e.destroy(), this.drag = null, this.$scrollbar.removeEventListener("mouseenter", this.onMouseEnter), this.createScrollbar.destroy(), this.inactivity.destroy(), this.raf.off(this.onFrame);
  }
}
const m = x();
class Dt {
  constructor(e = {}) {
    // --- Public state ---
    o(this, "animatedScroll", 0);
    o(this, "targetScroll", 0);
    o(this, "velocity", 0);
    o(this, "lastVelocity", 0);
    o(this, "direction", 0);
    o(this, "isTouching", !1);
    // --- Private state ---
    o(this, "_isScrolling", !1);
    o(this, "_isStopped", !1);
    o(this, "_isLocked", !1);
    o(this, "_preventNativeScrollCounter", 0);
    o(this, "_preventTimers", []);
    o(this, "_resetVelocityTimeout", null);
    o(this, "_reducedMotion", !1);
    o(this, "_motionQuery", null);
    o(this, "_time", 0);
    o(this, "_isMobile", !1);
    // --- Dependencies ---
    o(this, "opts");
    o(this, "animate", new ut());
    o(this, "emitter", new ht());
    o(this, "dimensions");
    o(this, "_raf");
    // --- Handlers ---
    o(this, "vsHandler", null);
    o(this, "keyboardHandler", null);
    o(this, "anchorHandler", null);
    o(this, "scrollbar", null);
    o(this, "update", () => {
      const e = performance.now(), i = (e - (this._time || e)) * 1e-3;
      this._time = e, this.animate.advance(i);
    });
    o(this, "onNativeScroll", () => {
      if (this._resetVelocityTimeout !== null && (clearTimeout(this._resetVelocityTimeout), this._resetVelocityTimeout = null), this._preventNativeScrollCounter > 0) {
        this._preventNativeScrollCounter--;
        return;
      }
      if (this._isScrolling !== !1 && this._isScrolling !== "native" || this.opts.infinite) return;
      const e = this.animatedScroll;
      this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity, this.velocity = this.animatedScroll - e, this.direction = Math.sign(this.velocity), this._isStopped || (this.isScrolling = "native"), this.emit(), this.velocity !== 0 && (this._resetVelocityTimeout = setTimeout(() => {
        this.lastVelocity = this.velocity, this.velocity = 0, this.isScrolling = !1, this.emit();
      }, 400));
    });
    o(this, "onMobileResize", () => {
      var i, s;
      if (!this.opts.breakpoint) return;
      const e = this._isMobile;
      this._isMobile = m.innerWidth < this.opts.breakpoint, e !== this._isMobile && (this._isMobile ? ((i = this.vsHandler) == null || i.destroy(), this.vsHandler = null, (s = this.scrollbar) == null || s.destroy(), this.scrollbar = null) : (this.vsHandler || this.initVirtualScroll(), !this.scrollbar && this.opts.scrollbar.enabled && (this.scrollbar = new K(this, this._raf, this.opts.scrollbar))));
    });
    o(this, "onReducedMotionChange", (e) => {
      this._reducedMotion = e.matches;
    });
    // ---------------------------------------------------------------------------
    // Scroll position persistence
    // ---------------------------------------------------------------------------
    o(this, "STORAGE_KEY", "emotion-scroll-position");
    this.opts = bt(e), this._raf = this.opts.raf || ot, this.dimensions = new mt(this.wrapperElement, this.opts.content, {
      autoResize: this.opts.autoResize
    }), this.animatedScroll = this.targetScroll = this.actualScroll, this.opts.el.classList.add("es-smooth"), this.initReducedMotion(), this.initNativeListeners(), this.initMobileCheck(), this._isMobile || (this.initVirtualScroll(), this.opts.scrollbar.enabled && (this.scrollbar = new K(this, this._raf, this.opts.scrollbar))), this.opts.anchors && (this.anchorHandler = new Lt(this, this.wrapperElement), this.anchorHandler.init()), this.opts.useKeyboardSmooth && (this.keyboardHandler = new _t(this), this.keyboardHandler.init()), this.opts.saveScrollPosition && this.restoreScrollPosition(), this.opts.disabled && this.stop(), this.opts.autoRaf && this._raf.on(this.update);
  }
  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------
  on(e, i) {
    this.emitter.on(e, i);
  }
  off(e, i) {
    this.emitter.off(e, i);
  }
  scrollTo(e, {
    offset: i = 0,
    immediate: s = !1,
    lock: r = !1,
    duration: c,
    easing: a,
    lerp: h,
    onStart: l,
    onComplete: n,
    force: u = !1
  } = {}) {
    if ((this._isStopped || this._isLocked) && !u) return;
    let d = gt(
      e,
      i,
      this.limit,
      this.isHorizontal,
      this.animatedScroll
    );
    if (d === null) return;
    if (d = this.opts.infinite ? d : b(d, 0, this.limit), d === this.targetScroll) {
      l == null || l(this), n == null || n(this);
      return;
    }
    if (this._reducedMotion && (s = !0), s) {
      this.animatedScroll = this.targetScroll = d, this.setScroll(this.scroll), this.resetState(), this.preventNextNativeScrollEvent(), this.emit(), n == null || n(this);
      return;
    }
    const v = h ?? this.opts.lerp, g = c ?? this.opts.duration, T = a !== void 0 ? tt(a) : this.opts.easing;
    this.targetScroll = d, this.animate.fromTo(this.animatedScroll, d, {
      lerp: g ? void 0 : v,
      duration: g,
      easing: T,
      onStart: () => {
        r && (this._isLocked = !0), this.isScrolling = "smooth", l == null || l(this);
      },
      onUpdate: (E, et) => {
        this.isScrolling = "smooth", this.lastVelocity = this.velocity, this.velocity = E - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = E, this.setScroll(this.scroll), et ? (this.resetState(), this.emit(), n == null || n(this), this.preventNextNativeScrollEvent(), this.opts.saveScrollPosition && this.persistScrollPosition()) : this.emit();
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
    var e;
    this.scrollTo(0, { immediate: !0 }), (e = this.scrollbar) == null || e.reset();
  }
  destroy() {
    var e, i, s, r, c;
    this._raf.off(this.update), (e = this.vsHandler) == null || e.destroy(), this.vsHandler = null, (i = this.keyboardHandler) == null || i.destroy(), this.keyboardHandler = null, (s = this.anchorHandler) == null || s.destroy(), this.anchorHandler = null, (r = this.scrollbar) == null || r.destroy(), this.scrollbar = null, this.dimensions.destroy(), m.removeEventListener("resize", this.onMobileResize), this.wrapperElement.removeEventListener("scroll", this.onNativeScroll), (c = this._motionQuery) == null || c.removeEventListener("change", this.onReducedMotionChange), this._resetVelocityTimeout !== null && clearTimeout(this._resetVelocityTimeout);
    for (const a of this._preventTimers) clearTimeout(a);
    this._preventTimers = [], this.opts.el.classList.remove("es-smooth", "es-scrolling", "e-fixed"), this.emitter.off("scroll"), this.emitter.off("virtual-scroll");
  }
  // ---------------------------------------------------------------------------
  // Read-only properties (IScrollController)
  // ---------------------------------------------------------------------------
  get isScrolling() {
    return this._isScrolling;
  }
  set isScrolling(e) {
    this._isScrolling !== e && (this._isScrolling = e, this.opts.el.classList.toggle("es-scrolling", !!e));
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
    return this.opts.infinite ? nt(this.animatedScroll, this.limit) : this.animatedScroll;
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
  emitVirtualScroll(e) {
    this.emitter.emit("virtual-scroll", e);
  }
  stopAnimation() {
    this.animate.stop();
  }
  // ---------------------------------------------------------------------------
  // Native scroll integration
  // ---------------------------------------------------------------------------
  get isWindowScroll() {
    const e = p();
    return this.opts.el === e.documentElement;
  }
  get wrapperElement() {
    return this.isWindowScroll ? m : this.opts.el;
  }
  get actualScroll() {
    return this.isWindowScroll ? this.isHorizontal ? m.scrollX : m.scrollY : this.isHorizontal ? this.opts.el.scrollLeft : this.opts.el.scrollTop;
  }
  setScroll(e) {
    this.wrapperElement.scrollTo({
      [this.isHorizontal ? "left" : "top"]: e,
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
    const e = setTimeout(() => {
      this._preventNativeScrollCounter > 0 && this._preventNativeScrollCounter--, this._preventTimers = this._preventTimers.filter((i) => i !== e);
    }, 100);
    this._preventTimers.push(e);
  }
  // ---------------------------------------------------------------------------
  // Mobile breakpoint
  // ---------------------------------------------------------------------------
  initMobileCheck() {
    this.opts.breakpoint && (this._isMobile = m.innerWidth < this.opts.breakpoint, m.addEventListener("resize", this.onMobileResize));
  }
  initVirtualScroll() {
    this.vsHandler = new wt(this), this.vsHandler.setup();
  }
  // ---------------------------------------------------------------------------
  // Reduced motion
  // ---------------------------------------------------------------------------
  initReducedMotion() {
    typeof m.matchMedia == "function" && (this._motionQuery = m.matchMedia("(prefers-reduced-motion: reduce)"), this._reducedMotion = this._motionQuery.matches, this._motionQuery.addEventListener("change", this.onReducedMotionChange));
  }
  restoreScrollPosition() {
    const e = m.localStorage.getItem(this.STORAGE_KEY);
    if (e !== null) {
      const i = Number(e);
      Number.isNaN(i) || this.scrollTo(i, { immediate: !0 });
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
      const e = this.scroll;
      this.animatedScroll = this.targetScroll = e;
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
  Dt as default,
  Wt as easings,
  tt as resolveEasing,
  D as smoothEasing
};
