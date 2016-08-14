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

var Buffer = function (_ResourceBase) {
    _inherits(Buffer, _ResourceBase);

    function Buffer(gl, target, usage) {
        _classCallCheck(this, Buffer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Buffer).call(this, gl));

        _this.target = target;
        _this.usage = usage;
        _this.containsData = false;
        _this.buffer = gl.createBuffer();
        return _this;
    }

    _createClass(Buffer, [{
        key: "update",
        value: function update(length, subBuffer) {
            this.containsData = true;
            this.bind();
            if (subBuffer) {
                if (!this.containsData) {
                    this.gl.bufferData(this.target, length + subBuffer.byteLength, this.usage);
                }
                this.gl.bufferSubData(this.target, length, subBuffer);
            } else {
                if (typeof length === "number") {
                    this.gl.bufferData(this.target, length, this.usage);
                } else {
                    this.gl.bufferData(this.target, length, this.usage);
                }
            }
        }
    }, {
        key: "bind",
        value: function bind() {
            this.gl.bindBuffer(this.target, this.buffer);
        }
    }, {
        key: "destroy",
        value: function destroy() {
            _get(Object.getPrototypeOf(Buffer.prototype), "destroy", this).call(this);
            this.gl.deleteBuffer(this.buffer);
        }
    }]);

    return Buffer;
}(_ResourceBase3.default);
//# sourceMappingURL=Buffer.js.map


exports.default = Buffer;