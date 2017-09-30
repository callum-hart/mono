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