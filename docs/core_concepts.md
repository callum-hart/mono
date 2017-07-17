# Core Concepts

Mono has two core concepts:

1. Change the overriding mechanism of CSS
2. Make CSS easier to reason with

#### Change the overriding mechanism of CSS

An overriding architecture becomes self-perpetuating. **The more overrides exist the more overriding you do**. The language overtly encourages this - even from a clean slate browser defaults are overriden. Variation & reusability are instinctively achieved by overriding unwanted styles.

- Overrides in CSS are fragile. Relient on cascade, specificty, importance. Changes to cascade, specificty, importance can alter which override wins. Overrides are so vulnerable - similar to house of cards.

Cascade order, high specificity & importance only become offensive when overriding a style.

<p align="center">&ast;&ast;&ast;</p>

If we view **overrides as mutation** we can look to other languages for guidance. Many of which include techniques that **provide a system for changing a value:**

- **Access modifiers** - determine who & how a value can be modified.
- **Data types** - a value cannot be modified through re-assignment (final in Java / const in ES6).
- **Immutability** - a value whose state cannot be modifed after its creation.
- **Setters** - expose safe ways to modify otherwise inaccessible values.

An equivalent system is missing from CSS - a style can be modified by anyone from anywhere. 

<p align="center">&ast;&ast;&ast;</p>

Mono denounces this liberal attitude to overrides. 

- prevents unessessary overrides & provides a system to control overrides.

Mono imposes restrictions on what styles can change, who is allowed to change them, & how they can be changed - a system mono calls **controlled overrides**.

Controlled overrides encompass traits common in functional & OO lanaguages.
Controlled overrides consist of types & modifiers. Types have a set of laws that govern how a style can subsequently be modified. Mod

- mirrors access modifiers & setters in OO languages.
- benefits of controlled overrides:
	- provide coherent way to override styles.
	- remove cascade dependency. portability - no longer matters what order styles are in. buys total freedom to rearrange, remove (without worry of previously overriden styles taking affect), add styles (without worry of accidentailly overriding existing styles). this makes CSS robust. 



*What is wrong with CSS overrides?*

- CSS overrides are fragile. 
	- Re-order styles 
	- Change specificity 
	- Use importance 
	- Newly added styles can override existing ones.
	- Removing styles can cause previously overriden styles taking affect.
- Overriding architecture becomes self-perpetuating (more overrides exist the more overriding you do).

