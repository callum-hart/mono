> **Principle:**a fundamental truth or proposition that serves as the foundation for a system of belief or behaviour or for a chain of reasoning.

*Notes:*

**Avoid needless overrides**

- The best CSS override is one that doesn't need to happen in the first place!
- Overrides should not be used for variation or reusability (there are better alternatives).

*Example of needless override vs avoided override?*

**Rules govern overrides**

- Pre-defined rules determine when an override is allowed.
- An override can only happen in certain circumstances.
- Any override that violates a rule is not allowed.

**Overrides must be controlled**

- All overrides must operate within a regulated system.
- The system abides to the rules & must provide a mechanism to override.
- Any override operating outside the system is not allowed.

**One way to override styles**

- There must be one way in which a style can be overriden.
- With mono an override is expressed using a [modifier]().
- When a style is overriden using a modifier we can pinpoint exactly where & why it happened. 
- Compared to regular CSS, where overrides inconspicuously happen all over the place.

**CSS should be easy to understand**

- It should be easy to understand CSS.
- Property usage should not be ambiguous - it should be easy to justify why a style exists.
- Property values should not use magic numbers - it should be easy to identify the reasoning behind a value.

---
# Key principles

Mono has five key principles:

### Avoid needless overrides

The best CSS override is one that doesn't happen in the first place! Overrides should not be the goto solution for achieving variation or reusability. Despite being the [default architecture of CSS]() there are better alternatives to overriding styles.

### Rules govern overrides

There are certain circumstances in which overrides cannot be avoided - however this doesn't mean we can ignore the first principle.

Instead we must identify all possible use cases in which an override is required, and then establish the laws & conditions in which an override is allowed to happen.

Limiting the circumstances in which styles can be overriden helps reduce needless overrides, whilst providing a framework to work with. Mono uses a type system to keep overrides in check - an override that violates a rule is not permitted.

### Overrides must be controlled

Overrides must operate within a controlled & regulated system. 

The system must provide a mechanism to override whilst enforcing the rules that govern overrides. 

An override operating outside the system is not allowed. 

### One way to override styles

There must only be one way to override a style. 

A single implementation guarantees consistency and clarity. With mono an override is expressed using a [modifier](). A modifier is the only way to override a style.

When a style is overriden (using modifiers) we can pinpoint exactly where & why the override happened. This is a stark contrast to regular CSS - where overrides are inconspicuously scattered accross different parts of code.

### CSS should be easy to understand

It should be easy to understand & predict the behaviour of CSS. 

It should be easy to articulate & identify what styles do, why they are used, & what role they play in our code. Mono uses [motives]() that empower CSS to communicate its purpose. 

This reduces ambiguity & obscurity which means developers are less likely to break things since changes are more predictable.