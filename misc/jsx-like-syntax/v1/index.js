const SPACE = " ";
const DOT = ".";


const Mono = {
  createStyle(element, className, styles, ...children) {
    return {
      element,
      className,
      styles,
      children
    };
  },

  createCSS(a) {
    let CSS = '';

    if (a.length) {
      a.forEach(s => {
        const selector = Mono._makeSelector(s);
        console.log(selector);
        console.log(s.styles);
        console.log('-------------------------------');
        CSS += `${selector} { ${s.styles} }`;

        if (s.children.length) {
          parentSelector = selector;
          s.children.map(Mono.createCSS);
        }
      });
    } else {
      const selector = Mono._makeSelector(a);
      CSS += `${parentSelector}${SPACE}${selector} { ${a.styles} }`;
      console.log(`${parentSelector}${SPACE}${selector}`);
      console.log(a.styles);
      console.log('-------------------------------');

      if (a.children.length) {
        parentSelector += `${SPACE}${selector}`;
        a.children.map(Mono.createCSS);
      }
    }

    console.log(CSS);
  },


  _makeSelector({element, className}) {
    if (className) {
      return `${element}[class="${className.replace(DOT, SPACE)}"]`;
    } else {
      return element;
    }
  }
}



const ast = [
  Mono.createStyle(
    "form",
    null,
    "display: block;"
  ),

  Mono.createStyle(
    "form",
    "base-form",
    "padding: 20px; margin: 10px;background: ivory; border: 1px solid grey;",
    Mono.createStyle(
      "p",
      null,
      "font-size: 12px;color: #333;"
    ),
    Mono.createStyle(
      "span",
      "error-message",
      "display: none;"
    )
  ),

  Mono.createStyle(
    "form",
    "base-form.base-form--saving",
    "background: lightgrey; opacity: 0.8; pointer-events: none;"
  ),

  Mono.createStyle(
    "form",
    "base-form.base-form--error",
    "border: 1px solid red;",
    Mono.createStyle(
      "input",
      null,
      "border: 1px solid red;"
    ),
    Mono.createStyle(
      "span",
      "error-message",
      "display: block; color: red;",
      Mono.createStyle(
        "a",
        "anotherLink",
        "color: grey"
      ),
      Mono.createStyle(
        "p",
        null,
        "font-size: 20px",
        Mono.createStyle(
          "a",
          "yetAnotherLink",
          "color: RED"
        )
      )
    )
  )
];


Mono.createCSS(ast);