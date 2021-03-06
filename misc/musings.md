### What are the **problems** with CSS?

- Global scope
- Has no *business* logic
- Tightly coupled with *structure of* HTML
- Applying a style(s) can be a battle. Fight against **Cascade** and **Specificity**.
- Applying a style(s) is **unpredictable**. [We have] no visibility on whether a style will be applied. We can make educated guesses.
- Applied style(s) are **vulnerable**. It's easy to **overwrite styles** from anyplace at anytime.
- Numerous ways to override: a) highest specificity wins b) last style wins (cascasing) c) using !important d) inline CSS. Which makes it **hard to keep track** of what style is applied, what styles have been overwritten, whether there any side effects, and how styles are interconnected.
- CSS is mutable by nature.

### Existing techniques that "solve" the problems with CSS

**Inlining CSS**
*React styles, aphrodyte, styltron etc... other JS styling libs (not to be confused with inline CSS `style=""`)*

Benefits:

- Easier to be reasoned with.
- Which boosts confidence.
- Gives more certainty styles will be applied.
- Reduces probability of mutation / accidental overrides.
- Reduces side affects.
- Better scoping / encapsulation.

Drawbacks:

- Styling is coupled to JavaScript rendering.
- Business logic / functional stuff highly coupled with presentation *(no seperation of concerns)*.
- Higher barrier of entry - can't untilize a designer who knows HTML & CSS - they'd need to learn JS.
- Styles tied into build process.
- Anti-pattern. On the server-side it's considered bad practice to mix SQL with business logic, so why mix eveything up on the front-end?
- Caching / performance implications?
- Low cohesion - components responsible for markup, functionality & presentation.
- Pre-processors & flexbox handle most of the niceties JS styles bring (variables, calcualted dimensions).
- [Personal opinion] I tend to split work into manageble chunks. Prefer to focus on business logic seperately to styling; so don't find co-located styles useful - if anything they pollute the JS and are a distraction.

### What constraints can be added to CSS?
*What can we borrow from: other programming languages / design patterns?*

- Can **immutability** be added to CSS?
- Can **scoping** be added to CSS?
- Variable **constants** i.e .IMMUTABLE_CLASSNAME {}
- Can **access modifiers** be added to CSS?
- Default styles (like initial state in React)

### How could they be enforced?

- Pre-processor?
- Pre-pre-processor :-) Something that leverages the power of pre-processors whilst providing additional functionality.
- A linter
- An analyser *like Parker*
- Paradigm / design pattern *like Flux / Redux*
- Annotations?
- Macros, i.e extend of the CSS language
- Dev tools, i.e alerts you when immutable CSS property(s) are changed

# What if CSS could be immutable?

What if a CSS property or group of CSS properties applied to a given element(s) could only be declared once.

In other words: making CSS property(s) in a CSS declaration constant. Unable to be overwritten.

# And what would immutable CSS look like?
*Is it even possible?*
*(If so) is it even worthwhile? Would it solve the problems listed in first section?*

Some abstract concepts / musings:

### Immutable classes

```
.BUTTON {
    padding: 10px 15px;
    border: 1px solid grey;
    // styles for button
}


.SAVE_BUTTON {
    @extend .BUTTON;
    // styles specific to save button
}
```

*Idea:* `.SAVE_BUTTON` can't override any properties declared in `.BUTTON`
*Pros:* Base properties are only declared once (in `.BUTTON`). Yeah immutability!
*Cons*: `.SAVE_BUTTON` looks like a different version of `.BUTTON`. This doesn't mean it'll have different properties *(it may)*. But most likely `.SAVE_BUTTON` will have different values for some properties of `.BUTTON`. For instance `.BUTTON` has a grey border and `.SAVE_BUTTON` has a blue border.

Hmmm okay... how about excluding properties from `.BUTTON` that have multiple values?

```
.BUTTON {
    padding: 10px 15px;
    border-style: solid;
    border-width: 1px;
}

.DEFAULT_BUTTON {
    border-color: grey;
}

.SAVE_BUTTON {
    border-color: blue;
}
```

