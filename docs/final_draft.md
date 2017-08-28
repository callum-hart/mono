Introduction

Mono is a design pattern & programming language that reduces the difficulties of CSS development.

Mono brings concepts based on established programming language conventions to CSS, including: data types, access modifiers & immutability.

With a small footprint & focus on its core concepts mono makes CSS robust, predictable and easy to reason with.

Motivation

Mono was born out of my own frustration.

Whilst working on different CSS codebases I realised all shared similar issues. A common trait became clear: CSS development is expensive - it's labour intensive & time consuming.

The typical CSS workflow amounted to:

1. Hunting: Locate where a style derives from.
2. Reasoning: Understand why a style exists.
3. Analysing: Ascertain what impact adding / changing / removing a style will have.
4. Friction: Compete with specificity, cascade & importance when making a change.

Four steps to make one change is exhausting, and more importantly not scalable. The bigger codebases grew the worse maintaining their CSS became.

***

A cumbersome workflow isn't without reason - merely a symptom of  other issues. CSS is notoriously fragile and difficult to reason with.

Part of the difficulties lie with global scope & an unhealthy tolerance of overrides. Without separation of concerns, nor a means to encapsulate we often find styles compete against one another - so much so that the term "winning style" has been coined.

Determining the "winning style" is unpredictable - with too many deciding factors at play. Global scope permits anyone to override. Influencers cascade, specificity and importance determine who is victorious. At any given time the victor can change (new styles added, old styles removed) which not only makes the outcome uncertain but fragile.

The unpredictable and fragile nature of CSS make it easy to break and hard to maintain. The sheer volume of styles cohabiting in the same space quickly grows unmanageable. It's difficult to keep track of what styles are used & who uses them. It grows increasingly difficult to identify dependencies and relationships between styles, which means we cannot confidently make changes.

***

After having these problems myself & witnessing others suffering I thought there must be a better way! Initially a thought experiment mono evolved from investigating [CSS issues](), examining why they were problematic, & exploring how they were solved elsewhere.

With an open-minded approach & focus on understanding core problems before seeking solutions mono aims to make CSS robust, predictable, and easy to reason with. I'm extremely excited having watched mono mature & even more thrilled about it's future!

Core concepts

Mono has two core concepts:

1. Change overriding mechanism of CSS
2. Give CSS an expressive & unified implementation

Change overriding mechanism of CSS

In my opinion a high proportion of CSS pain points come from it's overriding architecture.

Overrides are brittle, unreliable and self-perpetuating. Built on unstable foundations (cascade, specificity, importance) overrides often feel uncontrollable.  Can they be tamed?

In a word, yes.

If we view overrides as mutation we can look to other languages for guidance, many of which provide a system for changing a value. For example:

Access modifiers: Determine who & how a value can be modified.
Data types: A value cannot be modified through reassignment (final in Java / const in ES6).
Immutability: A value whose state cannot be modified after its creation.
Setters: Expose safe ways to modify otherwise inaccessible values.

An equivalent system is missing from CSS - a style can be modified by anyone from anywhere.

Mono denounces this liberal attitude to overrides. Instead mono imposes constraints that determine what styles can be overridden, who is allowed to override, and how overrides are done - a system mono calls controlled overrides.

Give CSS an expressive & unified implementation

It is hard to understand the behaviour of CSS.

