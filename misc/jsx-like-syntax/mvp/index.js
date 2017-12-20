/**
 * Get first version of this done asap to test idea
 */


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

  creatCSS(a) {
    a.forEach(b => Mono._makeCSS(b));
    Mono._parseAst();
  },

  _makeCSS(s, parentRef = null) {
    const ref = Mono._makeRef(s);
    const fullRef = parentRef ? `${parentRef}${SPACE}${ref}` : ref;

    console.log(`fullRef: ${fullRef}`);
    Mono._saveRef(fullRef, s.styles);

    if (s.children.length) {
      if (parentRef) {
        parentRef += `${SPACE}${ref}`;
      } else {
        parentRef = ref;
      }

      s.children.map(b => Mono._makeCSS(b, parentRef));
    }
  },

  _parseAst() {
    console.log(Mono._AST);
  },

  _AST: {},

  _saveRef(ref, styles) {
    if (Mono._AST[ref]) {
      console.log(`ref: ${ref} already saved, merge styles with existing ref?`);
    } else {
      Mono._AST[ref] = styles;
    }
  },

  _makeSelector({element, className}) {
    if (className) {
      return `${element}[class="${className.replace(DOT, SPACE)}"]`;
    } else {
      return element;
    }
  },

  _makeRef({element, className}) {
    if (className) {
      return `${element}${DOT}${className}`;
    } else {
      return element;
    }
  },

  _makeSelectorFromRef(ref) {
    console.log(`[_makeSelectorFromRef] ref: ${ref}`);
  }
}



const styles = [
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


Mono.creatCSS(styles);
