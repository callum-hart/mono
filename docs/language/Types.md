# Types

In mono each CSS declaration has a type.

A type has a set of laws that determine how the declaration can be overridden.

In total there are 3 types: immutable, protected & public.

## Immutable

Immutable declarations **can never be overridden**.

```css
h3.subTitle {
  font-size<immutable>: 16px;
}
```

The font size of `h3.subTitle` is and always will be 16px. This value cannot be overridden, any attempt to do so will throw a compiler error.

## Protected

Protected declarations can only be overridden by **pseudo-classes** derived from the **same selector**.

```css
button.btn {
  background-color<protected>: blue;
}
```

The button background color can only be overridden by pseudo-classes derived from `.btn`:

```css
button.btn:link {
  /* can modify background-color */
}

button.btn:visited  {
  /* can modify background-color */
}

button.btn:hover {
  /* can modify background-color */
}

button.btn:active {
  /* can modify background-color */
}
```

## Public

Public declarations can only be overridden by **pseudo or modifier classes** derived from **parent elements**.

```css
td {
  background-color<public>: darkgray;
}
```

The `td` background color can be overridden by pseudo-classes of parent elements:

```css
tr:hover td {
  /* can modify background-color */
}
```

Or can be overridden by modifier classes of parent elements:

```css
table.mode--readOnly td {
  /* can modify background-color */
}
```

<p align="center">&ast;&ast;&ast;</p>

Whilst types belong to each CSS declaration they can also be applied at the rule-set level, providing a **less verbose alternative**:

```css
img.avatar<immutable> {
  height: 40px;
  width: 40px;
  border: 2px solid deepskyblue;
}
```

The **type is inferred by the rule-set**. All declarations within `img.avatar` are immutable. Declarations can opt out of the inferred type at the property level:

```css
img.avatar<immutable> {
  height: 40px;
  width: 40px;
  border<protected>: 2px solid deepskyblue;
}
```