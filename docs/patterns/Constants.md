# Constants
**A constant is an element whose appearance cannot be altered**

Constants always look the same, regardless of where they are used. Styles are decoupled from their context and "hidden" from the outside world.

Constants are best suited to common components (such as buttons, avatars, icons, et cetera), especially those with a high usage. For example the following button:

```html
<button class=”btn”>
  Save
</button>
```

```css
button.btn {
  padding: 8px 12px;
  background: ivory;
  border: 1px solid slategrey;
  color: darkslategray;
}
```

As it currently stands `.btn` suffers a few problems:

First it **lacks identity**. It isn’t obvious that `.btn` is a common component (other than intuition telling us it probably is). Nothing differentiates `.btn` from other classes which means it isn’t clear what impact modifying its styles will have, nor where these modifications should happen.

Secondly it’s far **too easy to override** `.btn` styles. They can be overridden from anywhere, because CSS offers no means to protect or encapsulate them. And since `.btn` lacks identity we are unaware what impact overriding it’s styles will have.

<p align="center">&ast;&ast;&ast;</p>

**Constants** look to solve these problems by encapsulating styles whilst providing an identity.

This is achieved using the following class naming convention:

```html
class="*className"
```

*Classes are prefixed with an asterix (\*)*

The previous button example becomes:

```html
<button class="*btn">
  Save
</button>
```

```css
button.\*btn {
  padding: 8px 12px;
  background: ivory;
  border: 1px solid slategrey;
  color: darkslategray;
}
```

Prefixing the class with a special character is a subtle change, but buys us a few things. Firstly it’s **easy to identify** and thus differentiate `*btn` from other classes. It’s clear that `*btn` is a common component and modifications should be made carefully.

Secondly it adds a **layer of protection**. The special character in the selector needs escaping, which makes it harder to accidentally override since the selector is more verbose: `button.\*btn` vs `button.btn`.

<p align="center">&ast;&ast;&ast;</p>

Constants can have **contextual styles** which are styles tied to a specific usage.

Contextual styles are applied using a separate class. This avoids polluting common styles (in `*btn`) with those only relevant to specific usages. For example:

```html
<nav>
  <button class="*btn nav__btn">
    Log out
  </button>
</nav>
```

```css
button.nav__btn {
  margin-top: 20px;
}
```

Styles specific to the button inside the navigation are applied using the class `nav__button`.

<p align="center">&ast;&ast;&ast;</p>

So far the examples consisted of one HTML element (a single button). However constants can have nested elements. These are called **child constant(s)**.

It is just as important that child constants enjoy the same benefits (protection and identity) that their parents have.

This is achieved using the following class naming convention:

```html
class="^className"
```

*Classes are prefixed with an caret (^)*

An example is a chat widget:

```html
<section class="*chatBox">
  <div class="^chatBox__header"></div>
  <div class="^chatBox__footer"></div>
</section>
```

```css
div.\*chatBox {
  background: ivory;
}

div.\^chatBox__header {
  background: seashell;
}

div.\^chatBox__footer {
  border: 1px solid seagreen;
}
```

Again prefixing the class with a special character makes child constants easy to identify, and harder to override.

Using a different prefix [for child constants] also reinforces their identity. They can easily be distinguished from other CSS classes and recognised as belonging to a constant. Both of which help understanding what the class is, where it’s used, and what impact modifying or overriding it will have.