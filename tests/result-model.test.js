import assert from 'node:assert/strict';
import test from 'node:test';
import { loadResultModel } from './helpers/load-result-model.js';
import { loadScenarios } from './helpers/scenarios.js';

const model = loadResultModel();
const scenarios = loadScenarios();

const expectedQuestionMapping = {
  'Beslut och mandat': ['M1', 'M2', 'H1', 'H2', 'H8'],
  'Problemlösning och ansvar': ['M4', 'M5', 'M6', 'M7'],
  'Organisationens självständighet': ['M3', 'M8', 'M9', 'M10', 'M11', 'M12'],
  'Organisationsdesign': ['H3', 'H4', 'H6', 'H7'],
  'Kunskapsberoende': ['M5', 'H5']
};

function dimensionsByTitle(result) {
  return new Map(result.dimensions.map(dimension => [dimension.title, dimension]));
}

test('v2 exposes the locked five-dimension question mapping', () => {
  const result = model.evaluate(scenarios[0].answers).v2;
  const actual = JSON.parse(JSON.stringify(
    Object.fromEntries(result.dimensions.map(dimension => [dimension.title, dimension.questionIds]))
  ));
  assert.deepEqual(actual, expectedQuestionMapping);
});

test('M11 contributes an organization-independence signal without changing the question', () => {
  const independent = model.evaluate(scenarios.find(scenario => scenario.id === 'independent').answers).v2;
  const bottleneck = model.evaluate(scenarios.find(scenario => scenario.id === 'founder_bottleneck').answers).v2;
  const getDimension = result => result.dimensions.find(dimension => dimension.title === 'Organisationens självständighet');

  assert.equal(getDimension(independent).indicators.length, 0);
  assert.ok(getDimension(bottleneck).indicators.includes('M11'));
});

for (const scenario of scenarios) {
  test(`${scenario.id} maps to ${scenario.expected.profile}`, () => {
    const result = model.evaluate(scenario.answers);
    assert.equal(result.profile.name, scenario.expected.profile);
    assert.equal(result.v2.profile.name, scenario.expected.profile);
    for (const forbidden of scenario.expected.mustNotProfile ?? []) {
      assert.notEqual(result.profile.name, forbidden);
    }
  });

  test(`${scenario.id} maps every expected strong and weak dimension`, () => {
    const result = model.evaluate(scenario.answers).v2;
    const actual = dimensionsByTitle(result);

    for (const name of scenario.expected.strongDimensions) {
      assert.equal(actual.get(name)?.level, 'strong', `${name} should be strong`);
      assert.equal(actual.get(name)?.tone, 'positive', `${name} should have a positive result block`);
    }
    for (const name of scenario.expected.weakDimensions) {
      assert.ok(
        ['developing', 'constrained', 'critical'].includes(actual.get(name)?.level),
        `${name} should surface dependency`
      );
      assert.ok(['watch', 'elevated', 'high'].includes(actual.get(name)?.tone));
    }
  });

  test(`${scenario.id} prepares complete result blocks`, () => {
    const result = model.evaluate(scenario.answers).v2;
    assert.equal(result.version, '2.0');
    assert.equal(result.resultBlocks.profile.name, scenario.expected.profile);
    assert.equal(result.resultBlocks.dimensions.length, 5);
    assert.ok(result.resultBlocks.primaryObservation.length > 0);
    assert.ok(result.resultBlocks.recommendedFocus.length > 0);
  });
}
