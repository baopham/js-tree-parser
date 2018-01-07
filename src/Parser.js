// @flow
import Node, { ROOT_ORDER, ROOT_LEVEL } from './Node'

const EOL = /\r\n|\r|\n/g

class ParserError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

class InvalidNumberOfSpaces extends ParserError {}

class OrphanNode extends ParserError {}

export default class Parser {
  indentation: number
  tree: string
  initialSpaces: ?number
  structure: Object
  orderedNodes: Array<Node>

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
    this.tree = tree
    this.indentation = 2
  }

  static new(tree: string): Parser {
    return new Parser(tree)
  }

  parse(): Node {
    const lines = this.tree.split(EOL)
    this.setStructureAndOrderedNodes(lines)
    const root = this.structure[ROOT_LEVEL][ROOT_ORDER]

    for (const node of this.orderedNodes) {
      if (node.isRoot) continue

      const parent = this.getParentForNode(node)

      if (!parent) {
        throw new OrphanNode(`${node.name || '<empty node>'} has no parent`)
      }

      parent.children.push(node)

      node.parent = parent
    }

    return root
  }

  setIndentation(indentation: number): Parser {
    this.indentation = indentation
    return this
  }

  getStructure(): Object {
    return this.structure
  }

  getOrderedNodes(): Array<Node> {
    return this.orderedNodes
  }

  setStructureAndOrderedNodes(lines: Array<string>) {
    this.orderedNodes = []
    this.initialSpaces = null
    this.structure = {}

    lines.forEach((line, order) => {
      const node = this.lineToNode(line)

      if (this.initialSpaces === null) {
        this.initialSpaces = this.numberOfSpaces(line)
        node.isRoot = true
      }

      node.order = order
      node.level = this.spacesToLevel(this.numberOfSpaces(line))

      if (!this.structure[node.level]) {
        this.structure[node.level] = {}
      }

      this.structure[node.level][node.order] = node
      this.orderedNodes.push(node)
    })
  }

  lineToNode(line: string): Node {
    const node = new Node()
    node.name = line.replace('|-', '').trim()
    return node
  }

  numberOfSpaces(line: string): number {
    return Math.max(line.search(/\S/), 0)
  }

  spacesToLevel(numberOfSpaces: number): number {
    if (typeof this.initialSpaces !== 'number') {
      throw new Error('No initial spaces')
    }

    if (numberOfSpaces === this.initialSpaces) {
      return 0
    }

    if ((numberOfSpaces - this.initialSpaces) % this.indentation !== 0) {
      throw new InvalidNumberOfSpaces(
        `Make sure children's leading spaces being a multiple of ${
          this.indentation
        }`
      )
    }

    return Math.floor((numberOfSpaces - this.initialSpaces) / this.indentation)
  }

  getParentForNode(node: Node): ?Node {
    const level = node.level
    let order = node.order

    if (typeof level !== 'number' || typeof order !== 'number') {
      throw new Error('Invalid node')
    }

    if (level === ROOT_LEVEL) {
      return null
    }

    const parentLevel = level - 1
    const candidates = this.structure[parentLevel]
    order = order - 1
    while (order >= ROOT_ORDER) {
      if (candidates[order]) {
        return candidates[order]
      }
      --order
    }
  }
}
