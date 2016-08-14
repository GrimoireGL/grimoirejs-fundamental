"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("grimoirejs/lib/Core/Node/Component");

var _Component3 = _interopRequireDefault(_Component2);

var _grimoirejs = require("grimoirejs");

var _grimoirejs2 = _interopRequireDefault(_grimoirejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ns = _grimoirejs2.default.ns("HTTP://GRIMOIRE.GL/NS/DEFAULT");

var CanvasInitializerComponent = function (_Component) {
    _inherits(CanvasInitializerComponent, _Component);

    function CanvasInitializerComponent() {
        _classCallCheck(this, CanvasInitializerComponent);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CanvasInitializerComponent).apply(this, arguments));
    }

    _createClass(CanvasInitializerComponent, [{
        key: "$treeInitializing",
        value: function $treeInitializing(c) {
            if (this._isContainedInBody(c)) {
                // canvas should be placed siblings of the script tag
                this._generateCanvas(c.parentElement);
            } else {}
        }
        /**
         * Generate canvas element
         * @param  {Element}           parent [description]
         * @return {HTMLCanvasElement}        [description]
         */

    }, {
        key: "_generateCanvas",
        value: function _generateCanvas(parent) {
            var generatedCanvas = document.createElement("canvas");
            generatedCanvas.width = this.attributes.get("width").Value;
            generatedCanvas.height = this.attributes.get("height").Value;
            this.sharedObject.set(ns("gl"), this._getContext(generatedCanvas));
            parent.appendChild(generatedCanvas);
            return generatedCanvas;
        }
    }, {
        key: "_getContext",
        value: function _getContext(canvas) {
            var context = canvas.getContext("webgl");
            if (!context) {
                context = canvas.getContext("webgl-experimental");
            }
            return context;
        }
        /**
         * Check the tag is included in the body
         * @param  {Element} tag [description]
         * @return {boolean}     [description]
         */

    }, {
        key: "_isContainedInBody",
        value: function _isContainedInBody(tag) {
            if (!tag.parentElement) return false;
            if (tag.parentNode.nodeName === "BODY") return true;
            return this._isContainedInBody(tag.parentElement);
        }
    }]);

    return CanvasInitializerComponent;
}(_Component3.default);

CanvasInitializerComponent.attributes = {
    width: {
        defaultValue: 640,
        converter: "number"
    },
    height: {
        defaultValue: 480,
        converter: "number"
    }
};
exports.default = CanvasInitializerComponent;
//# sourceMappingURL=CanvasInitializerComponent.js.map