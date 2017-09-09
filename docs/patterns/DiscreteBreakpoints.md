# Discrete Breakpoints
**Styles in one media query should not override styles in another**

Discrete breakpoints are self-contained, in which styles are partitioned and encapsulated within ranges. Styles within one range do not affect nor override styles in another.

Indiscrete breakpoints are the opposite. Styles from one range can affect and thus override styles in another.

A common usage of indiscrete breakpoints is "mobile first":

```html
<nav>
  <a href="" class="logo">Logo</a>
</nav>
```

```css
a.logo {
  font-size: 14px;
}

@media (min-width: 500px) {
  a.logo {
    font-size: 16px;
  }
}

@media (min-width: 1000px) {
  a.logo {
    font-size: 18px;
  }
}
```
*Figure 1*

In this example the **media queries rely on their position in the cascade** to produce the expected behaviour. On screens wider than 1000px all 3 rule-sets will apply with the last in the cascade taking effect (the font-size of a.logo will be 18px). It overrides the other font-size declarations.

Reshuffling the order of rule-sets produces a different result:

```css
a.logo {
  font-size: 14px;
}

@media (min-width: 1000px) {
  a.logo {
    font-size: 18px;
  }
}

@media (min-width: 500px) {
  a.logo {
    font-size: 16px;
  }
}
```
*Figure 2*

Again on screens wider than 1000px all 3 rule-sets apply. All three conditions are true so it's the last in the cascade that takes effect (font-size of `a.logo` will be 16px). **Unintuitively it is the cascade and not the breakpoint value that determines the font-size**.

Indiscrete breakpoints are also dependent on specificity. In the following example **the rule-set with the strongest specificity out-competes** the others; regardless of their position in the cascade or breakpoint value:

```css
nav a.logo {
  font-size: 14px;
}

@media (min-width: 1000px) {
  a.logo {
    font-size: 18px;
  }
}

@media (min-width: 500px) {
  a.logo {
    font-size: 16px;
  }
}
```
*Figure 3*

At all screen-sizes the font-size will be 14px, since the selector `nav a.logo` has the strongest specificity.

Figure 2 and 3 are examples of how indiscrete breakpoints are dependent and influenced by cascade and specificity.

<p align="center">&ast;&ast;&ast;</p>

On the other hand **discrete breakpoints** are not dependant on cascade or specificity. The need to override styles from other breakpoints is removed.

The example below produces the same outcome as figure 1 without the weaknesses seen in figure 2 and 3:

```css
@media (max-width: 499px) {
  a.logo {
    font-size: 14px;
  }
}

@media (min-width: 500px) and (max-width: 999px) {
  a.logo {
    font-size: 16px;
  }
}

@media (min-width: 1000px) {
  a.logo {
    font-size: 18px;
  }
}
```
*Figure 4*

The styles within each breakpoint no longer compete with one another. At each breakpoint the font size only has one declaration.

Reshuffling the order of rule-sets no longer changes the outcome, nor does using a selector with stronger specificity:

```css
@media (max-width: 499px) {
  nav a.logo {
    font-size: 14px;
  }
}

@media (min-width: 1000px) {
  a.logo {
    font-size: 18px;
  }
}

@media (min-width: 500px) and (max-width: 999px) {
  a.logo {
    font-size: 16px;
  }
}
```
*Figure 5*

The example above produces the same outcome as figure 4, despite a change to cascade order and specificity.

This makes **media queries more predictable**, since there’s no need to orchestrate overrides. Omitting overrides has made the order of media queries and their specificity irrelevant. Only the breakpoint size determines what styles apply which is far more intuitive and deterministic.

Just like negation this **pattern buys guarantees**. We can guarantee what the font size will be at different screen-sizes. We can guarantee that changing the order of media queries won’t affect the outcome. We can guarantee a change in specificity won’t sidestep the cascade and override subsequent rule-sets. And we can guarantee the font size in one media query won’t get overridden by another.