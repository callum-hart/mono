const Formatter = require('../formatter');

const mockFile = {
  name: 'mock mono file'
}

/**
 * TODO:
 * - rule-sets on same line .a{color: red} .b{color: blue}
 * - tests for CSS errors, ie double colon.
 *   - Formatter should throw appropriate errors (http://facebook.github.io/jest/docs/en/expect.html#tothrowerror)
 */

test('Single rule-set formatting', () => {
  mockFile.source = `


  .heading {
              font-size:         14px;

        font-weight: bold;

    font-familiy: Operator Mono;

  line-height: 20px;}`;

  expect(Formatter.format(mockFile)).toBe(`.heading {
  font-size: 14px;
  font-weight: bold;
  font-familiy: Operator Mono;
  line-height: 20px;
}
`);
});


test('Multiple rule-set formatting', () => {
  mockFile.source = `
  h1 {font-size: 30px;} h2   {font-size:24px;}
        h3{  font-size:20px;}
  .heading {
              font-size:         14px;

        font-weight: bold;

    font-familiy: Operator Mono;

  line-height: 20px;}`;

  expect(Formatter.format(mockFile)).toBe(`h1 {
  font-size: 30px;
}
h2 {
  font-size: 24px;
}
h3 {
  font-size: 20px;
}
.heading {
  font-size: 14px;
  font-weight: bold;
  font-familiy: Operator Mono;
  line-height: 20px;
}
`);
});


test('Single space before opening brace', () => {
  mockFile.source = `
  p


        {
    color: darkslategrey;
  }
  `;

  expect(Formatter.format(mockFile)).toBe(`p {
  color: darkslategrey;
}
`);
});


test('Media query formatting', () => {
  mockFile.source = `

  @media (min-width:600px) and       (max-width:    900px)      {
        h1 {

    font-size:        24px;
  }}

          @media (min-width:900px)
                      {
        h1 {font-size: 28px ;}
  }


  `;

  expect(Formatter.format(mockFile)).toBe(`@media (min-width: 600px) and (max-width: 900px) {
  h1 {
    font-size: 24px;
  }
}
@media (min-width: 900px) {
  h1 {
    font-size: 28px;
  }
}
`);
});


test('Multi-line selectors should be on same line', () => {
  mockFile.source = `

  h1,
  h2,
  h3,
  h4,
  h5 {
    color: lightslategray;
  }`;

  expect(Formatter.format(mockFile)).toBe(`h1, h2, h3, h4, h5 {
  color: lightslategray;
}
`);
});


test('Inferred type formatting', () => {
  mockFile.source = `
  .link<        immutable

  >        {
    color: cadetblue;
    text-decoration: none;
  }`;

  expect(Formatter.format(mockFile)).toBe(`.link<immutable> {
  color: cadetblue;
  text-decoration: none;
}
`);
});


test('Single line mono notion formatting', () => {
  mockFile.source = `

  .hidden     {
    display<   immutable    >: none;
  }
  `;

  expect(Formatter.format(mockFile)).toBe(`.hidden {
  display<immutable>: none;
}
`);
});


test('Multi-line mono notion formatting', () => {
  mockFile.source = `

  .hidden
  {
    display<

        immutable
      >: none;
  }
  `;

  expect(Formatter.format(mockFile)).toBe(`.hidden {
  display<immutable>: none;
}
`);
});


// @note: reasons are changed to lowercase (in: ENG-123456 out: eng-123456)
test('Motive with reason', () => {
  mockFile.source = `
  .error {
              color<?patch(    'eng-123456' )  >:indianred;
  }

  `;

  expect(Formatter.format(mockFile)).toBe(`.error {
  color<?patch('eng-123456')>: indianred;
}
`);
});


test('Motive with whitespace in & around reason', () => {
  mockFile.source = `
  .error {
              color<   ?   because('make error obvious')       >:indianred;
  }

  `;

  expect(Formatter.format(mockFile)).toBe(`.error {
  color<?because('make error obvious')>: indianred;
}
`);
});


test('Child combinators (in selectors) should not affect mono notion detection', () => {
  mockFile.source = `

  a.link {
    color<protected>: deepskyblue;
  }

  div > span {
        display: block;
  }

  a.link:hover { color<@override>:    dodgerblue; }

  `;

  expect(Formatter.format(mockFile)).toBe(`a.link {
  color<protected>: deepskyblue;
}
div > span {
  display: block;
}
a.link:hover {
  color<@override>: dodgerblue;
}
`);
});


test('Greater/Less than symbols in motives should not affect mono notion detection', () => {
  mockFile.source = `

  section.leftBar {
    margin-left<?because('align with <...>')>:20px;
  }

  footer {
    background-color<immutable>: olivedrab ;
    border-top<immutable>: darkolivegreen    ;
  }
  `;

  expect(Formatter.format(mockFile)).toBe(`section.leftBar {
  margin-left<?because('align with <...>')>: 20px;
}
footer {
  background-color<immutable>: olivedrab;
  border-top<immutable>: darkolivegreen;
}
`);
});


test('Space between notion combinators should be removed', () => {
  mockFile.source = `

  .toastMessage.showing {
    opacity<      immutable,    ?overrule >   : 1;
        visibility<   immutable, ?overrule
        >: visible;
    pointer-events<

  immutable,      ?overrule

    >: auto;
  }
  `;

  expect(Formatter.format(mockFile)).toBe(`.toastMessage.showing {
  opacity<immutable,?overrule>: 1;
  visibility<immutable,?overrule>: visible;
  pointer-events<immutable,?overrule>: auto;
}
`);
});