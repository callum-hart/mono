Using negation for pseudo classes means no overrides ever!

This makes the modifiers --override and --mutate redundant,
which in turns affects whether the types Immutable, Protected
& Public are needed at all?

The examples below demonstrate that any CSS property can truely
have only 1 definition.

The question is:
- Is this style of CSS too verbose?
- Can the same result be achieved using a simpler method? (i.e what
we see below would be the compiled output, not necessarily the
source code).

Same selector psuedo classes:

```
p.bar:not(:hover):not(.bar--active) {
    color: grey;
}

p.bar:hover {
    color: blue;
}

p.bar--active:not(:hover) {
    color: green;
}
```

Parent selector psuedo classes:

```
div.parent-div:not(:hover):not(.parent-div--active) span.child-span {
    color: grey;
}

div.parent-div:hover span.child-span {
    color: blue;
}

div.parent-div--active:not(:hover) span.child-span {
    color: green;
}
```

The color of `p.bar` depends on 3 scenarios:

1. Default
2. User interaction (:hover)
3. State (`.bar--active`)

What would a less verbose solution look like? How can
these 3 scenarios be represented?

```
p.bar {
    color: grey;
}

p.bar:hover {
    color: blue;
}

p.bar--active {
    color: green;
}
```

Removing :not from the selectors makes the 3 scenarios
easy to compose and understand. However in naitive CSS
this equates to overrides:

- On :hover the color of `p.bar` & `p.bar--active` is overriden.
- When active the color of `p.bar` is overriden.

Could the selectors be generated? i.e a compiler reads what
we have above, identifies the 3 scenarios, and transforms the
selectors appropriately...

---

On the other hand.... we don't want to transfer the difficulty
of managing styles to difficulty managing selectors.

In OO languages overrides aren't banished entirely, they're
controlled. Unlike CSS where overrides happen willy nilly.

For instance access modifiers in Java control who and how
variables can be overriden (via inheritance / setters).

In mono modifiers provide not only an interface for controlled
overrides, but depict how styles that often appear disparate
are connected.

Technically negation with pseudo selectors is possible
(as seen above). But with it come new implications, especially
when a pseudo class modifies the style of a child element.

Take the following example (in which hovering over the parent
element changes the color of the child element):

```
span.child-span {
    font-size: 13px;
    font-weight: 200;
    // unaware what the color of the span is, or where it is set
}

div.parent-div:not(:hover) span.child-span {
    color: grey; // setting default color of span feels strange from this context / is disjointed
}

div.parent-div:hover span.child-span {
    color: blue; // span color changes in response to an interaction with parent (so makes sense from this context)
}
```

The color of the span is obfuscated.

Also what if the span isn't always inside `div.parent-div`, yet
always needs to be the same color?

vs:

The controlled override approach (using public type and --mutate
modifier) seems to provide a better representation of the
relationship between the parent and child element, i.e:

```
span.child-span {
    font-size: 13px;
    font-weight: 200;
    color: Public(grey); // indicates this can be changed by a parent element (almost like a contract)
}

div.parent-div:hover span.child-span {
    color: --mutate(blue); // binds the relationship between the 2 elements (fulfils the contract)
}
```
