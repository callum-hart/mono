const Log = require('../log');


const mockFile = {
  name: 'Log test mock file'
}


test('[codeError] finds unique match #1', () => {
  mockFile.source =`
h1 {
  font-size: 20px;
}

.title {
  color<locked>: cadetblue;
}`;

  const codeError = Log.codeError(mockFile, 'color<locked>: cadetblue;', 'locked');
  console.log(codeError);
  expect(codeError.lineNumber).toBe(7);
});


test('[codeError] finds unique match #2', () => {
  mockFile.source =`
h1 {
  font-size: 20px;
}

.title { color<locked>: cadetblue; }`;

  const codeError = Log.codeError(mockFile, 'color<locked>: cadetblue;', 'locked');
  console.log(codeError);
  expect(codeError.lineNumber).toBe(6);
});


test('[codeError] finds exact match #1', () => {
  mockFile.source =`
h1.title {
  font-size: 20px;
}

.title {
  color: cadetblue;
}`;

  const codeError = Log.codeError(mockFile, '.title{', '.title');
  console.log(codeError);
  expect(codeError.lineNumber).toBe(6);
});


/**
 * Tests from here on after fail. They are used to document use-cases that
 * aren't currently supported by `codeError`.
 *
 * As important as error messages are, now isn't the time to dedicate lots
 * of time on them. Record issues found & revisit `codeError` in the future.
 */

test('[codeError] should ignore matches in comments', () => {
  mockFile.source =`
h1{
  font-size: 20px;
}

/*
.subTitle {
  font-weight<locked>: bold;
}
*/

.title{
  font-weight<locked>: bold;
}`;

  const codeError = Log.codeError(mockFile, 'font-weight<locked>: bold;', 'locked');
  console.log(codeError);
  expect(codeError.lineNumber).toBe(13);
});


test('[codeError] should find selector without element type #1', () => {
  mockFile.source =`
section.eins {
  display: none;
}

p.zwei, .eins {
  flex: 1;
}`;

  const codeError = Log.codeError(mockFile, '.eins{', '.eins');
  console.log(codeError);
  expect(codeError.lineNumber).toBe(6);
});


test('[codeError] should find selector without element type #2', () => {
  mockFile.source =`
div.hidden {
  height: 0;
  width: 0;
}

.hidden {visibility: hidden;} .shown {visibility: visible;}`;

  const codeError = Log.codeError(mockFile, '.hidden{', '.hidden');
  console.log(codeError);
  expect(codeError.lineNumber).toBe(7);
});


test('[codeError] should find selector without element type #3', () => {
  mockFile.source =`
div.shown {
  height: initial;
  width: initial;
}

.hidden {visibility: hidden;} .shown {visibility: visible;}`;

  const codeError = Log.codeError(mockFile, '.shown{', '.shown');
  console.log(codeError);
  expect(codeError.lineNumber).toBe(7);
});