# Leverage Audit validation scenarios

The eight JSON files are executable specifications for the validation scenarios agreed for the audit. They deliberately refer to question IDs only; the canonical question text remains in `public/app.js` and is not duplicated or changed here.

Each fixture contains:

- one answer for every one of the 25 live questions (`C1–C4`, `M1–M12`, `H1–H9`),
- the expected profile,
- the dimensions expected to be clearly strong or weak,
- optional profiles that the scenario must not be confused with.

Single-answer values are the option values already used by the application. For scored answers, `0` means the lowest dependency risk and `4` the highest. `M11` is an array of existing option values and remains unscored. Context values (`C1–C4`) are also existing option values, not new scores.

`npm test` runs two layers:

1. Fixture-contract tests ensure every scenario stays aligned with all 25 live questions and valid options.
2. Result-model tests execute the current production rule engine. They assert only mappings that exist today. The exact profile assertion for “Ansvar utan mandat” is explicitly skipped because the preliminary mapping cannot yet distinguish that systemic mandate problem from a general operational bottleneck. No replacement scoring rule is introduced by the test suite.

The fixture expectations are the long-term validation target. As the five-dimension scoring is locked, the coverage table in `tests/result-model.test.js` can be expanded without rewriting the scenarios.
