# tree-parser

Parse this:

```
  Root
    |- Level 1.1
      |- Level 2.1
    |- Level 1.2
      |- Level 2.2
        |- Level 3
          |- Level 4
```

to this:

```js
for (const child of root.children) {
  console.log(child.name);
  console.log(child.order);
  console.log(child.children);
  console.log(child.children[0].children);
  console.log(child.children[0].parent === child);
}
```

## Table of Contents
* [Install](#install)
* [Usage](#usage)
  * [Advanced](#advanced)
* [Testing](#testing)

## Install

``` bash
$ npm i @baopham/tree-parser
```

## Usage

```js
import { Parser } from '@baopham/tree-parser';

// A tree with 4 spaces for indentation
const tree =
`    Root
        |- Level 1 - Order 1
            |- Level 2 - Order 2
                |- Level 3 - Order 3
                |- Level 3 - Order 4
            |- Level 2 - Order 5
        |- Level 1 - Order 6
            |- Level 2 - Order 7
                |- Level 3 - Order 8
                    |- Level 4 - Order 9`;

const root = Parser.new(tree)
  // number of spaces for an indentation, 2 is the default.
  .setIndentation(4)
  .parse();

for (const child of root.children) {
  console.log(child.name);
  console.log(child.order);
  console.log(child.children);
  console.log(child.children[0].children);
  console.log(child.children[0].parent === child);
}
```

### Advanced

Get node by level and order:

```js
import { Parser } from '@baopham/tree-parser';

const tree =
`  Root
    |- Level 1 - Order 1
      |- Level 2 - Order 2
        |- Level 3 - Order 3
        |- Level 3 - Order 4
      |- Level 2 - Order 5
    |- Level 1 - Order 6
      |- Level 2 - Order 7
        |- Level 3 - Order 8
          |- Level 4 - Order 9`;

const parser = new Parser(tree);

parser.parse();

const structure = parser.getStructure();

// Get nodes at level 3
const level3Nodes = structure[3];
// Get node at level 3, order 4
const node = structure[3][4];

// Get last leaf
const orderedNodes = parser.getOrderedNodes();
const lastLeaf = orderedNodes[orderedNodes.length - 1];
```

Reference another node:

```js
import { Parser } from '@baopham/tree-parser';

const tree =
`  Root
    |- Level 1 - Order 1
      |- [Ref:Root > Level 1 - Order 3 > Level 2 - Order 4 > Level 3 - Order 5 > Level 4 - Order 6]
    |- Level 1 - Order 3
      |- Level 2 - Order 4
        |- Level 3 - Order 5
          |- Level 4 - Order 6`;

const parser = Parser.new(tree);

parser.parse();

expect(parser.orderedNodes[2].referenced).toBe(parser.orderedNodes[6]);
```


## Testing

``` bash
$ npm test
```
