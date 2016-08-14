"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ResourceBase2 = require("./ResourceBase");

var _ResourceBase3 = _interopRequireDefault(_ResourceBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Shader = function (_ResourceBase) {
    _inherits(Shader, _ResourceBase);

    function Shader(gl, type, sourceCode) {
        _classCallCheck(this, Shader);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Shader).call(this, gl));

        _this.type = type;
        _this.sourceCode = sourceCode;
        _this.valid = false;
        _this.shader = gl.createShader(type);
        if (sourceCode) {
            _this.update(sourceCode);
        }
        return _this;
    }

    _createClass(Shader, [{
        key: "update",
        value: function update(source) {
            this.shader = source;
            this.gl.shaderSource(this.shader, source);
            this.gl.compileShader(this.shader);
            if (!this.gl.getShaderParameter(this.shader, WebGLRenderingContext.COMPILE_STATUS)) {
                throw new Error("Compiling shader failed.\nSourceCode:\n" + this.sourceCode + "\n\nErrorCode:" + this.gl.getShaderInfoLog(this.shader));
            }
            this.valid = true;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            _get(Object.getPrototypeOf(Shader.prototype), "destroy", this).call(this);
            this.gl.deleteShader(this.shader);
        }
    }]);

    return Shader;
}(_ResourceBase3.default);
//# sourceMappingURL=Shader.js.map


exports.default = Shader;