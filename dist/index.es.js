var _ = Object.defineProperty;
var O = (t, e, s) => e in t ? _(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var i = (t, e, s) => O(t, typeof e != "symbol" ? e + "" : e, s);
import V from "virtual-scroll";
import { clamp as y, raf as k, resize as x, lerp as A } from "@emotionagency/utils";
function D(t) {
  return t !== null && typeof t == "object" && "constructor" in t && t.constructor === Object;
}
function P(t = {}, e = {}) {
  Object.keys(e).forEach((s) => {
    typeof t[s] > "u" ? t[s] = e[s] : D(e[s]) && D(t[s]) && Object.keys(e[s]).length > 0 && P(t[s], e[s]);
  });
}
const H = {
  body: {},
  addEventListener() {
  },
  removeEventListener() {
  },
  activeElement: {
    blur() {
    },
    nodeName: ""
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return {
      initEvent() {
      }
    };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {
      },
      getElementsByTagName() {
        return [];
      }
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  }
};
function b() {
  const t = typeof document < "u" ? document : {};
  return P(t, H), t;
}
const N = {
  document: H,
  navigator: {
    userAgent: ""
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  },
  history: {
    replaceState() {
    },
    pushState() {
    },
    go() {
    },
    back() {
    }
  },
  CustomEvent: function() {
    return this;
  },
  addEventListener() {
  },
  removeEventListener() {
  },
  getComputedStyle() {
    return {
      getPropertyValue() {
        return "";
      }
    };
  },
  Image() {
  },
  Date() {
  },
  screen: {},
  setTimeout() {
  },
  clearTimeout() {
  },
  matchMedia() {
    return {};
  },
  requestAnimationFrame(t) {
    return typeof setTimeout > "u" ? (t(), null) : setTimeout(t, 0);
  },
  cancelAnimationFrame(t) {
    typeof setTimeout > "u" || clearTimeout(t);
  }
};
function w() {
  const t = typeof window < "u" ? window : {};
  return P(t, N), t;
}
function q(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function g(t) {
  throw new Error('Could not dynamically require "' + t + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var M = { exports: {} };
(function(t, e) {
  (function(s) {
    t.exports = s();
  })(function() {
    return function s(o, f, d) {
      function l(r, h) {
        if (!f[r]) {
          if (!o[r]) {
            var c = typeof g == "function" && g;
            if (!h && c) return c(r, !0);
            if (a) return a(r, !0);
            var p = new Error("Cannot find module '" + r + "'");
            throw p.code = "MODULE_NOT_FOUND", p;
          }
          var E = f[r] = { exports: {} };
          o[r][0].call(E.exports, function($) {
            var T = o[r][1][$];
            return l(T || $);
          }, E, E.exports, s, o, f, d);
        }
        return f[r].exports;
      }
      for (var a = typeof g == "function" && g, n = 0; n < d.length; n++) l(d[n]);
      return l;
    }({ 1: [function(s, o, f) {
      function d() {
      }
      d.prototype = {
        on: function(l, a, n) {
          var r = this.e || (this.e = {});
          return (r[l] || (r[l] = [])).push({
            fn: a,
            ctx: n
          }), this;
        },
        once: function(l, a, n) {
          var r = this;
          function h() {
            r.off(l, h), a.apply(n, arguments);
          }
          return h._ = a, this.on(l, h, n);
        },
        emit: function(l) {
          var a = [].slice.call(arguments, 1), n = ((this.e || (this.e = {}))[l] || []).slice(), r = 0, h = n.length;
          for (r; r < h; r++)
            n[r].fn.apply(n[r].ctx, a);
          return this;
        },
        off: function(l, a) {
          var n = this.e || (this.e = {}), r = n[l], h = [];
          if (r && a)
            for (var c = 0, p = r.length; c < p; c++)
              r[c].fn !== a && r[c].fn._ !== a && h.push(r[c]);
          return h.length ? n[l] = h : delete n[l], this;
        }
      }, o.exports = d, o.exports.TinyEmitter = d;
    }, {}] }, {}, [1])(1);
  });
})(M);
var z = M.exports;
const C = /* @__PURE__ */ q(z), I = b(), K = (t) => ({
  el: (t == null ? void 0 : t.el) ?? I.documentElement,
  touchMultiplier: (t == null ? void 0 : t.touchMultiplier) ?? 3.8,
  firefoxMultiplier: (t == null ? void 0 : t.firefoxMultiplier) ?? 40,
  preventTouch: (t == null ? void 0 : t.preventTouch) ?? !0,
  scrollbar: (t == null ? void 0 : t.scrollbar) ?? !0,
  friction: (t == null ? void 0 : t.friction) ?? 0.08,
  stepSize: (t == null ? void 0 : t.stepSize) ?? 1,
  breakpoint: (t == null ? void 0 : t.breakpoint) ?? null,
  passive: (t == null ? void 0 : t.passive) ?? !1,
  useKeyboard: (t == null ? void 0 : t.useKeyboard) ?? !0,
  disabled: (t == null ? void 0 : t.disabled) ?? !1,
  raf: (t == null ? void 0 : t.raf) ?? null,
  maxScrollDelta: (t == null ? void 0 : t.maxScrollDelta) ?? 120,
  saveScrollPosition: (t == null ? void 0 : t.saveScrollPosition) ?? !1
}), m = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  TAB: "Tab",
  PAGEUP: "PageUp",
  PAGEDOWN: "PageDown",
  HOME: "Home",
  END: "End"
};
class R {
  constructor() {
    i(this, "isScrolling");
    i(this, "vsPosition");
    i(this, "isScrollbarVisible");
    i(this, "position");
    i(this, "disabled");
    i(this, "velocity");
    this.isScrolling = !1, this.vsPosition = 0, this.isScrollbarVisible = !1, this.position = 0, this.disabled = !1, this.velocity = 0;
  }
}
const S = b();
class U {
  constructor() {
    i(this, "scrollbar");
  }
  create() {
    return this.scrollbar = S.createElement("div"), this.scrollbar.innerHTML = '<span class="scrollbar__thumb"></span>', S.querySelector(".scrollbar") ? (this.scrollbar.classList.add("scrollbar", "block-scrollbar"), this.scrollbar) : (this.scrollbar.classList.add("scrollbar"), this.scrollbar);
  }
  append(e) {
    if (e) {
      if (!e.parentElement) {
        S.body.appendChild(this.scrollbar);
        return;
      }
      e.appendChild(this.scrollbar);
    }
  }
  destroy() {
    this.scrollbar.parentElement.removeChild(this.scrollbar);
  }
}
class W {
  constructor(e) {
    i(this, "inactiveDelay", 1);
    i(this, "timer", 0);
    i(this, "ticker");
    i(this, "interval");
    this.cb = e, this.detect = this.detect.bind(this), this.intervals();
  }
  get compare() {
    return !(this.timer >= this.inactiveDelay);
  }
  detect() {
    this.cb(this.compare);
  }
  intervals() {
    this.ticker = setInterval(() => {
      this.timer++;
    }, 1e3), this.interval = setInterval(this.detect, 120);
  }
  reset() {
    this.timer = 0;
  }
  destroy() {
    clearInterval(this.ticker), clearInterval(this.interval);
  }
}
const j = w(), v = b();
class F {
  constructor(e, s) {
    i(this, "events", {
      start: ["mousedown", "touchstart"],
      move: ["mousemove", "touchmove"],
      end: ["mouseup", "touchend"]
    });
    this.options = e, this.state = s, this.bounds(), this.init();
  }
  bounds() {
    ["start", "update", "end"].forEach((s) => this[s] = this[s].bind(this));
  }
  init() {
    this.events.start.forEach((e) => {
      this.options.$scrollbar.addEventListener(e, this.start, {
        passive: !1
      });
    }), this.events.end.forEach((e) => {
      v.documentElement.addEventListener(e, this.end);
    }), screen.width > 960 && this.options.$scrollbar.addEventListener("click", this.update);
  }
  get sizes() {
    const e = this.options.$el.scrollHeight, s = j.innerHeight, o = e - s;
    return {
      height: e,
      max: o
    };
  }
  compute(e) {
    const s = this.options.$scrollbar.offsetHeight;
    this.state.isScrollbarVisible = !0;
    const o = y(this.sizes.height * (e / s), 0, this.sizes.max);
    this.state.vsPosition = o, setTimeout(() => this.state.isScrollbarVisible = !1, 0);
  }
  update(e) {
    var s;
    if (!this.state.disabled) {
      const o = e.clientY || ((s = e.targetTouches[0]) == null ? void 0 : s.clientY);
      this.compute(o);
    }
  }
  start() {
    this.events.move.forEach((e) => {
      v.documentElement.addEventListener(e, this.update);
    }), this.options.$thumb.classList.add("active");
  }
  end() {
    this.state.isScrollbarVisible = !1, this.options.$thumb.classList.remove("active"), this.events.move.forEach((e) => {
      v.documentElement.removeEventListener(e, this.update);
    });
  }
  destroy() {
    this.events.start.forEach((e) => {
      this.options.$scrollbar.removeEventListener(e, this.start);
    }), this.events.end.forEach((e) => {
      v.documentElement.removeEventListener(e, this.end);
    }), this.events.move.forEach((e) => {
      v.documentElement.removeEventListener(e, this.update);
    }), this.options.$scrollbar.removeEventListener("click", this.update);
  }
}
const B = w(), L = b();
class Y {
  constructor(e, s, o) {
    i(this, "$scrollbar");
    i(this, "$thumb");
    i(this, "height");
    i(this, "max");
    i(this, "createScrollbar");
    i(this, "inactivity");
    i(this, "onDrag");
    i(this, "disconnect");
    this.$el = e, this.state = s, this.raf = o, this.$el = e || L.querySelector("#scroll-container"), this.bounds(), this.createScrollbar = new U(), this.inactivity = new W(this.setVisibility), this.init();
  }
  bounds() {
    ["setHeight", "move", "setVisibility"].forEach((s) => this[s] = this[s].bind(this));
  }
  init() {
    this.$scrollbar = this.createScrollbar.create(), this.$thumb = this.$scrollbar.querySelector(".scrollbar__thumb"), this.createScrollbar.append(this.$el), this.$scrollbar.addEventListener("mouseenter", this.inactivity.reset), this.raf.on(this.move), this.drag();
  }
  setHeight() {
    this.height = this.$el.scrollHeight;
    const e = B.innerHeight;
    let s = e * (e / this.height);
    this.max = this.height - e, this.height === e && (s = 0), this.$thumb.style.height = s + "px";
  }
  setVisibility(e) {
    if (!e) {
      this.$thumb.classList.remove("scrolling");
      return;
    }
    this.$thumb.classList.add("scrolling");
  }
  move() {
    if (this.state.disabled ? this.$scrollbar.classList.add("hidden") : this.$scrollbar.classList.remove("hidden"), this.state.isScrolling) {
      const e = L.documentElement.clientHeight;
      this.$thumb.classList.add("scrolling");
      const o = 100 * this.state.position / (this.height - e);
      this.$thumb.style.top = o.toFixed(2) + "%", this.$thumb.style.transform = `translateY(-${o.toFixed(2)}%)`;
    }
    this.setHeight();
  }
  reset() {
    this.setHeight(), this.$thumb.style.top = "0%", this.$thumb.style.transform = "translateY(0%)";
  }
  drag() {
    this.onDrag = new F(
      {
        $el: this.$el,
        $thumb: this.$thumb,
        $scrollbar: this.$scrollbar
      },
      this.state
    );
  }
  destroy() {
    this.onDrag && this.onDrag.destroy(), this.$scrollbar && this.$scrollbar.removeEventListener("mouseenter", this.inactivity.reset), this.createScrollbar && this.createScrollbar.destroy(), this.inactivity && this.inactivity.destroy();
  }
}
const u = w(), G = b();
function J(t) {
  for (; t; ) {
    if (t.dataset.scrollIgnore) return !0;
    t = t.parentElement;
  }
  return !1;
}
class tt {
  constructor(e) {
    i(this, "vs");
    i(this, "scrollbar");
    i(this, "emitter");
    i(this, "opts");
    i(this, "state");
    i(this, "_disabled", !1);
    i(this, "isMobile", !1);
    i(this, "scrollTop", 0);
    i(this, "_raf");
    i(this, "max", 0);
    i(this, "min", 0);
    this.opts = K(e), this.state = new R(), this._raf = this.opts.raf || k, this.emitter = new C(), this.init();
  }
  bounds() {
    this.update = this.update.bind(this), this.onKeyDown = this.onKeyDown.bind(this), this.onResize = this.onResize.bind(this);
  }
  init() {
    this.bounds(), this.opts.saveScrollPosition && (this.disabled = !0, this.opts.el.scrollTop = +u.localStorage.getItem("ess") || 0, this.scrollTop = this.opts.el.scrollTop, this.state.vsPosition = this.opts.el.scrollTop, this.state.position = this.opts.el.scrollTop), this.disabled = this.opts.disabled, this.opts.useKeyboard && u.addEventListener("keydown", this.onKeyDown, !1), x.on(this.onResize), this._raf.on(this.update);
  }
  onResize() {
    this.opts.breakpoint && (this.isMobile = u.innerWidth < this.opts.breakpoint), this.isMobile && (this.vs && this.vs.destroy(), this.vs = null, this.scrollbar && this.scrollbar.destroy(), this.scrollbar = null), !this.isMobile && !this.vs && this.setupVirtualScroll(), !this.isMobile && !this.scrollbar && this.opts.scrollbar && (this.scrollbar = new Y(this.opts.el, this.state, this._raf));
  }
  detectScrolling() {
    Math.abs(
      Math.round(this.state.vsPosition) - Math.round(this.state.position)
    ) >= 1 || this.state.isScrollbarVisible ? this.state.isScrolling = !0 : this.state.isScrolling = !1;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(e) {
    this._disabled = e, this.state.disabled = e, e ? (this.opts.el.classList.add("e-fixed"), this.state.vsPosition = this.scrollTop, this.state.position = this.scrollTop, this.state.velocity = 0) : this.opts.el.classList.remove("e-fixed");
  }
  get maxValue() {
    return this.opts.el.scrollHeight - u.innerHeight;
  }
  get canScroll() {
    return !this.disabled && this.opts.el.scrollHeight > u.innerHeight;
  }
  setupVirtualScroll() {
    this.vs = new V({ ...this.opts, useKeyboard: !1 }), this.vs.on((e) => {
      if (this.disabled || J(e.originalEvent.target))
        return;
      const s = y(
        e.deltaY,
        -this.opts.maxScrollDelta,
        this.opts.maxScrollDelta
      );
      this.state.vsPosition -= s * this.opts.stepSize, this.state.vsPosition = y(this.state.vsPosition, this.min, this.max), this.opts.saveScrollPosition && localStorage.setItem("ess", String(this.state.vsPosition));
    });
  }
  on(e) {
    this.emitter.on("update", (s) => {
      e(s);
    });
  }
  update() {
    if (this.detectScrolling(), this.max = this.maxValue, !this.disabled) {
      if (this.state.position = A(
        this.state.position,
        this.state.vsPosition,
        this.opts.friction
      ), this.state.position = Math.round(this.state.position * 100) / 100, this.state.velocity = this.state.vsPosition - this.state.position, this.state.isScrolling && this.emitter.emit("update", {
        position: this.state.position,
        direction: this.state.vsPosition > this.state.position ? 1 : -1,
        velocity: this.state.velocity,
        progress: this.state.position / this.max
      }), this.scrollTop !== this.opts.el.scrollTop) {
        this.state.vsPosition = this.opts.el.scrollTop, this.scrollTop = this.opts.el.scrollTop, this.opts.saveScrollPosition && localStorage.setItem("ess", String(this.state.vsPosition));
        return;
      }
      if (this.isMobile) {
        this.state.vsPosition = this.opts.el.scrollTop;
        return;
      }
      this.opts.el.scrollTop = this.state.position, this.scrollTop = this.opts.el.scrollTop;
    }
  }
  onKeyDown(e) {
    if (this.canScroll)
      switch (e.key) {
        case m.TAB:
          this.state.vsPosition = G.activeElement.getBoundingClientRect().y;
          break;
        case m.UP:
          this.state.vsPosition -= 240;
          break;
        case m.DOWN:
          this.state.vsPosition += 240;
          break;
        case m.PAGEUP:
          this.state.vsPosition -= u.innerHeight;
          break;
        case m.PAGEDOWN:
          this.state.vsPosition += u.innerHeight;
          break;
        case m.HOME:
          this.state.vsPosition = this.min;
          break;
        case m.END:
          this.state.vsPosition = this.max;
          break;
        default:
          return;
      }
    this.state.vsPosition = y(this.state.vsPosition, this.min, this.max);
  }
  reset() {
    var e;
    this.state.vsPosition = 0, this.state.position = 0, this.opts.el.scrollTop = 0, this.scrollTop = this.opts.el.scrollTop, (e = this.scrollbar) == null || e.reset();
  }
  destroy() {
    this._raf.off(this.update), this.vs && this.vs.destroy(), x.off(this.onResize), this.scrollbar && this.scrollbar.destroy(), u.removeEventListener("keydown", this.onKeyDown);
  }
}
export {
  tt as default
};
