/**
 * Get first version of this done asap to test idea
 */


const BLANK      = '';
const SPACE      = ' ';
const DOT        = '.';
const COLON      = ':';
const SEMI_COLON = ';';


class CSXException {
  constructor(message, data) {
    this.message = message;
    this.data = data;
  }
}

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
    console.log(Mono._AST);
    console.log('------------------------');

    for (var ref in Mono._AST) {
      const a = ref.split(SPACE);

      // Traverse tree to see whether ref exists (starting from right-hand-side).

      let i = a.length - 1;
      let b = BLANK;

      do {
        b = (b === BLANK) ? a[i] : `${a[i]}${SPACE}` + b;

        if (ref !== b && Mono._AST[b]) {
          // ref already exists, check if styles are unique
          try {
            Mono._stylesUnique(Mono._AST[b], Mono._AST[ref]);
          } catch (e) {
            console.log(`\n[Override Found] \`${ref}\` overrides the property \`${e.data.property}\` set by \`${b}\``);
            console.log(`\nExisting styles (\`${b}\`):\n   \`${e.data.existingStyles}\``);
            console.log(`\nNew styles (\`${ref}\`):\n   \`${e.data.newStyles}\``);
            throw new e.constructor();
          }
        }

        i--;
      } while (i >= 0);
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
        console.log(`\nThe CSS property \`${e.data.property}\` has already been defined for \`${ref}\``);
        console.log(`\nExisting styles (\`${ref}\`):\n   "${e.data.existingStyles}"`);
        console.log(`\nNew styles (\`${ref}\`):\n   "${e.data.newStyles}"`);
        throw new e.constructor();
      }
    } else {
      Mono._AST[ref] = styles;
    }
  },

  // unique in terms of CSS property (not including CSS value)
  // needs to handle: media queries, property short-hands (margin vs margin-top)
  _stylesUnique(existingStyles, newStyles) {
    for (var property in Mono._stylesAsObject(newStyles)) {
      if (Mono._stylesAsObject(existingStyles)[property]) {
        throw new CSXException('Override found', {
          property,
          existingStyles,
          newStyles
        });
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


// Usage --

const stylesWithComposition = [
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
  ),

  Mono.createStyle(
    "ul",
    "nav__links",
    "display: flex; padding-left: 0; list-style: none",
    Mono.createStyle(
      "li",
      null,
      null,
      Mono.createStyle(
        "a",
        null,
        "padding: 0 10px;"
      )
    )
  )
];

const styles = [
  Mono.createStyle(
    "p",
    null,
    "font-size: 12px;"
  ),

  // Mono.createStyle(
  //   "p",
  //   null,
  //   "font-size: 13px /* not allowed */; line-height: 20px;"
  // ),

  Mono.createStyle(
    "span",
    "errorMessage",
    "color: red;"
  ),

  Mono.createStyle(
    "form",
    "checkout",
    null,
    Mono.createStyle(
      "span",
      "errorMessage",
      "font-size: 10px;"
    )
  ),

  Mono.createStyle(
    "div",
    "wrapper",
    null,
    Mono.createStyle(
      "form",
      "checkout",
      null,
      // Mono.createStyle(
      //   "p",
      //   null,
      //   "font-size: 10px /* not allowed */;"
      // ),
      Mono.createStyle(
        "span",
        "errorMessage",
        "color: blue /* not allowed */; font-size: 12px /* not allowed */; "
      )
    )
  )
];


Mono.createCSS(styles);
