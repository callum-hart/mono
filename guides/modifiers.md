/**
    Modifiers --

    Specical functions that modify the value of CSS declarations.

    Modifiers are associated to specific types. They can only be
    used on willing types.

    By design modifier functions are pure. They cannot modify values
    passed as arguments, and cannot add additional CSS properties.
    This gaurentees what styles are applied, which in turn reduces
    side effects.

    Modifiers are prefixed with a double dash --

*/


/**
    @modifier: Override
    @description: Can modify the value of Protected declarations.
    @throws: some error name.
*/
@function --override($protectedProperty) {
    @return append($protectedProperty, #{'/* --override */'});
}

/**
    @modifier: Mutate
    @description: Can modify the value of Public declarations.
    @throws: IllegalMutation
*/
@function --mutate($publicProperty) {
    @return append($publicProperty, #{'/* --mutate */'});
}
