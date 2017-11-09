# Lexer

```
[
  [
    'SINGLE_SELECTOR',
    'p.heading',
    {
      line: 1
    }
  ],
  [
    'OPEN_BRACE',
    '{',
    {
      line: 1
    }
  ],
  [
    'DECLARATION',
    'line-height<immutable>: 20px;',
    {
      line: 2
    }
  ],
  [
    'CLOSE_BRACE',
    '}',
    {
      line: 3
    }
  ],
  [
    'MULTI_INFERRED_SELECTOR',
    'p.one, span.two<immutable>',
    {
      line: 4
    }
  ],
  [
    'OPEN_BRACE',
    '{',
    {
      line: 4
    }
  ],
  [
    'DECLARATION',
    'line-height<immutable>: 20px;',
    {
      line: 5
    }
  ],
  [
    'CLOSE_BRACE',
    '}',
    {
      line: 6
    }
  ],
  [
    'MEDIA_QUERY',
    '@media (min-width: 300px) and (max-width: 600px)',
    {
      line: 7
    }
  ],
  [
    'OPEN_BRACE',
    '{',
    {
      line: 7
    }
  ]
]
```

Need to decide how to tokenize multiple selectors, options:

Prettier puts each selector on a newline i.e:

`div.hey, span.hey, p.hey{`

becomes:

```
div.hey,
span.hey,
p.hey{
```

Token options:

a) Could put whole group in token:
*Would need to format selectors onto same line*

```
[
  'MULTI_SELECTOR',
  'div.hey, span.hey, p.hey',
  { line: 8 }
]
```

b) Create a token for each selector:

```
[
  'SELECTOR',
  'div.hey',
  { line: 8 }
],
[
  'SELECTOR',
  'span.hey',
  { line: 9 },
],
[
  'SELECTOR',
  'p.hey',
  { line: 10 }
]
```

And then in the parser selectors in a sequence are treated as multiple selectors.

**NOTE:** Grouped selectors CANNOT contain inferred types. This would throw an error:

```
div.hey,
span.hey<protected>,
p.hey{
```

The lexer should be responsible for validation, i.e:

`color<foo>: red;` => invalid mono type `foo` used

This will require a lower level of abstraction - the token DECLARATION is too high level /  needs to capture more info.

`width: 100%;`
`display<protected,?overrule>: none;`
`color<?because('eng-12345d djdjdd')>: cadetblue;`
`font-size<public,?because('some reason')>: 12px;`
`color<@override>: blue;`

Could add `notionInfo` to token shape:

[
  type,
  value,
  locationInfo,
  notionInfo
]

`notionInfo` has the shape:

[
  type,
  modifier,
  motive
]

It's optional - if no notions are present it won't exist.

```
[
  'DECLARATION',
  'width: 100%;',
  { line: 11 }
],
[
  'DECLARATION',
  'display<protected,?overrule>: none;',
  { line: 12 },
  ['protected', null, "?overrule"]
],
[
  'DECLARATION',
  'color<?because('eng-12345d djdjdd')>: cadetblue;',
  { line: 13 },
  [null, null, "?because('eng-12345d djdjdd')"]
],
[
  'DECLARATION',
  'font-size<public,?because('some reason')>: 12px;',
  { line: 14 },
  ['public', null, "?because('some reason')"]
],
[
  'DECLARATION',
  'color<@override>: blue;',
  { line: 15 },
  [null, '@override', null]
]

```

`notionInfo` would also be utilized by inferred types:

`span.hey<protected> {}`

```
[
  'SELECTOR',
  'span.hey<protected>',
  { line: 9 },
  [ 'protected', null, null ]
]
```

Validation can then be handled at the point of determining `notionInfo` for both declarations & inferred types.


