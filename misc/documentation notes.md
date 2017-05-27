# Introduction

- Mono is a language that aims to reduce the difficulties of CSS development.
- Based on established convensions from traditional programming languages. *(data types, access modifiers & immutabiliy).*
- It makes CSS robust, predictable, & easy to reason with.
- This improves maintainabiliy, developer confidence, & reduces side affects - resulting in faster development time, a happier developer experience, & ultimately fewer bugs.

# Motivation

- Born out of my own fustration.
- CSS development is expensive - it's labour intensive & time consuming.
- CSS workflow:
    - Hunting - locate where a style is set & who sets it.
    - Reasoning - why does a style exist? Is it even used?
    - Analyse - identifing what impact adding / changing / removing a style(s) will have.
    - Friction - now that we want to make a change have to compete with specificity, cascade & importance.
- There must be a better way!

# Core concept

- CSS painpoints:
    - Cause: global scope, cascade, specificity, importance.
    - Effect: brittle *(easy to break things)*, unpredictable *(no gaurentees / side affects)*, hard to maintain *(can't confidently add, edit, remove)*.
- Worst offenders *(cascade, specificity, importance)* only become an issue when we have to work against them - i.e override styles.
- The following example is harmless in solitary:

```
html body div.content p {
    color: #ccc !important;
}
```

- However becomes offensive when we want to override the color.
- Override is a mutation. In other language mutation is handled via:
	- Access modifiers - determine who & how a value can be modified.
	- Setters - expose safe ways to modify otherwise inaccessible values.
	- Data types - final in Java, const in ES6. Cannot change an object's reference. 
	- Immutabiliy - a value that cannot be modifed after its creation. *(Subtly different to final; since you can change an immutable object's reference)*
- All of which: provide a system for changing a value. Which doesn't exist in CSS & I'd suggest [the default architecture of CSS is broken]().
- Key principle of mono: **change the overriding mechanism of CSS**. 