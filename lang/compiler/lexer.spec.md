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

`div.hey, span.hey<protected>, p.hey{`

becomes:

```
div.hey,
span.hey<protected>,
p.hey{
```

Token options:

a) Could put whole group in token:
*Would need to format selectors onto same line*

```
[
  'MULTI_SELECTOR',
  'div.hey, span.hey<protected>, p.hey',
  { line: 8 }
]
```

b) Create a token for each selector:

```
[
  'MULTI_SELECTOR',
  'div.hey',
  { line: 8 }
],
[
  'MULTI_SELECTOR_INFERRED',
  'span.hey<protected>',
  { line: 9 }
],
[
  'MULTI_SELECTOR',
  'p.hey',
  { line: 10 }
]
```

