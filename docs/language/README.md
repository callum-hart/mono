# Language

> Note: the mono language is still under development. This section contains the language specification, defining standards whilst providing an insight of what’s to come.

The mono language is an extension of the design pattern, composed of three parts:

1. **Types:** set rules that govern overrides
2. **Modifiers:** offer a controlled system to override
3. **Motives:** make CSS easier to understand

Mono is a statically typed language that compiles to CSS. A friendly compiler encourages the design pattern whilst enforcing its type system.

The language was designed to be **unobtrusive and familiar** to those already accustomed to CSS. Mono doesn’t change what it doesn’t need to nor add unnecessary complexity. The notions (types, modifiers, motives) are connected to regular CSS using syntactic metadata (similar to Java annotations):

```css
a.selector {
  font-size<monoNotion>: 16px;
}
```

Mono is **intentionally small by design** (bloated projects are hard to consume). Anything that could be achieved using regular CSS was offloaded to the design patterns. Anything that deviated from the core concepts was dropped.

In total the language has 3 types, 2 modifiers and 6 motives. It’s time to meet them:

- [Types](Types.md)
- [Modifiers](Modifiers.md)
- [Motives](Motives.md)