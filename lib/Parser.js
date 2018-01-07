"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NodeReferenceError = exports.OrphanNode = exports.InvalidNumberOfSpaces = void 0;

var _Node = _interopRequireWildcard(require("./Node"));

var _ReferenceNode = _interopRequireDefault(require("./ReferenceNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

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

var ParserError =
/*#__PURE__*/
function (_Error) {
  _inherits(ParserError, _Error);

  function ParserError(message) {
    var _this;

    _classCallCheck(this, ParserError);

    _this = _possibleConstructorReturn(this, (ParserError.__proto__ || Object.getPrototypeOf(ParserError)).call(this, message));
    _this.message = message;
    _this.name = _this.constructor.name;
    return _this;
  }

  return ParserError;
}(_wrapNativeSuper(Error));

var InvalidNumberOfSpaces =
/*#__PURE__*/
function (_ParserError) {
  _inherits(InvalidNumberOfSpaces, _ParserError);

  function InvalidNumberOfSpaces() {
    _classCallCheck(this, InvalidNumberOfSpaces);

    return _possibleConstructorReturn(this, (InvalidNumberOfSpaces.__proto__ || Object.getPrototypeOf(InvalidNumberOfSpaces)).apply(this, arguments));
  }

  return InvalidNumberOfSpaces;
}(ParserError);

exports.InvalidNumberOfSpaces = InvalidNumberOfSpaces;

var OrphanNode =
/*#__PURE__*/
function (_ParserError2) {
  _inherits(OrphanNode, _ParserError2);

  function OrphanNode() {
    _classCallCheck(this, OrphanNode);

    return _possibleConstructorReturn(this, (OrphanNode.__proto__ || Object.getPrototypeOf(OrphanNode)).apply(this, arguments));
  }

  return OrphanNode;
}(ParserError);

exports.OrphanNode = OrphanNode;

var NodeReferenceError =
/*#__PURE__*/
function (_ParserError3) {
  _inherits(NodeReferenceError, _ParserError3);

  function NodeReferenceError() {
    _classCallCheck(this, NodeReferenceError);

    return _possibleConstructorReturn(this, (NodeReferenceError.__proto__ || Object.getPrototypeOf(NodeReferenceError)).apply(this, arguments));
  }

  return NodeReferenceError;
}(ParserError);

exports.NodeReferenceError = NodeReferenceError;

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

          if (!parent) {
            throw new OrphanNode("".concat(_node.displayName(), " has no parent"));
          }

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

      this.setReferencedNodes();
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

        node.level = _this2.spacesToLevel(_this2.numberOfSpaces(line));
        node.order = order;

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
      var name = line.replace('|-', '').trim();
      var node = _ReferenceNode.default.isReferenceNode(name) ? new _ReferenceNode.default() : new _Node.default();
      node.name = name;
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
  }, {
    key: "setReferencedNodes",
    value: function setReferencedNodes() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.orderedNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _node2 = _step2.value;
          if (!(_node2 instanceof _ReferenceNode.default)) continue;
          _node2.referenced = this.findReferencedNode(_node2);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "findReferencedNode",
    value: function findReferencedNode(reference) {
      var pathMatcher = function pathMatcher(path) {
        return function (node) {
          return node.name === path;
        };
      };

      var _reference$getReferen = reference.getReferencePaths(),
          _reference$getReferen2 = _toArray(_reference$getReferen),
          rootPath = _reference$getReferen2[0],
          paths = _reference$getReferen2.slice(1);

      var root = this.structure[_Node.ROOT_LEVEL][_Node.ROOT_ORDER];
      var node;

      if (!root || root.name !== rootPath) {
        throw new NodeReferenceError("Invalid node reference ".concat(reference.displayName(), ". The first path should reference the root of the tree"));
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = paths[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _path = _step3.value;

          if (!root) {
            throw new NodeReferenceError("Cannot find node for \"".concat(_path, "\" reference. Typo?"));
          }

          var matcher = pathMatcher(_path); // $FlowFixMe

          node = root.children.find(matcher);
          root = node;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (!node) {
        throw new NodeReferenceError("Cannot find the referenced node \"".concat(reference.displayName(), "\""));
      }

      return node;
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