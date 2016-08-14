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

var Texture2D = function (_ResourceBase) {
    _inherits(Texture2D, _ResourceBase);

    function Texture2D(gl) {
        _classCallCheck(this, Texture2D);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Texture2D).call(this, gl));

        _this.valid = false;
        _this.texture = gl.createTexture();
        return _this;
    }

    _createClass(Texture2D, [{
        key: "update",
        value: function update(levelOrImage, widthOrFlipY, height, border, format, type, pixels, flipYForBuffer) {
            this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
            var flipY = false;
            var image = void 0;
            var width = void 0;
            var level = void 0;
            if (typeof height === "undefined") {
                flipY = widthOrFlipY ? true : false;
                image = levelOrImage;
            } else {
                level = levelOrImage;
                width = widthOrFlipY;
            }
            this.gl.pixelStorei(WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL, flipY ? 1 : 0);
            if (typeof height === "undefined") {
                this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, image);
            } else {
                this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, level, format, width, height, border, format, type, pixels);
            }
        }
    }, {
        key: "destroy",
        value: function destroy() {
            _get(Object.getPrototypeOf(Texture2D.prototype), "destroy", this).call(this);
            this.gl.deleteTexture(this.texture);
        }
    }]);

    return Texture2D;
}(_ResourceBase3.default);
//# sourceMappingURL=Texture2D.js.map


exports.default = Texture2D;