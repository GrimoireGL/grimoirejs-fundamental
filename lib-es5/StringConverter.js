"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function StringConverter(input) {
    if (typeof input === "string") {
        return input;
    } else if (typeof input.toString === "function") {
        return input.toString();
    } else {
        throw new Error("The provided object type(" + (typeof input === "undefined" ? "undefined" : _typeof(input)) + ") couldn't be parsed as string. The object should either be 'string' or any object having toString method");
    }
}
exports.default = StringConverter;