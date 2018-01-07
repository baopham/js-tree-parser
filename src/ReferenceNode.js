// @flow
import Node from './Node';

export const NODE_REFERENCE_REGEX = /^\[Ref:(.*)\]$/;

export class NoReference extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
  }
}

export default class ReferenceNode extends Node {
  referenced: ?Node;

  static isReferenceNode(name: string): boolean {
    return NODE_REFERENCE_REGEX.test(name);
  }

  getReferencePaths(): Array<string> {
    if (!this.name) {
      throw new NoReference('Invalid ReferenceNode. Name is empty');
    }

    const [, ref] = this.name.match(NODE_REFERENCE_REGEX) || [];

    if (!ref) {
      throw new NoReference(`Invalid reference name: "${this.displayName()}"`);
    }

    return ref
      .trim()
      .split('>')
      .map(path => path.trim());
  }

  toJSON(): Object {
    return {
      name: this.name,
      isRoot: this.isRoot,
      order: this.order,
      level: this.level,
      referenced: this.referenced,
      children: this.children
    };
  }
}
