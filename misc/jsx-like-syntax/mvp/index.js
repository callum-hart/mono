/**
 * Get first version of this done asap to test idea
 *
 * Todos:
 * - JSX mapping
 *
 */

const propertyWhitelist = require('./propertyWhitelist');


const BLANK             = '';
const SPACE             = ' ';
const DOT               = '.';
const COLON             = ':';
const SEMI_COLON        = ';';
const CHILD_COMBINATOR  = '>';
const OPEN_PARENTHESIS  = '(';
const CLOSE_PARENTHESIS = ')';
const OPEN_BRACE        = '{';
const CLOSE_BRACE       = '}';
const ZERO              = 0;
const MEDIA_UNIT        = 'px';


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
    Mono._makeCSS();
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
        // todo: generate run-time validations (see composition.css:116)
      } else {
        console.log(`The base class: "${baseRef}" does not exist.`);
        throw new Error('Base class not found');
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

  _makeCSS() {
    let CSS = BLANK;

    for (var ref in Mono._AST) {
      const selector = Mono._makeSelectorFromRef(ref);

      Mono._AST[ref].forEach(({styles, minWidth, maxWidth}) => {
        if (minWidth === ZERO && maxWidth === Infinity) {
          CSS += `${selector}${SPACE}${OPEN_BRACE}\n`;
          CSS += `${SPACE.repeat(2)}${styles}\n`;
        } else {
          // optimization: one media query per unique range containing all styles for that range
          const ranges = [];

          if (minWidth != ZERO) {
            ranges.push(`${OPEN_PARENTHESIS}min-width:${minWidth}${MEDIA_UNIT}${CLOSE_PARENTHESIS}`);
          }

          if (maxWidth != Infinity) {
            ranges.push(`${OPEN_PARENTHESIS}max-width:${maxWidth}${MEDIA_UNIT}${CLOSE_PARENTHESIS}`);
          }

          CSS += `@media${SPACE}${ranges.join(`${SPACE}and${SPACE}`)}${SPACE}${OPEN_BRACE}\n`;
          CSS += `${SPACE.repeat(2)}${selector}${SPACE}${OPEN_BRACE}\n`;
          CSS += `${SPACE.repeat(4)}${styles}\n`;
          CSS += `${SPACE.repeat(2)}${CLOSE_BRACE}\n`;
        }

        CSS += `${CLOSE_BRACE}\n`;
      });
    }

    console.log(CSS);
  },

  _AST: {},

  _saveRef(ref, {element, attrs, styles}) {
    if (Mono._stylesValid(ref, element, styles)) {
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
    }
  },

  // valid in regards to inheritance
  _stylesValid(ref, element, styles) {
    propertyWhitelist.forEach(({elements, properties}) => {
      const whitelistedProperty = properties.find(property => styles.includes(property));

      if (whitelistedProperty && !elements.includes(element)) {
        console.log(`\nThe HTML element "${element}" (${ref}) cannot use the property "${whitelistedProperty}"`);
        console.log(`\nThe property "${whitelistedProperty}" can only be used by the following elements:`);
        elements.forEach(element => console.log(`  - ${element}`));
        console.log('\n');
        throw new Error('Element cannot not use property');
      }
    });

    return true;
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
        equivalentStyles[property] = `${newStyles[property]} /* polymorphic (original value: ${equivalentStyles[property]}) */`;
      } else {
        // add style
        equivalentStyles[property] = `${newStyles[property]}`;
      }
    }

    equivalentStyle.styles = Mono._stylesToString(equivalentStyles);
  },

  _createStyleEntry(styles, {minWidth, maxWidth}) {
    return {
      styles,
      minWidth: minWidth ? minWidth : ZERO,
      maxWidth: maxWidth ? maxWidth : Infinity
    }
  },

  // unique in terms of CSS property (not including CSS value)
  // todo: needs to handle short-hands (margin vs margin-top) or validate against short-hand usage
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

  _stylesToObject(stylesAsString) {
    const styleObj = {};

    stylesAsString.split(SEMI_COLON)
          .filter(res => res !== BLANK)
          .map(res => res.trim())
          .forEach(declaration => {
            const [property, value] = declaration.split(COLON).map(res => res.trim());
            styleObj[property.toLowerCase()] = value;
          });

    return styleObj;
  },

  _stylesToString(stylesAsObject) {
    let stylesStr = BLANK;

    for (var [property, value] of Object.entries(stylesAsObject)) {
      stylesStr += `${property}${COLON}${value}${SEMI_COLON}`;
    }

    return stylesStr;
  },

  _makeRef({element, attrs}) {
    if (attrs && attrs.className) {
      return `${element}${DOT}${attrs.className}`;
    } else {
      return element;
    }
  },

  _makeSelectorFromRef(ref) {
    let selector = [];

    ref.split(SPACE).forEach(part => {
      if (part.includes(DOT)) {
        const isComposableClass = part.split(DOT).length === 3; // [element, baseClass, subClass]

        if (isComposableClass) {
          selector.push(Mono._makeComposableClassSelector(part));
        } else {
          selector.push(Mono._makeClassSelector(part));
        }
      } else {
        selector.push(Mono._makeTagOnlySelector(part));
      }
    });

    return(selector.join(`${SPACE}${CHILD_COMBINATOR}${SPACE}`));
  },

  _makeTagOnlySelector(element) {
    return `${element}:not([class])`;
  },

  _makeClassSelector(elementWithClass) {
    const [element, cssClass] = elementWithClass.split(DOT);
    return `${element}[class="${cssClass}"]`;
  },

  _makeComposableClassSelector(elementWithComposableClass) {
    const [element, baseClass, subClass] = elementWithComposableClass.split(DOT);
    return `${element}[class="${baseClass}${SPACE}${subClass}"]`;
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
    "strong",
    null,
    "font-size: 12px;"
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
      "display: none; font-size: 10px;"
    )
  ),

  Mono.createStyle(
    "form",
    {
      className: "base-form",
      minWidth: 500,
      maxWidth: 900
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
    "background: lightgrey; opacity: 0.8;border: 1px solid BLUE; cursor: not-allowed;",
    Mono.createStyle(
      "a",
      {
        className: "link",
        minWidth: 400
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
      "display: block; color: red; font-size: 20px;"
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
