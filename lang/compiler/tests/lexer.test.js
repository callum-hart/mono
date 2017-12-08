const Lexer = require('../lexer');
const {
  AbstractNotionException,
  TypeException,
  ModifierException,
  MotiveException,
  SelectorException,
  DeclarationException
} = require('../exceptions');


const mockFile = {
  name: 'Lexer test mock file'
}


test('Detect unknown declaration type', () => {
  mockFile.source = `
  footer {
    display<locked>:flex;
  }
  `;

  const unkownType = () => Lexer.tokenize(mockFile);
  expect(unkownType).toThrow(TypeException);
  expect(unkownType).toThrow('locked is not a valid type');
});


test('Detect unknown inferred type', () => {
  mockFile.source = `
  nav<private> {
    background: var(--nav_background);
  }
  `;

  const unkownType = () => Lexer.tokenize(mockFile);
  expect(unkownType).toThrow(TypeException);
  expect(unkownType).toThrow('private is not a valid type');
});


test('Detect unknown modifier', () => {
  mockFile.source = `
  a.link:hover {
    border-color<@change>: cornflowerblue;
  }
  `;

  const unknownModifier = () => Lexer.tokenize(mockFile);
  expect(unknownModifier).toThrow(ModifierException);
  expect(unknownModifier).toThrow('@change is not a valid modifier');
});


test('Detect unknown motive', () => {
  mockFile.source = `
  aside {
    overflow<?itsFriday>: hidden;
  }
  `;

  const unknownMotive = () => Lexer.tokenize(mockFile);
  expect(unknownMotive).toThrow(MotiveException);
  expect(unknownMotive).toThrow('?itsfriday is not a valid motive');
});


test('Detect motive patch without a reason', () => {
  mockFile.source = `
  section {
    height<?patch>: 100%;
  }
  `;

  const patchWithoutReason = () => Lexer.tokenize(mockFile);
  expect(patchWithoutReason).toThrow(MotiveException);
  expect(patchWithoutReason).toThrow('?patch is missing a reason');
});


test('Detect motive because without a reason', () => {
  mockFile.source = `
  ul.nav__links {
    clear<?because>: both;
  }
  `;

  const becauseWithoutReason = () => Lexer.tokenize(mockFile);
  expect(becauseWithoutReason).toThrow(MotiveException);
  expect(becauseWithoutReason).toThrow('?because is missing a reason');
});


test('Rule-set cannot infer a modifier', () => {
  mockFile.source = `
  nav.nav--dark<@override> {
    background: dimgrey;
  }
  `;

  const inferredModifier = () => Lexer.tokenize(mockFile);
  expect(inferredModifier).toThrow(ModifierException);
  expect(inferredModifier).toThrow('nav.nav--dark<@override> cannot infer modifiers');
});


test('Rule-set cannot infer a motive', () => {
  mockFile.source = `
  aside<?veto> {
    display: inline-block;
  }
  `;

  const inferredMotive = () => Lexer.tokenize(mockFile);
  expect(inferredMotive).toThrow(MotiveException);
  expect(inferredMotive).toThrow('aside<?veto> cannot infer motives');
});


test('Detect multiple types declared in CSS declaration', () => {
  mockFile.source = `
  h1 {
    color<immutable,protected>: steelblue;
  }
  `;

  const multipleTypes = () => Lexer.tokenize(mockFile);
  expect(multipleTypes).toThrow(TypeException);
  expect(multipleTypes).toThrow('color<immutable,protected> already assigned the type IMMUTABLE');
});


test('Detect multiple types declared in inferred rule-set', () => {
  mockFile.source = `
  a.link<protected,public> {
    font-size: 14px;
  }
  `;

  const multipleTypes = () => Lexer.tokenize(mockFile);
  expect(multipleTypes).toThrow(TypeException);
  expect(multipleTypes).toThrow('a.link<protected,public> already assigned the type PROTECTED');
});


test('Detect multiple modifiers declared in CSS declaration', () => {
  mockFile.source = `
  button:hover {
    background-color<@override,@mutate>: teal;
  }
  `;

  const multipleModifiers = () => Lexer.tokenize(mockFile);
  expect(multipleModifiers).toThrow(ModifierException);
  expect(multipleModifiers).toThrow('background-color<@override,@mutate> already assigned the modifier OVERRIDE');
});


test('Detect trailing comma in notion combinator', () => {
  mockFile.source = `
  li {
    list-style<?veto,>: none;
  }
  `;

  const trailingComma = () => Lexer.tokenize(mockFile);
  expect(trailingComma).toThrow(AbstractNotionException);
  expect(trailingComma).toThrow('Trailing comma found in combinator');
});


test('Detect trailing comma in inferred notion combinator', () => {
  mockFile.source = `
  a.link<protected,> {
    color: cadetblue;
    border-bottom: 1px solid transparent;
  }
  `;

  const trailingComma = () => Lexer.tokenize(mockFile);
  expect(trailingComma).toThrow(AbstractNotionException);
  expect(trailingComma).toThrow('Trailing comma found in combinator');
});


test('Detect missing element type', () => {
  mockFile.source = `
  .sideBar {
    width: var(--sideBar_width);
  }
  `;

  const missingElementType = () => Lexer.tokenize(mockFile);
  expect(missingElementType).toThrow(SelectorException);
  expect(missingElementType).toThrow('.sideBar is missing element type');
});


test('Element type as className shouldn\'t trick lexer', () => {
  mockFile.source = `
  .div {
    float: left;
  }
  `;

  const missingElementType = () => Lexer.tokenize(mockFile);
  expect(missingElementType).toThrow(SelectorException);
  expect(missingElementType).toThrow('.div is missing element type');
});


