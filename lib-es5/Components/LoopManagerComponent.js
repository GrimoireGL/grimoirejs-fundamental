"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("grimoirejs/lib/Core/Node/Component");

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoopManagerComponent = function (_Component) {
    _inherits(LoopManagerComponent, _Component);

    function LoopManagerComponent() {
        var _Object$getPrototypeO;

        _classCallCheck(this, LoopManagerComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(LoopManagerComponent)).call.apply(_Object$getPrototypeO, [this].concat(args)));

        _this._loopActions = [];
        return _this;
    }

    _createClass(LoopManagerComponent, [{
        key: "$awake",
        value: function $awake() {
            var _this2 = this;

            this.attributes.get("loopEnabled").addObserver(function (attr) {
                _this2._begin();
            });
            this._registerNextLoop = window.requestAnimationFrame // if window.requestAnimationFrame is defined or undefined
            ? function () {
                window.requestAnimationFrame(_this2._loop.bind(_this2));
            } : function () {
                window.setTimeout(_this2._loop.bind(_this2), 1000 / 60);
            };
        }
    }, {
        key: "register",
        value: function register(action, priorty) {
            this._loopActions.push({
                action: action,
                priorty: priorty
            });
            this._loopActions.sort(function (a, b) {
                return a.priorty - b.priorty;
            });
        }
    }, {
        key: "_begin",
        value: function _begin() {
            this._registerNextLoop();
        }
    }, {
        key: "_loop",
        value: function _loop() {
            this._loopActions.forEach(function (a) {
                return a.action();
            });
            this._registerNextLoop();
        }
    }]);

    return LoopManagerComponent;
}(_Component3.default);

LoopManagerComponent.attributes = {
    loopEnabled: {
        defaultValue: false,
        converter: "boolean"
    }
};
exports.default = LoopManagerComponent;
//# sourceMappingURL=LoopManagerComponent.js.map