A CSS declaration can exist for a range of reasons. The rationale behind a declaration usually resides in our (or someone else's) head. Since CSS offers no indication of its purpose (lacks intent) it's hard to understand why a property exists & fathom the rationale behind its value.

This means time & mental energy is spent reasoning with CSS. "Why is opacity set to 1", "What happens if I remove position relative". We make changes without confidently foreseeing the outcome and any side-effects that may come with it.

Mono introduces systems that help CSS express intent. By making CSS expressive & easier to reason with it becomes more tangible and the process of understanding it becomes more immediate.

***

CSS also lacks a consistent implementation.

There are many ways to achieve the same thing and no formal implementation. This means developers frequently make design decisions on a case-by-case basis which fosters inconsistencies. This makes it hard to understand and work with our own CSS and that of others.

In addition best practices such as BEM (aimed at promoting consistency) are difficult to enforce, which make them far too easy to ignore or misuse.

Mono is a firm believer in convention over configuration. Design patterns & best practices are "baked into" the language and more importantly enforced by its compiler. It is this enforcement that brings consistency.

Key principles

Mono has five key principles:
#1 Avoid needless overrides

The best override is one that doesn't happen in the first place!

Overrides should not be the goto solution for achieving variation or reusability. Despite being the default architecture of CSS there are better alternatives to overriding styles.
#2 Rules govern overrides

Predefined rules determine when an override is allowed.

There are certain circumstances in which overrides cannot be avoided (however this doesn't mean we can ignore the first principle).

Instead we must identify all possible use cases in which an override is required, and then establish laws & conditions in which an override is allowed to happen.

Limiting the circumstances in which styles can be overridden helps reduce needless overrides, whilst providing a framework to work with. Mono uses a type system to keep overrides in check - an override that violates a rule is not permitted.
#3 Overrides must be controlled

Overrides must operate within a controlled & regulated system.

The system must provide a mechanism to override whilst enforcing the rules that govern overrides.

An override operating outside the system is not allowed.
#4 One way to override

There must only be one way to override a style.

A single implementation guarantees consistency and clarity. With mono an override is expressed using a modifier]. A modifier is the only way to override a style.

When a modifier overrides a style we can pinpoint exactly where & why the override happened. This is a stark contrast to regular CSS - where overrides are inconspicuously scattered across different parts of code.
#5 CSS should be easy to understand

It should be easy to understand and predict the behaviour of CSS.

It should be easy to articulate and identify what styles do, why they are used, and what role they play in our code. Mono uses motives that empower CSS to communicate its purpose.

This reduces ambiguity and obscurity which means developers are less likely to break things since changes are more predictable.

Design patterns

Selector types

All selectors should include the element type.

Take the following CSS rule-set:

.btn {
    font-family: "Operator Mono SSm";
    font-size: 14px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    background: cadetblue;
    color: ivory;
}

Without an element type the .btn class is obscure. We cannot guarantee who the consumers (the HTML elements that use the .btn class) are.

This means we cannot confidently predict all elements with the class .btn will look the same, since we have no control or insight into what other (user agent, our own, 3rd party) CSS the element will have.

Also styles specific to a certain element type are bundled into the .btn class; and therefore applied to all consumers, which introduces unnecessary bloat (deadcode). Text-decoration none is only required for anchors using the .btn class.

When selectors are bound to an element type(s) it's easier to make connection between CSS & HTML:

a.btn,
button.btn {
    font-family: "Operator Mono SSm";
    font-size: 14px;
    background: cadetblue;
    color: ivory;
}

a.btn {
    text-decoration: none;
}

button.btn {
    border: none;
    cursor: pointer;
}

It’s easy to identify what elements use the class .btn - we can clearly see .btn can be an anchor or a button.

This also makes it easier to separate reusable styles from those specific to a certain element type. Text-decoration none is only needed for anchors so is moved out into a rule-set of its own.

Not only does this separate concerns, it helps organise styles into smaller, manageable, distinct chunks. I know where to add or remove styles for anchors, and better still if anchors stop using the .btn class I can safely remove styles specific to them.
Shorthand appropriately

Avoid using shorthand notation, unless property has multiple values.

Let’s say we have an element whose top margin is always 10px (a concrete value). For example an avatar:

img.avatar {
    margin: 10px 0 0 0;
    width: 40px;
    height: 40px;
    border-radius: 20px;
}

And avatars within the navigation have a left margin of 15px:

nav img.avatar {
    margin: 10px 0 0 15px;
}

Using the shorthand notation for margin has brought some undesirable effects.

Firstly it’s illogical. Inside the nav the top margin is re-applied even though only the left margin has changed. We are overriding the 10px top margin (set in img.avatar) with the same value - overriding 10px with 10px doesn’t make sense.

Secondly the margin shorthand is error prone. There is an increased risk of accidentally overriding the top margin with a value other than 10px. Which means we have to keep track and maintain every concrete value in our system. If the top margin of img.avatar is subsequently changed to 15px there are more instances to update.

Lastly shorthand notations can be unnecessary, often re-applying values that already exist or need to be reset later. We can leverage browser default (user agent) styles. The default margin for an image is already 0px.



Omitting the margin shorthand not only removes unnecessary (same value) overrides it also improves readability. The property name now describes where the value applies, seen in the revised example below:

img.avatar {
    margin-top: 10px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
}

nav img.avatar {
    margin-left: 15px;
}

Negation

Use negation to avoid overrides among composable classes.

Composable CSS classes can be used on their own, or in conjunction with other classes. When composed (with other CSS classes) the outcome is often different.

An example of composable classes can be seen in bootstrap:

<span class="badge badge-light">Light</span>

.badge {
  color: #fff;
}

.badge-light {
  color: #111;
}

The color of .badge is #fff and when .badge and .badge-light are used together the expected color is #111 (since the color in .badge-light overrides the color in .badge).

The color of .badge-light is expected to be #111 but this isn’t a guarantee. This is because the outcome (in this case the color) is dependant on respecting the laws of cascade - .badge-light must follow .badge. If not the outcome is different:



.badge-light {
  color: grey;
}

.badge {
  color: black;
}

Color of .badge-light is overridden by .badge.

Introducing negation removes the dependency on the cascade and the need to override.

.badge:not(.badge-light) {
  color: black;
}

.badge-light {
  color: grey;
}

The color has one declaration per variant no matter if the classes (.badge and .badge-light) are used on their own or used in conjunction. Negation has brought us portability and predictability. The order of declarations in the cascade no longer matters:

.badge-light {
  color: grey;
}

.badge:not(.badge-light) {
  color: black;
}

Color of .badge-light is still grey.

Negation buys guarantees. We can guarantee the color of .badge is black and the color of .badge-light is grey. We can guarantee the color when the classes are composed is grey. And we can guarantee modifying styles in one rule-set won’t bring unforeseen side-effects to the other.






Discrete breakpoints

Styles in one media query should not override styles in another.



Indiscrete breakpoints can often be seen in “mobile first” implementations:

<nav>
  <a href="" class="logo">Logo</a>
</nav>

a.logo {
    font-size: 14px;
}

@media (min-width: 500px) {
    a.logo {
      font-size: 16px;
    }
}

@media (min-width: 1000px) {
    a.logo {
      font-size: 18px;
    }
}

Figure 1

In this example the media queries rely on their position in the cascade to produce the expected behaviour. On screens larger than 1000px all 3 rule-sets will apply with the last in the cascade taking effect (the font-size of a.logo will be 18px). It overrides the other font-size declarations.










Reshuffling the order of rule-sets produces a different result:

a.logo {
    font-size: 14px;
}

@media (min-width: 1000px) {
    a.logo {
      font-size: 18px;
    }
}

@media (min-width: 500px) {
    a.logo {
      font-size: 16px;
    }
}

Again on screens larger than 1000px all 3 rule-sets apply. And since a min-width of 500px evaluates to true, and is later in the cascade the font-size of a.logo is 16px. Unintuitively it is the cascade and not the breakpoint value that determines the font-size.

Indiscrete breakpoints are also dependent on specificity. In the following example the rule-set with the strongest specificity out-competes the others; regardless of their position in the cascade or breakpoint value:

nav a.logo {
  font-size: 14px;
}

@media (min-width: 1000px) {
    a.logo {
      font-size: 18px;
    }
}

@media (min-width: 500px) {
    a.logo {
      font-size: 16px;
    }
}

At all screen widths the font-size of a.logo will be 14px, since the selector has the strongest specificity.


Figure 2 and 3 are examples of how indiscrete breakpoints are dependent and influenced by cascade and specificity.

***

Discrete breakpoints encapsulate styles within boundaries. Each boundary is partitioned so that styles in one boundary cannot override styles in another.

This removes the need to override.

The example below produces the same outcome as figure 1 without the weaknesses seen in figure 2 and 3:

@media (max-width: 499px) {
  a.logo {
    font-size: 14px;
  }
}

@media (min-width: 500px) and (max-width: 999px) {
    a.logo {
      font-size: 16px;
    }
}

@media (min-width: 1000px) {
    a.logo {
      font-size: 18px;
    }
}

Figure 4

The styles within each breakpoint no longer compete with one another. At each breakpoint the font-size only has one declaration.

Reshuffling the order of rule-sets no longer changes the outcome, nor does using a selector with stronger specificity:

@media (max-width: 499px) {
  nav a.logo {
    font-size: 14px;
  }
}

@media (min-width: 1000px) {
    a.logo {
      font-size: 18px;
    }
}

@media (min-width: 500px) and (max-width: 999px) {
    a.logo {
      font-size: 16px;
    }
}

The example above produces the same outcome as figure 4, despite a change to cascade order and specificity.

This makes media queries far more predictable, since there’s no need to orchestrate overrides. Omitting overrides has made the order of media queries and their specificity irrelevant. Only the breakpoint size determines what styles apply (at different screen sizes) which is far more intuitive and deterministic.

Just like negation this pattern buys guarantees. We can guarantee what the font-size will be at different screen-sizes. We can guarantee that changing the order of media queries won’t affect the outcome. We can guarantee a change in specificity won’t sidestep the cascade and override subsequent rule-sets. And we can guarantee the font-size in one media query won’t get overridden by another.

Constants

A constant is an element whose appearance cannot be altered.

Constants always look the same, regardless of where they are used. Styles are decoupled from their context and “hidden” from the outside world.

Constants are best suited to common components (such as buttons, avatars, icons, et cetera), especially those with a high usage. For example the following button:

<button class=”btn”>
Save
</button>

button.btn {
  padding: 8px 12px;
  background: ivory;
  border: 1px solid slategrey;
  color: darkslategray;
}

As it currently stands .btn suffers a few problems:

Firstly it lacks identity. It isn’t obvious that .btn is a common component (other than intuition telling us it probably is). Nothing differentiates .btn from other classes which means it isn’t clear what impact modifying its styles will have, nor where these modifications should happen.

Secondly it’s far too easy to override .btn styles both technically and in terms of developer awareness.

Technically .btn styles can be overridden from anywhere because CSS offers no means to protect nor encapsulate them. And since .btn lacks identity we are unaware what impact overriding it’s styles have.

***

Constants look to solve these problems by partitioning and encapsulating styles, whilst also providing an identity.

This is achieved using the following class naming convention:

class=”*className”

Classes are prefixed with an asterix (*)

The previous button example becomes:

<button class=”*btn”>
Save
</button>

button.\*btn {
  padding: 8px 12px;
  background: ivory;
  border: 1px solid slategrey;
  color: darkslategray;
}

Prefixing the class with a special character is a subtle change, but buys us a few things. Firstly it’s easy to identify and thus differentiate *btn from other classes. It’s clear that *btn is a common component and modifications should be made carefully.

Secondly it adds a layer of protection. The special character needs to be escaped, which makes it harder to accidentally override btn since its selector is more verbose: button.\*btn vs button.btn.

***

Constants can have contextual styles which are styles tied to a specific usage.

Contextual styles are applied using a separate class. This avoids polluting common styles (in *btn) with those only relevant to specific usages. For example:

<nav>
  <button class="*btn nav__btn">
    Log out
  </button>
</nav>

button.nav__btn {
  margin-top: 20px;
}

Styles specific to the *btn inside the navigation are applied using the class nav__button.

***

So far the examples have consisted of only one HTML element (a single button). However constants can have nested elements. These are called child constant(s).

It is just as important that child constants enjoy the same benefits (protection and identity) that their parents have.

This is achieved using the following class naming convention:

class=”^className”

Classes are prefixed with an caret (^)







An example is a chat widget:

<section class="*chatBox">
  <div class="^chatBox__header"></div>
  <div class="^chatBox__footer"></div>
</section>

div.\*chatBox {
  background: ivory;
}

div.\^chatBox__header {
  background: seashell;
}

div.\^chatBox__footer {
  border: 1px solid seagreen;
}

Again prefixing the class with a special character makes child constants easy to identify, and harder to override.

Using a different prefix [for child constants] also reinforces their identity. They can easily be distinguished from other CSS classes and recognised as belonging to a constant. Both of which help understanding what the class is, where it’s used, and what impact modifying or overriding it will have.

Note on design patterns

Whilst presented separately it’s important to note that the design patterns work just as well together and they do alone. Patterns can work in conjunction, each focussed on their own role in helping to avoid needless overrides.


Language
Note: the mono language is still under development. This section contains the language specification, defining standards whilst providing an insight of what’s to come.

The mono language goes places the design pattern can’t.

Mono is a compiled, statically typed language. It uses a type system to control overrides and uses descriptive markup to help CSS express intent.

Mono is composed of 3 concepts:

Types
Modifiers
Motives



Mono goes places its design patterns can’t.
Small layer that sits on top of CSS
Mono is a statically typed language.
It uses a type system to control overrides.
Designed to make CSS easier to understand.
Mono is compiled which brings several benefits:
Enforce the design patterns
Enforce the type system
Catch errors at compile-time
Assist the developer. The elm folks are visibly enjoying compilers as assistants. Both in terms of onboarding beginners, and providing a delightful developer experience.
The mono language is an extension of the design pattern.
Soley focussed on the core concepts (improve overriding mechanism of CSS & make CSS easier to reason with).
As small as it can be - bloated projects are harder to consume!
Language designed to be:
Unobtrusive
Familiar
Consistent



The mono language is an extension of the design pattern, composed of three parts:

Types
Modifiers
Motives

The language is focussed purely on the core concepts. Types and modifiers provide a safe system for overrides, and motives help CSS express intent.

Mono is a statically typed language that compiles to CSS. The compiler encourages design patterns, enforces the type system, and catches syntactical errors. The compiler design just as important as language design.


Intentionally small by design. There are 3 types, 2 modifiers and 6 motives. All use the same notion: property<notion>: value;
Mono has been designed to be complementary to those familiar with CSS.


Types

In mono each CSS declaration has a type.

A type has a set of laws that determine how the declaration can be overridden.

In total there are 3 types: immutable, protected & public.

Immutable

Immutable declarations can never be overridden.

h3.subTitle {
  font-size<immutable>: 16px;
}

The font size of h3.subTitle is and always will be 16px. This value cannot be overridden, any attempt to do so will throw a compiler error.

Protected

Protected declarations can only be overridden by pseudo-classes derived from the same selector.

button.btn {
  background-color<protected>: blue;
}





The .btn background color can only be overridden by pseudo-classes derived from .btn:

button.btn:link {
  // can modify background-color
}

button.btn:visited  {
  // can modify background-color
}

button.btn:hover {
  // can modify background-color
}

button.btn:active {
  // can modify background-color
}

Public

Public declarations can only be overridden by pseudo classes derived from ancestry selectors:

td {
  color<public>: darkgray;
}

The td color can only be overridden by pseudo-classes of parent elements:

tr:hover td {
  // can modify color
}

***

Whilst types belong to each CSS declaration they can also be applied at the rule-set level; proving a less verbose alternative:

img.avatar<immutable> {
height: 40px;
width: 40px;
border: 2px solid deepskyblue;
}

The type is inferred by the rule-set. All declarations within img.avatar are immutable.
Declarations can opt out of the inferred type at the property level:

img.avatar<immutable> {
      height: 40px;
width: 40px;
border<protected>: 2px solid deepskyblue;
}
Modifiers

Modifiers provide a single mechanism to override a CSS declaration. Modifiers are the only way  a style can be overridden.

Each modifier is paired with a type. A modifier is only allowed to override a declaration if the type and modifier are compatible.

Since the type immutable cannot be overridden we are left with two modifiers, one for protected and one for public types.

Override

Can only override CSS declarations with the type protected.

button.btn {
  background-color<protected>: blue;
}

button.btn:hover  {
  background-color<@override>: blue;
}

Mutate

Can only override CSS declarations with the type public.

td {
  color<public>: darkgray;
}

tr:hover td {
  color<@mutate>: black;
}

Motives

Motives add reasoning to CSS, they help express intent.

The goal of a motive is to off-load information from our brain to the code itself. Externalizing information not only frees our mind, but makes collaboration easier.

Motives capture the rationale in the moment a declaration is declared. This rationale helps explain the reason why a property exists, or justify its value.

Motives remove investing time & energy into understanding CSS, whilst indicating what impact changing / removing a declaration will have.

There are 6 kinds of motive:


Overrule

Used to override inline CSS; inlined in the HTML or set by JavaScript.

<p class=”status” style=”display:none”>
  Saving…
</p>

form.loading p.status {
  display<?overrule>: block;
}

Overthrow

Used to override 3rd party CSS.

For example the background color of a bootstrap button.

<button type="button" class="btn btn-default">
    Buy
</button>

button.btn-default {
    background-color<?overthrow>: honeydew;
}

If the dependency (in this case bootstrap) is dropped we can confidently remove its overthrow rules.

Veto

Used to override user agent / browser default styles.

ul.contactList {
    margin-left<?veto>: 0;
    padding-left<?veto>: 0;
}

Fallback

Used to denote fallback properties used for cross browser compatibility.

nav {
    background<?fallback>: grey;
    background: linear-gradient(white, black);
}

Because

Used to justify the usage of a property, or reasoning behind its value.

The box sizing of section.newsFeed only exists to swallow its padding:

section.newsFeed {
    padding<immutable>: 20px;
    box-sizing<?because: swallowPadding)>: border-box;
}

The left margin of main.content should match the left padding of nav:

nav {
  padding-left : 20px;
}

main.content {
    margin-left<?because: 'align content with nav'>: 20px;
}

The because motive is powerful since it helps depict and maintain dependencies between properties and or elements.

For example if the padding of section.news-feed is removed we can remove box-sizing. Likewise if the left padding of nav changes we know to change the left margin of main.content.

Patch

Used to denote temporary styles; usually related to a bug or feature that’s in progress.

The patch motive accepts a pointer to where more information is located. For example a JIRA ticket ID:

a.signIn {
    color<?patch: 'ENG-123456'>: cadetblue;
}

When the ticket ENG-123456 is resolved this declaration can safely be removed.


Combinators

There are times when a type or modifier can be using in conjunction with a motive. In these cases notions are separated with a comma:

ul.contactList {
    box-sizing<immutable, ?because:swallowPadding>;
}


Remaining sections:

Examples
Findings
Compiler spec?
