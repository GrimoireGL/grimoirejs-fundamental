"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AssetLoader = require("../Asset/AssetLoader");

var _AssetLoader2 = _interopRequireDefault(_AssetLoader);

var _Component2 = require("grimoirejs/lib/Core/Node/Component");

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};

var AssetLoadingManagerComponent = function (_Component) {
    _inherits(AssetLoadingManagerComponent, _Component);

    function AssetLoadingManagerComponent() {
        var _Object$getPrototypeO;

        _classCallCheck(this, AssetLoadingManagerComponent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(AssetLoadingManagerComponent)).call.apply(_Object$getPrototypeO, [this].concat(args)));

        _this.loader = new _AssetLoader2.default();
        return _this;
    }

    _createClass(AssetLoadingManagerComponent, [{
        key: "$treeInitialized",
        value: function $treeInitialized() {
            if (this.attributes.get("autoStart").Value) {
                this._autoStart();
            }
            this._documentResolver();
        }
    }, {
        key: "$awake",
        value: function $awake() {
            var _this2 = this;

            this.loader.register(new Promise(function (resolve) {
                _this2._documentResolver = resolve;
            }));
        }
    }, {
        key: "_autoStart",
        value: function _autoStart() {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.loader.promise;

                            case 2:
                                this.tree("goml").attr("loopEnabled", true);

                            case 3:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }]);

    return AssetLoadingManagerComponent;
}(_Component3.default);

exports.default = AssetLoadingManagerComponent;

AssetLoadingManagerComponent.attributes = {
    loadingProgress: {
        defaultValue: 0,
        converter: "number"
    },
    autoStart: {
        defaultValue: true,
        converter: "boolean"
    }
};
//# sourceMappingURL=AssetLoadingManagerComponent.js.map