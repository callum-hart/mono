/**
    Patterns --

    Document patterns used in immutable CSS
*/


/**
    @technique: Negation
    @description: Negation uses the :not pseudo-class to avoid
    mutations amongst composable classes. A common example of
    a composable class is a BEM modifier.
    @problem:

    .form {
        background: grey;
    }

    .form--withError {
        background: red;
    }

    When the form has both classes the background is set twice.
    This breaks the principles enforced by some types, e.g:

    .form {
        background: Immutable(grey);
    }

    The background of `.form` is locked. When the form has the error
    class it cannot change the background property.

    @solution:

    .form:not(.form--withError) {
        background: grey;
    }

    .form--withError {
        background: red;
    }

    @more

    Negation removes affects of the cascade - the order of declarations
    doesn't matter. Which makes declarations more portable and predictable.

    Test case: text in a row is blue, text in an active row is green:

    <div class="row">
        <p>Normal text</p>
    </div>

    <div class="row row--active">
        <p>Active text</p>
    </div>

    Without negation, the overriding declaration only wins if:
    (list ordered by weight).

    - Importance - property is flagged as !important
    - Specificity - it has a selector with a higher specificity
    - Order - it is declared after the style it's overriding

    Todo: add importance example, and order examples by weight...

    This works (declared after):

    .row p {
        color: blue;
    }

    .row--active p {
        color: green;
    }

    This works (higher specificity):

    div.row--active p {
        color: green;
    }

    .row p {
        color: blue;
    }

    This doesn't work (declared before + equal specificity):

    .row--active p {
        color: green;
    }

    .row p {
        color: blue;
    }

    With negation we needn't bother about cascasde position or selector
    specificity, since there is only one source of truth for each state.

    As expected this works (declared after + equal specificity):

    .row:not(.row--active) p {
        color: blue;
    }

    .row--active p {
        color: green;
    }

    As does this (declared before + equal specificity):

    .row--active p {
        color: green;
    }

    .row:not(.row--active) p {
        color: blue;
    }

    Removing the override has bought us portability and predictability.
    I can gaurentee that text in `row` is blue, and text in `row--active`
    is green. I no longer have to think about the order of declarations
    and the strength of their selector.

    This is super powerful! Negation has removed 2 painpoints of CSS: the
    cascade and selector specificity, which just leaves the styles to
    worry about :)

*/

/**
    @technique: Selector types
    @description: Selectors should include their element type.
    This has several benefits:

    *Note: a consumer is an element or group of elements which CSS
    rules are applied.

    - Improved scoping – styles are scoped to the elements that use them.
    - Encapsulation – styles are brought out of the global domain.
    - Better visibility – reduces ambiguity of consumers.
    - Reduces conflicts – easier to avoid and track unwanted overides.

    @problem:

    .title {
        font-size: 20px;
    }

    The `.title` class is obscure. We cannot make any guarantee of
    who the consumer is. And we have no control (or foresight) over
    what other styles will be applied.

    As it stands our title does not have a predictable or concrete
    shape. For example:

    <span class="title"></span>
    <h1 class="title"></h1>

    Both instances of `.title` will look different.

    @solution:

    h1.title {
        font-size: 20px;
    }

*/

/**
    @technique: Breakpoint encapsulation
    @description: Properties whose values change at different
    screensizes should be scoped within breakpoints.
    @problem:

    .foo {
        font-size: 14px;
    }

    @media(min-width: 500px) {
        .foo {
            font-size: 12px;
        }
    }

    On screens wider than 500px the font-size of `.foo` is set twice.
    This breaks the principles enforced by some types, e.g:

    .foo {
        font-size: Immutable(14px);
    }

    The font-size of `.foo` is locked. It cannot be changed inside the
    media query.

    @solution:

    @media(max-width: 500px) {
        .foo {
            font-size: 14px;
        }
    }

    @media(min-width: 500px) {
        .foo {
            font-size: 12px;
        }
    }

    In order to achieve no overrides, breakpoint ranges need to be
    discrete. Styles within one media query cannot affect styles in
    another.

    Consider the following:

    $s: 400px;
    $m: 900px;
    $l: 1200px;

    Indiscrete breakpoints (styles compete):

    @media (min-width: $s) {
        // anything above 400px
        // competes with $m and $l
    }

    @media (min-width: $m) {
        // anything above 900px
        // competes with $l
    }

    @media (min-width: $l) {
        // anything above 1200px
    }


    Discrete breakpoints (no style competition):

    @media (max-width: $s) {
        // anything below 400px
    }

    @media (min-width: $s) and (max-width: $m)  {
        // between 400px and 900px
    }

    @media (min-width: $m) and (max-width: $l)  {
        // between 900px and 1200px
    }

    @media (min-width: $l) {
        // anything above 1200px
    }

    Not only do discrete breakpoints eliminate competing styles
    they also buy portability. Just like negation, specicifity
    and cascade no longer determine the winning style. Styles are
    encapulated within their ranges.

    Monos compiler should detect (and prevent) indiscrete
    breakpoints.


    Co-located media queries?

    div.someClass {
        color: immutable(#ccc);
        font-family: immutable(operator);
        font-weight: immutable(300);
        font-size:
            switch(@meda) {
                case width 0px -> 400px:
                    16px;
                case width 400px -> 900px:
                    14px;
                default:
                    12px;
            };
    }

*/

