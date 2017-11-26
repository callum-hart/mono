# Parser

### CSS Rules for Overrides
*Need to be considered in order to determine what is overriding vs what is overriden.*

1) Importance overrides Specificity & Cascade:

```css
h1.title {
  color: transparent !important; /* Winner */
}

body h1.title {
  color: dimgrey;
}

h1.title {
  color: slategrey;
}
```

*Todo: throw lexer exception when `!important` is used. Since mono bans uncontrolled overrides using/supporting `!important` is pointless.*

2) Specificity overrides Cascade

```css
body h1.title {
  color: dimgrey; /* Winner */
}

h1.title {
  color: slategrey;
}
```

3) Cascade overrides Cascade

```css
h1.title {
  color: dimgrey;
}

h1.title {
  color: slategrey; /* Winner */
}
```

*Since specificity takes precedence over cascade the entire CSS will need to be parsed before calculating what override is dominant.*

### Scenarios for Overrides

When selectors are equal the deciding factor is Cascade:

```css
h1.title {
  color<immutable>: slategrey;
}

/* This overrides the declaration defined earlier in the cascade - not allowed since color is immutable */
h1.title {
  color: dimgrey;
}
```

When selectors are not equal the deciding factor is Specificity:

```css
h1.title {
  color<immutable>: slategrey;
}

/* This selector has a stronger specificity so overrides the declaration defined earlier in the cascade - not allowed since color is immutable */
nav h1.title {
  color: dimgrey;
}
```

When selectors are not equal the deciding factor is Specificity **regardless of Cascade**:

```css
/* This selector has a stronger specificity so overrides the declaration defined later in the cascade - not allowed since color is immutable */
nav h1.title {
  color: dimgrey;
}

h1.title {
  color<immutable>: slategrey;
}
```

### Caveats of Overrides

Overrides go undetected among **composable classes**, i.e:

```html
<p class="foo bar">Hello</p>
```

```css
p.foo {
  color: black;
}

p.bar {
  color: white;
}
```

CSS is unaware that `.foo` and `.bar` can be used together - could this be detected/prevented?

### Mono Rules for Overrides

- An override is only permitted if the contract between a type and modifier is honoured:
  - `@override` can only override declarations with the type `protected`.
  - `@mutate` can only override declarations with the type `public`.
- Overrides without a compatible type/modifier are not allowed.
- Overrides without using a modifier are not allowed.

*Todo: improper usage of `@override` could be detected ahead of time since the selector must end with a pseudo-class.*

### Inheritance

Inherited properties pose a problem since they are determined at runtime vs compile-time.

*A full list of inheritable properties can be [found here.](https://stackoverflow.com/questions/5612302/which-css-properties-are-inherited)*

#### The Problem:

```html
<div class="sideBar">
  <a class="link" href="" >Home</a>
</div>
```

```css
div.sideBar {
  font-size<immutable>: 12px;
}

a.link {
  font-size: 13px; /* Shouldn't be allowed */
}
```

The `font-size` inherited from `div.sideBar` is immutable, `a.link` should not be allowed to change it. How can this be evaluated/prevented at compile-time?

#### Ideas for Solutions:

**Reset Styles**
`all: initial;`

```css
div.sideBar {
  color: red;
}

p {
  all: initial; /* Ignore inherited color */
}
```

Other than poor [browser support](https://developer.mozilla.org/en-US/docs/Web/CSS/all#Browser_compatibility) this approach is too excessive - non-inherited properties are also ignored, which means previously defined styles need to be re-defined i.e:

```css
div.sideBar {
  color: red;
}

p {
  font-size: 20px;
}

p.link {
  all: initial; /* Ignores inherited color & ignores font-size */
  font-size: 20px; /* Need to re-define font-size */
}
```

[With this approach] If inherited properties are ignored what's the point of setting them?

**Limit Inheritance**

Inheritance could be moderated by controlling who can define inheritable properties.

For example, properties related to text could only be set by pure textual elements (p, a, h1-h6 etc...), i.e:

```css
div.sideBar {
  color: red; /* Not allowed since `div` is not a pure textual element */
}

p.link {
  color: red; /* Allowed since `p` is a pure textual element */
}
```

Could introduce **macros** if selectors became too verbose, i.e:

Rather than:

```css
h1, h2, h3, h4, h5, h6, p, a, span, strong, i, li {
  font-family: "Open Sans";
}
```

Could use macros/generators:

```css
%text% {
  font-family: "Open Sans";
}

/* Would generate: */

h1, h2, h3, h4, h5, h6, p, a, span, strong, i, li {
  font-family: "Open Sans";
}
```