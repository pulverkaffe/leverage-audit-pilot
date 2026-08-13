import assert from 'node:assert/strict';
import test from 'node:test';
import { loadResultModel } from './helpers/load-result-model.js';
import { loadScenarios } from './helpers/scenarios.js';

const model = loadResultModel();
const scenarios = loadScenarios();
const questionIds = model.questions.map(question => question.id);
const dimensionNames = [
  'Beslut och mandat',
  'Problemlösning och ansvar',
  'Operativ självständighet',
  'Organisationsdesign',
  'Kunskapsberoende'
];
const profileNames = [
  'Självständig organisation',
  'Växande beroende',
  'Central ledare',
  'Operativ flaskhals'
];

test('the validation suite contains eight scenarios', () => {
  assert.equal(scenarios.length, 8);
  assert.equal(new Set(scenarios.map(scenario => scenario.id)).size, 8);
});

test('the live audit still contains the expected 25 question IDs', () => {
  assert.deepEqual(questionIds, [
    'C1', 'C2', 'C3', 'C4',
    'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12',
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9'
  ]);
});

for (const scenario of scenarios) {
  test(`${scenario.id} has a valid answer for every live question`, () => {
    assert.deepEqual(Object.keys(scenario.answers).sort(), [...questionIds].sort());

    for (const question of model.questions) {
      const answer = scenario.answers[question.id];
      const validValues = question.options.map(option => option.value);

      if (question.type === 'multi') {
        assert.ok(Array.isArray(answer) && answer.length > 0, `${question.id} must be a non-empty array`);
        assert.equal(new Set(answer).size, answer.length, `${question.id} must not contain duplicates`);
        for (const value of answer) {
          assert.ok(validValues.includes(value), `${question.id} contains invalid option ${value}`);
        }
        if (answer.includes(7)) assert.deepEqual(answer, [7], 'M11 "Inget av ovanstående" must stand alone');
      } else {
        assert.ok(validValues.includes(answer), `${question.id} contains invalid option ${answer}`);
      }
    }
  });

  test(`${scenario.id} declares a valid expected profile and dimension contract`, () => {
    assert.ok(profileNames.includes(scenario.expected.profile));
    assert.ok(Array.isArray(scenario.expected.strongDimensions));
    assert.ok(Array.isArray(scenario.expected.weakDimensions));

    const declared = [...scenario.expected.strongDimensions, ...scenario.expected.weakDimensions];
    for (const dimension of declared) assert.ok(dimensionNames.includes(dimension), `Unknown dimension: ${dimension}`);
    assert.equal(new Set(declared).size, declared.length, 'Strong and weak dimensions must be disjoint');
  });
}
