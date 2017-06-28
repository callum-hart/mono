# Notes for mono docs

- [x] Introduction
- [x] Motivation
- [x] Core concepts
- [x] Guides
	- [x] Design pattern
	- [x] Mono language
- [x] Mono language
	- [x] Proposed Syntax
	- [x] Compiler specification
- [x] Examples

# Introduction

- Mono is a language that aims to reduce the difficulties of CSS development.
- Based on established convensions from traditional programming languages *(data types, access modifiers & immutabiliy)*.
- Mono makes CSS **robust**, **predictable**, & **easy to reason with**.
- This improves maintainabiliy, developer confidence, & reduces side affects - resulting in faster development time, a happier developer experience, & ultimately fewer bugs.

# Motivation

- Born out of my own fustration.
- CSS development is expensive - it's labour intensive & time consuming.
- Todays CSS workflow:
    - **Hunting** - locate where a style is set & who sets it.
    - **Reasoning** - why does a style exist? Is it even used?
    - **Analyse** - identifing what impact adding / changing / removing a style will have.
    - **Friction** - when making a change have to compete with specificity, cascade & importance.
- There must be a better way!
- CSS is neglected, especially compared to it's buddy JavaScript!

# Core concept

- CSS painpoints:
    - **Cause**: global scope, cascade, specificity, importance.
    - **Effect**: fragile *(easy to break things)*, unpredictable *(no gaurentees / side affects)*, hard to maintain *(can't confidently add, edit, remove)*.
- Worst offenders *(cascade, specificity, importance)* only become an issue when we have to work against them - i.e override a style.
- The following example is harmless in solitary:

```css
html body div.content p {
 color: #ccc !important;
}
// end of file
```

- Yet has high specifity, uses !important, and is the last CSS rule in the cascade.
- These traits only become offensive when we want to override a style; in this case the color. Need to:
	- Use !important
	- Use a selector with stronger specifity
	- Use a selector with equal specifity & put overriding CSS later in the cascade
- Fair amount of cogitation required just to override the color.

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
- In essense JS styles are proving popular because they reduce the painpoints of overrides. *Further reading: current remedies (inline JS)*
- *Futher reading: [default architecture of CSS is broken]() and [no overrides vs controlled overrides]().*

**Secondary principle**

- Secondary principle is **make CSS easier to reason with**.
- Easier to **reason** & **analyse**.
- A CSS rule can exist for a range of reasons:
	- Apply a style
	- Override style
	- Override style from a 3rd party (i.e bootstrap)
	- Provide a fallback (for older browsers)
	- Remove user agent style
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
- Yet at some point the rationale was there... Ah yes, after some hunting:
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

- At its core mono is a programming paradigm - it's just as much an idea as it is a language.
- It's selective, focussed on [core concepts]():
	- improve overriding mechanism of CSS
	- make CSS easier to reason with
- Two parts:

1. **Design pattern** - ways to architect naitive CSS
2. **Language** - extending the CSS language

- One of the [technical goals]() of mono is **leverage naitive CSS** as much as possible. Rule of thumb: only extend the language if it can't be achieved naitivly.
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
- With the element type it's easier to make connection between CSS & HTML.
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

- When the form has the class `.form--withError` the background is set twice (`.form--withError` overrides `.form`).
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

- The background is only set once for each variation. Negation has removed the need to override the background color.
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

First lets look at **indiscrete breakpoints** (usually seen amongst mobile first design):

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
- Without a max-width we are **dependent on the cascade.** As we've seen with negation relying on cascade is **fragile & unpredictable**:

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
- At any given screen-size the `font-size` is only set once.
- *Again* this buys us portability & predictability:

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
- Just like negation the CSS property is set once for each variation; the variation here being screen-size.
- And since overrides have been omitted, we no longer need to orchestrate the cascade, nor resort to specificity or importance to override unsavoury styles.
- We can gaurentee what the `font-size` will be at different screen-sizes.
- We can gaurentee the `font-size` within a given breakpoint won't get overriden by another.

**Universals**

- Entities that always look the same, regardless of where they are used.
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
- **Lacks identity** nothing to differentiate `.btn` from other classes. Can't identify `btn` is a global entity *(other than intuition / speculation)*.
- Makes **reasoning more difficult**:  where & how often is `btn` used, what is the impact of modifying it, where should I make changes. *(Todays CSS workflow)*
- Increases risk of **unintentional overrides**, since the language & us *(the unassuming developer)* don't know any better.

### Solution

- Partition & encapsulate universal styles.
- Universals use the following naming convention for their classname: `class="*[universalClass]"`, (they are prefixed with an asterix):

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
	- **Protection:** adds a layer of protection. It's harder to accidentally override, since the selector is more verbose. (`button.\*btn` vs `button.btn`).
	- **Identity:** easier to indentify & thus differentiate in both HTML & CSS. Reduces risk of intensional overrides.

##### Contextual styles

- Universals can have contextual styles - CSS tied to a specific usage.
- Contextual styles are applied using a seperate identifier class: `class="*[universalClass] [contextualClass]"`
- This avoids polluting universal styles with those only relevant in specific use cases.
- For example:

```html
<nav>
	<button class="*btn nav__btn">
		Save
	</button>
</nav
```

```css
button.nav__btn {
	margin-top: 20px;
}
```

- Styles specific to the button inside `nav` should be applied using the class `.nav__btn`.

##### Universal children

- Some universals have child elements. These too should enjoy the benfits (protection & identity) of their parents.
- Universal children use the following naming convention for their classname: `class="^[universalChildClass]"`, (they are prefixed with an caret):

```html
<section class="*chatBox">
	<div class="^chatBox__header"></div>
	<div class="^chatBox__footer"></div>
</section>
```

```css
div.\^chatBox__header {
	background: seashell;
}

div.\^chatBox__footer {
	border:	1px solid seagreen;
}
```

- Again the prefix protects styles from the outside world, whilst providing an identity.
- Universal children can have contextual styles, which [like universals] are denoted with an identifier class: `class="*[universalChildClass] [contextualClass]"`:

```html
<aside>
	<section class="*chatBox">
		<div class="^chatBox__header aside__chatBox__header"></div>
		<div class="^chatBox__footer aside__chatBox__footer"></div>
	</section>
</aside>
```

```css
div.aside__chatBox__header {}

div.aside__chatBox__footer {}
```
*Styles specific to the chat box within aside.*

**Symbiotic**

- Whilst presented seperately it's important to note the patterns work just as well together, as they do alone.
- You may have noticed each [example] used **selector types**, and where appropriate the **shorthand notation**.
- The following example demonstrates **negation**, **discrete breakpoints** & **universals** working in conjunction. Each focussed on their own role in omitting unessessary overrides.


```html
<img class="*avatar *avatar--s" src="...">
<img class="*avatar *avatar--m" src="...">
<img class="*avatar *avatar--l" src="...">
<img class="*avatar *avatar--l *avatar--square" src="...">
```

```css
... todo
```

## Language

> Note: the mono language is still under development. This section contains the language specification - defining standards, whilst providing an insight into what's to come.

> You can find the [proposed syntax here](), although it's recommended to read the language specification first. *IMO it's better to understand what's happening at a higher level, before deleving into semantics & syntx*.

- The mono language goes places where the design pattern can't.
- Composed of 3 parts:
	- Types
	- Modifiers
	- Motives

### Types

- Set of data types for CSS properties.
- Bound to the scope of a CSS rule-set.
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

Public properties can only be modified by pseudo and modifier classes derived from ancestor selectors.

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
+	background<@override>: darkblue;
}
```

**Mutate**

Can modify the value of CSS properties with the type Public.

```diff
td {
	color<public>: darkgray;
}

