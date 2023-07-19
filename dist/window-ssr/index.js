"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = exports.ssrWindow = exports.getWindow = exports.ssrDocument = exports.getDocument = void 0;
const document_1 = require("./document");
Object.defineProperty(exports, "getDocument", { enumerable: true, get: function () { return document_1.getDocument; } });
Object.defineProperty(exports, "ssrDocument", { enumerable: true, get: function () { return document_1.ssrDocument; } });
const window_1 = require("./window");
Object.defineProperty(exports, "getWindow", { enumerable: true, get: function () { return window_1.getWindow; } });
Object.defineProperty(exports, "ssrWindow", { enumerable: true, get: function () { return window_1.ssrWindow; } });
const extend_1 = __importDefault(require("./extend"));
exports.extend = extend_1.default;
//# sourceMappingURL=index.js.map