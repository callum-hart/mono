# Core concepts

Mono is a design pattern & language. It has two core concepts:

1. Change overriding mechanism of CSS
2. Give CSS an expressive & unified implementation

## Change overriding mechanism of CSS

In my opinion a high propertion of CSS painpoints come from it's overriding architecture.
 
Overrides are: [brittle, unreliable and self-perpetuating](blog-post-pain-from-overrides). Built on unstable foundations *(cascade, specificity, importance)* overrides often feel uncontrollable.  Can they be tamed?

In a word, yes.

If we view **overrides as mutation** we can look to other languages for guidance. Many of which include techniques that **provide a system for changing a value**, these include things such as:

- **Access modifiers** - determine who & how a value can be modified.
- **Data types** - a value cannot be modified through re-assignment (final in Java / const in ES6).
- **Immutability** - a value whose state cannot be modifed after its creation.
- **Setters** - expose safe ways to modify otherwise inaccessible values.

An equivalent system is missing from CSS - a style can be modified by anyone from anywhere. 

Mono denounces this liberal attitude to overrides. Instead mono imposes constraints that determine what styles can be overriden, who is allowed to override, & how overrides are done - a system mono calls **controlled overrides**.

**Benefits:** stability: reduces risk of bugs (caused by accidental overrides).


## Give CSS an expressive & unified implementation

It is **hard to understand the behaviour of CSS**.

A CSS declaration can exist for a range of reasons. The rationale behind a declaration usually resides in our (or someone elses) head. Since **[CSS lacks intent](code-snippet)** (offers no indication of its purpose) it's hard to understand why a property exists & fathom the rationale behind its value.

This means time & mental energy is spent reasoning with CSS. "Why is opactity set to 1", "What happens if I remove position relative". We make changes without confidently foreseeing the outcome & any side-affects that come with it.

Mono introduces systems that help CSS express intent. By making CSS expressive & easier to reason with the process of understanding [it] becomes more **immediate & tangible**.

<p align="center">&ast;&ast;&ast;</p>

CSS also **lacks a consistent implementation**.

There are many ways to achieve the same thing & no formal implementation. This means developers frequently make design decisions on a case-by-case basis which fosters inconsistencies. This makes it hard to understand & work with our own CSS and that of others.

In addition best practices (such as [BEM]()) aimed at promoting consistency are difficult to enforce, which make them far too easy to ignore or misuse.

Mono is a firm believer in **convention over configuration**. {Design patterns & best practices are "baked into" the language & more importantly enforced by its compiler. It is this enforcement that brings consistency.}? *last bit needs work*



---

**Expressive (notes)**

**Idea:** CSS offers no indication of it's purpose. 
**Problem:** Hard to understand behaviour of CSS. A CSS rule can exist for a range of reasons. Black box. Hard to identify rationale behind why a property exists & reasoning behind it's value (majic numbers).
**Intent (solution):** By making CSS easier to reason with we make the process of understanding it more immediate. Make it easy to identify: role styles have, how styles are interconnected. 
**Benefits:** Reduces risk of bugs. Reduces side-affects, can confidently make changes.


**Unified (notes)** 

**Idea:** CSS lacks a consistent implementation. 
**Problem:** Many ways to achieve the same thing - more time spent on understanding behaviour of CSS. Inconsistent implementations increase ambiguity / risk of bugs.
**Intent (solution)**: 
Design patterns promote consistency
Constraints limit uncertainly
Predefined rules guide implementation

**Benefits:**
familiarity (reduces onboarding time)
narrows scope of potential problems
less decision making (convension over configuration, focus on what needs to be done not how)

Spend alot of time focussing on how something needs to be done. Emphahis is on how because implementations differ across projects & even within the same project. 
How is determined by each implementation.

Design patterns & best practices are "baked into" the language - alleviating developers from making decisions 

design patterns & language features are backed up by it's compiler. With best practices "baked in" mono promotes consistency & assists developers 

imposes design patterns that are backed up by its compiler. The language introduces constraignts such as controlled overrides

Instead we should focus on what needs to be done, not how. 

Many ways to achieve the same thing. 
No formal way of handling common use cases.
Best practices are loosely enforced (if at all).

Design patterns promote consistency.
Constraints limit uncertainly.
Predefined rules guide implementation.