Well this kinda works... each CSS property is only declared once.

What if `.SAVE_BUTTON` should have a dashed border?

Move `border-style` out from `.BUTTON` since it can have multiple values.

```
.BUTTON {
    padding: 10px 15px;
    border-width: 1px;
}

.DEFAULT_BUTTON {
    border-style: solid;
    border-color: grey;
}

.SAVE_BUTTON {
    border-style: dashed;
    border-color: blue;
}
```

This kinda works too...

What if `.BUTTON` became a function?

In pre-processor land functions are called mixins... tada

### Immutable mixins

```
.BUTTON(@borderStyle, @borderColor) {
    padding: 10px 15px;
    border-width: 1px;
    border-style: @borderStyle;
    border-color: @borderColor;
}

.DEFAULT_BUTTON {
    .BUTTON(solid, grey);
}

.SAVE_BUTTON {
    .BUTTON(dashed, blue);
}
```

Even nicer... by abstracting common styles (`padding` + `border-width`) into a function we've made the base `.BUTTON` class redundant. This will keep HTML skinny.

### What about **composable classes**?
*Classes that are used together. Common example can be seen in bootstrap: `class="btn btn-primary"`*.

- `btn` bass class ~> adds core styles
- `btn-primary` enhancement class ~> adds additional styles. These ususally override *some* inherited styles from base class. Oh oh we have mutation.

The `btn btn-primary` example could be re-written just like we saw above:

```
.BTN(@backgroundColor) {
    padding: 8px 12px;
    font-size: 12px;
    background: @backgroundColor;
}

.BTN_PRIMARY {
    .BTN(blue);
}
```

The need for the `btn` class is gone. Using `class="BTN_PRIMARY"` produces the same result as `btn btn-primary` **without mutation**. Properties applied to the button are only set once. Yeah immutability!

**Removing composable classes** has **enabled immutability**. But this comes with a cost. The constraint implies an element can't have multiple classes when the same CSS property(s) is applied in each. This is viable for the `btn` example because the `btn-primary` enhancement is concrete - it doesn't change, or have multiple states.

This approach doesn't work for modifier / pseudo classes...

### What about **modifier classes**?
*i.e BEM modifiers. Modifier classes represent a difference (difference could be state / theme).*

- Example: `form form--withError`
- Could take same approach as `btn btn-primary` (abstracting common styles out into a function).

```
.FORM(@backgroundColor) {
    padding: 20px;
    background: @backgroundColor;
}

.BASE_FORM {
    .FORM(white);
}

.BASE_FORM--WITH_ERROR {
    .FORM(red);
}
```

- This would mean the form can't have both classes `form` and `form--withError` at the same time. This would make changing classes more cumbersome i.e couldn't do `$('.form').addClass('form--withError')`. Would have to swap `form` class with `form--withError`.
- Is the inconveinience of swapping classes a show stopper? Is it unrealistic to say classes can only be used together when they apply unique CSS properties to the element?

When composable classes can't be avoided *(like modifer classes)* a different approach is needed to achieve immutability. **Is it even possible to have composible classes without mutability?**

Let's explore the options.

### Using :not

```
.FORM(@backgroundColor) {
    padding: 20px;
    background: @backgroundColor;
}

.BASE_FORM {
    .FORM(white);
}

.BASE_FORM--WITH_ERROR {
    .FORM(red);
}
```

```html
<form class="BASE_FORM BASE_FORM--WITH_ERROR"></form>
```

As it stands `BASE_FORM--WITH_ERROR` overrides the background color set by `.BASE_FORM`. *Assuming `.BASE_FORM--WITH_ERROR` is declared after `.BASE_FORM` - darn cascade!*

To prevent the mutation we can explicity say the background color of `.BASE_FORM` should only be set when the form does **not** also have the class `.BASE_FORM--WITH_ERROR`.

We can do this using the `:not(X)` pseudo-class:

