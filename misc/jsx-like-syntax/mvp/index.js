/**
 * Get first version of this done asap to test idea
 */


const BLANK = "";
const SPACE = " ";
const DOT = ".";
const COLON = ":";
const SEMI_COLON = ";"


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
    a.forEach(b => Mono._parseCSS(b));
    Mono._parseAst();
  },

  _parseCSS(c, parentRef = null) {
    const ref = Mono._makeRef(c);
    const fullyQualifiedRef = parentRef ? `${parentRef}${SPACE}${ref}` : ref;
    Mono._saveRef(fullyQualifiedRef, c.styles);

    if (c.children.length) {
      if (parentRef) {
        parentRef += `${SPACE}${ref}`;
      } else {
        parentRef = ref;
      }

      c.children.forEach(d => Mono._parseCSS(d, parentRef));
    }
  },

  _parseAst() {
    for (var ref in Mono._AST) {
      console.log(ref);
      console.log(Mono._AST[ref]);

      ref.split(SPACE)
          .map(b => b.split(DOT))
          .forEach(c => {
            console.log(c);
          });

      console.log('------------------------');
    }
  },

  _AST: {},

  _saveRef(ref, styles) {
    if (Mono._AST[ref]) {
      try {
        Mono._stylesClash(Mono._AST[ref], styles);
        // merge styles
        Mono._AST[ref] += styles;
      } catch (e) {
        throw new e.constructor(e.message);
      }
    } else {
      Mono._AST[ref] = styles;
    }
  },

  _stylesClash(existingStyles, newStyles) {
    for (var property in Mono._stylesAsObject(newStyles)) {
      if (Mono._stylesAsObject(existingStyles)[property]) {
        throw new Error(`
          The property: '${property}' has already been defined.

          existingStyles:
            ${existingStyles}

          newStyles:
            ${newStyles}
        `);
      }
    }

    return false;
  },

  _stylesAsObject(styles) {
    const styleObj = {}

    styles.split(SEMI_COLON)
          .filter(res => res !== BLANK)
          .map(res => res.trim())
          .forEach(declaration => {
            const [property, value] = declaration.split(COLON).map(res => res.trim());
            styleObj[property] = value;
          });

    return styleObj;
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
    "span",
    null,
    "color: blue; font-style: italic;"
  ),

  Mono.createStyle(
    "span",
    null,
    "font-size: 23px; font-weight: bold; font-style:italic;line-height: 20px;"
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


Mono.createCSS(styles);
