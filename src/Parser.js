// @flow
import Node, { ROOT_ORDER, ROOT_LEVEL } from './Node';
import ReferenceNode from './ReferenceNode';

const EOL = /\r\n|\r|\n/g;

type Level = number;
type Order = number;

class ParserError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
  }
}

export class InvalidNumberOfSpaces extends ParserError {}

export class OrphanNode extends ParserError {}

export class NodeReferenceError extends ParserError {}

export default class Parser {
  indentation: number;
  tree: string;
  initialSpaces: ?number;
  structure: { [Level]: { [Order]: Node } };
  orderedNodes: Array<Node>;

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
  constructor(tree: string) {
    this.tree = tree;
    this.indentation = 2;
  }

  static new(tree: string): Parser {
    return new Parser(tree);
  }

  parse(): Node {
    const lines = this.tree.split(EOL);
    this.setStructureAndOrderedNodes(lines);
    const root = this.structure[ROOT_LEVEL][ROOT_ORDER];

    for (const node of this.orderedNodes) {
      if (node.isRoot) continue;

      const parent = this.getParentForNode(node);

      if (!parent) {
        throw new OrphanNode(`${node.displayName()} has no parent`);
      }

      parent.children.push(node);

      node.parent = parent;
    }

    this.setReferencedNodes();

    return root;
  }

  setIndentation(indentation: number): Parser {
    this.indentation = indentation;
    return this;
  }

  getStructure(): Object {
    return this.structure;
  }

  getOrderedNodes(): Array<Node> {
    return this.orderedNodes;
  }

  setStructureAndOrderedNodes(lines: Array<string>) {
    this.orderedNodes = [];
    this.initialSpaces = null;
    this.structure = {};

    lines.forEach((line: string, order: Order) => {
      const node = this.lineToNode(line);

      if (this.initialSpaces === null) {
        this.initialSpaces = this.numberOfSpaces(line);
        node.isRoot = true;
      }

      node.level = this.spacesToLevel(this.numberOfSpaces(line));
      node.order = order;

      if (!this.structure[node.level]) {
        this.structure[node.level] = {};
      }

      this.structure[node.level][node.order] = node;
      this.orderedNodes.push(node);
    });
  }

  lineToNode(line: string): Node {
    const name = line.replace('|-', '').trim();
    const node = ReferenceNode.isReferenceNode(name)
      ? new ReferenceNode()
      : new Node();
    node.name = name;
    return node;
  }

  numberOfSpaces(line: string): number {
    return Math.max(line.search(/\S/), 0);
  }

  spacesToLevel(numberOfSpaces: number): Level {
    if (typeof this.initialSpaces !== 'number') {
      throw new Error('No initial spaces');
    }

    if (numberOfSpaces === this.initialSpaces) {
      return 0;
    }

    if ((numberOfSpaces - this.initialSpaces) % this.indentation !== 0) {
      throw new InvalidNumberOfSpaces(
        `Make sure children's leading spaces being a multiple of ${
          this.indentation
        }`
      );
    }

    return Math.floor((numberOfSpaces - this.initialSpaces) / this.indentation);
  }

  getParentForNode(node: Node): ?Node {
    const level = node.level;
    let order = node.order;

    if (typeof level !== 'number' || typeof order !== 'number') {
      throw new Error('Invalid node');
    }

    if (level === ROOT_LEVEL) {
      return null;
    }

    const parentLevel = level - 1;
    const candidates = this.structure[parentLevel];
    order = order - 1;
    while (order >= ROOT_ORDER) {
      if (candidates[order]) {
        return candidates[order];
      }
      --order;
    }
  }

  setReferencedNodes() {
    for (const node of this.orderedNodes) {
      if (!(node instanceof ReferenceNode)) continue;
      node.referenced = this.findReferencedNode(node);
    }
  }

  findReferencedNode(reference: ReferenceNode): Node {
    const pathMatcher = path => node => node.name === path;
    const [rootPath, ...paths] = reference.getReferencePaths();

    let root = this.structure[ROOT_LEVEL][ROOT_ORDER];
    let node: ?Node;

    if (!root || root.name !== rootPath) {
      throw new NodeReferenceError(
        `Invalid node reference ${reference.displayName()}. The first path should reference the root of the tree`
      );
    }

    for (const path of paths) {
      if (!root) {
        throw new NodeReferenceError(
          `Cannot find node for "${path}" reference. Typo?`
        );
      }

      const matcher = pathMatcher(path);
      // $FlowFixMe
      node = root.children.find(matcher);
      root = node;
    }

    if (!node) {
      throw new NodeReferenceError(
        `Cannot find the referenced node "${reference.displayName()}"`
      );
    }

    return node;
  }
}
