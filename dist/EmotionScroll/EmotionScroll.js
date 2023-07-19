"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const virtual_scroll_1 = __importDefault(require("virtual-scroll"));
const window_ssr_1 = require("../window-ssr");
const utils_1 = require("@emotionagency/utils");
const tinyemitter_1 = __importDefault(require("tiny-emitter/dist/tinyemitter"));
const opts_1 = require("./opts");
const keyCodes_1 = require("./keyCodes");
const State_1 = require("./State");
const Scrollbar_1 = __importDefault(require("./Scrollbar"));
const window = (0, window_ssr_1.getWindow)();
const document = (0, window_ssr_1.getDocument)();
class EmotionScroll {
    constructor(opts) {
        this._disabled = false;
        this.isMobile = false;
        this.scrollTop = 0;
        this.max = 0;
        this.min = 0;
        this.opts = (0, opts_1.getOpts)(opts);
        this.state = new State_1.State();
        this._raf = this.opts.raf || utils_1.raf;
        this.emitter = new tinyemitter_1.default();
        this.init();
    }
    bounds() {
        this.update = this.update.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onResize = this.onResize.bind(this);
    }
    init() {
        this.bounds();
        if (this.opts.saveScrollPosition) {
            this.disabled = true;
            this.opts.el.scrollTop = +window.localStorage.getItem('ess') || 0;
            this.scrollTop = this.opts.el.scrollTop;
            this.state.vsPosition = this.opts.el.scrollTop;
            this.state.position = this.opts.el.scrollTop;
        }
        this.disabled = this.opts.disabled;
        if (this.opts.useKeyboard) {
            window.addEventListener('keydown', this.onKeyDown, false);
        }
        utils_1.resize.on(this.onResize);
        this._raf.on(this.update);
    }
    onResize() {
        if (this.opts.breakpoint) {
            this.isMobile = window.innerWidth < this.opts.breakpoint;
        }
        if (this.isMobile) {
            this.vs && this.vs.destroy();
            this.vs = null;
            this.scrollbar && this.scrollbar.destroy();
            this.scrollbar = null;
        }
        if (!this.isMobile && !this.vs) {
            this.setupVirtualScroll();
        }
        if (!this.isMobile && !this.scrollbar && this.opts.scrollbar) {
            this.scrollbar = new Scrollbar_1.default(this.opts.el, this.state, this._raf);
        }
    }
    detectScrolling() {
        const dif = Math.abs(Math.round(this.state.vsPosition) - Math.round(this.state.position));
        if (dif >= 1 || this.state.isScrollbarVisible) {
            this.state.isScrolling = true;
        }
        else {
            this.state.isScrolling = false;
        }
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = val;
        this.state.disabled = val;
        if (val) {
            this.opts.el.classList.add('e-fixed');
        }
        else {
            this.opts.el.classList.remove('e-fixed');
        }
    }
    get maxValue() {
        return this.opts.el.scrollHeight - window.innerHeight;
    }
    get canScroll() {
        return !this.disabled && this.opts.el.scrollHeight > window.innerHeight;
    }
    setupVirtualScroll() {
        this.vs = new virtual_scroll_1.default(Object.assign(Object.assign({}, this.opts), { useKeyboard: false }));
        this.vs.on((e) => {
            if (this.disabled) {
                return;
            }
            const delta = (0, utils_1.clamp)(e.deltaY, -this.opts.maxScrollDelta, this.opts.maxScrollDelta);
            this.state.vsPosition -= delta * this.opts.stepSize;
            this.state.vsPosition = (0, utils_1.clamp)(this.state.vsPosition, this.min, this.max);
            if (this.opts.saveScrollPosition) {
                localStorage.setItem('ess', String(this.state.vsPosition));
            }
        });
    }
    on(cb) {
        this.emitter.on('update', (vars) => {
            cb(vars);
        });
    }
    update() {
        this.detectScrolling();
        this.max = this.maxValue;
        if (this.disabled) {
            return;
        }
        this.state.position = (0, utils_1.lerp)(this.state.position, this.state.vsPosition, this.opts.friction);
        this.state.position = Math.round(this.state.position * 100) / 100;
        if (this.state.isScrolling) {
            this.emitter.emit('update', {
                position: this.state.position,
                direction: this.state.vsPosition > this.state.position ? 1 : -1,
                velocity: this.state.vsPosition - this.state.position,
                progress: this.state.position / this.max,
            });
        }
        if (this.scrollTop !== this.opts.el.scrollTop) {
            this.state.vsPosition = this.opts.el.scrollTop;
            this.scrollTop = this.opts.el.scrollTop;
            if (this.opts.saveScrollPosition) {
                localStorage.setItem('ess', String(this.state.vsPosition));
            }
            return;
        }
        if (this.isMobile) {
            this.state.vsPosition = this.opts.el.scrollTop;
            return;
        }
        this.opts.el.scrollTop = this.state.position;
        this.scrollTop = this.opts.el.scrollTop;
    }
    onKeyDown(e) {
        if (this.canScroll) {
            switch (e.key) {
                case keyCodes_1.keyCodes.TAB:
                    this.state.vsPosition =
                        document.activeElement.getBoundingClientRect().y;
                    break;
                case keyCodes_1.keyCodes.UP:
                    this.state.vsPosition -= 240;
                    break;
                case keyCodes_1.keyCodes.DOWN:
                    this.state.vsPosition += 240;
                    break;
                case keyCodes_1.keyCodes.PAGEUP:
                    this.state.vsPosition -= window.innerHeight;
                    break;
                case keyCodes_1.keyCodes.PAGEDOWN:
                    this.state.vsPosition += window.innerHeight;
                    break;
                case keyCodes_1.keyCodes.HOME:
                    this.state.vsPosition = this.min;
                    break;
                case keyCodes_1.keyCodes.END:
                    this.state.vsPosition = this.max;
                    break;
                default:
                    return;
            }
        }
        this.state.vsPosition = (0, utils_1.clamp)(this.state.vsPosition, this.min, this.max);
    }
    reset() {
        var _a;
        this.state.vsPosition = 0;
        this.state.position = 0;
        this.opts.el.scrollTop = 0;
        this.scrollTop = this.opts.el.scrollTop;
        (_a = this.scrollbar) === null || _a === void 0 ? void 0 : _a.reset();
    }
    destroy() {
        this._raf.off(this.update);
        this.vs && this.vs.destroy();
        utils_1.resize.off(this.onResize);
        this.scrollbar && this.scrollbar.destroy();
        window.removeEventListener('keydown', this.onKeyDown);
    }
}
exports.default = EmotionScroll;
//# sourceMappingURL=EmotionScroll.js.map