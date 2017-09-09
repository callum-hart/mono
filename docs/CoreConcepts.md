# Core Concepts

Mono has two core concepts:

1. Change overriding mechanism of CSS
2. Give CSS an expressive & unified implementation

## Change overriding mechanism of CSS

In my opinion a high proportion of CSS pain points come from it's overriding architecture.

Overrides provide no guarantee. They are brittle since their effects **depend on the cascade and specificity**, both of which are vulnerable to change.

Overrides are also self-perpetuating. The **more overrides exist the more overriding you do**. CSS overtly encourages this, even from a clean slate browser defaults are overridden.

In addition CSS can suffer from high coupling and low cohesion - where reusable styles are tightly mixed with those that aren't. This increases the demand for overrides since unwanted [non-reusable] styles need overriding.

In the current climate a developer has little option but to override.

<p align="center">&ast;&ast;&ast;</p>

However if we view overrides as mutation we can look to other languages for guidance, many of which **provide a system for changing a value**. For example:

- **Access modifiers:** Determine who & how a value can be modified.
- **Data types:** A value cannot be modified through reassignment (final in Java / const in ES6).
- **Immutability:** A value whose state cannot be modified after its creation.
- **Setters:** Expose safe ways to modify otherwise inaccessible values.

An equivalent system is missing from CSS - a style can be modified by anyone from anywhere.

**Mono denounces this liberal attitude to overrides**. Instead mono imposes constraints that determine what styles can be overridden, who is allowed to override, and how overrides are done - a system mono calls controlled overrides.

## Give CSS an expressive & unified implementation

It is **hard to understand the behaviour of CSS**.

A CSS declaration can exist for a range of reasons. The rationale behind a declaration usually resides in our (or someone else's) head.

It's hard to understand why a property exists & fathom the rationale behind its value since CSS offers no indication of its purpose (lacks intent). The comments below represent a thought process made interpreting the CSS:

```css
.btn {
  padding: 20px 10px;

  /* Isn’t the browser default font size 11px? */
  font-size: 11px;

  /* I guess .btn can be an anchor */
  text-decoration: none;

  border: 1px solid red;

  /* Must override an unwanted border radius */
  border-radius: 0;

  /* I assume opacity is set somewhere else, either with a higher specificity, or later in the cascade, or via JavaScript; hence the !important */
  opacity: 1 !important;

  background: #ccc;
  color: #000;
  cursor: pointer;

  /* Can’t see why that’s needed… should be ok to remove ¯\(ツ)/¯ */
  position: relative;
}
```

**Time and mental energy is spent reasoning with CSS**. "Why is opacity 1", "What happens position relative is removed". Rationale that once existed is lost. We make changes without confidently foreseeing the outcome or any side-effects that may come with it.

Mono introduces systems that help CSS express intent. By making CSS expressive & easier to reason with it becomes more tangible and the process of understanding it becomes more immediate.

<p align="center">&ast;&ast;&ast;</p>

CSS also **lacks a consistent implementation**.

CSS has many ways to achieve the same thing with no formal implementation.

This means developers frequently make design decisions on a case-by-case basis which fosters inconsistency. In turn its hard to understand and work with our own CSS and that of others.

In addition best practices such as BEM (aimed at promoting consistency) are difficult to enforce, which make them far too easy to ignore or misuse.

Mono is a firm believer in **convention over configuration**. Design patterns and best practices are "baked into" the language which naturally nurtures consistency.