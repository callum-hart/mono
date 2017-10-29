const Lexer = require('../lexer');
const {
  AbstractNotionException,
  TypeException,
  ModifierException,
  MotiveException
} = require('../exceptions');


const mockFile = {
  name: 'Lexer test mock file'
}

// todo: add tests for token generation, once lexer complete


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
  .nav--dark<@override> {
    background: dimgrey;
  }
  `;

  const inferredModifier = () => Lexer.tokenize(mockFile);
  expect(inferredModifier).toThrow(ModifierException);
  expect(inferredModifier).toThrow('.nav--dark<@override> cannot infer modifiers');
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


test('Detect multiple modifiers', () => {
  mockFile.source = `
  button:hover {
    background-color<@override,@mutate>: teal;
  }
  `;

  const multipleModifiers = () => Lexer.tokenize(mockFile);
  expect(multipleModifiers).toThrow(ModifierException);
  expect(multipleModifiers).toThrow('background-color<@override,@mutate> already assigned the modifier OVERRIDE');
});


test('Detect combinator missing notion in CSS declaration', () => {
  mockFile.source = `
  li {
    list-style<?veto,>: none;
  }
  `;

  const trailingComma = () => Lexer.tokenize(mockFile);
  expect(trailingComma).toThrow(AbstractNotionException);
  expect(trailingComma).toThrow('Trailing comma found in combinator');
});