tr:hover td {
+	color<@mutate>: black;
}
```

### Motives

- Add reasoning to CSS.
- Goal of a motive is to off-load information about the code (from our brain) to the code itself.
- As we have seen "A CSS rule can exist for a range of reasons".
- Motives capture the rational in the moment a property is declared. It's easy to forget why a property exists, which means once added it generally stays *(even when the reason for adding it is later nullified)*.
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
	box-sizing<?because: swallowPadding)>: border-box;
}
```

*And left margin is 20px to align the content with the nav - (value reasoning):*

```css
main.content {
	margin-left<?because: 'align content with nav'>: 20px;
}
```

**Patch**

Used to denote temporary styles.

Usually related to a known bug, or feature that hasn't been finished yet.

When the bug is fixed / feature is finished patchs associated with it can be removed.

```css
a.sub-title {
	color<?patch: 'ENG-123456'>: cadetblue;
}
```

# Mono language

> Note: the mono language is still under development.

- The mono language is an extension of the [design pattern]().
- Soley focussed on the [core concepts]() (improve overriding mechanism of CSS & make CSS easier to reason with).
- As small as it can be - bloated projects are harder to consume!
- Language designed to be:
	- Unobtrusive
	- Familiar
	- Consistent

## Proposed syntax

- Types, modifiers and motives share the same construct.

