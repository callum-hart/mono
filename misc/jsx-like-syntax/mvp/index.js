/**
 * Get first version of this done asap to test idea
 *
 * Todos:
 * - media queries (in progress)
 * - composition
 * - inheritance
 *
 * With this implementation all styles are immutable... more
 * suitable project name immutable-css?
 */


const BLANK      = '';
const SPACE      = ' ';
const DOT        = '.';
const COLON      = ':';
const SEMI_COLON = ';';
const ZERO       = 0;


class CSXException {
  constructor(message, data) {
    this.message = message;
    this.data = data;
  }
}

const Mono = {
  createStyle(element, attrs, styles, ...children) {
    return {
      element,
      attrs,
      styles,
      children
    }
  },

  createCSS(styles) {
    styles.forEach(block => Mono._parseStyles(block));
    Mono._parseAst();
  },

  // todo: needs to handle inferred media queries & validate against nested media queries
  _parseStyles(block, parentRef = null) {
    const ref = Mono._makeRef(block);
    const fullyQualifiedRef = parentRef ? `${parentRef}${SPACE}${ref}` : ref;
    Mono._saveRef(fullyQualifiedRef, block);

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
    console.log('AST:');
    console.log(Mono._AST);
    console.log('---------------------------------------------');

    for (var ref in Mono._AST) {
      const a = ref.split(SPACE);
      let i = a.length - 1;
      let b = BLANK;

      // traverse tree to see whether ref exists (moving from right to left).
      do {
        b = (b === BLANK) ? a[i] : `${a[i]}${SPACE}` + b;

        if (ref !== b && Mono._AST[b]) {
          // ref already exists, check if styles are unique
          try {
            Mono._stylesUnique(Mono._AST[b], Mono._AST[ref]); // todo: not working since changes to ref & _stylesUnique
          } catch (e) {
            console.log(`\n[Override Found] \`${ref}\` overrides the property \`${e.data.property}\` set by \`${b}\``);
            console.log(`\nExisting style (\`${b}\`):\n   \`${e.data.existingStyles}\``);
            console.log(`\nNew style (\`${ref}\`):\n   \`${e.data.newStyles}\``);
            throw new e.constructor();
          }
        }

        i--;
      } while (i >= 0);
    }
  },

  _AST: {},

  _saveRef(ref, {styles, attrs}) {
    if (Mono._AST[ref]) {
      // ref already exists, merge styles with existing styles if no overrides present.
      const newStyles = Mono._createStyleEntry(styles, attrs);

      try {
        Mono._AST[ref].forEach(existingStyles => Mono._stylesUnique(existingStyles, newStyles));
        Mono._AST[ref].push(newStyles); // save styles
      } catch (e) {
        console.log(`\nThe CSS property \`${e.data.property}\` has already been defined for \`${ref}\``);
        console.log(`\nExisting style (\`${ref}\`):\n   "${e.data.existingStyles.styles}"`);
        console.log(`\nNew style (\`${ref}\`):\n   "${e.data.newStyles.styles}"`);
        throw new e.constructor();
      }
    } else {
      Mono._AST[ref] = [Mono._createStyleEntry(styles, attrs)];
    }
  },

  _createStyleEntry(styles, attrs) {
    const minWidth = (attrs && attrs.minWidth) ? attrs.minWidth : ZERO;
    const maxWidth = (attrs && attrs.maxWidth) ? attrs.maxWidth : Infinity;

    return {
      styles,
      minWidth,
      maxWidth
    }
  },

  // unique in terms of CSS property (not including CSS value)
  // needs to handle property short-hands (margin vs margin-top) or validate against short-hand usage
  _stylesUnique(existingStyles, newStyles) {
    if (Mono._breakpointsOverlap(existingStyles, newStyles)) {
      console.log('breakpoints overlap');
      for (var property in Mono._stylesToObject(newStyles.styles)) {
        if (Mono._stylesToObject(existingStyles.styles)[property]) {
          console.log('override found');
          throw new CSXException('Override found', {
            property,
            existingStyles,
            newStyles
          });
        } else {
          console.log('no overrides found');
        }
      }
    } else {
      console.log('breakpoints don\'t overlap');
    }

    return true;
  },

  _breakpointsOverlap(rangeA, rangeB) {
    const bothBelow = (rangeB.minWidth < rangeA.minWidth) && (rangeB.maxWidth < rangeA.minWidth);
    const bothAbove = (rangeB.minWidth > rangeA.maxWidth) && (rangeB.maxWidth > rangeA.maxWidth);

    if (bothBelow || bothAbove) {
      return false;
    } else {
      return true;
    }
  },

  _stylesToObject(styles) {
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

  _makeSelector({element, attrs}) {
    if (attrs && attrs.className) {
      return `${element}[class="${attrs.className.replace(DOT, SPACE)}"]`;
    } else {
      return element;
    }
  },

  _makeRef({element, attrs}) {
    if (attrs && attrs.className) {
      return `${element}${DOT}${attrs.className}`;
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
    {
      className: "error-message"
    },
    "color: red; font-weight: bold;"
  ),

  Mono.createStyle(
    "form",
    {
      className: "base-form"
    },
    "padding: 20px; margin: 10px;background: ivory; border: 1px solid grey;",
    Mono.createStyle(
      "p",
      null,
      "font-size: 12px;color: #333;"
    ),
    Mono.createStyle(
      "span",
      {
        className: "error-message"
      },
      "display: none;"
    )
  ),

  Mono.createStyle(
    "form",
    {
      className: "base-form.base-form--saving"
    },
    "background: lightgrey; opacity: 0.8; pointer-events: none;"
  ),

  Mono.createStyle(
    "form",
    {
      className: "base-form.base-form--error"
    },
    "border: 1px solid red;",
    Mono.createStyle(
      "input",
      null,
      "border: 1px solid red;"
    ),
    Mono.createStyle(
      "span",
      {
        className: "error-message"
      },
      "display: block;",
      Mono.createStyle(
        "a",
        {
          className: "anotherLink"
        },
        "color: grey"
      ),
      Mono.createStyle(
        "p",
        null,
        "font-size: 20px",
        Mono.createStyle(
          "a",
          {
            className: "yetAnotherLink"
          },
          "color: RED"
        )
      )
    )
  ),

  Mono.createStyle(
    "ul",
    {
      className: "nav__links"
    },
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

const stylesWithOverrides = [
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
    {
      className: "errorMessage"
    },
    "color: red;"
  ),

  Mono.createStyle(
    "form",
    {
      className: "checkout"
    },
    null,
    Mono.createStyle(
      "span",
      {
        className: "errorMessage"
      },
      "font-size: 10px;"
    )
  ),

  Mono.createStyle(
    "div",
    {
      className: "wrapper"
    },
    null,
    Mono.createStyle(
      "form",
      {
        className: "checkout"
      },
      null,
      // Mono.createStyle(
      //   "p",
      //   null,
      //   "font-size: 10px /* not allowed */;"
      // ),
      Mono.createStyle(
        "span",
        {
          className: "errorMessage"
        },
        "color: blue /* not allowed */; font-size: 12px /* not allowed */; "
      )
    )
  )
];

const stylesWithMediaQueries = [
  Mono.createStyle(
    "span",
    {
      className: "errorMessage",
      minWidth: 300,
      maxWidth: 600
    },
    "color: red;"
  ),

  Mono.createStyle(
    "span",
    {
      className: "errorMessage",
      minWidth: 600
    },
    "color: blue;"
  ),

  Mono.createStyle(
    "span",
    {
      className: "errorMessage",
      minWidth: 300,
      maxWidth: 500
    },
    "font-size: 12px;"
  ),

  Mono.createStyle(
    "span",
    {
      className: "errorMessage",
      maxWidth: 200
    },
    "font-weight: bold;"
  ),

  Mono.createStyle(
    "span",
    {
      className: "errorMessage"
    },
    "font-style: italic;"
  ),

  // Mono.createStyle(
  //   "div",
  //   null,
  //   "font-style: italic;",
  //   Mono.createStyle(
  //     "span",
  //     {
  //       className: "errorMessage"
  //     },
  //     "font-style: italic;"
  //   )
  // )
];

Mono.createCSS(stylesWithMediaQueries);
