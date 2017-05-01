# Example UI - Grid

Testing RWD with mono using `bound` type.

**Findings:**

- Works as expected.
- Discovered a new motive `--because`.
- Prefer co-located media queries as they're easier to read, and keep related styles together. Examples:

Co-located approach:

```
section.content__block {
    // styles for all screen-sizes here...

    @media (max-width: $small)  {
        flex-basis: bound(immutable(100%));
    }

    @media (min-width: $small) and (max-width: $medium)  {
        flex-basis: bound(immutable(50%));
    }

    @media (min-width: $medium) and (max-width: $large) {
        flex-basis: bound(immutable(calc(100% / 3)));
    }
}
```

Advantages of co-located approach:

- More concise.
- Easier to read.
- Less likely to remove required styles.
- Easier maintenance.

Seperate approach:

```
section.content__block {
    // styles for all screen-sizes here...
}

@media (max-width: $small)  {
    section.content__block {
        flex-basis: bound(immutable(100%));
    }
}

@media (min-width: $small) and (max-width: $medium)  {
    section.content__block {
        flex-basis: bound(immutable(50%));
    }
}

@media (min-width: $medium) and (max-width: $large) {
    section.content__block {
        flex-basis: bound(immutable(calc(100% / 3)));
    }
}
```

Disadvantages of seperate approach:

- Markup is more verbose.
- Selector maintainability
    - {n} number of selectors to maintain (where {n} corresponds to the number of breakpoints).
    - error prone, more selectors increases chance of errors (typos)