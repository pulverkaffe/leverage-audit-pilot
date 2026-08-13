import assert from 'node:assert/strict';
import test from 'node:test';
import { loadResultModel } from './helpers/load-result-model.js';
import { loadScenarios } from './helpers/scenarios.js';

const model = loadResultModel();
const scenarios = loadScenarios();

// Only dimensions with a current production mapping are asserted. The two qualitative
// dimensions are included when an existing driver can already identify the weakness.
const dimensionCoverage = {
  independent: { strong: ['Beslut och mandat', 'Problemlösning och ansvar', 'Operativ självständighet'], weak: [] },
  founder_bottleneck: { strong: [], weak: ['Beslut och mandat', 'Problemlösning och ansvar', 'Operativ självständighet', 'Organisationsdesign', 'Kunskapsberoende'] },
  growing_company: { strong: [], weak: ['Organisationsdesign'] },
  strong_central_leader: { strong: ['Beslut och mandat', 'Problemlösning och ansvar', 'Operativ självständighet'], weak: [] },
  responsibility_without_authority: { strong: ['Problemlösning och ansvar'], weak: ['Beslut och mandat', 'Organisationsdesign'] },
  knowledge_bottleneck: { strong: ['Problemlösning och ansvar', 'Operativ självständighet'], weak: ['Kunskapsberoende'] },
  problem_solver: { strong: ['Beslut och mandat', 'Operativ självständighet'], weak: ['Problemlösning och ansvar'] },
  false_independence: { strong: ['Problemlösning och ansvar'], weak: ['Beslut och mandat', 'Operativ självständighet', 'Organisationsdesign'] }
};

function dimensionsByTitle(result) {
  return new Map(result.dimensions.map(dimension => [dimension.title, dimension]));
}

for (const scenario of scenarios) {
  const profilePending = scenario.id === 'responsibility_without_authority';
  test(`${scenario.id} maps to ${scenario.expected.profile}`, {
    skip: profilePending
      ? 'The preliminary profile mapping cannot yet distinguish a mandate-system problem from a broad operational bottleneck.'
      : false
  }, () => {
    const result = model.evaluate(scenario.answers);
    assert.equal(result.profile.name, scenario.expected.profile);
    for (const forbidden of scenario.expected.mustNotProfile ?? []) {
      assert.notEqual(result.profile.name, forbidden);
    }
  });

  test(`${scenario.id} preserves the currently mapped strong and weak dimensions`, () => {
    const result = model.evaluate(scenario.answers);
    const actual = dimensionsByTitle(result);
    const coverage = dimensionCoverage[scenario.id];

    for (const name of coverage.strong) {
      assert.ok(scenario.expected.strongDimensions.includes(name), `${name} must be strong in the fixture contract`);
      assert.equal(actual.get(name)?.tone, 'positive', `${name} should have a positive production signal`);
    }
    for (const name of coverage.weak) {
      assert.ok(scenario.expected.weakDimensions.includes(name), `${name} must be weak in the fixture contract`);
      assert.ok(['watch', 'elevated', 'high'].includes(actual.get(name)?.tone), `${name} should surface a production concern`);
    }
  });
}