test('Element type as ID shouldn\'t trick lexer', () => {
  mockFile.source = `
  #section {
    width: 100%;
  }
  `;

  const missingElementType = () => Lexer.tokenize(mockFile);
  expect(missingElementType).toThrow(SelectorException);
  expect(missingElementType).toThrow('#section is missing element type');
});


test('Detect descendant selector missing element type', () => {
  mockFile.source = `
  nav .nav__links {
    float: right;
  }
  `;

  const missingElementType = () => Lexer.tokenize(mockFile);
  expect(missingElementType).toThrow(SelectorException);
  expect(missingElementType).toThrow('.nav__links is missing element type');
});


test('Detect adjacent sibling missing element type', () => {
  mockFile.source = `
  ul + .title {
    font-weight: bold;
  }
  `;

  const missingElementType = () => Lexer.tokenize(mockFile);
  expect(missingElementType).toThrow(SelectorException);
  expect(missingElementType).toThrow('.title is missing element type');
});


test('Detect general sibling missing element type', () => {
  mockFile.source = `
  img ~ .imgLabel {
    font-size: 0.8em;
  }
  `;

  const missingElementType = () => Lexer.tokenize(mockFile);
  expect(missingElementType).toThrow(SelectorException);
  expect(missingElementType).toThrow('.imgLabel is missing element type');
});


test('Detect child combinator missing element type', () => {
  mockFile.source = `
  ul.menu > .menu__item {
    margin-left<?veto>: 0;
  }
  `;

  const missingElementType = () => Lexer.tokenize(mockFile);
  expect(missingElementType).toThrow(SelectorException);
  expect(missingElementType).toThrow('.menu__item is missing element type');
});


test('Detect pseudo-class missing element type', () => {
  mockFile.source = `
  .btn:hover {
    pointer-events: none;
  }
  `;

  const missingElementType = () => Lexer.tokenize(mockFile);
  expect(missingElementType).toThrow(SelectorException);
  expect(missingElementType).toThrow('.btn:hover is missing element type');
});


test('Detect pseudo-element missing element type', () => {
  mockFile.source = `
  .arrow::after {
    content: '';
  }
  `;

  const missingElementType = () => Lexer.tokenize(mockFile);
  expect(missingElementType).toThrow(SelectorException);
  expect(missingElementType).toThrow('.arrow::after is missing element type');
});


test('Detect missing element type in multiple selectors', () => {
  mockFile.source = `
  h1, h2, .heading {
    -webkit-font-smoothing: antialiased;
  }
  `;

  const missingElementType = () => Lexer.tokenize(mockFile);
  expect(missingElementType).toThrow(SelectorException);
  expect(missingElementType).toThrow('.heading is missing element type');
});


test('Detect invalid element type', () => {
  mockFile.source = `
  spinner {
    display: flex;
  }
  `;

  const invalidElementType = () => Lexer.tokenize(mockFile);
  expect(invalidElementType).toThrow(SelectorException);
  expect(invalidElementType).toThrow('spinner is not a valid element type');
});


test('Detect descendant selector using invalid element type', () => {
  mockFile.source = `
  nav spinner {
    float: right;
  }
  `;

  const invalidElementType = () => Lexer.tokenize(mockFile);
  expect(invalidElementType).toThrow(SelectorException);
  expect(invalidElementType).toThrow('spinner is not a valid element type');
});


test('Detect adjacent sibling using invalid element type', () => {
  mockFile.source = `
  ul + spinner {
    font-weight: bold;
  }
  `;

  const invalidElementType = () => Lexer.tokenize(mockFile);
  expect(invalidElementType).toThrow(SelectorException);
  expect(invalidElementType).toThrow('spinner is not a valid element type');
});


test('Detect general sibling using invalid element type', () => {
  mockFile.source = `
  img ~ spinner {
    font-size: 0.8em;
  }
  `;

  const invalidElementType = () => Lexer.tokenize(mockFile);
  expect(invalidElementType).toThrow(SelectorException);
  expect(invalidElementType).toThrow('spinner is not a valid element type');
});


test('Detect child combinator using invalid element type', () => {
  mockFile.source = `
  ul.menu > spinner {
    margin-left<?veto>: 0;
  }
  `;

  const invalidElementType = () => Lexer.tokenize(mockFile);
  expect(invalidElementType).toThrow(SelectorException);
  expect(invalidElementType).toThrow('spinner is not a valid element type');
});


test('Detect pseudo-class using invalid element type', () => {
  mockFile.source = `
  spinner:hover {
    pointer-events: none;
  }
  `;

  const invalidElementType = () => Lexer.tokenize(mockFile);
  expect(invalidElementType).toThrow(SelectorException);
  expect(invalidElementType).toThrow('spinner is not a valid element type');
});


test('Detect pseudo-element using invalid element type', () => {
  mockFile.source = `
  spinner::after {
    content: '';
  }
  `;

  const invalidElementType = () => Lexer.tokenize(mockFile);
  expect(invalidElementType).toThrow(SelectorException);
  expect(invalidElementType).toThrow('spinner is not a valid element type');
});


test('Detect invalid element type in multiple selectors', () => {
  mockFile.source = `
  p.title, title {
    -webkit-font-smoothing: antialiased;
  }
  `;

  const invalidElementType = () => Lexer.tokenize(mockFile);
  expect(invalidElementType).toThrow(SelectorException);
  expect(invalidElementType).toThrow('title is not a valid element type');
});


test('Detect the usage of !important', () => {
  mockFile.source = `
  button.dontate {
    opacity: 0 !important;
  }
  `;

  const importantDeclaration = () => Lexer.tokenize(mockFile);
  expect(importantDeclaration).toThrow(DeclarationException);
  expect(importantDeclaration).toThrow('opacity: 0 !important; uses !important');
});

