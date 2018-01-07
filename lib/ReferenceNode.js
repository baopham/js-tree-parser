"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NoReference = exports.NODE_REFERENCE_REGEX = void 0;

var _Node2 = _interopRequireDefault(require("./Node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _gPO = Object.getPrototypeOf || function _gPO(o) { return o.__proto__; };

var _sPO = Object.setPrototypeOf || function _sPO(o, p) { o.__proto__ = p; return o; };

var _construct = _typeof(Reflect) === "object" && Reflect.construct || function _construct(Parent, args, Class) { var Constructor, a = [null]; a.push.apply(a, args); Constructor = Parent.bind.apply(Parent, a); return _sPO(new Constructor(), Class.prototype); };

var _cache = typeof Map === "function" && new Map();

function _wrapNativeSuper(Class) { if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() {} Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writeable: true, configurable: true } }); return _sPO(Wrapper, _sPO(function Super() { return _construct(Class, arguments, _gPO(this).constructor); }, Class)); }

var NODE_REFERENCE_REGEX = /^\[Ref:(.*)\]$/;
exports.NODE_REFERENCE_REGEX = NODE_REFERENCE_REGEX;

var NoReference =
/*#__PURE__*/
function (_Error) {
  _inherits(NoReference, _Error);

  function NoReference(message) {
    var _this;

    _classCallCheck(this, NoReference);

    _this = _possibleConstructorReturn(this, (NoReference.__proto__ || Object.getPrototypeOf(NoReference)).call(this, message));
    _this.message = message;
    _this.name = _this.constructor.name;
    return _this;
  }

  return NoReference;
}(_wrapNativeSuper(Error));

exports.NoReference = NoReference;

var ReferenceNode =
/*#__PURE__*/
function (_Node) {
  _inherits(ReferenceNode, _Node);

  function ReferenceNode() {
    _classCallCheck(this, ReferenceNode);

    return _possibleConstructorReturn(this, (ReferenceNode.__proto__ || Object.getPrototypeOf(ReferenceNode)).apply(this, arguments));
  }

  _createClass(ReferenceNode, [{
    key: "getReferencePaths",
    value: function getReferencePaths() {
      if (!this.name) {
        throw new NoReference('Invalid ReferenceNode. Name is empty');
      }

      var _ref = this.name.match(NODE_REFERENCE_REGEX) || [],
          _ref2 = _slicedToArray(_ref, 2),
          ref = _ref2[1];

      if (!ref) {
        throw new NoReference("Invalid reference name: \"".concat(this.displayName(), "\""));
      }

      return ref.trim().split('>').map(function (path) {
        return path.trim();
      });
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        name: this.name,
        isRoot: this.isRoot,
        order: this.order,
        level: this.level,
        referenced: this.referenced,
        children: this.children
      };
    }
  }], [{
    key: "isReferenceNode",
    value: function isReferenceNode(name) {
      return NODE_REFERENCE_REGEX.test(name);
    }
  }]);

  return ReferenceNode;
}(_Node2.default);

exports.default = ReferenceNode;