"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Node = _interopRequireWildcard(require("./Node"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _gPO = Object.getPrototypeOf || function _gPO(o) { return o.__proto__; };

var _sPO = Object.setPrototypeOf || function _sPO(o, p) { o.__proto__ = p; return o; };

var _construct = _typeof(Reflect) === "object" && Reflect.construct || function _construct(Parent, args, Class) { var Constructor, a = [null]; a.push.apply(a, args); Constructor = Parent.bind.apply(Parent, a); return _sPO(new Constructor(), Class.prototype); };

var _cache = typeof Map === "function" && new Map();

function _wrapNativeSuper(Class) { if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() {} Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writeable: true, configurable: true } }); return _sPO(Wrapper, _sPO(function Super() { return _construct(Class, arguments, _gPO(this).constructor); }, Class)); }

var EOL = /\r\n|\r|\n/g;

var InvalidNumberOfSpaces =
/*#__PURE__*/
function (_Error) {
  _inherits(InvalidNumberOfSpaces, _Error);

  function InvalidNumberOfSpaces(message) {
    var _this;

    _classCallCheck(this, InvalidNumberOfSpaces);

    _this = _possibleConstructorReturn(this, (InvalidNumberOfSpaces.__proto__ || Object.getPrototypeOf(InvalidNumberOfSpaces)).call(this, message));
    _this.name = _this.constructor.name;
    return _this;
  }

  return InvalidNumberOfSpaces;
}(_wrapNativeSuper(Error));

var Parser =
/*#__PURE__*/
function () {
  /**
   * Parser constructor.
   *
   * @param string tree
   * ` Root
   *    |- Level 1 - Order 1
   *      |- Level 2 - Order 2
   *        |- Level 3 - Order 3
   *        |- Level 3 - Order 4
   *      |- Level 2 - Order 5
   *    |- Level 1 - Order 6
   *      |- Level 2 - Order 7
   *        |- Level 3 - Order 8
   *          |- Level 4 - Order 9`
   */
  function Parser(tree) {
    _classCallCheck(this, Parser);

    this.tree = tree;
    this.indentation = 2;
  }

  _createClass(Parser, [{
    key: "parse",
    value: function parse() {
      var lines = this.tree.split(EOL);
      this.setStructureAndOrderedNodes(lines);
      var root = this.structure[_Node.ROOT_LEVEL][_Node.ROOT_ORDER];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.orderedNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _node = _step.value;
          if (_node.isRoot) continue;
          var parent = this.getParentForNode(_node);
          if (!parent) continue;
          parent.children.push(_node);
          _node.parent = parent;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return root;
    }
  }, {
    key: "setIndentation",
    value: function setIndentation(indentation) {
      this.indentation = indentation;
      return this;
    }
  }, {
    key: "getStructure",
    value: function getStructure() {
      return this.structure;
    }
  }, {
    key: "getOrderedNodes",
    value: function getOrderedNodes() {
      return this.orderedNodes;
    }
  }, {
    key: "setStructureAndOrderedNodes",
    value: function setStructureAndOrderedNodes(lines) {
      var _this2 = this;

      this.orderedNodes = [];
      this.initialSpaces = null;
      this.structure = {};
      lines.forEach(function (line, order) {
        var node = _this2.lineToNode(line);

        if (_this2.initialSpaces === null) {
          _this2.initialSpaces = _this2.numberOfSpaces(line);
          node.isRoot = true;
        }

        node.order = order;
        node.level = _this2.spacesToLevel(_this2.numberOfSpaces(line));

        if (!_this2.structure[node.level]) {
          _this2.structure[node.level] = {};
        }

        _this2.structure[node.level][node.order] = node;

        _this2.orderedNodes.push(node);
      });
    }
  }, {
    key: "lineToNode",
    value: function lineToNode(line) {
      var node = new _Node.default();
      node.name = line.replace('|-', '').trim();
      return node;
    }
  }, {
    key: "numberOfSpaces",
    value: function numberOfSpaces(line) {
      return Math.max(line.search(/\S/), 0);
    }
  }, {
    key: "spacesToLevel",
    value: function spacesToLevel(numberOfSpaces) {
      if (typeof this.initialSpaces !== 'number') {
        throw new Error('No initial spaces');
      }

      if (numberOfSpaces === this.initialSpaces) {
        return 0;
      }

      if ((numberOfSpaces - this.initialSpaces) % this.indentation !== 0) {
        throw new InvalidNumberOfSpaces("Make sure children's leading spaces being a multiple of ".concat(this.indentation));
      }

      return Math.floor((numberOfSpaces - this.initialSpaces) / this.indentation);
    }
  }, {
    key: "getParentForNode",
    value: function getParentForNode(node) {
      var level = node.level;
      var order = node.order;

      if (typeof level !== 'number' || typeof order !== 'number') {
        throw new Error('Invalid node');
      }

      if (level === _Node.ROOT_LEVEL) {
        return null;
      }

      var parentLevel = level - 1;
      var candidates = this.structure[parentLevel];
      order = order - 1;

      while (order >= _Node.ROOT_ORDER) {
        if (candidates[order]) {
          return candidates[order];
        }

        --order;
      }
    }
  }], [{
    key: "new",
    value: function _new(tree) {
      return new Parser(tree);
    }
  }]);

  return Parser;
}();

exports.default = Parser;