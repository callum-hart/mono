# Motives

Motives add reasoning to CSS, they **help express intent**.

The goal of a motive is to off-load information from our brain to the code itself. Externalizing information not only frees our mind, but makes collaboration easier.

**Motives capture rationale** in the moment a declaration is declared. This rationale helps explain the reason why a property exists, or justify its value.

Motives remove investing time & energy into understanding CSS, whilst indicating what impact changing / removing a declaration will have.

There are 6 kinds of motive:

## Overrule

Used to override inline CSS (either inlined in HTML or set via JavaScript).

```html
<p class="status" style="display:none">
  Saving…
</p>
```

```css
p.status {
  display<?overrule>: block;
}
```

## Overthrow

Used to override 3rd party CSS.

For example the background color of a bootstrap button.

```html
<button type="button" class="btn btn-default">
  Buy
</button>
```

```css
button.btn-default {
  background-color<?overthrow>: honeydew;
}
```

If the dependency (in this case bootstrap) is dropped we can confidently remove its overthrow rules.

## Veto

Used to override user agent / browser default styles.

```css
ul.contactList {
  margin-left<?veto>: 0;
  padding-left<?veto>: 0;
}
```

## Fallback

Used to denote fallback properties used for cross browser compatibility.

```css
nav {
  background<?fallback>: grey;
  background: linear-gradient(white, black);
}
```

## Because

Used to justify the usage of a property, or reasoning behind its value.

The box sizing of `section.newsFeed` only exists to swallow its padding:

```css
section.newsFeed {
  padding<immutable>: 20px;
  box-sizing<?because: swallowPadding)>: border-box;
}
```

`main.content` should be vertically aligned with `nav`:

```css
nav {
  padding-left : 20px;
}

main.content {
    margin-left<?because: 'align content with nav'>: 20px;
}
```

The because motive is powerful since it helps depict and maintain dependencies between properties and or elements.

For example if the padding of `section.news-feed` is removed we can remove box-sizing. Likewise if the left padding of `nav` changes we know to change the left margin of main.content.

## Patch

Used to denote temporary styles, usually related to a bug or feature that’s in progress.

The patch motive accepts a pointer to where more information is located. For example a JIRA ticket ID:

```css
a.signIn {
  color<?patch: 'ENG-123456'>: cadetblue;
}
```

When the ticket ENG-123456 is resolved this declaration can safely be removed.

<p align="center">&ast;&ast;&ast;</p>

# Combinators

There are times when a type or modifier can be using in conjunction with a motive. In these cases notions are separated with a comma:

```css
ul.contactList {
  box-sizing<immutable, ?because:swallowPadding>;
}
```

