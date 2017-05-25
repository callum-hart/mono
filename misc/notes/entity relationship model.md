UPDATE: meaningful comments is an understatement! We can generate an **entity relationship model** showing how styles are connected now & in future interactions / states.

Leverage the relationships formed by types & their modifiers to generate meaningful comments.
*Idea orginally stemmed from `misc/screenshots/contextual comments.jpg`*

Expose mutations that derive from pseudo classes, parent elements upfront.

This makes it really easy to see what variations a property (for a given selector) can have.

Normally have to hunt for styles applied by psuedo classes, parent elements. *Using the 'Force element state' in inspector*.

**For example:**
*reveal psuedo styles*

```
a.someLink {
    color: protected(grey);
}

a.someLink:hover {
    color: --override(blue);
}
```

Would generate:

```
a.someLink {
    color: grey /* <Protected> modified on hover */;
}

a.someLink:hover {
    color: blue /* @Override */;
}
```

*Only need to look at `a.someLink` source code to identify it's color is changed on hover.*

**Another example:**
*reveal styles applied by parent modifier class*

```
span.childElement {
    background: public(white);
}

div.parentElement--active {
    span.childElement {
        background: --mutate(blue);
    }
}
```

Would generate:

```
span.childElement {
    background: white /* <Public> modified to `blue` when parent equals `div.parentElement--active` */;
}

div.parentElement--active span.childElement {
    background: blue /* @Mutate */;
}
```

*Only need to look at `span.childElement` source code to identify it's background can also be `blue`.*

**Another example:**
*reveal styles from modifeir classes?*

```
form.searchForm {
    background: immutable(white);
}

form.searchForm.searchForm--disabled {
    opacity: immutable(0.4);
    pointer-events: immutable(none);
}
```

Would generate:

```
form.searchForm {
    background: white /* <Immutable> */;
    -has: /* `opacity: 0.4` when classList contains `searchForm--disabled` */;
    -has: /* `pointer-events: none` when classList contains `searchForm--disabled` */;
}

form.searchForm.searchForm--disabled {
    opacity: 0.4 /* <Immutable> */;
    pointer-events: none /* <Immutable> */;
}
```

*Only need to look at `form.searchForm` source code to identify it's opacity & pointer-events can change.*