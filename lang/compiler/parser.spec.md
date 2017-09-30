# Parser

Defining the mono AST - WIP.

## Rule-set

**`geo`**: rule-set location info. Contains:
- *cascadePosition*: position of rule-set in the global cascade
- *startLine*: line number where rule-set starts
- *endLine*: line number where rule-set ends

**`type`**: the rule-set type. Can be:
- RULE_SET i.e: `span.icon {}`
- INFERRED_RULE_SET i.e: `span.icon<immutable> {}`
- GROUPED_RULE_SET i.e: `span.icon, svg {}`
  - note: grouped rule-set can contain zero or more inferred rule-sets, i.e: `span.icon<immutable>, svg {}`

**`selector`**: CSS selector info. Contains:
- *rawSelector*: the selector i.e: `span.icon`
- *specificityScore*: selectors specificity strength.
  - used for cases involving illegal overrides, this helps determine which rule-set is overriding the other.
- *elementType:* type of HTML element the selector targets.
- *inferredType*: Used by INFERRED_RULE_SET. Contains type inferred by the rule-set i.e: `immutable`

**`selectors`**: Used by GROUPED_RULE_SET. Array containing each {selector}

**`declarations`**: array containing each {declaration}

## Media-query

**`geo`**: media-query location info. Contains:
- *startLine*: line number where rule-set starts
- *endLine*: line number where rule-set ends

**`type`**: media type. Can be:
- all
- print
- screen
- speech

**`feature`**: feature type. Can be:
- min-width
- max-width
- min-height
- max-height
- ➕ plus [many more](https://developer.mozilla.org/en-US/docs/Web/CSS/@media#Media_features)

**`ruleSets`**: array containing each {rule-set}

### Comment

**`geo`**: comment location info. Contains:
- *startLine*: line number where rule-set starts
- *endLine*: line number where rule-set ends

**`type`**: the comment type. Can be:
- single line
- multi-line

## Font face
*For now just store font-face location info, can't see what else is needed*

**`geo`**: font-face location info. Contains:
- *startLine*: line number where rule-set starts
- *endLine*: line number where rule-set ends

## Keyframe
*For now just store keyframe location info, can't see what else is needed*

**`geo`**: font-face location info. Contains:
- *startLine*: line number where rule-set starts
- *endLine*: line number where rule-set ends

## Declaration

**`geo`**: declaration location info. Contains:
- *line*: declaration line number

**`property`**: CSS property i.e `font-size`

**`value`**: CSS value i.e `font-size`

**`notion`**: Mono notion (if any). Can be:
- type i.e: `protected`
- modifier i.e: `@override`
- motive i.e: `?patch('ENG-123')`

