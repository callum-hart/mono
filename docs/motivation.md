# Motivation

Mono was born out of my own fustration.

Whilst working on different CSS codebases I realised all shared similar issues. A common trait became clear: **CSS development is expensive** - it's labour intensive & time consuming.

The typical CSS workflow amounted to:

1. **Hunting:** Locate where a style derives from & identify who sets it.
2. **Reasoning:** Understand why a style exists.
3. **Analysing:** Ascertain what impact adding / changing / removing a style will have.
4. **Friction:** Compete with specificity, cascade & importance when making a change.

Four steps to make one change is **exhausting**, and more importantly **not scalable**. The bigger codebases grew the worse maintaining their CSS becames.

A cumbersome workflow isn't without reason - merely a symptom of  other issues. CSS is notoriously **fragile** & **difficult to reason with**.

Part of the difficulties lie with **global scope** & an unhealthy tolerance of **overrides**. Without seperation of concerns, nor a means to encapsulate we often find **styles compete against one another** - so much so that the term "winning style" has been coined. 

Determining the "winning style" is uncertain. There are too many deciding factors at play. Global scope permits anyone to override. Influencers cascade, specificity & importance determine who is victorious. At any given time the victor can change (new styles added, old styles removed) which not only makes the outcome **unpredictable** but also **fragile**.



The sheer volume of styles cohabiting in the same space quickly grows unmanageable. We loose track of what styles are used & who uses them. It becomes hard to indentify what role styles have & are interconnected. 

- Loose track of styles (what styles are used, who uses them).
- Hard to indentify how styles are interconnected.
- A feeling of uncertainty looms over us. Loose confidence in making changes.
- CSS has taken the reign (control).
- High risk of breaking things.


It's hard to keep track of styles & spot dependancies / relationships between them. This ability to loose control & insight into our CSS results in a **high risk of breaking things**.




It becomes difficult to keep track of: What styles are used? Who uses these styles? How are these styles interconnected? CSS provides no insight or guidence into answering these questions.
 
Both of which lead to a **high risk of breaking things**.




labour intensive, unpredictable, fragile, hard to reason with... 
Projects like BEM make CSS easier to reason with
In steps mono...

I thought there must be a better way! 









 