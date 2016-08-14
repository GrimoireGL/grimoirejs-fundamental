"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EEObject2 = require("grimoirejs/lib/Core/Base/EEObject");

var _EEObject3 = _interopRequireDefault(_EEObject2);

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

var AssetLoader = function (_EEObject) {
    _inherits(AssetLoader, _EEObject);

    function AssetLoader() {
        var _Object$getPrototypeO;

        _classCallCheck(this, AssetLoader);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(AssetLoader)).call.apply(_Object$getPrototypeO, [this].concat(args)));

        _this.registerCount = 0;
        _this.loadCount = 0;
        _this.completeCount = 0;
        _this.errorCount = 0;
        _this.promise = new Promise(function (resolve) {
            _this._resolve = resolve;
        });
        return _this;
    }

    _createClass(AssetLoader, [{
        key: "register",
        value: function register(promise) {
            var _this2 = this;

            this.registerCount++;
            return new Promise(function (resolve, reject) {
                (function () {
                    return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        _context.prev = 0;
                                        _context.next = 3;
                                        return promise;

                                    case 3:
                                        _context.t0 = _context.sent;
                                        resolve(_context.t0);

                                        this.loadCount++;
                                        _context.next = 12;
                                        break;

                                    case 8:
                                        _context.prev = 8;
                                        _context.t1 = _context["catch"](0);

                                        reject(_context.t1);
                                        this.errorCount++;

                                    case 12:
                                        this.completeCount++;
                                        this._checkLoadCompleted();

                                    case 14:
                                    case "end":
                                        return _context.stop();
                                }
                            }
                        }, _callee, this, [[0, 8]]);
                    }));
                }).bind(_this2)();
            });
        }
    }, {
        key: "_checkLoadCompleted",
        value: function _checkLoadCompleted() {
            this.emit("progress", this);
            if (this.registerCount === this.completeCount) {
                this._resolve();
            }
        }
    }]);

    return AssetLoader;
}(_EEObject3.default);

exports.default = AssetLoader;
//# sourceMappingURL=AssetLoader.js.map