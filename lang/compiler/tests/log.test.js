const Log = require('../log');


const mockFile = {
  name: 'Log test mock file'
}


test('`codeError` finds unique match', () => {
  mockFile.source =`h1{
  font-size: 20px;
}

.title{
  color<locked>: cadetblue;
}`;

  const codeError = Log.codeError(mockFile, 'color<locked>: cadetblue;', 'locked');
  console.log(codeError);
  expect(codeError.lineNumber).toBe(6);
});


test('`codeError` ignores matches in comments', () => {
  mockFile.source =`h1{
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
  expect(codeError.lineNumber).toBe(12);
});


test('`codeError` finds exact match', () => {
  mockFile.source =`h1.title{
  font-size: 20px;
}

.title{
  color: cadetblue;
}`;

  const codeError = Log.codeError(mockFile, '.title{', '.title');
  console.log(codeError);
  expect(codeError.lineNumber).toBe(5);
});