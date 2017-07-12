# Motivation

Mono was born out of my own fustration.

Whilst working on different CSS codebases I realised all shared similar issues. A common trait became clear: **CSS development is expensive** - it's labour intensive & time consuming.

The typical CSS workflow amounted to:

1. **Hunting:** Locate where a style derives from & identify who sets it.
2. **Reasoning:** Understand why a style exists.
3. **Analysing:** Ascertain what impact adding / changing / removing a style will have.
4. **Friction:** Compete with specificity, cascade & importance when making a change.

Four steps to make one change is **exhausting**, and more importantly **not scalable**. The bigger codebases grew the worse maintaining their CSS became.

<p align="center">&ast;&ast;&ast;</p>

A cumbersome workflow isn't without reason - merely a symptom of  other issues. CSS is notoriously **fragile** & **difficult to reason with**. 

Part of the difficulties lie with global scope & an unhealthy tolerance of overrides. Without seperation of concerns, nor a means to encapsulate we often find **styles compete against one another** - so much so that the term "winning style" has been coined. 

Determining the "winning style" is **unpredictable** - with too many deciding factors at play. Global scope permits anyone to override. Influencers cascade, specificity & importance determine who is victorious. At any given time the victor can change (new styles added, old styles removed) which not only makes the outcome **uncertain** but also **fragile**.

The unpredictable & fragile nature of CSS make it **easy to break** & **hard to maintain**. The sheer volume of styles cohabiting in the same space quickly grows **unmanageable**. It's difficult to keep track of what styles are used & who uses them. It grows increasingly difficult to identify dependancies & relationships between styles, which means we **cannot confidently make changes**.

<p align="center">&ast;&ast;&ast;</p>

After having these problems myself & witnessing others suffering I thought there **must be a better way!** Initially a thought experiment mono evolved by investigating [CSS issues](), examining why they were problematic, & exploring how they were solved elsewhere.

With an open-minded approach & focus on understanding core problems before seeking solutions mono aims to make CSS **robust, predictable, & easy to reason with**. I'm extremely excited having watched mono mature & even more thrilled about it's future!