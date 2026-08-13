# Leverage Audit validation scenarios

The eight JSON files are executable specifications for the validation scenarios agreed for the audit. They deliberately refer to question IDs only; the canonical question text remains in `public/app.js` and is not duplicated or changed here.

Each fixture contains:

- one answer for every one of the 25 live questions (`C1–C4`, `M1–M12`, `H1–H9`),
- the expected profile,
- the dimensions expected to be clearly strong or weak,
- optional profiles that the scenario must not be confused with.

Single-answer values are the option values already used by the application. For scored answers, `0` means the lowest dependency risk and `4` the highest. `M11` remains an array of existing option values; result model v2 converts the number of selected dependency areas to a 0–4 dimension signal without changing the question or stored answer. Context values (`C1–C4`) are existing option values, not scores.

`npm test` runs two layers:

1. Fixture-contract tests ensure every scenario stays aligned with all 25 live questions and valid options.
2. Result-model tests execute the current production rule engine and assert all eight expected profile mappings and dimension contracts.

The separate fixture `tests/validation/five-scenario-validation.json` preserves the exact M/H answer patterns from the five-scenario profile validation. Its test suite verifies the consolidated type-based profile priority: operational takeover, healthy intentional centrality, and structural dependency.

The fixture expectations are the long-term validation target. The five dimensions stay unchanged while profile priority can be calibrated against additional evidence.
