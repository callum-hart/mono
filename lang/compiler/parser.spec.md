# Parser

## Type-Modifier System

#### CSS rules for overrides
*Need to be considered in order to determine what is overriding vs what is overriden.*

1) Importance overrides Specificity & Cascade:

```
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

*Todo: throw lexer exception when `!important` is used. Since mono bans uncontrolled overrides using/supporting `!important` is useless.*

2) Specificity overrides Cascade

```
body h1.title {
  color: dimgrey; /* Winner */
}

h1.title {
  color: slategrey;
}
```

3) Cascade overrides Cascade

```
h1.title {
  color: dimgrey;
}

h1.title {
  color: slategrey; /* Winner */
}
```

*Since specificity takes precedence over cascade the entire CSS will need to be parsed before calculating what override is dominant.*

#### Mono rules for overrides

- An override is only permitted if the contract between a type and modifier is honoured:
  - `@override` can only override declarations with the type `protected`.
  - `@mutate` can only override declarations with the type `public`.
- Overrides without a compatible type/modifier are not allowed.
- Overrides without using a modifier are not allowed.

*Todo: improper usage of `@override` could be detected ahead of time since the selector must end with a pseudo-class.*

It appears the **first step** should be designing a model for representing overrides.

#### Scenarios

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