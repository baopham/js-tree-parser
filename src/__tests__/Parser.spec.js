import path from 'path'
import fs from 'fs'
import Parser, { InvalidNumberOfSpaces } from '../Parser'

function getFixture(name) {
  return fs.readFileSync(path.join(__dirname, 'fixtures', name), {
    encoding: 'utf8'
  })
}

describe('Parser', () => {
  it('should parse tree', () => {
    // prettier-ignore
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
          |- Level 4 - Order 9`

    const root = Parser.new(tree).parse()

    const expected = getFixture('expected_parsed_tree.json')

    expect(JSON.parse(JSON.stringify(root))).toEqual(JSON.parse(expected))
  })

  it('should parse tree with custom indentation', () => {
    // prettier-ignore
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
                    |- Level 4 - Order 9`

    const root = Parser.new(tree)
      .setIndentation(4)
      .parse()

    const expected = getFixture('expected_parsed_tree.json')

    expect(JSON.parse(JSON.stringify(root))).toEqual(JSON.parse(expected))
  })

  it('should validate correct indentation', () => {
    // prettier-ignore
    const tree =
`  Root
       |- Level 1 - Order 1`;

    expect(() => {
      Parser.new(tree).parse()
    }).toThrowError(InvalidNumberOfSpaces)
  })

  it('should be able to reference another node', () => {
    // prettier-ignore
    const tree =
`  Root
    |- Level 1 - Order 1
      |- [Ref:Root > Level 1 - Order 3 > Level 2 - Order 4 > Level 3 - Order 5 > Level 4 - Order 6]
    |- Level 1 - Order 3
      |- Level 2 - Order 4
        |- Level 3 - Order 5
          |- Level 4 - Order 6`

    const parser = Parser.new(tree)
    parser.parse()
    expect(parser.orderedNodes[2].referenced).toBe(parser.orderedNodes[6])
  })
})
