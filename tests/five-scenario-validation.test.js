import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { loadResultModel } from './helpers/load-result-model.js';

const model = loadResultModel();
const validationUrl = new URL('./validation/five-scenario-validation.json', import.meta.url);
const scenarios = JSON.parse(fs.readFileSync(validationUrl, 'utf8'));

test('the five-scenario validation set is complete', () => {
  assert.equal(scenarios.length, 5);
  assert.equal(new Set(scenarios.map(scenario => scenario.id)).size, 5);
});

for (const scenario of scenarios) {
  test(`${scenario.name} maps to ${scenario.expectedProfile}`, () => {
    const result = model.evaluate(scenario.answers).v2;
    assert.equal(result.profile.name, scenario.expectedProfile);
  });
}
