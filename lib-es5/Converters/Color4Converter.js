"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Color = require("grimoirejs/lib/Core/Math/Color4");

var _Color2 = _interopRequireDefault(_Color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Color4Converter(val) {
    if (val instanceof _Color2.default) {
        return val;
    }
    return _Color2.default.parse(val);
}
exports.default = Color4Converter;
//# sourceMappingURL=Color4Converter.js.map