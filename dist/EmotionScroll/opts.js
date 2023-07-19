"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpts = void 0;
const window_ssr_1 = require("../window-ssr");
const document = (0, window_ssr_1.getDocument)();
const getOpts = (opts) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    return {
        el: (_a = opts === null || opts === void 0 ? void 0 : opts.el) !== null && _a !== void 0 ? _a : document.documentElement,
        touchMultiplier: (_b = opts === null || opts === void 0 ? void 0 : opts.touchMultiplier) !== null && _b !== void 0 ? _b : 3.8,
        firefoxMultiplier: (_c = opts === null || opts === void 0 ? void 0 : opts.firefoxMultiplier) !== null && _c !== void 0 ? _c : 40,
        preventTouch: (_d = opts === null || opts === void 0 ? void 0 : opts.preventTouch) !== null && _d !== void 0 ? _d : true,
        scrollbar: (_e = opts === null || opts === void 0 ? void 0 : opts.scrollbar) !== null && _e !== void 0 ? _e : true,
        friction: (_f = opts === null || opts === void 0 ? void 0 : opts.friction) !== null && _f !== void 0 ? _f : 0.08,
        stepSize: (_g = opts === null || opts === void 0 ? void 0 : opts.stepSize) !== null && _g !== void 0 ? _g : 1,
        breakpoint: (_h = opts === null || opts === void 0 ? void 0 : opts.breakpoint) !== null && _h !== void 0 ? _h : null,
        passive: (_j = opts === null || opts === void 0 ? void 0 : opts.passive) !== null && _j !== void 0 ? _j : false,
        useKeyboard: (_k = opts === null || opts === void 0 ? void 0 : opts.useKeyboard) !== null && _k !== void 0 ? _k : true,
        disabled: (_l = opts === null || opts === void 0 ? void 0 : opts.disabled) !== null && _l !== void 0 ? _l : false,
        raf: (_m = opts === null || opts === void 0 ? void 0 : opts.raf) !== null && _m !== void 0 ? _m : null,
        maxScrollDelta: (_o = opts === null || opts === void 0 ? void 0 : opts.maxScrollDelta) !== null && _o !== void 0 ? _o : 120,
        saveScrollPosition: (_p = opts === null || opts === void 0 ? void 0 : opts.saveScrollPosition) !== null && _p !== void 0 ? _p : false,
    };
};
exports.getOpts = getOpts;
//# sourceMappingURL=opts.js.map