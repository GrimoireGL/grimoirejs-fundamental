"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function StringConverter(val) {
    if (typeof val === "string") {
        return val;
    } else if (typeof val.toString === "function") {
        return val.toString();
    } else {
        throw new Error("The provided object type(" + (typeof val === "undefined" ? "undefined" : _typeof(val)) + ") couldn't be parsed as string. The object should either be 'string' or any object having toString method");
    }
}
exports.default = StringConverter;
//# sourceMappingURL=StringConverter.js.map