`cssProperty<notion>: cssValue;`

- Notions are wrapped in croccodiles <> (between the CSS property name, and the colon that follows).

### Types

```css
img.avatar {
	height<immutable>: 40px;
	width<immutable>: 40px;
	border-style<immutable>: solid;
  border-width<immutable>: 2px;
  border-color<protected>: deepskyblue;
	display<public>: flex;
}
```

- Whilst types belong to each CSS property they can also be applied at the rule-set level - providing a less verbose alternative:

```css
img.avatar<immutable> {
	height: 40px;
	width: 40px;
	border-style: solid;
  border-width: 2px;
}
```

- The type is inferred by the rule-set. The `height`, `width`, `border-style` and `border-width` have the type immutable.
- Properties can opt out of the inferred type at the property level:

```diff
img.avatar<immutable> {
	height: 40px;
	width: 40px;
	border-style: solid;
  border-width: 2px;
+ border-color<protected>: deepskyblue;
+	display<public>: flex;
}
```

- `border-color` and `display` opt out of the inferred type, choosing to specifiy their own.

### Modifiers

- Modifiers are prefixed with the **@** symbol.
- `property<@Modifier>: value;`
- *Those familiar with Java will recognise the @ symbol from [annotations]().*

```css
img.avatar:hover {
  border-color<@override>: dodgerblue;
}

nav.unauthenticated img.avatar {
	display<@mutate>: none;
}
```

### Motives

- Motives are prefixed with the **?** symbol.
- `property<?Motive>: value;`
- I ❤️ the question mark notation, since motives explain usage. The ? asks why a property exists, and the motive provides an answer.

```css
button.btn-default {
	background-color<?overthrow>: honeydew;
}
```

- Some motives accept a parameter.
- For example the `patch` motive accepts a pointer to where more information can be found. *In this example the ID of JIRA ticket.*

```css
a.sub-title {
	color<?patch: 'ENG-123456'>: cadetblue;
}
```

*When ticket ENG-123456 has been resolved this declaration can be removed.*

## Combinations

- There are times when types and motives are used in conjunction.
- In these cases the notions are seperated with a comma:

```css
ul.todo-list {
	box-sizing<immutable, ?because:swallowPadding>
}
```

## Design desisions

- **Consistent:** Mono notions are wrapped in croccodiles <>.
- **Distinguishable:** Each notion is easy to identify, and thus differentiate. Types consisting of the keyword, modifiers prefixed with @, and motives prefixed with ?.
- **Readability:** Notions are unobtrusive which makes it easy to scan & read CSS declations. *Property names remain at the beginning of a line, and property values at the end.*
- **WIP:** mono syntax is still a working draft. You can see its evolution [here](exploring syntax.css).

## Co-located media queries

