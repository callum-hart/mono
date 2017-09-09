# Findings

The [proof of concepts](ProofOfConcepts.md) helped expose early flaws, highlight what was/wasn’t useful, and unearth new features / use-cases.

They also provided an insight into how mono improves CSS development, the **key benefits** being:

- **Clarity:** easier to track where styles derive from and why they exist.
- **Predictable:** easier to foresee what impact adding / changing / removing styles will have.
- **Robust:** styles independant of cascade, specificity and uncontrolled overrides make CSS resilient to change.
- **Reusable:** controlled overrides encourage better reuse.
- **Speed:** faster development time, since less time lost in the typical CSS workflow.
- **Maintainable:** easier to maintain (thanks to predictability and robustness).

<p align="center">&ast;&ast;&ast;</p>

An unexpected benefit also emerged. Being a side project meant that monos development time was disjointed. I’d jump in and out of building the example projects - 2 hour chunks of work spread over several weeks, at times days apart.

I found it easier to resume from where I’d left off, and quicker to get back up to speed, since the **styles were easier to understand**. I also felt more **confident to make changes**, since the behavior of CSS was predictable and its **side-effects suppressed**.

I started to think what other factors helped mono escape the typical CSS workflow, and attribute this to:

- **Code is expressive** which makes it easier to understand.
- **Patterns promote consistency** which buys familiarity.
- **Constraints limit uncertainty** which narrows the scope of potential problems.
- **Rules guide workflow** which reduces time making needless decisions, whilst improving consistency.

## What's next?

Release monos compiler!