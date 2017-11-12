const Lexer = require('../lexer');


const mockFile = {
  name: 'Token test mock file'
}


test('Simple rule-set', () => {
  mockFile.source = `
  div {
    float: left;
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'SELECTOR', 'div', [ 1 ], null ],
    [ 'DECLARATION', 'float: left;', [ 2 ], null ],
    [ 'BRACE_CLOSE', '}', [ 3 ] ]
  ]);
});


test('Declaration with type', () => {
  mockFile.source = `
  div.hidden {
    display<immutable>: none;
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'SELECTOR', 'div.hidden', [ 1 ], null ],
    [ 'DECLARATION', 'display<immutable>: none;', [ 2 ], [ 'IMMUTABLE', undefined, undefined, undefined ] ],
    [ 'BRACE_CLOSE', '}', [ 3 ] ]
  ]);
});


test('Declaration with modifier', () => {
  mockFile.source = `
  a.link:hover {
    color<@override>: darkolivegreen;
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'SELECTOR', 'a.link:hover', [ 1 ], null ],
    [ 'DECLARATION', 'color<@override>: darkolivegreen;', [ 2 ], [ undefined, 'OVERRIDE', undefined, undefined ] ],
    [ 'BRACE_CLOSE', '}', [ 3 ] ]
  ]);
});


test('Declaration with motive', () => {
  mockFile.source = `
  button.btn {
    background-color<?overthrow>: honeydew;
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'SELECTOR', 'button.btn', [ 1 ], null ],
    [ 'DECLARATION', 'background-color<?overthrow>: honeydew;', [ 2 ], [ undefined, undefined, 'OVERTHROW', undefined ] ],
    [ 'BRACE_CLOSE', '}', [ 3 ] ]
  ]);
});


test('Declaration with motive & reason', () => {
  mockFile.source = `
  a.signIn {
    color<?patch("eng-123")>: cadetblue;
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'SELECTOR', 'a.signIn', [ 1 ], null ],
    [ 'DECLARATION', 'color<?patch("eng-123")>: cadetblue;', [ 2 ], [ undefined, undefined, 'PATCH', '\"eng-123\"' ] ],
    [ 'BRACE_CLOSE', '}', [ 3 ] ]
  ]);
});


test('Declaration with multiple notions', () => {
  mockFile.source = `
  ul.contactList {
    margin-left<immutable,?veto>: 0;
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'SELECTOR', 'ul.contactList', [ 1 ], null ],
    [ 'DECLARATION', 'margin-left<immutable,?veto>: 0;', [ 2 ], [ 'IMMUTABLE', undefined, 'VETO', undefined ] ],
    [ 'BRACE_CLOSE', '}', [ 3 ] ]
  ]);
});


test('Rule-set with inferred type', () => {
  mockFile.source = `
  img.avatar<immutable> {
    height: 40px;
    width: 40px;
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'SELECTOR', 'img.avatar<immutable>', [ 1 ], [ 'IMMUTABLE', undefined, undefined, undefined ] ],
    [ 'DECLARATION', 'height: 40px;', [ 2 ], null ],
    [ 'DECLARATION', 'width: 40px;', [ 3 ], null ],
    [ 'BRACE_CLOSE', '}', [ 4 ] ]
  ]);
});


test('Grouped rule-set', () => {
  mockFile.source = `
  h1, h2, h3 {
    color: aliceblue;
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'SELECTOR', 'h1', [ 1 ], null ],
    [ 'SELECTOR', 'h2', [ 2 ], null ],
    [ 'SELECTOR', 'h3', [ 3 ], null ],
    [ 'DECLARATION', 'color: aliceblue;', [ 4 ], null ],
    [ 'BRACE_CLOSE', '}', [ 5 ] ]
  ]);
});


test('Grouped rule-set with declaration type', () => {
  mockFile.source = `
  input, button {
    outline<immutable>: none;
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'SELECTOR', 'input', [ 1 ], null ],
    [ 'SELECTOR', 'button', [ 2 ], null ],
    [ 'DECLARATION', 'outline<immutable>: none;', [ 3 ], [ 'IMMUTABLE', undefined, undefined, undefined ] ],
    [ 'BRACE_CLOSE', '}', [ 4 ] ]
  ]);
});


test('Simple media query', () => {
  mockFile.source = `
  @media (max-width:300px) {
    div.hideOnSmall {
      display: none;
    }
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'MEDIA_QUERY', '@media (max-width: 300px)', [ 1 ] ],
    [ 'BRACE_OPEN', '{', [ 1, 26 ] ],
    [ 'SELECTOR', 'div.hideOnSmall', [ 2 ], null ],
    [ 'DECLARATION', 'display: none;', [ 3 ], null ],
    [ 'BRACE_CLOSE', '}', [ 4 ] ],
    [ 'BRACE_CLOSE', '}', [ 5 ] ]
  ]);
});


