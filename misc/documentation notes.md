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
    - Analyse - identifing what impact adding / changing / removing a style will have.
    - Friction - when making a change have to compete with specificity, cascade & importance.
- There must be a better way!
	- *Further reading: current remedies (inline JS)*

# Core concept

- CSS painpoints:
    - Cause: global scope, cascade, specificity, importance.
    - Effect: brittle *(easy to break things)*, unpredictable *(no gaurentees / side affects)*, hard to maintain *(can't confidently add, edit, remove)*.
- Worst offenders *(cascade, specificity, importance)* only become an issue when we have to work against them - i.e override a style.
- The following example is harmless in solitary:

```css
html body div.content p {
    color: #ccc !important;
}
```

- However becomes offensive when we want to override the color. Need to:
	- Use !important
	- Use a selector with stronger specifity
	- Use a selector with equal specifity & put overriding CSS later in the cascade
- Fair amount of brainpower required just to override the color.

**Override = mutation**

- If we think of an override as a mutation we can look to other languages for guidance:
	- Access modifiers - determine who & how a value can be modified.
	- Setters - expose safe ways to modify otherwise inaccessible values.
	- Data types - final in Java, const in ES6. Value cannot be modified through re-assignment.
	- Immutabiliy - a value whose state cannot be modifed after its creation.
- ^ All of which: **provide a system for changing a value**. An equivalent system is missing from CSS - values can be changed from anywhere by everyone. *Further reading: CSS compared with other languages.*

**Key principle** 

- Brings us to key principle of mono: **change the overriding mechanism of CSS**. 
- How?:
	- Enforcing restrictions on what styles can be changed, & who can change them - **controlled overrides**. 
	- Providing a coherent way to override styles.
- Easier to **analyse**, reduces **friction**.  
- *Futher reading: [default architecture of CSS is broken]() and [no overrides vs controlled overrides]().*

**Secondary principle**

- Secondary principle is **make CSS easier to reason with**. 
- Easier to **reason** & **analyse**.
- A CSS rule can exist for a range of reasons:
	- Add a style
	- Override style
	- Override style from a 3rd party (i.e bootstrap) 
	- Provide a fallback (for older browsers)
	- Undo user agent style
	- Override an inline style 
- This reasoning usually resides in our head. CSS offers no indication of it's purpose:

```css
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

- At its core mono is a design pattern - it's just as much an idea as it is a language.
- It's selective, focussed on [core concepts](): 
	- improving overriding mechanism of CSS
	- making CSS easier to reason with
- Two parts:

1. **Design pattern** - ways to architect naitive CSS
2. **Language** - extending the CSS language

- One of the [technical goals]() of mono is leverage naitive CSS as much as possible. Rule of thumb: only extend the language if it can't be achieved naitivly.
- Look at design pattern first (since it's something you can start doing in CSS now, backbone for the mono language).

## Design pattern

**Selector types**

All selectors should include the element type.  

Compare the following:

```diff
- .title {
+ h1.title {
	font-size: 20px;
}
```

- Without the element type the `title` class is obscure. We cannot make any gaurentee who the consumer is. It doesn't have a predictable or concrete markup.
- No control or insight into what other styles `title` can have - other styles being user agent, our own, or 3rd party CSS.
- Easier to make connection between CSS & HTML.
- Reduces conflicts by scoping styles to the elements that use them. Easier to avoid & track unintentional overrides. 
- Not to say can't group selectors. For example:

```css
button.btn,
a.btn {
	background: white;
	border: 1px solid grey;
	color: black;
	text-decoration: none;
}
```

- `text-decoration` only exists to override default for anchors. Doesn't need to apply to buttons (default `text-decoration` is already none). Better to eliminate dead code, and only apply required styles:

```diff
button.btn,
a.btn {
	background: white;
	border: 1px solid grey;
	color: black;
-	text-decoration: none;
}

+a.btn {
+	text-decoration: none;
+}
```

**Shorthand appropriately**

Avoid using shorthand notation, unless property has multiple values.

```css
img.avatar {
	margin: 10px 0 0 0;
}

nav img.avatar {
	margin: 10px 0 0 15px;
}
```

- The top margin of `.avatar` is concrete - it should always be 10px.
- Issues with using shorthand for `.avatar` margin:
 	- **Illogical:** inside `nav` the top margin is re-applyed even though only the left margin is changed. Overriding value with the same value is illogical.
 	- **Error prone:** increases risk of accidentally overriding top margin to something other than 10px.
 	- **Maintenance:** if top margin is subsequently changed to 15px - there are more instances to update.
 	- **Unnecessary:** we can leverage browser defaults, margins are already 0.
- Better to:

```css
img.avatar {
	margin-top: 10px;
}

nav img.avatar {
	margin-left: 15px;
}
```

- Not only does this remove overrides, it also improves improves readability - since the property name describes where the value is applied.

**Negation** 

Negation uses the `:not` pseudo-class to avoid mutation amongst composable classes.

*Example composable class is a [BEM modifier]().*

```html
<section>
	<form class="form form--withError">
	</form>
</section>
```

```css
form.form {
	background: white;
}

form.form--withError {
	background: red;
}
```
*figure {n}*

- With the class `.form--withError` the form background is set twice (`.form--withError` overrides `.form`).
- But this forces us to **respect the cascade**, the following produces a different outcome:

```diff
-form.form {
-	background: white;
-}

form.form--withError {
	background: red;
}

+form.form {
+	background: white;
+}
```
- Even with the class `.form--withError` the form background will be always be white.
- Couple of soultions:
- Rely on **cascade** like in first example (fig n).
- Or use **importance**:

```diff
form.form--withError {
+	background: red !important;
}

form.form {
    background: white;
}
```
- Or use **a higher specificity:**

```diff
+section form.form--withError {
	background: red;
}

form.form {
    background: white;
}
```
- Demonstrates how: fickle CSS can be, unforgiving the cascade is, and the ease in which the worst offenders arise. *Those deeming this example fabricated: just think how many times you've had to fight against the cascade.* 
- **Solution with negation:**

```css
.form:not(.form--withError) {
	background: white;
}

.form--withError {
	background: red;
}
```

- The background is set only once for each variation. Negation has removed the need to override the background color.
- And since we're not relying on overrides we needn't worry about cascade, specificity nor importance.
- Negation has bought us **portability** and **predictability**:

```diff
-.form:not(.form--withError) {
-	background: white;
-}

.form--withError {
	background: red;
}

+.form:not(.form--withError) {
+	background: white;
+}
```
*figure {n} produces the same outcome.*

- We can gaurentee the background color of `.form` is white, and `.form--withError` is red. 
- We can gaurentee modifying styles in one rule won't bring unforeseen side-affects to the other. 
 
**Discrete breakpoints**

Breakpoint ranges need to be discrete. This means styles within one media query cannot compete with styles in another.

First lets look at indiscrete breakpoints (usually seen with mobile first):

```css
h3.heading {
	font-size: 16px;
}

@media (min-width: 400px) {
	h3.heading {
		font-size: 18px;
	}
}

@media (min-width: 900px) {
	h3.heading {
		font-size: 20px;
	}
}

@media (min-width: 1200px) {
	h3.heading {
		font-size: 22px;
	}
}
```

- The styles within `min-width: 900px` override those in `min-width: 400px`, the styles within `min-width: 1200px` override those in `min-width: 400px` and `min-width: 900px`.
- Without a max-width we are **dependent on the cascade.** As we've seen with negation relying on cascade is brittle & unpredictable:

```diff
-h3.heading {
-	font-size: 16px;
-}

-@media (min-width: 400px) {
-	h3.heading {
-		font-size: 18px;
-	}
-}

@media (min-width: 900px) {
	h3.heading {
		font-size: 20px;
	}
}

+h3.heading {
+	font-size: 16px;
+}

+@media (min-width: 400px) {
+	h3.heading {
+		font-size: 18px;
+	}
+}

@media (min-width: 1200px) {
	h3.heading {
		font-size: 22px;
	}
}
```
*figure {n} order of styles changes the outcome*


- It's better to **encapsulate styles** within discrete breakpoints:

```css
@media (max-width: 400px) {
	h3.heading {
		font-size: 16px;
	}
}

@media (min-width: 400px) and (max-width: 900px) {
	h3.heading {
		font-size: 18px;
	}
}

@media (min-width: 900px) and (max-width: 1200px) {
	h3.heading {
		font-size: 20px;
	}
}

@media (min-width: 1200px) {
	h3.heading {
		font-size: 22px;
	}
}
```

- With discrete breakpoints the `font-size` of `h3.heading` is no longer overriden. 
- At any given screen-size the `font-size` will have one definition.
- This buys us portability & predictability:
 
```diff
-@media (max-width: 400px) {
-	h3.heading {
-		font-size: 16px;
-	}
-}

-@media (min-width: 400px) and (max-width: 900px) {
-	h3.heading {
-		font-size: 18px;
-	}
-}

@media (min-width: 900px) and (max-width: 1200px) {
	h3.heading {
		font-size: 20px;
	}
}

+@media (max-width: 400px) {
+	h3.heading {
+		font-size: 16px;
+	}
+}

+@media (min-width: 400px) and (max-width: 900px) {
+	h3.heading {
+		font-size: 18px;
+	}
+}

@media (min-width: 1200px) {
	h3.heading {
		font-size: 22px;
	}
}
```
*figure {n} produces the same outcome*
 
- Just like negation cascade no longer determines the winning style.
- Just like negation the CSS property is set once for each variation; the variation being screen-size.
- And since overrides have been omitted, we no longer need to orchestrate the cascade, nor resort to specificity or importance to override unwanted styles.
- We can gaurentee what the `font-size` will be at different screen-sizes.
- We can gaurentee the `font-size` within a given breakpoint won't get overriden by another.

**Universal entities**

- Elements that always look the same, regardless of where they are used.
- High usage - used frequently throughout project. A'la a common/global/core components. Examples: button, avatar, heading.
- Styles are decoupled from their context - the same styles apply in every instance.

### Problem

```html
<button class="btn">
	Save
</button>
```

```css
button.btn {
	padding: 8px 12px;
	background: ivory;
	border: 1px solid slategrey; 	
	color: darkslategray;
}
```

- What we want and what we get are different.
	- We want the button to always look the same.
	- However we cannot gaurentee this will be the case.
- CSS **classes are brittle** - it's easy to override `btn` styles. 
- **Lacks identity** nothing to differentiate `.btn` from other classes. Can't identify `btn` is a global component *(other than intuition)*.
- Makes **reasoning more difficult**:  where & how often is this used, what is the impact of modifying it, where should I make changes. *(Todays CSS workflow)*
- Increases risk of **unintentional overrides**, since the language & us *(the unassuming developer)* don't know any better.

### Solution

- Universal entities use a naming convention for their classnames.
- They are prefixed with an asterix:

```diff
+<button class="*btn">
-<button class="btn">
	Save
</button>
```

```diff
+button.\*btn {
-button.btn {
	padding: 10px;
	background: ivory;
	border: 1px solid slategrey; 
}
```

- Prefixing the class with a special character is a subtle change, but buys us a few things:
	- **Protection:** adds a layer of protection. It's harder to accidentally override, since the selector is more verbose. (`div.\*box` vs `div.box`).
	- **Identity:** easier to indentify & thus differentiate in both HTML & CSS.

*Todo:*
- contextual styles
- child elements

## Language

*Code samples - either use pseudo syntax / sass proof-of-concept syntax / future syntax. Using future syntax here could be misleading, and confusing? But do I want/expect people to use sass proof-of-concept?*

### Types

- Set of data types for CSS properties.
- Bound to the scope of a CSS rule-set.
- Each property within a rule-set can have a type.
- A type has a set of laws that govern how the declaration can subsequently be modified.

**Immutable**

Immutable properties can only be set once. They cannot be modified or more specically overriden. 

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

- The background of `button.btn` can only be modified by:
	- `button.btn:link`
	- `button.btn:visited`
	- `button.btn:hover`
	- `button.btn:active` 

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

form.form--withError fieldset {
	// allowed to modify background
}
```

### Modifiers

- Mechanism to change the value of a CSS property.
- Associated with a specific type - can only act on willing types.

**Override**

Can modify the value of CSS properties with the type Protected.

```diff
button.btn {
	background<protected>: blue; 
}

button.btn:hover {
+   background<@override>: darkblue; 	
}
```

**Mutate**

Can modify the value of CSS properties with the type Public.

```diff
td {
	color<public>: darkgray;	
}

tr:hover td {
+   color<@mutate>: black;
}
```

### Motives

- Add reasoning to CSS.
- Goal of a motive is to off-load information about the code (from our brain) to the code itself.
- As we have seen "A CSS rule can exist for a range of reasons".
- Motives capture the rational in the moment a property is declared. It's easy to forget why a property exists, which means once added it generally stays *(even when the reason for adding it is later nullified)*. This makes refactoring CSS rather dicey!
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
	display<?overrule>: block;
}
```

**Overthrow**

Used when overriding 3rd party CSS.

For example the background color of a [bootstrap]() button:

```html
<button type="button" class="btn btn-default">
	Default
</button>
```

```css
button.btn-default {
	background-color<?overthrow>: honeydew;
}
```

*If dependency (in this case bootstrap) is dropped we can confidently remove its overthrow rules.*

**Veto**

Used when overriding user agent styles *(browser defaults)*.

```css
ul.contact-list {
	margin-left<?veto>: 0;
	padding-left<?veto>: 0;
}
```

**Fallback**

Denote fallback properties used for cross browser compatibility.

```css
nav {
	background<?fallback>: grey;
	background: linear-gradient(white, black);
}
```

**Because**

Used to justify the usage of a property, or reasoning behind   it's value.

*For example `box-sizing` only exists to swallow the padding - (property usage):*

```css
section.news-feed {
	padding<immutable>: 20px;
	box-sizing<?because: padding)>: border-box;
}
```

*And left margin is 20px to align the content with the nav - (value reasoning):*

```css
main.content {
	margin-left<?because: align content with nav>: 20px;
}
```

