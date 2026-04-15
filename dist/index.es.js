var rt = Object.defineProperty;
var ot = (e, t, i) => t in e ? rt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var o = (e, t, i) => ot(e, typeof t != "symbol" ? t + "" : t, i);
import { clamp as p, damp as nt, raf as lt, modulo as at } from "@emotionagency/utils";
import { getWindow as S, getDocument as f } from "ssr-window";
import ct from "virtual-scroll";
function ht(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function E(e) {
  throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var j = { exports: {} };
(function(e, t) {
  (function(i) {
    e.exports = i();
  })(function() {
    return function i(s, r, a) {
      function n(l, u) {
        if (!r[l]) {
          if (!s[l]) {
            var d = typeof E == "function" && E;
            if (!u && d) return d(l, !0);
            if (h) return h(l, !0);
            var v = new Error("Cannot find module '" + l + "'");
            throw v.code = "MODULE_NOT_FOUND", v;
          }
          var P = r[l] = { exports: {} };
          s[l][0].call(P.exports, function($) {
            var I = s[l][1][$];
            return n(I || $);
          }, P, P.exports, i, s, r, a);
        }
        return r[l].exports;
      }
      for (var h = typeof E == "function" && E, c = 0; c < a.length; c++) n(a[c]);
      return n;
    }({ 1: [function(i, s, r) {
      function a() {
      }
      a.prototype = {
        on: function(n, h, c) {
          var l = this.e || (this.e = {});
          return (l[n] || (l[n] = [])).push({
            fn: h,
            ctx: c
          }), this;
        },
        once: function(n, h, c) {
          var l = this;
          function u() {
            l.off(n, u), h.apply(c, arguments);
          }
          return u._ = h, this.on(n, u, c);
        },
        emit: function(n) {
          var h = [].slice.call(arguments, 1), c = ((this.e || (this.e = {}))[n] || []).slice(), l = 0, u = c.length;
          for (l; l < u; l++)
            c[l].fn.apply(c[l].ctx, h);
          return this;
        },
        off: function(n, h) {
          var c = this.e || (this.e = {}), l = c[n], u = [];
          if (l && h)
            for (var d = 0, v = l.length; d < v; d++)
              l[d].fn !== h && l[d].fn._ !== h && u.push(l[d]);
          return u.length ? c[n] = u : delete c[n], this;
        }
      }, s.exports = a, s.exports.TinyEmitter = a;
    }, {}] }, {}, [1])(1);
  });
})(j);
var ut = j.exports;
const dt = /* @__PURE__ */ ht(ut), mt = 400, ft = 100, pt = 1e3, gt = 250, St = 0.5, vt = 60, bt = 60, x = "emotion-scroll-position", yt = 1.5, Et = 0.1, Tt = 0.075, wt = 1.7, Lt = 1, Mt = 1, _t = 120, zt = 120, Rt = 1e3;
class Ht {
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
  advance(t) {
    var s;
    if (!this.isRunning) return;
    let i = !1;
    if (this.duration && this.easing) {
      this.currentTime += t;
      const r = p(this.currentTime / this.duration, 0, 1);
      i = r >= 1;
      const a = i ? 1 : this.easing(r);
      this.value = this.from + (this.to - this.from) * a;
    } else this.lerp ? (this.value = nt(this.value, this.to, this.lerp * vt, t), Math.abs(this.value - this.to) < St && (this.value = this.to, i = !0)) : (this.value = this.to, i = !0);
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
function Ot(e, t) {
  let i;
  return function(...s) {
    clearTimeout(i), i = setTimeout(() => {
      i = void 0, e.apply(this, s);
    }, t);
  };
}
const T = S();
class kt {
  constructor(t, i, { autoResize: s = !0, debounceDelay: r = gt } = {}) {
    o(this, "width", 0);
    o(this, "height", 0);
    o(this, "scrollWidth", 0);
    o(this, "scrollHeight", 0);
    o(this, "debouncedResize");
    o(this, "wrapperResizeObserver");
    o(this, "contentResizeObserver");
    o(this, "resize", () => {
      this.wrapper instanceof Window ? (this.width = T.innerWidth, this.height = T.innerHeight, this.scrollWidth = this.content.scrollWidth, this.scrollHeight = this.content.scrollHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight, this.scrollWidth = this.wrapper.scrollWidth, this.scrollHeight = this.wrapper.scrollHeight);
    });
    this.wrapper = t, this.content = i, s && (this.debouncedResize = Ot(this.resize, r), this.wrapper instanceof Window ? T.addEventListener("resize", this.debouncedResize) : typeof ResizeObserver < "u" && (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), typeof ResizeObserver < "u" && (this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content))), this.resize();
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
const _ = (e) => e, D = (e) => {
  const t = 1 - e;
  return 1 - t * t * t * (1 - e * 0.6);
}, C = (e) => ({
  in: (t) => t ** e,
  out: (t) => 1 - (1 - t) ** e,
  inOut: (t) => t < 0.5 ? 2 ** (e - 1) * t ** e : 1 - (-2 * t + 2) ** e / 2
}), z = C(2), R = C(3), H = C(4), O = C(5), Z = {
  in: (e) => e === 0 ? 0 : 2 ** (10 * e - 10),
  out: (e) => e === 1 ? 1 : 1 - 2 ** (-10 * e),
  inOut: (e) => e === 0 ? 0 : e === 1 ? 1 : e < 0.5 ? 2 ** (20 * e - 10) / 2 : (2 - 2 ** (-20 * e + 10)) / 2
}, J = {
  in: (e) => 1 - Math.cos(e * Math.PI / 2),
  out: (e) => Math.sin(e * Math.PI / 2),
  inOut: (e) => -(Math.cos(Math.PI * e) - 1) / 2
}, Q = {
  in: (e) => 1 - Math.sqrt(1 - e * e),
  out: (e) => Math.sqrt(1 - (e - 1) ** 2),
  inOut: (e) => e < 0.5 ? (1 - Math.sqrt(1 - (2 * e) ** 2)) / 2 : (Math.sqrt(1 - (-2 * e + 2) ** 2) + 1) / 2
}, k = 1.70158, w = k * 1.525, N = k + 1, tt = {
  in: (e) => N * e * e * e - k * e * e,
  out: (e) => 1 + N * (e - 1) ** 3 + k * (e - 1) ** 2,
  inOut: (e) => e < 0.5 ? (2 * e) ** 2 * ((w + 1) * 2 * e - w) / 2 : ((2 * e - 2) ** 2 * ((w + 1) * (e * 2 - 2) + w) + 2) / 2
}, U = 2 * Math.PI / 3, W = 2 * Math.PI / 4.5, et = {
  in: (e) => e === 0 ? 0 : e === 1 ? 1 : -(2 ** (10 * e - 10)) * Math.sin((e * 10 - 10.75) * U),
  out: (e) => e === 0 ? 0 : e === 1 ? 1 : 2 ** (-10 * e) * Math.sin((e * 10 - 0.75) * U) + 1,
  inOut: (e) => e === 0 ? 0 : e === 1 ? 1 : e < 0.5 ? -(2 ** (20 * e - 10) * Math.sin((20 * e - 11.125) * W)) / 2 : 2 ** (-20 * e + 10) * Math.sin((20 * e - 11.125) * W) / 2 + 1
}, L = (e) => {
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
}, it = {
  in: (e) => 1 - L(1 - e),
  out: L,
  inOut: (e) => e < 0.5 ? (1 - L(1 - 2 * e)) / 2 : (1 + L(2 * e - 1)) / 2
}, oe = {
  linear: _,
  none: _,
  smooth: D,
  power1: z,
  power2: R,
  power3: H,
  power4: O,
  quad: z,
  cubic: R,
  quart: H,
  quint: O,
  expo: Z,
  sine: J,
  circ: Q,
  back: tt,
  elastic: et,
  bounce: it
}, Ct = {
  power1: z,
  power2: R,
  power3: H,
  power4: O,
  quad: z,
  cubic: R,
  quart: H,
  quint: O,
  expo: Z,
  sine: J,
  circ: Q,
  back: tt,
  elastic: et,
  bounce: it
};
var G;
const Pt = typeof process > "u" || ((G = process.env) == null ? void 0 : G.NODE_ENV) !== "production", F = /* @__PURE__ */ new Set();
function q(e, t) {
  !Pt || F.has(t) || (F.add(t), console.warn(`[emotion-scroll] ${e}`));
}
function st(e) {
  if (typeof e != "string") return e;
  if (e === "none" || e === "linear") return _;
  if (e === "smooth") return D;
  const [t, i = "out"] = e.split("."), s = Ct[t];
  if (!s)
    return q(
      `Unknown easing "${e}". Falling back to linear.`,
      e
    ), _;
  const r = s[i];
  return r || (q(
    `Unknown easing direction "${i}" for "${t}". Expected "in", "out" or "inOut". Falling back to "${t}.out".`,
    e
  ), s.out);
}
const V = f();
function At(e) {
  return typeof e == "object" && e !== null ? {
    enabled: e.enabled ?? !0,
    isSmooth: e.isSmooth ?? !0
  } : {
    enabled: e ?? !0,
    isSmooth: !0
  };
}
function Dt(e = {}) {
  const t = e.orientation ?? "vertical";
  let i = e.duration ?? void 0, s = st(e.easing);
  return typeof i == "number" && typeof s != "function" ? s = D : typeof s == "function" && typeof i != "number" && (i = yt), {
    el: e.el ?? V.documentElement,
    content: e.content ?? e.el ?? V.documentElement,
    orientation: t,
    gestureOrientation: e.gestureOrientation ?? (t === "horizontal" ? "both" : "vertical"),
    smoothWheel: e.smoothWheel ?? !0,
    syncTouch: e.syncTouch ?? !1,
    syncTouchLerp: e.syncTouchLerp ?? Tt,
    touchInertiaExponent: e.touchInertiaExponent ?? wt,
    lerp: e.lerp ?? Et,
    duration: i,
    easing: s,
    touchMultiplier: e.touchMultiplier ?? Mt,
    wheelMultiplier: e.wheelMultiplier ?? Lt,
    maxScrollDelta: e.maxScrollDelta ?? _t,
    scrollbar: At(e.scrollbar),
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
    maxTouchInertia: e.maxTouchInertia ?? Rt,
    anchors: e.anchors
  };
}
const $t = f();
function It(e, t, i, s, r) {
  if (typeof e == "string") {
    if (["top", "left", "start"].includes(e)) return 0 + t;
    if (["bottom", "right", "end"].includes(e)) return i + t;
    const a = $t.querySelector(e);
    return a ? B(a, s, r) + t : null;
  }
  return e instanceof HTMLElement ? B(e, s, r) + t : typeof e == "number" ? e + t : null;
}
function B(e, t, i) {
  const s = e.getBoundingClientRect(), r = t ? "left" : "top", a = getComputedStyle(e), n = parseFloat(t ? a.scrollMarginLeft : a.scrollMarginTop) || 0;
  return s[r] + i - n;
}
const xt = S(), Nt = f();
class Ut {
  constructor(t, i) {
    o(this, "onClick", (t) => {
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
      const r = new URL(s.href), a = new URL(xt.location.href);
      if (r.host !== a.host || r.pathname !== a.pathname || !r.hash) continue;
      const n = r.hash;
      if (!Nt.querySelector(n)) continue;
      t.preventDefault();
      const h = typeof this.host.opts.anchors == "object" ? this.host.opts.anchors : void 0;
      this.host.scrollTo(n, h), history.pushState(null, "", n);
      break;
    }
  }
}
const b = S(), Wt = f(), m = {
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
    o(this, "onKeyDown", (t) => {
      const { host: i } = this;
      if (i.isStopped || i.limit <= 0) return;
      const s = i.opts.keyboardScrollStep;
      let r = null;
      switch (t.key) {
        case m.TAB: {
          const a = Wt.activeElement;
          if (a) {
            const n = a.getBoundingClientRect(), h = i.isHorizontal ? n.left : n.top;
            r = i.animatedScroll + h;
          }
          break;
        }
        case m.UP:
          r = i.targetScroll - s;
          break;
        case m.DOWN:
          r = i.targetScroll + s;
          break;
        case m.LEFT:
          i.isHorizontal && (r = i.targetScroll - s);
          break;
        case m.RIGHT:
          i.isHorizontal && (r = i.targetScroll + s);
          break;
        case m.PAGEUP:
          r = i.targetScroll - (i.isHorizontal ? b.innerWidth : b.innerHeight);
          break;
        case m.PAGEDOWN:
          r = i.targetScroll + (i.isHorizontal ? b.innerWidth : b.innerHeight);
          break;
        case m.HOME:
          r = 0;
          break;
        case m.END:
          r = i.limit;
          break;
      }
      r !== null && i.scrollTo(p(r, 0, i.limit));
    });
    this.host = t;
  }
  init() {
    b.addEventListener("keydown", this.onKeyDown, !1);
  }
  destroy() {
    b.removeEventListener("keydown", this.onKeyDown);
  }
}
const qt = f();
function Vt(e, t, i) {
  var s;
  for (; e && e !== t; ) {
    if ((s = e.hasAttribute) != null && s.call(e, "data-scroll-ignore") || typeof i.prevent == "function" && i.prevent(e))
      return !0;
    e = e.parentElement;
  }
  return !1;
}
class Bt {
  constructor(t) {
    o(this, "vs", null);
    o(this, "onVirtualScroll", (t) => {
      const { host: i } = this, { opts: s } = i, r = t.originalEvent, a = r.type.includes("touch"), n = r.type.includes("wheel");
      if ("ctrlKey" in r && r.ctrlKey || (i.isTouching = r.type === "touchstart" || r.type === "touchmove", Vt(r.target, s.el, s)) || i.isStopped || i.isLocked) return;
      if (!(s.syncTouch && a || s.smoothWheel && n)) {
        i.isScrolling = "native", i.stopAnimation();
        return;
      }
      i.emitVirtualScroll({ deltaX: t.deltaX, deltaY: t.deltaY, event: r });
      let c;
      if (s.gestureOrientation === "both" ? c = Math.abs(t.deltaY) > Math.abs(t.deltaX) ? t.deltaY : t.deltaX : s.gestureOrientation === "horizontal" ? c = t.deltaX : c = t.deltaY, c === 0) return;
      c = -c, n && (c *= s.wheelMultiplier), c = p(c, -s.maxScrollDelta, s.maxScrollDelta);
      const l = a && r.type === "touchend";
      if (l && s.syncTouch) {
        const v = Math.sign(i.velocity) * Math.abs(i.velocity) ** s.touchInertiaExponent;
        c = p(v, -s.maxTouchInertia, s.maxTouchInertia);
      }
      (!s.overscroll || s.infinite || this.isWithinBounds(c)) && "cancelable" in r && r.cancelable && r.preventDefault();
      const u = a && s.syncTouch, d = u && l;
      i.scrollTo(i.targetScroll + c, {
        ...u ? { lerp: d ? s.syncTouchLerp : 1 } : { lerp: s.lerp, duration: s.duration, easing: s.easing }
      });
    });
    this.host = t;
  }
  setup() {
    const { opts: t } = this.host;
    this.vs = new ct({
      el: t.el === qt.documentElement ? void 0 : t.el,
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
    const { animatedScroll: i, limit: s } = this.host;
    return s <= 0 ? !1 : i > 0 && i < s || i === 0 && t > 0 || i === s && t < 0;
  }
}
const M = S();
class Yt {
  constructor(t, i, s) {
    o(this, "isMobile", !1);
    o(this, "onResize", () => {
      if (this.breakpoint == null) return;
      const t = this.isMobile;
      this.isMobile = M.innerWidth < this.breakpoint, t !== this.isMobile && (this.isMobile ? this.onEnter() : this.onLeave());
    });
    this.breakpoint = t, this.onEnter = i, this.onLeave = s, t != null && (this.isMobile = M.innerWidth < t, M.addEventListener("resize", this.onResize));
  }
  destroy() {
    M.removeEventListener("resize", this.onResize);
  }
}
class Xt {
  constructor(t, i) {
    o(this, "guardCounter", 0);
    o(this, "guardTimers", []);
    o(this, "settleTimer", null);
    o(this, "onScroll", () => {
      if (this.settleTimer !== null && (clearTimeout(this.settleTimer), this.settleTimer = null), this.guardCounter > 0) {
        this.guardCounter--;
        return;
      }
      const { host: t } = this;
      if (t.isScrolling !== !1 && t.isScrolling !== "native" || t.opts.infinite) return;
      const i = t.animatedScroll;
      t.animatedScroll = t.targetScroll = t.getActualScroll(), t.lastVelocity = t.velocity, t.velocity = t.animatedScroll - i, t.direction = Math.sign(t.velocity), t.isStopped || (t.isScrolling = "native"), t.onScrollChanged(), t.velocity !== 0 && (this.settleTimer = setTimeout(() => {
        t.lastVelocity = t.velocity, t.velocity = 0, t.isScrolling = !1, t.onScrollChanged();
      }, mt));
    });
    this.wrapper = t, this.host = i, this.wrapper.addEventListener("scroll", this.onScroll, { passive: !0 });
  }
  preventNext() {
    this.guardCounter++;
    const t = setTimeout(() => {
      this.guardCounter > 0 && this.guardCounter--, this.guardTimers = this.guardTimers.filter((i) => i !== t);
    }, ft);
    this.guardTimers.push(t);
  }
  destroy() {
    this.wrapper.removeEventListener("scroll", this.onScroll), this.settleTimer !== null && (clearTimeout(this.settleTimer), this.settleTimer = null);
    for (const t of this.guardTimers) clearTimeout(t);
    this.guardTimers = [], this.guardCounter = 0;
  }
}
const Y = S();
class Kt {
  constructor() {
    o(this, "matches", !1);
    o(this, "query", null);
    o(this, "onChange", (t) => {
      this.matches = t.matches;
    });
    typeof Y.matchMedia == "function" && (this.query = Y.matchMedia("(prefers-reduced-motion: reduce)"), this.matches = this.query.matches, this.query.addEventListener("change", this.onChange));
  }
  destroy() {
    var t;
    (t = this.query) == null || t.removeEventListener("change", this.onChange), this.query = null;
  }
}
const X = S();
class Gt {
  restore() {
    const t = X.localStorage.getItem(x);
    if (t === null) return null;
    const i = Number(t);
    return Number.isNaN(i) ? null : i;
  }
  save(t) {
    X.localStorage.setItem(x, String(t));
  }
}
const K = f();
class jt {
  constructor() {
    o(this, "scrollbar");
  }
  create(t = !1) {
    this.scrollbar = K.createElement("div");
    const i = K.createElement("span");
    return i.className = "scrollbar__thumb", this.scrollbar.appendChild(i), this.scrollbar.classList.add("scrollbar"), t && this.scrollbar.classList.add("scrollbar--horizontal"), this.scrollbar;
  }
  append(t) {
    t.appendChild(this.scrollbar);
  }
  destroy() {
    this.scrollbar.remove();
  }
}
class Zt {
  constructor(t, i = 1e3) {
    o(this, "timer", null);
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
const y = f(), g = {
  start: ["mousedown", "touchstart"],
  move: ["mousemove", "touchmove"],
  end: ["mouseup", "touchend"]
};
class Jt {
  constructor(t, i, s) {
    o(this, "onTrackClick", (t) => {
      if (this.controller.isStopped) return;
      const i = this.pointerToScroll(t.clientX, t.clientY);
      this.controller.scrollTo(i, { immediate: !this.opts.isSmooth });
    });
    o(this, "onStart", (t) => {
      t.preventDefault();
      for (const i of g.move)
        y.documentElement.addEventListener(i, this.onMove);
      this.elements.$thumb.classList.add("active");
    });
    o(this, "onMove", (t) => {
      if (this.controller.isStopped) return;
      let i, s;
      "touches" in t && t.touches.length > 0 ? (i = t.touches[0].clientX, s = t.touches[0].clientY) : (i = t.clientX, s = t.clientY);
      const r = this.pointerToScroll(i, s);
      this.controller.scrollTo(r, { immediate: !this.opts.isSmooth });
    });
    o(this, "onEnd", () => {
      this.elements.$thumb.classList.remove("active");
      for (const t of g.move)
        y.documentElement.removeEventListener(t, this.onMove);
    });
    this.elements = t, this.controller = i, this.opts = s, this.init();
  }
  get isHorizontal() {
    return this.controller.isHorizontal;
  }
  init() {
    for (const t of g.start)
      this.elements.$scrollbar.addEventListener(t, this.onStart, { passive: !1 });
    for (const t of g.end)
      y.documentElement.addEventListener(t, this.onEnd);
    this.elements.$scrollbar.addEventListener("click", this.onTrackClick);
  }
  /** Map a pointer position (relative to track) to a scroll target. */
  pointerToScroll(t, i) {
    const s = this.elements.$scrollbar.getBoundingClientRect(), r = getComputedStyle(this.elements.$scrollbar), a = this.isHorizontal ? t : i;
    let n, h;
    if (this.isHorizontal) {
      const l = parseFloat(r.paddingLeft) || 0, u = parseFloat(r.paddingRight) || 0;
      n = s.left + l, h = s.width - l - u;
    } else {
      const l = parseFloat(r.paddingTop) || 0, u = parseFloat(r.paddingBottom) || 0;
      n = s.top + l, h = s.height - l - u;
    }
    return p((a - n) / h, 0, 1) * this.controller.limit;
  }
  destroy() {
    for (const t of g.start)
      this.elements.$scrollbar.removeEventListener(t, this.onStart);
    for (const t of g.end)
      y.documentElement.removeEventListener(t, this.onEnd);
    for (const t of g.move)
      y.documentElement.removeEventListener(t, this.onMove);
    this.elements.$scrollbar.removeEventListener("click", this.onTrackClick);
  }
}
const Qt = f();
class te {
  constructor(t, i, s) {
    o(this, "$scrollbar");
    o(this, "$thumb");
    o(this, "thumbSize", 0);
    o(this, "thumbMinSize", bt);
    o(this, "cachedPadding", { top: 0, bottom: 0, left: 0, right: 0 });
    o(this, "createScrollbar", new jt());
    o(this, "inactivity");
    o(this, "drag", null);
    o(this, "onMouseEnter", () => {
      this.inactivity.show();
    });
    o(this, "setVisibility", (t) => {
      this.$thumb.classList.toggle("scrolling", t);
    });
    o(this, "onFrame", () => {
      this.$scrollbar.classList.toggle("hidden", this.controller.isStopped), this.updateThumbSize(), this.updateThumbPosition(), this.controller.isScrolling && this.inactivity.show();
    });
    this.controller = t, this.raf = i, this.opts = s, this.inactivity = new Zt(this.setVisibility, pt), this.init();
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
    const i = parseFloat(
      t.getPropertyValue("--es-thumb-min-size")
    );
    Number.isFinite(i) && i >= 0 && (this.thumbMinSize = i);
  }
  /** Inner track size excluding padding. */
  get trackSize() {
    return this.isHorizontal ? this.$scrollbar.clientWidth - this.cachedPadding.left - this.cachedPadding.right : this.$scrollbar.clientHeight - this.cachedPadding.top - this.cachedPadding.bottom;
  }
  init() {
    this.$scrollbar = this.createScrollbar.create(this.isHorizontal), this.$thumb = this.$scrollbar.querySelector(".scrollbar__thumb"), this.createScrollbar.append(Qt.body), this.cacheScrollbarPadding(), this.$scrollbar.addEventListener("mouseenter", this.onMouseEnter), this.drag = new Jt(
      { $scrollbar: this.$scrollbar, $thumb: this.$thumb },
      this.controller,
      this.opts
    ), this.raf.on(this.onFrame);
  }
  updateThumbSize() {
    const t = this.controller.limit;
    if (t <= 0) {
      this.thumbSize = 0, this.$thumb.style[this.isHorizontal ? "width" : "height"] = "0px";
      return;
    }
    const i = this.trackSize, s = i / (i + t), r = Math.min(this.thumbMinSize, i);
    this.thumbSize = p(i * s, r, i), this.$thumb.style[this.isHorizontal ? "width" : "height"] = this.thumbSize + "px";
  }
  updateThumbPosition() {
    const t = this.trackSize - this.thumbSize;
    if (t <= 0) return;
    const r = (p(this.controller.progress, 0, 1) * t).toFixed(2);
    this.isHorizontal ? this.$thumb.style.transform = `translateX(${r}px)` : this.$thumb.style.transform = `translateY(${r}px)`;
  }
  reset() {
    this.updateThumbSize(), this.$thumb.style.transform = this.isHorizontal ? "translateX(0px)" : "translateY(0px)";
  }
  destroy() {
    var t;
    (t = this.drag) == null || t.destroy(), this.drag = null, this.$scrollbar.removeEventListener("mouseenter", this.onMouseEnter), this.createScrollbar.destroy(), this.inactivity.destroy(), this.raf.off(this.onFrame);
  }
}
const A = S();
class ne {
  constructor(t = {}) {
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
    o(this, "_time", 0);
    // --- Dependencies ---
    o(this, "opts");
    o(this, "raf");
    o(this, "animate", new Ht());
    o(this, "emitter", new dt());
    o(this, "dimensions");
    o(this, "nativeScroll");
    o(this, "reducedMotion", new Kt());
    o(this, "mobile");
    o(this, "persistence", new Gt());
    // --- Handlers ---
    o(this, "vsHandler", null);
    o(this, "keyboardHandler", null);
    o(this, "anchorHandler", null);
    o(this, "scrollbar", null);
    o(this, "update", () => {
      const t = performance.now(), i = (t - (this._time || t)) * 1e-3;
      this._time = t, this.animate.advance(i);
    });
    this.opts = Dt(t), this.raf = this.opts.raf || lt, this.dimensions = new kt(this.wrapperElement, this.opts.content, {
      autoResize: this.opts.autoResize
    }), this.animatedScroll = this.targetScroll = this.getActualScroll(), this.opts.el.classList.add("es-smooth"), this.nativeScroll = new Xt(this.wrapperElement, this), this.mobile = new Yt(
      this.opts.breakpoint,
      () => this.teardownDesktopHandlers(),
      () => this.setupDesktopHandlers()
    ), this.mobile.isMobile || this.setupDesktopHandlers(), this.opts.anchors && (this.anchorHandler = new Ut(this, this.wrapperElement), this.anchorHandler.init()), this.opts.useKeyboardSmooth && (this.keyboardHandler = new Ft(this), this.keyboardHandler.init()), this.opts.saveScrollPosition && this.restoreScrollPosition(), this.opts.disabled && this.stop(), this.opts.autoRaf && this.raf.on(this.update);
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
    return this.opts.infinite ? at(this.animatedScroll, this.limit) : this.animatedScroll;
  }
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  get isMobile() {
    return this.mobile.isMobile;
  }
  get wrapperElement() {
    return this.isWindowScroll ? A : this.opts.el;
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
    const { force: s = !1, onStart: r, onComplete: a } = i;
    if ((this._isStopped || this._isLocked) && !s) return;
    const n = this.resolveTarget(t, i.offset ?? 0);
    if (n === null) return;
    if (n === this.targetScroll) {
      r == null || r(this), a == null || a(this);
      return;
    }
    if (i.immediate || this.reducedMotion.matches) {
      this.performImmediate(n, a);
      return;
    }
    this.performAnimated(n, i);
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
    return this.isWindowScroll ? this.isHorizontal ? A.scrollX : A.scrollY : this.isHorizontal ? this.opts.el.scrollLeft : this.opts.el.scrollTop;
  }
  onScrollChanged() {
    this.notifyChange();
  }
  // ---------------------------------------------------------------------------
  // Private — scrollTo pipeline
  // ---------------------------------------------------------------------------
  resolveTarget(t, i) {
    const s = It(
      t,
      i,
      this.limit,
      this.isHorizontal,
      this.animatedScroll
    );
    return s === null ? null : this.opts.infinite ? s : p(s, 0, this.limit);
  }
  performImmediate(t, i) {
    this.animatedScroll = this.targetScroll = t, this.setScroll(this.scroll), this.resetState(), this.nativeScroll.preventNext(), this.notifyChange(), i == null || i(this);
  }
  performAnimated(t, i) {
    const s = i.lerp ?? this.opts.lerp, r = i.duration ?? this.opts.duration, a = i.easing !== void 0 ? st(i.easing) : this.opts.easing, n = i.lock ?? !1;
    this.targetScroll = t, this.animate.fromTo(this.animatedScroll, t, {
      lerp: r ? void 0 : s,
      duration: r,
      easing: a,
      onStart: () => {
        var h;
        n && (this._isLocked = !0), this.isScrolling = "smooth", (h = i.onStart) == null || h.call(i, this);
      },
      onUpdate: (h, c) => {
        var l;
        if (this.isScrolling = "smooth", this.lastVelocity = this.velocity, this.velocity = h - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = h, this.setScroll(this.scroll), !c) {
          this.notifyChange();
          return;
        }
        this.resetState(), this.notifyChange(), (l = i.onComplete) == null || l.call(i, this), this.nativeScroll.preventNext(), this.opts.saveScrollPosition && this.persistence.save(this.animatedScroll);
      }
    });
  }
  // ---------------------------------------------------------------------------
  // Private — DOM / state helpers
  // ---------------------------------------------------------------------------
  get isWindowScroll() {
    return this.opts.el === f().documentElement;
  }
  setScroll(t) {
    this.wrapperElement.scrollTo({
      [this.isHorizontal ? "left" : "top"]: t,
      behavior: "instant"
    });
  }
  setupDesktopHandlers() {
    this.vsHandler || (this.vsHandler = new Bt(this), this.vsHandler.setup()), !this.scrollbar && this.opts.scrollbar.enabled && (this.scrollbar = new te(this, this.raf, this.opts.scrollbar));
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
export {
  ne as default,
  oe as easings,
  st as resolveEasing,
  D as smoothEasing
};
