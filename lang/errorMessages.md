# Error Messages

> Note: the mono language is still under development.

There are 3 types of errors:

1. [Design pattern errors](#design-pattern-errors)
2. [Type system errors](#type-system-errors)
3. [Parsing errors](#parsing-errors)

## Design pattern errors

### Missing element type

Occurs when a CSS selector is missing element type.

**Source:**

```css
.guest-list {
  margin-left<?veto>: 0;
  padding-left<?veto>: 0;
}
```

**Error:**

```
-- Missing element type --------------------------------- app.mono

The selector `.guest-list` is missing an element type.

12| .guest-list {
  ^^^

`.guest-list` needs to be scoped to a HTML element(s).

For example:

`div.guest-list {`


Further reading:

https://callum-hart.gitbooks.io/mono/docs/patterns/SelectorTypes.html

```

### Inappropriate shorthand

Occurs when shorthand notation is misused.

**Source:**

```css
div.nav__links {
  margin<immutable>: 10px 0 0 0;
}
```

**Error:**

```
-- Inappropriate shorthand ------------------------------ nav.mono

`div.nav__links` unnecessarily uses shorthand notation for the property `margin`.

3| div.nav__links {
4|   margin<immutable>: 10px 0 0 0;
                        ^^^^^^^^^^

Only the top margin needs to be applied.

For example:

div.nav__links {
  margin-top<immutable>: 10px;


Further reading:

https://callum-hart.gitbooks.io/mono/docs/patterns/ShorthandAppropriately.html

```

### Indiscrete breakpoints

Occurs when indiscrete breakpoints are detected.

**Source:**

```css
@media (min-width: 400px) {
 h3.heading {
  font-size: 16px;
 }
}

@media (min-width: 900px) {
 h3.heading {
  font-size: 18px;
 }
}

@media (min-width: 1200px) {
 h3.heading {
  font-size: 20px;
 }
}
```

**Error:**

```
-- Indiscrete breakpoints ------------------------ typography.mono

The breakpoints for ` h3.heading` are indiscrete.

1| @media (min-width: 400px) {
2|  h3.heading {

7| @media (min-width: 900px) {
8|  h3.heading {

13| @media (min-width: 1200px) {
14|  h3.heading {

The styles in:

1| @media (min-width: 400px)

Can be overriden by:

7|  @media (min-width: 900px)
13| @media (min-width: 1200px)

The styles in:

7| @media (min-width: 900px)

Can be overriden by:

13| @media (min-width: 1200px)

Breakpoints should be discrete. Those for `h3.heading` are missing a `max-width`.

May I suggest:

@media (min-width: 400px) and (max-width: 900px) {
 h3.heading {

@media (min-width: 900px) and (max-width: 1200px) {
 h3.heading {


Further reading:

https://callum-hart.gitbooks.io/mono/docs/patterns/DiscreteBreakpoints.html

```

## Type system errors

### Missing modifier

When a typed property is changed without a modifier.

**Source:**

```css
fieldset {
  background<public>: white;
}

form.form--withError fieldset {
  background: lightpink;
}
```

**Error:**

```
-- Missing modifier ------------------------------------ form.mono

The property `background` is missing a modifier.

14| form.form--withError fieldset
15|  background: mistyrose;

The background of 'fieldset' has the type: public.

10| fieldset {
11|  background<public>: ivory;
                ^^^^^^

May I suggest:

Using the modifier `mutate`:

16| form.form--withError fieldset
17|  background<@mutate>: mistyrose;

```

### Type modifier mismatch

When a modifier acts on the wrong type.

**Source:**

```css
a {
  color<immutable>: aquamarine;
}

a:hover {
  color<@override>: mediumaquamarine;
}
```

**Error:**

```
-- Type modifier mismatch ---------------------------- common.mono

The modifier `@override` cannot change properties with the type `immutable`.

4| a {
5|  color<immutable>: aquamarine;
          ^^^^^^^^^

8| a:hover {
9|  color<@override>: mediumaquamarine;
          ^^^^^^^^^

The color has the type: immutable
But the modifier used is: @override

May I suggest:

Changing the color type to `protected`:

4| a {
5|  color<protected>: aquamarine;

```

## Parsing errors

### Unknown type

When an unknown type is used.

**Source:**

```css
nav {
  border-bottom-color<lock>: teal;
}
```

**Error:**

```
-- Unkown type ------------------------------------------ nav.mono

`lock` is not a valid type.

1| nav {
2|  border-bottom-color<lock>: teal;
                        ^^^^

Available types are:

immutable
protected
public

```

### Unknown modifier

When an unknown modifier is used.

**Source:**

```css
btn.payNow:hover {
  transform<@unlock>: scale(1.2);
}
```

**Error:**

```
-- Unkown modifier ---------------------------------- buttons.mono

`@unlock` is not a valid modifier.

10| btn.payNow:hover {
11|  transform<@unlock>: scale(1.2);
                ^^^^^^

Available modifiers are:

@override
@mutate

```

### Unknown motive

When an unknown motive is used.

**Source:**

```css
span.heading--uppercase {
  text-transform<?itsFriday>: lowercase;
}
```

**Error:**

```
-- Unkown motive ----------------------------------- headings.mono

`?itsFriday` is not a valid motive.

8| span.heading--uppercase {
9|  text-transform<?itsFriday>: lowercase;
                    ^^^^^^^^^

Available motives are:

?overrule
?overthrow
?veto
?fallback
?because
?patch

```