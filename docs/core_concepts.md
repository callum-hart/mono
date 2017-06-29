# Core concept

**Note to self:** CSS painpoints doesn't fit in with core concepts. It related (since the concepts address them), but maybe should live elsewhere... part of / after motivation...

- Introduce overring nature of CSS. *(Set's scene)*
- Worst offenders of CSS pitfalls *(cascade, specificity, importance)*
- Worst offenders example
- Override equals mutation
- Key principle
- Secondary principle



At its core mono pinpoints the **overrding nature of CSS** as the problem. Variation & reusability is instinctively achieved by overridng unwanted styles. The language overtly encourages this. Even from a clean slate browser defaults are overriden.

An overiding architecture becomes self-perpetuating. **The more overrides exist the more overriding you do**. In my experience it's preferable (and somewhat safer) to override unwanted styles vs remove them. It's easier to see a fix, than spot a regression.

Managing overrides proves difficult. Global scope allows anyone to override. The influencers cascade, specificity & importance determine who will win. Yet in isolation these traits are harmless:

```css
html body div#main h1.title {
 color: #ccc !important;
}
``` 

High specificity and importance only become offensive when overriding a style, in this case the color of `h1.title`.

Ommiting / controlling overrides makes CSS **robust**, **predictable** & **maintainable**. It also reduces the cognition used to reason with CSS, and removes friction from   
