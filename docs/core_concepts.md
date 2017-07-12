# Key principles

Mono has two key principles:

1. Change the overriding mechanism of CSS
2. Make CSS easier to reason with

### Change the overriding mechanism of CSS

An overriding architecture becomes self-perpetuating. **The more overrides exist the more overriding you do**. The language overtly encourages this - even from a clean slate browser defaults are overriden. Variation & reusability are instinctively achieved by overriding styles.

Cascade order, high specificity & importance only become offensive when overriding a style.

<p align="center">&ast;&ast;&ast;</p>

If we think of **overrides as mutation** we can look to other languages for guidance. There are many practices that **provide a system for changing a value:**

- **Access modifiers** - determine who & how a value can be modified.
- **Data types** - a value cannot be modified through re-assignment (final in Java / const in ES6).
- **Immutability** - a value whose state cannot be modifed after its creation.
- **Setters** - expose safe ways to modify otherwise inaccessible values.

An equivalent system is missing from CSS. A style can be changed by anyone from anywhere.