# Parser

Defining the mono AST - WIP.

## Rule-set

**`geo`**: rule-set location info. Contains:
- cascadePosition: position of rule-set in the global cascade
- startLine: line number where rule-set starts
- endLine: line number where rule-set ends

**`type`**: the rule-set type. Can be:
- RULE_SET *i.e:* `span.icon {}`
- INFERRED_RULE_SET *i.e:* `span.icon<immutable> {}`
- GROUPED_RULE_SET *i.e:* `span.icon, svg {}`
  - *note: grouped rule-set can contain zero or more inferred rule-sets, i.e: `span.icon<immutable>, svg {}`*

**`declarations`**: array containing each {declaration}

**`selector`**: CSS selector info. Contains:
- rawSelector: the selector *i.e:* `span.icon`
- specificityScore: selectors specificity strength.
  - *used for cases involving illegal overrides, this helps determine which rule-set is overriding the other.*
- elementType: type of HTML element the selector targets.

**`selectors`**: Used by GROUPED_RULE_SET. Array containing each {selector}

## Media-query
## Font face
## Keyframe
## Comment
