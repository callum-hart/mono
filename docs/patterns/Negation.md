# Negation
**Use negation to avoid overrides among composable classes**

Composable classes are groups of styles that can be used independently, or combined to achieve a different result.

An example can be seen with [bootstrap badges](https://getbootstrap.com/docs/4.0/components/badge/):

```html
<span class="badge badge-light">
  Light
</span>
```

```css
.badge {
  color: #fff;
}

.badge-light {
  color: #f8f9fa;
}
```

The color of `.badge` is #fff. When `.badge` and `.badge-light` are used together the expected color is #f8f9fa (since the color in `.badge-light` overrides the color in .badge).

The color of `.badge-light` is expected to be #f8f9fa but this isn’t guaranteed. This is because the outcome (in this case the color) is dependant on respecting the laws of cascade: `.badge-light` must follow `.badge`. If not the outcome is different:

```css
.badge-light {
  color: #f8f9fa;
}

.badge {
  color: #fff;
}
```

*Color of .badge-light is overridden by .badge*

Introducing **negation removes the dependency on the cascade** and thus the need to override:

```css
.badge:not(.badge-light) {
  color: #fff;
}

.badge-light {
  color: #f8f9fa;
}
```

The color has one declaration per variant no matter if the classes are used independently or in conjunction. Negation has brought us **portability and predictability**. The order of declarations in the cascade no longer matters:

```css
.badge-light {
  color: #f8f9fa;
}

.badge:not(.badge-light) {
  color: #fff;
}
```

*Color of .badge-light is still #f8f9fa*

**Negation buys guarantees**. We can guarantee the color of `.badge` is #fff and the color of `.badge-light` is #f8f9fa. We can guarantee the color when the classes are composed is #f8f9fa. And we can guarantee modifying styles in one rule-set won’t bring unforeseen side-effects to the other.