test('Media query with mono notions', () => {
  mockFile.source = `
  @media (min-width:301px) and (max-width:600px) {
    nav {
      height<immutable>: var(--navHeight);
    }

    footer<immutable> {
      height: var(--footerHeight);
      margin-left<?because('ensure central alignment')>: auto;
      margin-right<?because('ensure central alignment')>: auto;
    }
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'MEDIA_QUERY', '@media (min-width: 301px) and (max-width: 600px)', [ 1 ] ],
    [ 'BRACE_OPEN', '{', [ 1, 49 ] ],
    [ 'SELECTOR', 'nav', [ 2 ], null ],
    [ 'DECLARATION', 'height<immutable>: var(--navHeight);', [ 3 ], [ 'IMMUTABLE', undefined, undefined, undefined ] ],
    [ 'BRACE_CLOSE', '}', [ 4 ] ],
    [ 'SELECTOR', 'footer<immutable>', [ 5 ], [ 'IMMUTABLE', undefined, undefined, undefined ] ],
    [ 'DECLARATION', 'height: var(--footerHeight);', [ 6 ], null ],
    [ 'DECLARATION', 'margin-left<?because(\'ensure central alignment\')>: auto;', [ 7 ], [ undefined, undefined, 'BECAUSE', '\'ensure central alignment\'' ] ],
    [ 'DECLARATION', 'margin-right<?because(\'ensure central alignment\')>: auto;', [ 8 ], [ undefined, undefined, 'BECAUSE', '\'ensure central alignment\'' ] ],
    [ 'BRACE_CLOSE', '}', [ 9 ] ],
    [ 'BRACE_CLOSE', '}', [ 10 ] ]
  ]);
});


test('Keyframe using percentages', () => {
  mockFile.source = `
  @keyframes fontbulger {
    0% {
      font-size: 10px;
    }
    30% {
      font-size: 15px;
    }
    100% {
      font-size: 12px;
    }
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'KEYFRAME', '@keyframes fontbulger', [ 1 ] ],
    [ 'BRACE_OPEN', '{', [ 1, 22 ] ],
    [ 'KEYFRAME_SELECTOR', '0%{', [ 2 ] ],
    [ 'DECLARATION', 'font-size: 10px;', [ 3 ], null ],
    [ 'BRACE_CLOSE', '}', [ 4 ] ],
    [ 'KEYFRAME_SELECTOR', '30%{', [ 5 ] ],
    [ 'DECLARATION', 'font-size: 15px;', [ 6 ], null ],
    [ 'BRACE_CLOSE', '}', [ 7 ] ],
    [ 'KEYFRAME_SELECTOR', '100%{', [ 8 ] ],
    [ 'DECLARATION', 'font-size: 12px;', [ 9 ], null ],
    [ 'BRACE_CLOSE', '}', [ 10 ] ],
    [ 'BRACE_CLOSE', '}', [ 11 ] ]
  ]);
});


test('Keyframe with comma-separated keyframe-selectors', () => {
  mockFile.source = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-50px);
    }
    60% {
      transform: translateY(-40px);
    }
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'KEYFRAME', '@keyframes bounce', [ 1 ] ],
    [ 'BRACE_OPEN', '{', [ 1, 18 ] ],
    [ 'KEYFRAME_SELECTOR', '0%,20%,50%,80%,100%{', [ 2 ] ],
    [ 'DECLARATION', 'transform: translateY(0);', [ 3 ], null ],
    [ 'BRACE_CLOSE', '}', [ 4 ] ],
    [ 'KEYFRAME_SELECTOR', '40%{', [ 5 ] ],
    [ 'DECLARATION', 'transform: translateY(-50px);', [ 6 ], null ],
    [ 'BRACE_CLOSE', '}', [ 7 ] ],
    [ 'KEYFRAME_SELECTOR', '60%{', [ 8 ] ],
    [ 'DECLARATION', 'transform: translateY(-40px);', [ 9 ], null ],
    [ 'BRACE_CLOSE', '}', [ 10 ] ],
    [ 'BRACE_CLOSE', '}', [ 11 ] ]
  ]);
});


test('Keyframe with keyword keyframe-selectors (from & to)', () => {
  mockFile.source = `
  @keyframes slide {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100px);
    }
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'KEYFRAME', '@keyframes slide', [ 1 ] ],
    [ 'BRACE_OPEN', '{', [ 1, 17 ] ],
    [ 'KEYFRAME_SELECTOR', 'from{', [ 2 ] ],
    [ 'DECLARATION', 'transform: translateX(0);', [ 3 ], null ],
    [ 'BRACE_CLOSE', '}', [ 4 ] ],
    [ 'KEYFRAME_SELECTOR', 'to{', [ 5 ] ],
    [ 'DECLARATION', 'transform: translateX(100px);', [ 6 ], null ],
    [ 'BRACE_CLOSE', '}', [ 7 ] ],
    [ 'BRACE_CLOSE', '}', [ 8 ] ]
  ]);
});


test('Font-face at-rule', () => {
  mockFile.source = `
  @font-face {
    font-family: "Open Sans";
    src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
         url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
  }
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'FONT_FACE', '@font-face', [ 1 ] ],
    [ 'BRACE_OPEN', '{', [ 1, 11 ] ],
    [ 'DECLARATION', 'font-family: "Open Sans";', [ 2 ], null ],
    [ 'DECLARATION', 'src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),url("/fonts/OpenSans-Regular-webfont.woff") format("woff");', [ 3 ], null ],
    [ 'BRACE_CLOSE', '}', [ 4 ] ]
  ]);
});


test('Charset at-rule', () => {
  mockFile.source = `
  @charset "utf-8";
  `;

  expect(Lexer.tokenize(mockFile)).toEqual([
    [ 'CHARSET', '@charset "utf-8";', [ 1 ] ]
  ]);
});