```
.FORM(@backgroundColor) {
    padding: 20px;
    background: @backgroundColor;
}

.BASE_FORM:not(.BASE_FORM--WITH_ERROR) {
    .FORM(white);
}

.BASE_FORM--WITH_ERROR {
    .FORM(red);
}
```

This works... The background color of the form is only ever set once - even when the form has both classes.

*Using `:not(X)` could be auto-generated by a build tool:*

Build tool could detect modifier classes and automatically add `:not(X)` to base class, i.e:

```
.BASE_FORM {
    .FORM(white);
}

.BASE_FORM--WITH_ERROR {
    .FORM(red);
}

// transformed to:

.BASE_FORM:not(.BASE_FORM--WITH_ERROR) {
    .FORM(white);
}

.BASE_FORM--WITH_ERROR {
    .FORM(red);
}
```

**Or** could introduce a way to describe composible classes:

```
.BASE_FORM {
    .FORM(white);
}

.BASE_FORM--WITH_ERROR extends .BASE_FORM {
    .FORM(red);
}

// transformed to:

.BASE_FORM:not(.BASE_FORM--WITH_ERROR) {
    .FORM(white);
}

.BASE_FORM--WITH_ERROR {
    .FORM(red);
}
```

### Extending the language (aka macros)

Immutable propeties could be flagged:

```
.someSelector {
    _padding: 20px; // flagged property (prefixed with underscore)
    margin: 10px;
}
```

A prefix could notify a compiler / build tool that the property couldn't be changed. `padding` for `.someSelector` can't be changed, whereas margin can.

**Brainwave:** immutable properties can be flagged by CAPITALIZING the property name like so:

```
.someSelector {
    PADDING: 20px; // immutable property
    margin: 10px;
}
```

This mimics the naming convension of *final* variables, and more importantly is **valid CSS!** No build tool required to tranform flagged _properties.

### What about **media queries**?

Can be handled just like composable classes. Abstract common styles out into a mixin + accept styles with multiple values through parameters, i.e:

```
.HEADING(@fontSize, @fontWeight) {
    color: #ccc;
    font-size: @fontSize;
    font-weight: @fontWeight;
}

@media(max-width: 500px) {
    h1 {
        .HEADING(20px, bold);
    }
}

@media(min-width: 500px) {
    h1 {
        .HEADING(50px, normal);
    }
}
```

Would have to enforce breakpoints didn't overlap one-another.

### What about **pseudo classes**?

Can't use the same approach as with composible classes *(i.e using `:not()`)*.

Could introduce a rule: **pseudo classes can only modify mutable properties set on their base class:**

```
.BTN_PRIMARY {
    PADDING: 10px;
    color: blue;
}

.BTN_PRIMARY:hover {
    padding: 12px; // throws error because padding is immutable
    color: blue; // allowed because color is mutable
}
```

Could introduce **protected properties**, which can **only be modified by pseudo classes:**

```
.BTN_PRIMARY {
    PADDING: 10px;
    _COLOR: blue;
}

.BTN_PRIMARY:hover {
    color: blue; // allowed because color is protected
}
```

This removes the risk of abusing mutable properties intended only to be modified by pseudo classes.

Protected properties could be denoted by capitalizing property name *(instead of underscore used in example above):*

```
.BTN_PRIMARY {
    PADDING: 10px; // immutable
    Color: blue; // protected
}
```

### Immutable mixins
*Already seem some examples of immutable mixins: `.BTN()`, `.FORM()`*

Shouldn't be able to override immutable mixins. **Immutable mixins can only be declared once:**

```
.BTN(@backgroundColor) {
    // mixin body
}

.BTN(@backgroundColor) {
    // throws error because BTN mixin has already been defined
}
```

**Things to consider**
*What should a build tool enforce... what should be left up to the developer?*

Should properties declared inside a immutable mixin be immutable by default?

For example:

```
// Strict mode: on

.BTN(@backgroundColor) {
    padding: 8px 12px;
    font-size: 12px;
    background: @backgroundColor;
}

.BTN_PRIMARY {
    .BTN(blue);
    padding: 10px 15px; // throws error because padding is already set
    font-size: 14; // throws error because font-size is already set
    background: green; // throws error because background is already set
}
```

