"use strict";

require("babel-polyfill");

var _grimoirejs = require("grimoirejs");

var _grimoirejs2 = _interopRequireDefault(_grimoirejs);

var _AssetLoadingManagerComponent = require("./Components/AssetLoadingManagerComponent");

var _AssetLoadingManagerComponent2 = _interopRequireDefault(_AssetLoadingManagerComponent);

var _CanvasInitializerComponent = require("./Components/CanvasInitializerComponent");

var _CanvasInitializerComponent2 = _interopRequireDefault(_CanvasInitializerComponent);

var _LoopManagerComponent = require("./Components/LoopManagerComponent");

var _LoopManagerComponent2 = _interopRequireDefault(_LoopManagerComponent);

var _RendererManagerComponent = require("./Components/RendererManagerComponent");

var _RendererManagerComponent2 = _interopRequireDefault(_RendererManagerComponent);

var _BooleanConverter = require("./Converters/BooleanConverter");

var _BooleanConverter2 = _interopRequireDefault(_BooleanConverter);

var _Color4Converter = require("./Converters/Color4Converter");

var _Color4Converter2 = _interopRequireDefault(_Color4Converter);

var _NumberConverter = require("./Converters/NumberConverter");

var _NumberConverter2 = _interopRequireDefault(_NumberConverter);

var _StringConverter = require("./Converters/StringConverter");

var _StringConverter2 = _interopRequireDefault(_StringConverter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

_grimoirejs2.default.register(function () {
    return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee() {
        var _$ns;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _$ns = _grimoirejs2.default.ns("HTTP://GRIMOIRE.GL/NS/DEFAULT");

                        _grimoirejs2.default.registerComponent(_$ns("AssetLoadingManager"), _AssetLoadingManagerComponent2.default);
                        _grimoirejs2.default.registerComponent(_$ns("CanvasInitializer"), _CanvasInitializerComponent2.default);
                        _grimoirejs2.default.registerComponent(_$ns("LoopManager"), _LoopManagerComponent2.default);
                        _grimoirejs2.default.registerComponent(_$ns("RendererManager"), _RendererManagerComponent2.default);
                        _grimoirejs2.default.registerConverter(_$ns("Boolean"), _BooleanConverter2.default);
                        _grimoirejs2.default.registerConverter(_$ns("Color4"), _Color4Converter2.default);
                        _grimoirejs2.default.registerConverter(_$ns("Number"), _NumberConverter2.default);
                        _grimoirejs2.default.registerConverter(_$ns("String"), _StringConverter2.default);
                        _grimoirejs2.default.registerNode("goml", ["CanvasInitializer", "LoopManager", "AssetLoadingManager"]);
                        _grimoirejs2.default.registerNode("renderers", ["RendererManager"]);
                        _grimoirejs2.default.registerNode("renderer", []);
                        _grimoirejs2.default.registerNode("scenes", []);
                        _grimoirejs2.default.registerNode("scene", []);
                        _grimoirejs2.default.registerNode("empty", []);

                    case 15:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
});
//# sourceMappingURL=index.js.map