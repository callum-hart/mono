> **Principle:**a fundamental truth or proposition that serves as the foundation for a system of belief or behaviour or for a chain of reasoning.


**Avoid needless overrides**

- The best CSS override is one that doesn't need to happen in the first place!
- Overrides should not be used for variation or reusability (there are better alternatives).

*Example of needless override vs avoided override?*

---

# Avoid needless overrides

The best CSS override is one that doesn't happen in the first place! Overrides should not be the goto solution for achieving variation or reusability. Despite being the default architecture of CSS there are better alternatives to overriding styles.

---

**Rules govern overrides**

- Pre-defined rules determine when an override is allowed.
- An override can only happen in certain circumstances.
- Any override that violates a rule is not allowed.

---

# Rules govern overrides

There are certain circumstances in which overrides cannot be avoided - however this doesn't mean we can ignore the first principle.

Instead a set of pre-defined conditions identify all possible use cases in which an override is needed. A set of pre-defined rules determine the laws in which an override is allowed to happen. This helps reduce needless overrides, whilst providing a framework for overrides.

An override without a viable use case, or an override which violates a rule is not permitted.

---


**Overrides must be systematic**

- All overrides must operate within a regulated system.
- The system abides to the rules & must provide a mechanism to override.
- Any override operating outside the system is not allowed.

---

# Overrides must be systematic

Overrides must operate within a regulated system. The system must be aware of the rules that govern overrides & be able to recognize whether an override is permitted or not.

The system provides a mechanism to override whilst offering a coherent way to override styles. An override is expressed using a [modifier](). If a style is overriden we can pinpoint where & why it happened.

An override operating outside the system (without a modifer) is not allowed.

---

**Access modifiers regulate overrides**

- CSS declarations use access modifiers to control who can override them.
- Each access modifier has a set of laws that govern how the declaration can subsequently be modified.

*example of access modifier?*

**Overrides are made using modifiers**

- All CSS overrides must use a modifier.
- A modifier can only override a style when a certain set of conditions are met.

*example of modifier?*

**No abiguity**

- Property usage should not be ambiguous.
- It should be easy to justify why a CSS property exists.

*example of --veto motive?*

**No obscurity**

- Property values should not use magic numbers.
- It should be easy to identify why a CSS value exists.

*example of --because motive?* 



