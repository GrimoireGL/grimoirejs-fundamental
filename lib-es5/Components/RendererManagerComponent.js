"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Color = require("grimoirejs/lib/Core/Math/Color4");

var _Color2 = _interopRequireDefault(_Color);

var _Component2 = require("grimoirejs/lib/Core/Node/Component");

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RendererManagerComponent = function (_Component) {
    _inherits(RendererManagerComponent, _Component);

    function RendererManagerComponent() {
        _classCallCheck(this, RendererManagerComponent);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(RendererManagerComponent).apply(this, arguments));
    }

    _createClass(RendererManagerComponent, [{
        key: "$mount",
        value: function $mount() {
            var _this2 = this;

            this.tree("goml")("LoopManager").get().register(this.onloop.bind(this), 1000);
            this.gl = this.sharedObject.get("gl");
            var e = this.attributes.get("enabled");
            this._enabled = e.Value;
            e.addObserver(function (a) {
                _this2._enabled = a.Value;
            });
        }
    }, {
        key: "onloop",
        value: function onloop() {
            if (this._enabled) {
                var c = this.attributes.get("bgColor").Value;
                this.gl.clearColor(c.R, c.G, c.B, c.A);
                this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
            }
        }
    }]);

    return RendererManagerComponent;
}(_Component3.default);

exports.default = RendererManagerComponent;

RendererManagerComponent.attributes = {
    enabled: {
        defaultValue: true,
        converter: "boolean"
    },
    bgColor: {
        defaultValue: new _Color2.default(0, 0, 0, 1),
        converter: "color4"
    }
};
//# sourceMappingURL=RendererManagerComponent.js.map