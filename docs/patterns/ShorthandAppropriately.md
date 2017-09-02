# Shorthand Appropriately
**Avoid using shorthand notation, unless property has multiple values**

Let’s say we have an element whose top margin is always 10px (a concrete value). For example an avatar:

```css
img.avatar {
  margin: 10px 0 0 0;
  width: 40px;
  height: 40px;
  border-radius: 20px;
}
```

And avatars within the navigation have a left margin of 15px:

```css
nav img.avatar {
  margin: 10px 0 0 15px;
}
```

Using the shorthand notation for margin has brought some **undesirable effects**.

Firstly it’s **illogical**. Inside the nav the top margin is re-applied even though only the left margin has changed. We are overriding the 10px top margin (set in img.avatar) with the same value - overriding 10px with 10px doesn’t make sense.

Secondly the margin shorthand is **error prone**. There is an increased risk of accidentally overriding the top margin with a value other than 10px. Which means we have to keep track and maintain every concrete value in our system. If the top margin of img.avatar is subsequently changed to 15px there are more instances to update.

Lastly shorthand notations can be **unnecessary**, often re-applying values that already exist or need to be reset later. We can leverage browser default (user agent) styles; the default margin for an image is already 0px.

Omitting the margin shorthand not only removes unnecessary (same value) overrides it also improves readability. The property name now describes where the value applies, seen in the revised example below:

```css
img.avatar {
  margin-top: 10px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
}

nav img.avatar {
  margin-left: 15px;
}
```
