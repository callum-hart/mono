# Introduction

- Mono is a language that aims to reduce the difficulties of CSS development.
- Based on established convensions from traditional programming languages *(data types, access modifiers & immutabiliy)*.
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

- However becomes offensive when we want to override the color. Need to:
	- Use !important
	- Use a selector with stronger specifity
	- Use a selector with equal specifity & put overriding CSS later in the cascade
- Fair amount of thought required just to override the color.
- If we think of an override as a mutation we can look to other languages for guidance:
	- Access modifiers - determine who & how a value can be modified.
	- Setters - expose safe ways to modify otherwise inaccessible values.
	- Data types - final in Java, const in ES6. Cannot change an object's reference. 
	- Immutabiliy - a value that cannot be modifed after its creation. *(Subtly different to final; since you can change an immutable object's reference)*
- All of which: provide a system for changing a value. An equivalent system is missing from CSS - values can be changed from anywhere by everyone.
- Brings us to key principle of mono: **change the overriding mechanism of CSS**. How? By enforcing restrictions on what styles can be changed, & who can change them - **controlled overrides**.
- *Futher reading: [default architecture of CSS is broken]() and [no overrides vs controlled overrides]().*
- Secondary principle is **make CSS easier to reason with**. A CSS rule can exist for a range of reasons:
	- Add a style
	- Override style
	- Override style from a 3rd party (i.e bootstrap) 
	- Provide a fallback (for older browsers)
	- Undo user agent style
	- Override an inline style 
- This reasoning usually resides in our head. CSS offers no indication for it's purpose:

```
.btn {
	padding: 20px 10px;
	font-size: 11px;
	border: 1px solid red;
	border-radius: 0;
	opacity: 1 !important;
	background: #ccc;
	color: #000;
	cursor: pointer;
	position: relative;
}
```

- No rationale behind why properties exist:
	- Why is font-size set to 11px? *isn't broswer default 11px?*
	- Why is the opacity set to 1? *isn't broswer default 1?*
	- Why position relative? *can't think why that's needed...*
- Yet at some point the rationale was there. Ah yes, after some hunting:
	- font-size is set to 11px -> to override the font-size coming from bootstrap
	- opacity is set to 1 -> because we still have that legacy script that sets button opacity to 0.
	- can't see why position is set to relative... should be okay to remove ¯\_(ツ)_/¯
- ^ Waste of time & energy.  
- Benefits when code is easier to reason with:
	- quicker to understand
	- easier for others to understand (our code) 
	- quicker to debug 
	- safer to add / change / remove
	- reduces dead code
	- robust
	- faster onboarding 
	- happier developers!

# Guides

...


