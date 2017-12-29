/**
 * Get first version of this done asap to test idea
 *
 * Todos:
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
    const { minWidth, maxWidth, className } = block.attrs;

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

    if (Mono._isComposableClass(parentRef, className)) {
      const baseClass = className.match(/^.+(?=(\.))/)[0]; // upto (but not including) dot
      const baseRef = `${block.element}${DOT}${baseClass}`;

      if (Mono._AST[baseRef]) {
        Mono._cloneBaseStyles(baseRef, fullyQualifiedRef);
      } else {
        console.log(`The base class: "${baseRef}" does not exist.`);
        // todo: throw error
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

      // save inferred media queries if any
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

  _cloneBaseStyles(baseRef, clonedRef) {
    for (var ref in Mono._AST) {
      // thought: could potentially clone all styles that include (not just start with) baseRef
      // i.e: `div.container form.base-form` => `div.container form.base-form.base-form--saving`
      // this would enable composition among nested nodes.
      if (ref === baseRef || ref.startsWith(`${baseRef}${SPACE}`)) {
        // clone and save base styles
        const fullyQualifiedClonedRef = ref.replace(baseRef, clonedRef);
        Mono._AST[fullyQualifiedClonedRef] = Mono._AST[ref].map(style => ({...style}));
        Mono._AST[fullyQualifiedClonedRef].__proto__.cloned = true;
        Mono._AST[fullyQualifiedClonedRef].__proto__._clonedFrom = ref; // just for debugging
      }
    }
  },

  _isComposableClass(parentRef, className) {
    // for now only support composition for:
    //  - top level nodes (cannot use composition in nested nodes)
    //  - two classes
    return parentRef === null &&
           className &&
           className.includes(DOT);
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
          // ref exists as part of another ref, check if styles are unique
          try {
            Mono._AST[ref].forEach(existingStyle => {
              Mono._AST[accumulator].forEach(accumulatedStyle => Mono._stylesUnique(accumulatedStyle, existingStyle));
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
      // ref already exists
      const newStyle = Mono._createStyleEntry(styles, attrs);

      if (Mono._AST[ref].__proto__.cloned) {
        // find existing style whose min & max width are equal to new style (if any)
        const equivalentStyle = Mono._AST[ref].find(({minWidth, maxWidth}) => minWidth === newStyle.minWidth && maxWidth === newStyle.maxWidth);

        if (equivalentStyle) {
          // merge new style with an equivalent style
          Mono._mergeNewStyleWithEquivalentStyle(newStyle, equivalentStyle);
        } else {
          // treat new style as a new entry in AST
          Mono._saveNewStyleForExistingRef(newStyle, ref);
        }
      } else {
        // merge new styles with existing styles if no overrides present
        Mono._saveNewStyleForExistingRef(newStyle, ref);
      }
    } else {
      Mono._AST[ref] = [Mono._createStyleEntry(styles, attrs)];
    }
  },

  _saveNewStyleForExistingRef(newStyle, ref) {
    try {
      Mono._AST[ref].forEach(existingStyle => Mono._stylesUnique(existingStyle, newStyle));
      Mono._AST[ref].push(newStyle); // save styles
    } catch (e) {
      console.log(`\nThe CSS property \`${e.data.property}\` has already been defined for \`${ref}\``);
      console.log(`\nExisting style (\`${ref}\`):\n   "${e.data.control.styles}"`);
      console.log(`\nNew style (\`${ref}\`):\n   "${e.data.comparison.styles}"`);
      throw new e.constructor();
    }
  },

  _mergeNewStyleWithEquivalentStyle(newStyle, equivalentStyle) {
    const newStyles = Mono._stylesToObject(newStyle.styles);
    const equivalentStyles = Mono._stylesToObject(equivalentStyle.styles);

    for (var property in newStyles) {
      if (equivalentStyles[property]) {
        // style already exists, override it
        equivalentStyles[property] = `${newStyles[property]} /* polymorphic */`;
        equivalentStyle.styles = Mono._stylesToString(equivalentStyles);
      } else {
        // add style
        equivalentStyle.styles += `${property}${COLON}${newStyles[property]}${SEMI_COLON}`;
      }
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

  _stylesToString(stylesAsObject) {
    let stylesStr = "";

    for (var [property, value] of Object.entries(stylesAsObject)) {
      stylesStr += `${property}${COLON}${value}${SEMI_COLON}`;
    }

    return stylesStr;
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
      "display: none; font-size: 10px;"
    )
  ),

  Mono.createStyle(
    "form",
    {
      className: "base-form",
      minWidth: 500
    },
    "width: 100%;"
  ),

  // Mono.createStyle(
  //   "a",
  //   {
  //     className: "link"
  //   },
  //   "color: green;"
  // ),

  Mono.createStyle(
    "form",
    {
      className: "base-form.base-form--saving"
    },
    "background: lightgrey; opacity: 0.8;border: 1px solid BLUE; pointer-events: none;",
    Mono.createStyle(
      "a",
      {
        className: "link"
      },
      "color: red;"
    )
  ),

  Mono.createStyle(
    "form",
    {
      className: "base-form.base-form--error"
    },
    "border: 1px solid red;  background: GREEN;",
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
      "display: block; color: red;"
    )
    // ,Mono.createStyle(
    //   "span",
    //   {
    //     className: "error-message",
    //     maxWidth: 400
    //   },
    //   "font-size: 12px; // not allowed"
    // ),
    // Mono.createStyle(
    //   "span",
    //   {
    //     className: "error-message",
    //     maxWidth: 600
    //   },
    //   "font-size: 14px; // not allowed"
    // )
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

Mono.createCSS(stylesWithComposition);
