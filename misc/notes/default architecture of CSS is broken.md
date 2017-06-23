Default architecture of CSS is broken.

Variation is handled by overrides.

Variation comes in many shapes and sizes:

- Themes
- Screensizes
- State (user interaction)
- Logic (authentication)
- A B testing

Issue with overrides is the complexity of [...] CSS grows exponentially. *[...] being any of the following:*

- understanding
- maintaining
- adding
- removing
- modifying

I would argue that overrides are self-perpetuating. The more overrides exist the more overriding you do. In my experience it's preferable (and somehow safer) to override unwanted styles vs remove them.

The language seems to encourage this. Even from a clean slate browser defaults need to be overriden.

CSS often suffers from high coupling and low cohesion, where reusable styles are tightly tied to those that aren't. This increases demand for overrides, since [unwanted] non-reusable styles need overriding.

If overrides (in there current state) were taken out of the equation CSS would be far more:

- Robust
- Predictable
- Easy to maintain
- Efficient (fewer redundant styles)
- Performant (?)

Which begs the question:

Can CSS be architected without adhering to its overriding nature?

Overrides as a mechanism for reuse leads to spaghetti code.