/**
    Types --

    Specical functions that add types to CSS declarations.

    A type is bound to a CSS declaration within a ruleset.

    Each type has a set of laws that govern how the declaration
    can subsequently be used / modified.

    By design type functions are pure. They cannot modify values
    passed as arguments, and cannot add additional CSS properties.
    This gaurentees what styles are applied, which reduces side
    effects.

*/


/**
    @type: Immutable
    @description: Immutable properties can only be set once. They
    cannot be modified after creation.
    @usage:

    .foo {
        height: immutable(100px);
    }

    The height of `.foo` is locked – it can never be changed.

*/
@function immutable($value) {
    // Only append debug flags when env variable is set...
    @return append($value, #{'/* immutable */'});
}

/**
    @type: Protected
    @description: Protected properties can only be modified by
    pseudo-classes derived from the same selector.
    @modifier: --override
    @usage:

    .foo {
       color: protected(grey);
    }

    .foo:hover {
       color: --override(grey);
    }

*/
@function protected($value) {
    @return append($value, #{'/* protected */'});
}

/**
    @type: Public (perhaps better name is Exposed?)
    @description: Public properties can only be modified by
    pseudo and modifier classes derived from parent selectors.
    @modifier: --mutate
    @usage:

    .bar {
         background: public(white);
    }

    1. Pseudo-class

    .foo:hover .bar {
       background: --mutate(grey);
    }

    2. Modifier class

    .foo.foo--withError .bar {
       background: --mutate(red);
    }

*/
@function public($value) {
    @return append($value, #{'/* public */'});
}

/**
    @type: Bound
    @description: Bound properties are scoped within the breakpoints
    they are defined. A bound type can wrap other types.
    @args: CSS value or <Typed>CSS value.
    @usage:

    1. CSS value

    .pow {
        @media(max-width: 500px) {
            font-size: bound(12px);
        }

        @media(min-width: 500px) {
            font-size: bound(16px);
        }
    }

    2. <Typed>CSS value

    .bar {
        @media(max-width: 500px) {
            font-size: bound(immutable(12px));
        }

        @media(min-width: 500px) {
            font-size: bound(protected(12px));
        }
    }

    From zero to 500px the font-size of `.bar` is immutable. It
    cannot be modified within the breakpoint boundary.

    After 500px the font-size of `.bar` is protected. It would
    therefore be legal to override the font-size from a pseudo-class:

    .bar:hover {
        @media(min-width: 500px) {
           font-size: --override(green);
       }
    }

*/
@function bound($value) {
    @return append($value, #{'/* bound */'});
}

/**
    @type: Theme
    @description: The value of Theme properties are changeable,
    they depend on the active theme. A theme type can wrap other
    types.
    @args: CSS value or <Typed>CSS value.
    @depreciate: I think this is better suited with a variable type.
    @usage:

    1. CSS value

    button {
        background: theme(@buttonBg); // value of background depends on theme
    }

    2. <Typed>CSS value

    button {
        background: theme(immutable(@buttonBg));
    }

    Decide how much value this type adds... if any? This could equally
    be handled with a new variable type (see `variables.scss`), i.e:

    $buttonBg: theme(red);
*/
@function theme($value) {
    @return append($value, #{'/* theme */'});
}
