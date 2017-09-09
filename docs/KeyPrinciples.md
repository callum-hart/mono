# Key Principles

Mono has five key principles:

## Avoid needless overrides
**The best override is one that doesn't happen in the first place**

Overrides should not be the goto solution to achieve variation or reusability. Too many overrides indicate improper reuse.

Mono uses design patterns to limit unnecessary overrides.

## Rules govern overrides
**Predefined rules determine when an override is allowed**

Certain circumstances require overrides, however this does not revoke the first principle.

Instead each circumstance [to override] should be identified, whilst established laws govern the conditions in which an override is permitted.

Mono uses a type system to **govern** overrides.

## Overrides must be controlled
**Overrides must operate within a controlled & regulated system**

An override that operates outside the system or violates a rule is not permitted.

Mono uses a type system to **control** overrides.

## One way to override
**There must only be one way to override a style**

Limiting overrides to a single implementation makes it easier to track and manage overrides.

With mono overrides are expressed using modifiers. Each modifier leaves a breadcrumb, allowing us to pinpoint exactly where and why an override happened.

This is a stark contrast to CSS, where overrides are inconspicuously scattered across different parts of code.

## CSS should be easy to understand
**It should be easy to understand and predict the behaviour of CSS**

It should be easy to articulate and identify what styles do, why they are used, and what role they have in our code.

Mono uses motives that allow CSS to communicate purpose. Reducing ambiguity / obscurity means developers are less likely to break things, since changes are more predictable.