- Another addition mono brings to naitive CSS is **co-located media queries**.
- Often media queries are scattered around a project, which makes CSS harder to reason with.
- One pre-processor delight is [nested media queries](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#media).

> "[nested media queris] make it easy to add media-specific styles without having to repeat selectors or break the flow of the stylesheet." - SASS docs

- Mono builds upon this idea.
- Rather than repeating declations (for each media query) a single property can declare multiple values for different media features.
- This conforms to monos ideology, whilst making media-specific styles declarative & easy to read.
- Take the following:

```css
aside.contextualInfo {
  font-family<immutable>: 'operator mono';
  font-weight<immutable>: 300;
  font-size<immutable>:
  switch(@media screen) {
	  case width 0px -> 400px:
      16px;
    case width 400px -> 900px:
      14px;
    default:
      12px;
    }
}
```

- Benefits of co-location:
	- **Readability:** easy to identify the value of `font-size` changes depending on screen-size.
	- **Maintenance:** one place to add / edit styles.
	- **Omits cascade:** orchestrating where to put media-queries no longer a concern.

# Compiler specification

**Note to self:** not sure whether the compiler spec should live elsewhere?

> Note: mono is still under development. This section contains the compiler specification - defining standards, and test-cases.

- Mono is a compiled language.
- Brings several benefits:
	- Enforce the design pattern
	- Enforce the type system
	- Assist the developer. *The elm folks are visibily enjoying [compilers as assistants](). Both in terms of onboarding beginners, and providing a delightful developer experience.*

## Errors

*Design pattern errors*

**Missing element type**

Occurs when a CSS selector is missing element type.

*Source:*

```css
.guest-list {
	margin-left<?veto>: 0;
	padding-left<?veto>: 0;
}
```

*Error:*

```bash
-- Missing element type --------------------------------- app.css

The selector `.guest-list` is missing an element type.

12| .guest-list {
	^^^
	
`.guest-list` needs to be scoped to a HTML element(s).

For example:

`div.guest-list {`
```

**Inappropriate shorthand**

Occurs when shorthand notation is misused.

*Source:*

```css
div.nav__links {
	margin<immutable>: 10px 0 0 0;
}
```

*Error:*

```bash
-- Inappropriate shorthand ------------------------------ nav.css

`div.nav__links` unnecessarily uses shorthand notation for the property `margin`.

3| div.nav__links {
4|   margin<immutable>: 10px 0 0 0;
							 ^^^^^

Only the top margin needs to be applied.

For example:

div.nav__links {
  margin-top<immutable>: 10px;
```

**Indiscrete breakpoints**

Occurs when indiscrete breakpoints are detected.

*Source:*

```css
@media (min-width: 400px) {
 h3.heading {
  font-size: 16px;
 }
}

@media (min-width: 900px) {
 h3.heading {
  font-size: 18px;
 }
}

@media (min-width: 1200px) {
 h3.heading {
  font-size: 20px;
 }
}
```

*Error:*

```bash
-- Indiscrete breakpoints ------------------------ typography.css

The breakpoints for ` h3.heading` are indiscrete.

1| @media (min-width: 400px) {		
2|  h3.heading {

7| @media (min-width: 900px) {
8|  h3.heading {

13| @media (min-width: 1200px) {
14|  h3.heading {

The styles in: 

1| @media (min-width: 400px)

Can be overriden by:

7| @media (min-width: 900px)
13| @media (min-width: 1200px)

The styles in:

7| @media (min-width: 900px)

Can be overriden by:

13| @media (min-width: 1200px)

Breakpoints should be discrete. Those for `h3.heading` are missing a `max-width`.
 
May I suggest:

@media (min-width: 400px) and (max-width: 900px) {
						  ^^^^^^^^^^^^^^^^^^^^^^			
 h3.heading {

@media (min-width: 900px) and (max-width: 1200px) {
						  ^^^^^^^^^^^^^^^^^^^^^^^
 h3.heading {
```

*Type system errors*

**Missing modifier**

When a typed property is changed without a modifier.

*Source:*

```css
fieldset {
	background<public>: white;
}

form.form--withError fieldset {
	background: lightpink;
}
```

*Error:*

```bash
-- Missing modifier ------------------------------------ form.css

The property `background` is missing a modifier.

14| form.form--withError fieldset
15|  background: mistyrose;

The background of 'fieldset' has the type: public.

10| fieldset {
11|  background<public>: ivory;
				^^^^^^

May I suggest:

Using the modifier `mutate`:

16| form.form--withError fieldset
17|  background<@mutate>: mistyrose;

```

**Type modifier mismatch**

When a modifier acts on the wrong type.

*Source:*

```css
a {
	color<immutable>: aquamarine;
}

a:hover {
	color<@override>: mediumaquamarine;
}
```

*Error:*

```bash
-- Type modifier mismatch ---------------------------- common.css

The modifier `@override` cannot change properties with the type `immutable`.

4| a {
5|  color<immutable>: aquamarine;
		  ^^^^^^^^^	
	
8| a:hover {
9|  color<@override>: mediumaquamarine;
		  ^^^^^^^^^

The color has the type: immutable
But the modifier used is: @override

May I suggest:

Changing the color type to `protected`:

4| a {
5|  color<protected>: aquamarine;

```

*Parsing errors*

**Unknown type**

When an unknown type is used.

*Source:*

```css
nav {
	border-bottom-color<lock>: teal;
}
```

*Error:*

```bash
-- Unkown type ------------------------------------------ nav.css

`lock` is not a valid type.

1| nav {
2|  border-bottom-color<lock>: teal;
						^^^^	

Available types are:

immutable
protected
public

```

**Unknown modifier**

When an unknown modifier is used.

*Source:*

```css
btn.payNow:hover {
	transform<@unlock>: scale(1.2);
}
```

*Error:*

```bash
-- Unkown modifier ---------------------------------- buttons.css

`@unlock` is not a valid modifier.

10| btn.payNow:hover {
11|  transform<@unlock>: scale(1.2);						
			   ^^^^^^^

Available modifiers are:

@override
@mutate

```

**Unknown motive**

When an unknown motive is used.

*Source:*

```css
span.heading--uppercase {
	text-transform<?itsFriday>: lowercase;
}
```

*Error:*

```bash
-- Unkown motive ----------------------------------- headings.css

`?itsFriday` is not a valid motive.

8| span.heading--uppercase {
9|  text-transform<?itsFriday>: lowercase;
				   ^^^^^^^^^^

Available motives are:

?overrule
?overthrow
?veto
?fallback
?because
?patch

```

# Examples

- Wanted to test my assumptions before building the compiler.
	- Save time. 
	- Allow ideas to develop.
	- Not be held back by implementation details / constraignts. 
- Mocked language using [Sass](). 
	- Tangible way of testing theories in practice.
	- Pretended design patterns & language constructs were being enforced by monos compiler. *When in actual fact my brain was acting on behalf of the compiler*.
- So far I've built 3 proof of concepts (POC) using the Sass implementation. *If you only checkout one I'd reccomend YouTube*.

**Facebook**

![Facebook](/path/to/img.jpg "Facebook")

- First project built with mono.
- Intricate UI, good test of types & modifiers.
- *Credit:* Ben Hartley for the [awesome design](https://dribbble.com/shots/1666016-Facebook-redesign).

 **Grid**
 
 ![Gird](/path/to/img.jpg "Gird")
 
 - Second project built with mono.
 - Responsive, good test of discrete breakpoints.

**YouTube** 

 ![YouTube](/path/to/img.jpg "YouTube")
 
 - Latest project built with mono. *Not yet finished.*
 - Good example of everything, includes:
		- Themes
		- Responsive layout / UI
		- State
		- Interactions

# Findings

- Not only did each example help test assumptions, they also: 
	- Exposed early flaws.
	- Trimmed the fat - highlighted what was / wasn't useful.
	- Unearthed new featurss / use-cases.
- Provided an insight into how mono could improve CSS development. Findings:
	- CSS was tonnes easier to reason with.
	- Not worrying about cascade, specificity & importance is so liberating!
	- No overrides yields better reuse.
	- Development time felt quicker. Less time spent reasoning with / fixing things.
- Most notably: I found it easier, quicker & safer (less error prone) to jump back in and continue where I left off. Attribute this to:

1. Code is expressive / has clarity -> easier to understand
2. Patterns promote consistency -> which buys familiarity (reduces onboarding time)
3. Constraints limit uncertainly -> narrows scope of potential problems
4. Predefined rules guide workflow -> less decision making, more consistency
5. Code is more logical than abstract -> easier to reason with
6. More confident to make changes -> less risk of side effects

# Outcome / What's next

- The POCs acted as a great testing ground for mono. 
- Took a scientific / unbiased approach - where instead of proving things right, tried to see what was wrong.
- Conclusion: mono is definetly worth persuing. From looking at the findings & my experience of writing mono vs regular CSS it looks promising. 
- I'm very excited to see where mono can go!