Is this too strict? Should we allow some flexibility?

Alternative: explicitly say what properties are immutable:

```
// Strict mode: off

.BTN(@backgroundColor) {
    padding: 8px 12px;
    FONT-SIZE: 12px;
    BACKGROUND: @backgroundColor;
}

.BTN_PRIMARY {
    .BTN(blue);
    padding: 10px 15px; // override allowed
    font-size: 14; // throws error because font-size is immutable
    background: green; // throws error because background is immutable
}
```

Would flexibility open the gates to abuse? Solution: could just be a setting ~> strict mode on|off.

We've only looked at classes, what about **element selectors** and **default styles**?

It's not uncommon to set default styles that override browser defaults:

```
ul {
    MARGIN: 0;
    PADDING: 0;
}

li {
    LIST-STYLE: none;
}

p {
    MARGIN: 0;
    FONT-SIZE: 12px;
}
```

What impact would this have?

This example might be too strict... the `margin` and `padding` of the  `<ul>` can never be set again... is that a bad thing?

Solution: use capitalized names for immutable properties i.e

```
ul {
    margin: 0; // can be overriden
    PADDING: 0; // can't be overriden
}
```

~~Hard~~ Impossible for a compiler / build tool to know a selectors element type. This would make it difficult to enforce immutability amongst properties declared inside an element selector. i.e

```
p {
    FONT-SIZE: 12px;
}
```

```html
<p class="first-name"></p>
```

```
.first-name {
    font-size: 14px;
}
```

Selector `.first-name` is unaware of it's element type. And thus unaware that `font-size` is immutable.

Solution: could use annotations to infer element type:

```
/* @type: <p> */
.first-name {
    font-size: 14px; // throws error because font-size of <p> is immutable
}
```

This could also be expressed using a **type system**...

```
.first-name<p> {
    font-size: 14px; // throws error because font-size of <p> is immutable
}
```

And then multiple types:

```
.first-name<p, span> {
    font-size: 14px; // throws error / warning
}
```

**Run-time errors** could catch selectors without types, who mutate properties set by element selectors. *This would happen in the browser.*

```
p {
    FONT-SIZE: 12px;
}
```

```html
<p class="first-name"></p>
```

```
.first-name {
    font-size: 14px; // can't be caught at compile time because class type is missing.
}

// Should be:
// .first-name<p> {}
```

Browser shows illegal mutations, i.e:
___
Illegal mutation of `font-size` made by `.first-name` class.
`font-size` is an immutable property set by the declaration on line XXX:

```
p {
    FONT-SIZE: 12PX;
}
```

Tip: add element type to class selector to catch error at compile time:

```
.first-name<p> {}
```
___

