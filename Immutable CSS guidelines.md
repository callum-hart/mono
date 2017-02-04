### Rules:
*Constraints enforced by Immutable CSS*

- Immutable classes can only be declared once.
- Immutable properties can only be declared once.
- Protected properties can only be modified by pseudo-classes.
- Public properties can only be modified by pseudo-classes of parent element.
- Immutable mixins can only be declared once.
- Immutable variables can only be delcared once.
- Media query breakpoints can't overlap one-another.

### Syntax:

- Immutable class: `.BTN_PRIMARY {}`
- Immutable property: `COLOR: blue;`
- Protected property: `Background: white;`
- Immutable mixin: `.FORM(@args...) {}`
- Immutable variable: `@BUTTON_COLOR: grey;`

### Approaches:
*Things achievable using naitive CSS*

- Composible classes: abstract common styles into a mixin.
- Modifier classes: use `:not()` pseudo-class to exclude styles from modifier class(es).

### Macros:
*Extending the CSS language*

- Type system: denote selectors HTML element type. `.first-name<p> {}`
- Extends: used to describe modifier classes. `.BTN--DISABLED extends .BTN {}`