/**
    @technique: Shorthand appropriately
    @description: Use shorthand notation only when a property has
    multiple values.

    @problem:

    div.pow {
        margin: 10px 0 0 0;
    }

    nav div.pow {
        margin: 10px 0 0 10px;
    }

    The top margin of `.pow` is concrete (it should always be 10px).
    With shorthand: future changes to margin sides of `.pow` must
    hydrate concrete values by duplicating their assignment.

    Inside `nav` the top margin is re-applyed even though only the
    left margin is changed.

    - Accidental mutations: easy to unintentionally override concrete
      values.
    - Unnecessary: we can leverage browser defaults, default margins
      are already 0.
    - Obfuscates values: cannot gaurentee hydrated values without
      looking at their initial assignment.
    - Increases risk of breaking principles, e.g:

    div.pow {
        margin: Immutable(10px 0 0 0);
    }

    All margin sides of `.pow` are locked. The top/right/bottom/left margins
    cannot be changed.

    @solution

    div.pow {
        margin-top: Immutable(10px);
    }

    nav div.pow {
        margin-left: 10px;
    }

    *Aside: improves readability since the property name describes
    where the value is applied.

*/

/**
    @technique: Universal entities
    @description: Styles that are decoupled from their context.
    Always look the same regardless of where they are used. Commonly
    used for common / global styling.

    @problem:

    <div class="box"></div>

    .box {
        padding: 10px;
        background: white;
    }

    - CSS classes are too brittle.
    - No seperation between universal and contextual styles.
    - Easy to accidentally override universal styles.
    - Semantics: No indication that `box` styles are global, nothing to
    differentiate it from other classes.

    @solution:

    <div class="*box"></div>

    div[class*="*box"] {
        padding: 10px;
        background: white;
    }

    Universal entities are denoted using a universal class which is prefixed
    with an asterix (*) and has the following structure:

    `*[universal name]`

    The subtle change to the classname (using the * prefix) buys us a few
    things:

    - Protection: the * prefix adds a layer of protection. It's harder to
    accidentally override universal styles, since the CSS selector is more
    verbose (`div[class*="*box"]` vs `div.box`).
    - Identity: universal entities are easy to identify (and thus differentiate)
    just by looking at the CSS or HTML.

    Universal entities may have contextual styles. These are styles tied to a
    specific use case(s), and are applied using a universal identifier class:

    `*[universal name] [contextual identifier]`

    Example:

    <aside>
        <div class="*box box__aside"></div>
    </aside>

    div.box__aside {
        height: 100%;
    }

    The identifier class `box__aside` is used to add context specific styles.


    More complex universal entities have nested (child) elements. These too should
    enjoy the benefits we've seen above (protection & identity).

    Universal children are denoted using a universal child class which are prefixed
    with a caret (^) and have the following structure:

    `^[universal name][child identifier]`

    Example:

    <div class="*box">
        <div class="^box__header">
        </div>

        <footer class="^box__footer">
        </footer>
    </div>

    div[class*="^box__header"] {
        height: 40px;
    }

    footer[class*="^box__footer"] {
        height: 50px;
    }

    Again the prefix (^) protects universal child styles from the outside world,
    and gives them an identity.

    Universal children may also have contextual styles, which are applied using
    a universal child identifier class:

    `^[universal name][child identifier] [contextual identifier]`

    Example:

    <aside>
        <div class="*box box__aside">
            <div class="^box__header box__aside__header">
            </div>

            <footer class="^box__footer box__aside__footer">
            </footer>
        </div>
    </aside>

    div.box__aside__header {
        box-shadow: 0 0 2px black;
    }

    *Aside: asterix prefix (*) denotes everywhere, caret prefix (^) points up to parent.

    UPDATE: universal selector change:

    Issue with wildcard selectors is that they don't play nicely with BEM.

    e.g: the selector `div[class*="^chat-box__header"]` targets both
    elements:

    <div class="^chat-box__header">
        <div class="^chat-box__header-icons"></div>
    </div>

    Instead escape the special character:

    `div.\^chat-box__header`

    Which only targets the class `^chat-box__header`.

    This is so much more robust.

    This means we no longer need to use a different prefix for universal
    children, they too can use an asterix. (Which I think simplifies the
    mono api).

*/