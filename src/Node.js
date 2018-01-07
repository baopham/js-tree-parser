// @flow

export const ROOT_LEVEL = 0;

export const ROOT_ORDER = 0;

export default class Node {
  name: ?string;
  isRoot: boolean;
  order: ?number;
  level: ?number;
  parent: ?Node;
  children: Array<Node>;

  constructor() {
    this.name = null;
    this.isRoot = false;
    this.order = null;
    this.level = null;
    this.parent = null;
    this.children = [];
  }

  hasChildren(): boolean {
    return !!this.children && this.children.length > 0;
  }

  displayName(): string {
    return this.name || '<empty node>';
  }

  toJSON(): Object {
    return {
      name: this.name,
      isRoot: this.isRoot,
      order: this.order,
      level: this.level,
      children: this.children
    };
  }
}