Runtime errors could be used on existing projects *(that haven't used immutable CSS)* and report on mutated properties.

**Compile time errors** could catch everything else:

- Immutable mixins being overriden `.FORM()`
- Immutable classes being overriden `.BTN_PRIMARY {}`
- Immutable properties being overriden `MARGIN: 10px;`
- Protected properties only being overriden by pseudo classes
- Mutating properties set by element selectors:

```
p {
    FONT-SIZE: 12px;
}

nav p {
    FONT-SIZE: 14px; // throws error because font-size of <p> is immutable
}

.first-name<p> {
    FONT-SIZE: 10px; // throws error because font-size of <p> is immutable
}
```

- Pre-processor variables being declared more than once `@IMAGE_WIDTH: 50px` *I wonder whether this could be scoped?*

```
@IMAGE_WIDTH: 50px;

// somewhere else...

@IMAGE_WIDTH: 60px; // throws error because variable is already defined
```

### Todos

Test my assumptions.

Build a site that uses the approaches, rules and constraints of immutable CSS.

Pretend I have a build tool enforcing the constraints.

### Findings

Had to add additional access modifier (public). Public properties can only be modified by pseudo-classes of parent element.

Use case: hover over an element can change style(s) of child element. i.e hover over button changes color of icon inside.

*Update:* public properties can also be changed by modifier class of parent element, i.e:

```
.BTN(@background) {
    padding: 4px 10px;
    Background: @background;
    oPacity: 1; // public
}

.btn-primary {
    .BTN(green);
}


.form--with-error {
    .btn-primary {
        pointer-events: none;
        oPacity: 0.5; // can modify opacity because property is public
    }
}
```

Only use immutable classes when it makes sense (such as utility classes). It's unrealistic to think declarations such as `.BUTTON` and `.ICON` can only be declared once. That is not to say they can't have immutable properties.

Visual *immutable* styles live in `button.less` / `icon.less` whereas how they are positioned depends on the context in which the element is used. For example:

```
// buttons.less

.BTN(@background, @color) {
    padding: 4px 10px;
    Background: @background;
    Color: @color;
}

.BTN_PRIMARY {
    .BTN(blue, white);
}

// nav.less

nav {
    .BTN_PRIMARY { // throws error because BTN_PRIMARY is an immutable class.
        float: right;
    }
}
```

Example above doesn't make sense because some properties of button depend on the context button is used. It would equally not make sense to move `float: right;` into `buttons.less` because not all buttons will need this style. It's better to make `BTN_PRIMARY` a mutable class *(one that can have multiple declarations)*. i.e:


```
// buttons.less

.BTN(@background, @color) {
    padding: 4px 10px;
    Background: @background;
    Color: @color;
}

.btn-primary {
    .BTN(blue, white);
}

// nav.less

nav {
    .btn-primary {
        float: right;
        Background: red; // throws error because `Backgound` is protected.
    }
}
```

### The case for Immutable CSS

#### CSS compared to JS

Duplicate attribute definitions in an POJO is bad design.

```
var user = {
    firstName: "Callum",
    lastName: "Hart",
    firstName: "Bob",
    firstName: "Sally"
}

user.firstName = "Henry";

var session = {
    currentUser: user,
    sessionId: sessionId
}

// Changing first name from a different context (same as overriding CSS prop from different scope).

session.user.firstName = "Bill";
```

We wouldn't do this in JS, so why does the equivalent happen in CSS?

#### CSS compared to OO

Would be useful to compare CSS with an Object-orientated language, which has variable types
and safe ways to assign values, i.e

```
public class Foo {
    // final variables cannot be redefined
    final String blue = "blue";

    // variables also have a type.

    // setters (only way to externally modify a variable)
    public void setFontSize(String fontSize) {
        this.fontSize = fontSize;
    }
}

- The variable `blue` cannot be redefined.
- Foo can only have 1 font size. Even if the setter (`setFontSize`) is called multiple times (unlikely) Foo will still only have 1 font size.

Foo foo = new Foo()
foo.setFontSize('10px');
foo.setFontSize('14px');
foo.setFontSize('12px');
foo.setFontSize('20px');

We can guarantee the font size of foo will always equal the last setter (20px).

vs:

@blue: "blue";
@blue: "red";

p.foo {
    color: @blue;
    font-size: 10px;
    font-size: 14px;
}

p {
    font-size: 12px !important;
}

.foo {
    font-size: 20px;
}

Font size of `.foo` is uncertain, the winning style is determined by importance, specificity and cascade order.

In the OOP example, when font size is mutated the original value is overridden. It can be set {n} times, but always have 1 definition.

In the CSS example, when font size is mutated the original value is preserved, and a new attribute+value is spawned. When set {n} times, it will have {n} definitions.
```

### Project name

I think Immutable CSS is too specific. And whilst immutability plays a
role in the project, it isn't the only thing. Ideas:

- Cassius
- Hitch
- Styl
- mono
- Curb
- Mono
- Monostyle
- Solo
- Monty

### Project description in 1 sentence

- Mutation management for CSS
- Mutation control for CSS
- Immutability and data types meet CSS
- A single source of truth for CSS styles
- Abolish specificity and cascading wars
- Making every CSS property a winner
- CSS without mutation, specificity wars or cascading conflicts
- Immutable CSS - abolish specificity wars & cascading conflicts
- Language that improves CSS architecture
- CSS with logic, data-types & immutability
- CSS free from unwieldy overrides, specificity wars or cascading conflicts
- CSS without unruly overrides, specificity wars or cascading conflicts

### Notes

- Gives library authors finite control over what styles are exposed – those that can be changed externally.
- Abolish specificity wars!
- [Immutable facebook 2] credit design: https://dribbble.com/shots/1666016-Facebook-redesign/attachments/262440
- I'm currently building UI's using mono to test my assumptions.
- MVP has 1 dependency Sass - merely because it's the quickest way to test ideas. Ideally mono will be decoupled from a specific
preprocessor. It should be as agnostic as possible. Compatible with any CSS strategy.
- Example UI's should also include common use cases (AB tests, themes, responsive pages) – and how they can be achieved with mono.
- Default architecture for CSS is broken -> declare a value and then override it N times.
- [Technical goals] Leverage naitive CSS as much as possible.
- What is mutation in CSS? When a CSS property for a given element has more than 1 declaration.
- Baked in ommitence of redundant styles. Preventing mutation eliminates dead code (styles that aren't used).
- [Dipping in and out of fb ui] I've found it easier and quicker to jump back into the project and continue where I left off. Think this is due to a number of reasons:
    1. Code is expressive / has clarity -> easier to understand
    2. Patterns promote consistency -> which in turn increases familiarity (reduces onboarding time)
    3. Constraints limit uncertainly -> and narrow scope of potential problems
    4. Predefined rules guide workflow -> less decision making
    5. Code feels more logical than abstract -> easier to reason with
    6. More confident to make changes -> less risk of side effects
- [Performance] More performant? Is it expensive for the CSSOM to draw elements with duplicate property declarations? i.e draw h1 with font size 18px and then redraw h1 with font size 20px. Yes it will be since CSS is a render blocking resource, so more CSS = slower page. Benchmarking: inspectror -> timeline -> event log -> parse stylesheet. Resources:
    - https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css
    - https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model
    - https://www.w3.org/TR/cssom-1/
- [Motivation] Fed up of scrolling through inspectors style tab hunting down the 'winning' CSS rule. In some cases a property was set 10 times. And I just thought this has got to stop. Not only is tracking down styles difficult, changing them can be equally combersome: having to compete with specificity, cascade and importance. Often CSS rules only exist soley to overright unwanted inherited styles - differentiating between required styles and those that act as a bandaide is tricky. No wonder maintaing CSS is a nightmare! The problems are a **language** and **architectural** issue.
- [Case studies] Look at the CSS for popular websites and see how often styles are overriden. For example the "What's happening" Netflix popup.
- [Docs] When explaining concepts include a code example(s) demonstrating each concept in isolation. *Concept being a type / modifier / motive / pattern / principal*.
- [mono is agnostic / flexible] In the fb example I use the BEM naming convension. This isn't integral to mono, and neither is how you architect your CSS files.
- [Technical goals] want the mono api to be as small as it can be. Bloated projects are harder to consume.
- [Think] What todo about inherited properties... if anything? i.e `<li><span>hey</span></li>`, `li { font-size: 12px; }` (span inherits font-size from li). Could prevent inherited styles using `initial` on child elements: https://jsfiddle.net/8nddo8b0/
- The premise of mono is a CSS property for a given element should have 1 definition.
- [No overrides] don't have to spend time & energy on specificity battles, order of styles in the cascade, fighting with !important. No overrides makes a large proportion of the work we do in CSS redundant - there's no need to undo unwanted styles. This 1 constraint *(no overrides)* removes **3 of the worst painpoints of CSS** (specificity, cascade, !important). No overrides is also possible with pseudo classes *(i.e :hover)* -> see "Using negation for pseudo classes" in `playground.html`. One could argue that an **override indicates improper reuse**. Mono discourages / prevents improper reuse.
- [Interop] Some motives are for interop; working with non-mono code, i.e --overthrow, --overrule.
- [Mono format] Would an enforced format be useful? *low priority*.
- Shouldn't confuse reusue with overrides.
- [Origins] Mono started as a thought experiment. Simple goal: make CSS better. Open minded - idea creation vs predetermined bias.
- [Blog] The case against CSS overrides.
- [Compiler] escape special characters in constant selectors.
- Too many overrides indicate improper reuse. Pushing a square peg into a round hole.
- [Mono Query] Series of commands used to see the health of a mono project. Examples:
    - running `mono inspect patch` (in terminal) shows all declarations that use the motive patch, could list their identifier (i.e ticket ID).
        - `mono fix patch ENG-123456` remove patches for a specific pointer.
    - `mono inspect overthrow` shows declarations that use the motive overthow.
        - `mono inspect overthrow bootstrap` shows declarations that override bootstrap styles.
        - `mono inspect overthrow drop bootstrap` remove all styles that override bootstrap styles (useful when a 3rd party dependency is dropped).


### Tooling / Ecosystem

**Browser extension**

- Show every property mutation for a given element.
- Think of ways to visualize property mutations.
- Could be represented as a timeline.
- If a property for a given element mutates N times show each change. Almost like a debugger breakpoint at each mutation.
- https://stackoverflow.com/questions/25724166/acessing-the-render-tree

Example:

```css

// line 2
p {
    font-size: 10px;
}

// line 14
section p {
    font-size: 15px;
}

// line 22
div p {
    font-size: 20px;
}
```

`font-size` for the element `p` is mutated 3 times. With the last declaration in the cascade sticking.

Browser extension:

Select an element to show it's property mutations.

Property: `font-size`
Mutations: 3

| <span style="font-size='10px'">text</span> | <span style="font-size='15px'">text</span> | <span style="font-size='20px'">text</span> |
| :---| :--- | :--- |
| 10px | 15px | 20px |
| `p {}` | `section p {}` | `div p {}` |
| line 2 *(app.css)* | line 14 *(app.css)* | line 122 *(main.css)* |

Time *(corresponds to cascade)* ->

Shows how the `font-size` of `p` changes over time. The top line in the table ("text") represents the style.
In this example the size of "text" would increase (from left to right).

Another example:

```css
// line 40 (app.css)
h3.title {
    color: grey;
}

// line 12 (main.css; which is included after app.css)
h3.title {
    color: red;
}
```

Browser extension:

Property: `color`
Mutations: 2

| <span style="color='grey'">text</span> | <span style="color='red'">text</span> |
| :---| :--- |
| grey | red |
| `h3.title {}` | `h3.title {}` |
| line 40 *(app.css)* | line 12 *(main.css)* |

Time *(corresponds to cascade)* ->

In this example the color of "text" on the left would be grey, and the color of "text" on the right would be red.

Alternative view *(which might be more useful)* would be property mutation count. Select an element and get a list of it's CSS properties with a count of how many times property is set. i.e:

Element: `<p class="heading"></p>`

| CSS property | Mutation count |
| :---| :--- |
| `font-size` | 5 |
| `font-weight` | 3 |
| `color` | 6 |
| `text-decoration` | 2 |

*High mutation count is bad. With Mono CSS mutation count should always be 1.*

### Mono source comments

Include reference to source file:line in compiled CSS:

```
nav.main-links {
    _source: styles/nav/main.scss:20;
}
```

### Resources

- https://www.phase2technology.com/blog/used-and-abused-css-inheritance-and-our-misuse-cascade
- https://css-tricks.com/opt-in-typography/
- https://www.javaworld.com/article/2076814/core-java/inheritance-versus-composition--which-one-should-you-choose-.html
- https://micahgodbolt.com/blog/writing-the-correct-css-once-is-pretty-easy-all-situations/
- https://micahgodbolt.com/blog/writing-the-correct-css-once-is-pretty-easy-part-2/
- https://speakerdeck.com/chriseppstein/help-my-stylesheets-are-a-mess
- https://medium.com/seek-blog/a-unified-styling-language-d0c208de2660
    - "working with CSS at scale is all about picking a reasonable subset of the language"