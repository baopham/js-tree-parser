"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ROOT_ORDER = exports.ROOT_LEVEL = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ROOT_LEVEL = 0;
exports.ROOT_LEVEL = ROOT_LEVEL;
var ROOT_ORDER = 0;
exports.ROOT_ORDER = ROOT_ORDER;

var Node =
/*#__PURE__*/
function () {
  function Node() {
    _classCallCheck(this, Node);

    this.name = null;
    this.isRoot = false;
    this.order = null;
    this.level = null;
    this.parent = null;
    this.children = [];
  }

  _createClass(Node, [{
    key: "hasChildren",
    value: function hasChildren() {
      return !!this.children && this.children.length > 0;
    }
  }, {
    key: "displayName",
    value: function displayName() {
      return this.name || '<empty node>';
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        name: this.name,
        isRoot: this.isRoot,
        order: this.order,
        level: this.level,
        children: this.children
      };
    }
  }]);

  return Node;
}();

exports.default = Node;