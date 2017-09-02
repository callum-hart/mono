# Modifiers

Modifiers provide a single mechanism to override a CSS declaration. Modifiers are the only way  a style can be overridden.

Each modifier is paired with a type. A modifier is only allowed to override a declaration if the type and modifier are compatible.

Since the type immutable cannot be overridden we are left with two modifiers, one for protected and one for public types.

## Override

Can only override CSS declarations with the type **protected**.

```css
button.btn {
  background-color<protected>: olive;
}

button.btn:hover  {
  background-color<@override>: darkolivegreen;
}
```

## Mutate

Can only override CSS declarations with the type **public**.

```css
td {
  color<public>: slategray;
}

tr:hover td {
  color<@mutate>: darkslategray;
}
```