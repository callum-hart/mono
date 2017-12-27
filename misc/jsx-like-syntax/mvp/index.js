/**
 * Get first version of this done asap to test idea
 *
 * Todos:
 * - media queries (done)
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
      attrs: attrs || {},
      styles: styles || '',
      children
    }
  },

  createCSS(styles) {
    styles.forEach(block => Mono._parseStyles(block));
    Mono._parseAst();
  },

  _parseStyles(block, parentRef = null, inheritedMedia = null) {
    const ref = Mono._makeRef(block);
    const fullyQualifiedRef = parentRef ? `${parentRef}${SPACE}${ref}` : ref;
    const { minWidth, maxWidth } = block.attrs;

    if (inheritedMedia) {
      if (minWidth || maxWidth) {
        Mono._logNestedMediaQuery(inheritedMedia, minWidth, maxWidth, fullyQualifiedRef);
        throw new Error('Nested media query found');
      } else {
        // add inherited media queries to child block
        block.attrs = {
          ...block.attrs,
          ...inheritedMedia.minWidth && { minWidth: inheritedMedia.minWidth },
          ...inheritedMedia.maxWidth && { maxWidth: inheritedMedia.maxWidth }
        }
      }
    }

    Mono._saveRef(fullyQualifiedRef, block);

    if (block.children.length) {
      // save parent path for children
      if (parentRef) {
        parentRef += `${SPACE}${ref}`;
      } else {
        parentRef = ref;
      }

      // handle inferred media queries if any
      if (minWidth || maxWidth) {
        inheritedMedia = {
          setBy: parentRef,
          ...minWidth && { minWidth },
          ...maxWidth && { maxWidth }
        }
      }

      // parse children
      block.children.forEach(child => Mono._parseStyles(child, parentRef, inheritedMedia));
    }
  },

  _parseAst() {
    console.log('---------------------------------------');
    console.log('AST:')
    console.log(Mono._AST);

    for (var ref in Mono._AST) {
      const paths = ref.split(SPACE);
      let i = paths.length - 1;
      let accumulator = BLANK;

      // traverse tree (right to left) to see whether ref exists as part of another ref
      do {
        accumulator = (accumulator === BLANK) ? paths[i] : `${paths[i]}${SPACE}` + accumulator;

        if (ref !== accumulator && Mono._AST[accumulator]) {
          // ref already exists as part of another ref, check if styles are unique
          try {
            Mono._AST[ref].forEach(refStyles => {
              Mono._AST[accumulator].forEach(accumulatedStyles => Mono._stylesUnique(accumulatedStyles, refStyles));
            });
          } catch (e) {
            console.log(`\n[Override Found] \`${ref}\` overrides the property \`${e.data.property}\` set by \`${accumulator}\``);
            console.log(`\nExisting style (\`${accumulator}\`):\n   \`${e.data.control.styles}\``);
            console.log(`\nNew style (\`${ref}\`):\n   \`${e.data.comparison.styles}\``);
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
        console.log(`\nExisting style (\`${ref}\`):\n   "${e.data.control.styles}"`);
        console.log(`\nNew style (\`${ref}\`):\n   "${e.data.comparison.styles}"`);
        throw new e.constructor();
      }
    } else {
      Mono._AST[ref] = [Mono._createStyleEntry(styles, attrs)];
    }
  },

  _createStyleEntry(styles, {minWidth, maxWidth}) {
    return {
      styles,
      minWidth: minWidth ? minWidth : ZERO,
      maxWidth: maxWidth ? maxWidth : Infinity
    }
  },

  // unique in terms of CSS property (not including CSS value)
  // needs to handle property short-hands (margin vs margin-top) or validate against short-hand usage
  _stylesUnique(control, comparison) {
    if (Mono._breakpointsOverlap(control, comparison)) {
      console.log('breakpoints overlap');
      for (var property in Mono._stylesToObject(comparison.styles)) {
        if (Mono._stylesToObject(control.styles)[property]) {
          console.log('override found');
          throw new CSXException('Override found', {
            property,
            control,
            comparison
          });
        } else {
          console.log('no overrides found');
        }
      }
    } else {
      // overrides can't exist when breakpoints don't overlap
      console.log('breakpoints don\'t overlap');
    }

    return true;
  },

  _breakpointsOverlap(controlRange, comparisonRange) {
    const rangeBelow = (comparisonRange.minWidth < controlRange.minWidth) &&
                       (comparisonRange.maxWidth < controlRange.minWidth);
    const rangeAbove = (comparisonRange.minWidth > controlRange.maxWidth) &&
                       (comparisonRange.maxWidth > controlRange.maxWidth);

    if (rangeBelow || rangeAbove) {
      return false;
    } else {
      return true;
    }
  },

  _stylesToObject(styles) {
    const styleObj = {};

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
  },

  _logNestedMediaQuery(inheritedMedia, minWidth, maxWidth, fullyQualifiedRef) {
    console.log(`\nMedia query already set by parent: "${inheritedMedia.setBy}"`);
    if (inheritedMedia.minWidth) {
      console.log(` - minWidth of: ${inheritedMedia.minWidth}`);
    }
    if (inheritedMedia.maxWidth) {
      console.log(` - maxWidth of: ${inheritedMedia.maxWidth}`);
    }
    console.log(`\nNested media query found in: "${fullyQualifiedRef}"`);
    if (minWidth) {
      console.log(` - minWidth: ${minWidth}`);
    }
    if (maxWidth) {
      console.log(` - maxWidth: ${maxWidth}`);
    }
    console.log(`\nNested media queries are not allowed\n`);
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
      Mono.createStyle(
        "p",
        null,
        "font-size: 10px /* not allowed */;"
      ),
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
      minWidth: 601,
      maxWidth: 900
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

  Mono.createStyle(
    "a",
    {
      className: "link",
      maxWidth: 900
    },
    "color: cadetblue;"
  ),

  Mono.createStyle(
    "div",
    {
      minWidth: 901
    },
    "height: 100px;",
    Mono.createStyle(
      "span",
      {
        className: "errorMessage"
      },
      "line-height: 100; text-transform: uppercase;",
      Mono.createStyle(
        "a",
        {
          className: "link"
        },
        "color: red"
      )
    ),
    Mono.createStyle(
      "span",
      {
        className: "errorMessage"
      },
      "float: left;"
    )
  )
];

Mono.createCSS(stylesWithMediaQueries);
