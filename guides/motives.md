/**
    Motives --

    Specical functions that add reasoning to CSS.

    Goal of a motive is to off-load information about
    the code (from your brain) to the code itself.

    Often there is a specific reason why a CSS property
    exists. Suitable reasons could be overriding:

    - Inline styles
    - 3rd party styles
    - User agent styles

    By making CSS easier to reason with we make the process of
    understanding (it) more immediate.

    Motives remove investing time and enery in justifying why
    a property exists.

    Motives are prefixed with a double dash --

*/

/**
    @motive: Overrule
    @description: Can modify inline CSS styles.
    @throws: IllegalOverrule
*/
@function --overrule($inlineStyle) {
    @return append($inlineStyle, #{!important '/* --overrule */'});
}

/**
    @motive: Overthrow
    @description: Can modify 3rd party CSS styles.
    @throws: IllegalOverthrow

    Helps keep track of styles that only exist to override
    3rd party styles. Useful for maintenence, if 3rd party
    becomes redundent (removed from project) 3rd party
    overrides can be removed. Makes CSS deterministic.

    Cannot be used to override styles declared in projects CSS.
*/
@function --overthrow($alienStyle) {
    @return append($alienStyle, #{'/* --overthrow */'});
}

/**
    @motive: Veto
    @description: Override user agent styles. Used when
    a property only exists to remove / reset a browser
    default.
    @throws: IllegalVeto
    @example:

    input {
        outline: --veto(none); // remove outline
    }

    Good:

    ul {
        padding-left: --veto(0); // reset padding
    }

    Bad:

    ul {
        padding-left: --veto(12px); // doesn't remove or reset value
    }
*/
@function --veto($browserDefault) {
    @return append($browserDefault, #{'/* --veto */'});
}

/**
    @type: Fallback
    @description: Fallback properties allow multiple implementations
    of the same CSS property. They can only be used for fallbacks.
    @usage:

    .foo {
        background: fallback(grey);
        background: Immutable(linear-gradient(white, black));
    }

*/
@function --fallback($fallbackValue) {
    @return append($fallbackValue, #{'/* --fallback */'});
}

/**
    @type: Because
    @description:
    @usage:

    .foo {
        padding: immutable(20px);
        box-sizing: --(border-box, element has padding);
    }

*/
@function --because($value, $reason) {
    @return append($value, #{'/* --because */'});
}


