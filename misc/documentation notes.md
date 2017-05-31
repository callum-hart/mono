# Introduction

- Mono is a language that aims to reduce the difficulties of CSS development.
- Based on established convensions from traditional programming languages *(data types, access modifiers & immutabiliy)*.
- It makes CSS robust, predictable, & easy to reason with.
- This improves maintainabiliy, developer confidence, & reduces side affects - resulting in faster development time, a happier developer experience, & ultimately fewer bugs.

# Motivation

- Born out of my own fustration.
- CSS development is expensive - it's labour intensive & time consuming.
- Todays CSS workflow:
    - Hunting - locate where a style is set & who sets it.
    - Reasoning - why does a style exist? Is it even used?
    - Analyse - identifing what impact adding / changing / removing a style(s) will have.
    - Friction - now that we want to make a change have to compete with specificity, cascade & importance.
- There must be a better way!
	- *Further reading: current remedies (inline JS, pre-processors)*

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
	- Data types - final in Java, const in ES6. Value cannot be modified through re-assignment.
	- Immutabiliy - a value whose state cannot be modifed after its creation. *(Subtly different to final; since you can change an immutable object's reference)*
- ^ All of which: provide a system for changing a value. An equivalent system is missing from CSS - values can be changed from anywhere by everyone. *Further reading: CSS compared with other languages.*
- Brings us to key principle of mono: **change the overriding mechanism of CSS**. How? By enforcing restrictions on what styles can be changed, & who can change them - **controlled overrides**. By providing a coherent way to override styles.
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
	text-decoration: none;
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
	- Why is text-decoration set to none?
	- Why is the opacity set to 1? *isn't broswer default 1?*
	- Why position relative? *can't think why that's needed...*
- Yet at some point the rationale was there. Ah yes, after some hunting:
	- font-size is set to 11px -> to override the font-size coming from bootstrap
	- text-decoration set to none -> `.btn` can be a button or anchor; so override for the later.
	- opacity is set to 1 -> because we still have that legacy script that sets button opacity to 0.
	- can't see why position is set to relative... should be okay to remove ¯\_(ツ)_/¯
- ^ Waste of time & energy.  
- Benefits of code that's easier to reason with:
	- quicker to understand
	- easier for others to understand
	- quicker to debug 
	- safer to add / change / remove
	- reduces dead code
	- robust
	- faster onboarding 
	- happier developers!

# Guides

- At its core mono is a design pattern. The core concepts *(change overriding mechanism of CSS & make CSS easier to reason with)* are achievable natively with CSS.
- For convenience mono provides an implementation (via an API) & set of guidelines (via a design pattern).
- API, composed of:
	- Types
	- Modifiers
	- Motives
	- *Futher reading: current vs future implementation*
- Patterns, composed of:
	- Negation
	- Selector types
	- Shorthand appropriately 
	- Discrete breakpoints
	- Universal entities

## Types

- Set of data types for CSS properties.
- Bound to the scope of a CSS rule-set.
- Each property within a rule-set can have a type.
- A type has a set of laws that govern how the declaration can subsequently be modified.

**Immutable**

Immutable properties can only be set once. They cannot be modified after creation. 

```
h3.title {
	font-size<immutable>: 12px;
}
```

- The font-size of `h3.title` is and always will be 12px.

**Protected**

Protected properties can only be modified by pseudo-classes derived from the same selector.

```
button.btn {
	background<protected>: blue; 
}

button.btn:hover {
	// allowed to modify background
}
```

**Public**

Public properties can only be modified by pseudo and modifier classes derived from descendant selectors.

*Pseudo-class example:*

```
td {
	color<public>: darkgray;	
}

tr:hover td {
	// allowed to modify color
}
```

*Modifier class example:*

```
fieldset {
	background<public>: white;
}

form.withError fieldset {
	// allowed to modify background
}
```

## Modifiers

- Mechanism to change the value of a CSS property.
- Associated with a specific type - can only act on willing types.

**Override**

Can modify the value of CSS properties with the type Protected.

```diff
button.btn {
	background<protected>: blue; 
}

button.btn:hover {
-	// allowed to modify background
+   @override background: darkblue; 	
}
```

**Mutate**

Can modify the value of CSS properties with the type Public.

```diff
td {
	color<public>: darkgray;	
}

tr:hover td {
-	// allowed to modify color
+   @mutate color: black;
}
```

## Motives

- Add reasoning to CSS.
- Goal of a motive is to off-load information about the code (from our brain) to the code itself.
- As we have seen "A CSS rule can exist for a range of reasons". Motives capture the rational in the moment a property is declared. It's easy to forget why a property exists, which means once added it generally stays *(even when the reason for adding it is later nullified)*. This makes refactoring CSS rather dicey!
- Externalizing information from our heads to artifacts not only frees our mind, but makes it easier for someone else to understand and work with.
- Motives remove investing time and energy in justifying why a property exists.
  
**Overrule**

Used when overriding inline CSS.

```html
<img src="path/to/cats.png"
	alt="an awesome portrayal of cats"
	class="pets" 
	style="display: none;">
```

```
img.pets {
	@overrule display: block;
}
```

**Overthrow**

Used when overriding 3rd party CSS.

For example the background color of [bootstrap]() buttons:

```html
<button type="button" class="btn btn-default">
	Default
</button>
```

```
button.btn-default {
	@overthrow background-color: honeydew;
}
```

**Veto**

Used when overriding user agent styles *(browser defaults)*.

...

**Fallback**

Used to denote a fallback properties for cross browser compatibility.

**Because**

Used to justify the usage of a property, or the reason for it's value.

