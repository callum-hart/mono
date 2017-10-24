const Formatter = require('../formatter');
const { CSSException } = require('../exceptions');


const mockFile = {
  name: 'mock mono file'
}


test('Single line comments should be removed', () => {
  mockFile.source = `

  /* single line comment */
  footer {
    height: 300px /* inline comment */;
    width: 100%;

    /* footer typography */
    font-size: 12px;
    font-familiy: Operator Mono   /*     assign to variable     */;

    /* footer theme colors */
    background: var(--footer_background) /* another inline comment */;
  }
  `;

  expect(Formatter.format(mockFile)).toBe(`footer{
  height: 300px;
  width: 100%;
  font-size: 12px;
  font-familiy: Operator Mono;
  background: var(--footer_background);
}
`);
});


test('Multi-line comments should be removed', () => {
  mockFile.source = `

  /*
    Styles for nav
  */

  nav {
    background: var(--nav_background);
    height: 80px;
    width: 100%;
  }

  /* Nav layout

  */

  /*

        Company logo
*/
  nav .logo {
    display: block;
    float: left;
    margin-left: 20px;
  }
  `;

  expect(Formatter.format(mockFile)).toBe(`nav{
  background: var(--nav_background);
  height: 80px;
  width: 100%;
}
nav .logo{
  display: block;
  float: left;
  margin-left: 20px;
}
`);
});


test('Single rule-set formatting', () => {
  mockFile.source = `


  .heading {
              font-size:         14px;

        font-weight: bold;

    font-familiy: Operator Mono;

  line-height: 20px;}`;

  expect(Formatter.format(mockFile)).toBe(`.heading{
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

  expect(Formatter.format(mockFile)).toBe(`h1{
  font-size: 30px;
}
h2{
  font-size: 24px;
}
h3{
  font-size: 20px;
}
.heading{
  font-size: 14px;
  font-weight: bold;
  font-familiy: Operator Mono;
  line-height: 20px;
}
`);
});


test('No space before opening rule-set brace', () => {
  mockFile.source = `
  p


        {
    color: darkslategrey;
  }
  `;

  expect(Formatter.format(mockFile)).toBe(`p{
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

  expect(Formatter.format(mockFile)).toBe(`@media (min-width: 600px) and (max-width: 900px){
  h1{
    font-size: 24px;
  }
}
@media (min-width: 900px){
  h1{
    font-size: 28px;
  }
}
`);
});

// @pending for now - depends on how multi-selectors are tokenized
// test('Multi-line selectors should be on same line', () => {
//   mockFile.source = `

//   h1,
//   h2,
//   h3,
//   h4,
//   h5 {
//     color: lightslategray;
//   }`;

//   expect(Formatter.format(mockFile)).toBe(`h1, h2, h3, h4, h5{
//   color: lightslategray;
// }
// `);
// });


test('One rule-set per line', () => {
  mockFile.source = `

  .show { display: flex }; .hide { display: none };

  `;

  expect(Formatter.format(mockFile)).toBe(`.show{
  display: flex;
}
.hide{
  display: none;
}
`);
});


test('Multi-line declarations formatted to single line', () => {
  mockFile.source = `

nav {
  background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0%, rgba(0, 0, 0, 1)),
      color-stop(100%, rgba(255, 255, 255, 1))
    );
  background: -ms-linear-gradient(
      top,
      #000 0%,
      #fff 100%
    );
  filter: progid:DXImageTransform.Microsoft.gradient(
      startColorstr=rgba(0, 0, 0, .1),
      endColorstr="#fff",
      GradientType=0
    );
  transition: color 0.3s ease-in,
              transform 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}

@font-face{
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
      url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
}

  `;

  expect(Formatter.format(mockFile)).toBe(`nav{
  background: -webkit-gradient(linear,left top,left bottom,color-stop(0%, rgba(0, 0, 0, 1)),color-stop(100%, rgba(255, 255, 255, 1)));
  background: -ms-linear-gradient(top, #000 0%, #fff 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=rgba(0, 0, 0, 0.1),endColorstr="#fff",GradientType=0);
  transition: color 0.3s ease-in,transform 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
@font-face{
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
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

  expect(Formatter.format(mockFile)).toBe(`.link<immutable>{
  color: cadetblue;
  text-decoration: none;
}
`);
});


test('Grouped rule-set containing inferred rule-sets', () => {
  mockFile.source = `

  .spacer {}

  div.eins, span.zwei<    protected   > , #drei {
    display: flex;
    align-items: center;
  }`;

  expect(Formatter.format(mockFile)).toBe(`.spacer{
}
div.eins,
span.zwei<protected>,
#drei{
  display: flex;
  align-items: center;
}
`);
});


test('Single line mono notion formatting', () => {
  mockFile.source = `

  .hidden     {
    display<   immutable    >: none;
  }
  `;

  expect(Formatter.format(mockFile)).toBe(`.hidden{
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

  expect(Formatter.format(mockFile)).toBe(`.hidden{
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

  expect(Formatter.format(mockFile)).toBe(`.error{
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

  expect(Formatter.format(mockFile)).toBe(`.error{
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

  expect(Formatter.format(mockFile)).toBe(`a.link{
  color<protected>: deepskyblue;
}
div > span{
  display: block;
}
a.link:hover{
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

  expect(Formatter.format(mockFile)).toBe(`section.leftBar{
  margin-left<?because('align with <...>')>: 20px;
}
footer{
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

  expect(Formatter.format(mockFile)).toBe(`.toastMessage.showing{
  opacity<immutable,?overrule>: 1;
  visibility<immutable,?overrule>: visible;
  pointer-events<immutable,?overrule>: auto;
}
`);
});


test('Invalid CSS detected (double colon) should throw CSSException', () => {
  mockFile.source = `
  nav {
    height::80px;
  }
  `;

  const doubleColon = () => Formatter.format(mockFile);
  expect(doubleColon).toThrowError(CSSException);
});


test('Invalid CSS detected (missing semicolon) should throw CSSException', () => {
  mockFile.source = `
  footer {
    height: 400px
    width: 100%
  }
  `;

  const doubleColon = () => Formatter.format(mockFile);
  expect(doubleColon).toThrow(CSSException);
});