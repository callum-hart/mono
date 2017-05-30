# Core artifacts

- Introduction
    - What is mono?
    - What does it do?
    - Benefits of mono
- Motivation
    - CSS development is expensive - hard & time consuming.
    - Painpoints of CSS
        - Global scope
        - Cascade
        - Specificity
        - Importance
        - Brittle - easy to break things
        - Unpredictable - no gaurentees / side affects
        - Maintainability - hard to confidently remove, edit, add
        - Not logical - in a programming sense
        - Inheritence - leads to improper reuse
        - Coupled with HTML
    - Current workflow *(hunting down styles)* is painful, must be something better!
    - Neglected, CSS feels stuck. Ecosystem is sparse.
- Core concept
    - Most painpoints have 1 thing in common: overrides.
    - Take overrides out the picture and CSS becomes: robust, predictable, easy to maintain & reason with.
    - Mono can be distiled to 1 constraint: no overrides.
    - Uses techniques from traditional programming languages to achieve this: data types, immutability, design patterns.
- Examples
- Guides
    - Types
    - Modifiers
    - Motives
    - Patterns
- Compiler

# Support material
*Articles referenced in core (from the appropriate context)*

- Default architecture of CSS is broken
- Current remedies - inline JS, pre-processors
- CSS compared with other languages
- Controlled overrides vs no overrides
- Entity relationship modeling with CSS