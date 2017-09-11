# Selector Types
**All selectors should include the element type**

Take the following CSS rule-set:

```css
.btn {
  font-family: "Operator Mono SSm";
  font-size: 14px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  background: cadetblue;
  color: ivory;
}
```

Without an element type the `.btn` class is obscure. We cannot guarantee who the consumers (the HTML elements that use the `.btn` class) are.

This means we cannot confidently predict all elements using the class `.btn` look the same. This is because we have no insight or control into what other styles the element will have (user agent, our own, 3rd party).

In addition styles specific to a certain element type are bundled into the `.btn` class; and therefore applied to all consumers, which introduces unnecessary bloat (deadcode).

In the example above text-decoration none is only required for anchors using the `.btn` class.

<p align="center">&ast;&ast;&ast;</p>

When selectors include the element type it's easier to make connection between CSS & HTML:

```css
a.btn,
button.btn {
  font-family: "Operator Mono SSm";
  font-size: 14px;
  background: cadetblue;
  color: ivory;
}

a.btn {
  text-decoration: none;
}

button.btn {
  border: none;
  cursor: pointer;
}
```

It’s easy to identify what elements use the class `.btn` - we can clearly see `.btn` can be an anchor or a button.

This also makes it easier to separate reusable styles from those specific to a certain element type. Text-decoration none is only needed for anchors so is moved out into a rule-set of its own.

Not only does this separate concerns, it helps organise styles into smaller, manageable, distinct chunks. Now I know where to add or remove styles for anchors, and better still if anchors stop consuming the `.btn` class I can safely remove styles specific to them.