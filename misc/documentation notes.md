# Introduction

- Mono is a language that aims to reduce the difficulties of CSS development.
- Based on established convensions from traditional programming languages. *(data types, access modifiers & immutabiliy).*
- It makes CSS robust, predictable, & easy to reason with.
- This improves maintainabiliy, developer confidence, & reduces side affects - which leads to faster development time & a better developer experience.

# Motivation

- Born out of my own fustration.
- CSS development is expensive - it's labour intensive & time consuming.
- CSS workflow:
	- Hunting - locate where a style is set & who sets it.
	- Reasoning - why is this style used? Is it even used?
	- Analyse - identifing what impact adding / changing / removing a style(s) will have.
	- Friction - now that we want to make a change have to compete with specificity, cascade & importance.
- There must be a better way!

# Core concept

- Problem is a language & architectural issue.
- CSS painpoints:
	- Cause: global scope, cascade, specificity, importance.
	- Effect: brittle (easy to break things), unpredictable (no gaurentees / side affects), hard to maintain (can't confidently add, edit, remove).
- Worst offenders *(cascade, specificity, importance)* only become an issue when we have to work against them - i.e override styles.
- The following example is harmless in solitary:

```
html body div.content p {
	color: #ccc !important;
}
```

- However becomes offensive when we want to override the color.
- Which leads to the key principle of mono: alter the overriding mechanism of CSS.