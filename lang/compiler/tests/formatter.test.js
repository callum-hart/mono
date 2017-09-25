const Formatter = require('../formatter');

const mockFile = {
  name: 'mock mono file'
}

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


test('Single space before opening croccodile ({)', () => {
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