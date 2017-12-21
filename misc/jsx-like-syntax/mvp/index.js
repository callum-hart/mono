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

  createCSS(styles) {
    styles.forEach(block => Mono._parseStyles(block));
    Mono._parseAst();
  },

  _parseStyles(block, parentRef = null) {
    const ref = Mono._makeRef(block);
    const fullyQualifiedRef = parentRef ? `${parentRef}${SPACE}${ref}` : ref;
    Mono._saveRef(fullyQualifiedRef, block.styles);

    if (block.children.length) {
      if (parentRef) {
        parentRef += `${SPACE}${ref}`;
      } else {
        parentRef = ref;
      }

      block.children.forEach(child => Mono._parseStyles(child, parentRef));
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
      // ref already exists, merge styles with existing styles if no overrides present.
      try {
        Mono._stylesUnique(Mono._AST[ref], styles);
        Mono._AST[ref] += styles; // merge styles
      } catch (e) {
        throw new e.constructor(e.message);
      }
    } else {
      Mono._AST[ref] = styles;
    }
  },

  // unique in terms of CSS property (not including CSS value)
  // would need to handle short-hands (margin vs margin-top)
  _stylesUnique(existingStyles, newStyles) {
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

    return true;
  },

  _stylesAsObject(styles) {
    const styleObj = {}

    styles.split(SEMI_COLON)
          .filter(res => res !== BLANK)
          .map(res => res.trim())
          .forEach(declaration => {
            const [property, value] = declaration.split(COLON).map(res => res.trim());
            styleObj[property.toLowerCase()] = value;
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
    "font-size: 23px; font-weight: bold; line-height: 20px;"
  ),

  Mono.createStyle(
    "span",
    "error-message",
    "color: red; font-weight: bold;"
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
      "display: block;",
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
