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
  'Organisationens självständighet',
  'Organisationsdesign',
  'Kunskapsberoende'
];
const profileNames = [
  'Självständig organisation',
  'Växande beroende',
  'Central ledare',
  'Operativ flaskhals'
];

const lockedQuestionText = {
  C1: 'Vilken roll beskriver dig bäst?',
  C2: 'Ungefär hur många personer arbetar i den del av organisationen som du leder?',
  C3: 'Hur många personer rapporterar direkt till dig?',
  C4: 'Hur har antalet personer i din del av organisationen förändrats under de senaste 12 månaderna?',
  M1: 'Under en vanlig tvåveckorsperiod, hur ofta ber någon dig fatta ett beslut som du tycker att personen eller teamet borde kunna fatta själv?',
  M2: 'Under en vanlig tvåveckorsperiod, hur ofta ber någon dig godkänna ett beslut som personen egentligen har rätt att fatta själv?',
  M3: 'Under en vanlig tvåveckorsperiod, hur ofta blir ett viktigt beslut försenat med minst en arbetsdag främst för att du inte är tillgänglig?',
  M4: 'Under en vanlig tvåveckorsperiod, hur ofta kommer en fråga eller uppgift tillbaka till dig trots att du redan har gjort det tydligt vem som ansvarar för den?',
  M5: 'Under en vanlig tvåveckorsperiod, hur ofta tog du själv över ett problem eller en uppgift som redan hade en tydlig ägare?',
  M6: 'Under en vanlig tvåveckorsperiod, hur ofta löste du ett problem åt en person eller ett team som du tidigare hade hjälpt att lösa samma typ av problem?',
  M7: 'Under en vanlig tvåveckorsperiod, hur ofta behövde du själv gå in och lösa en prioriteringskonflikt eller avvägning mellan personer, team eller funktioner som inte kunde komma vidare utan dig?',
  M8: 'Under en vanlig tvåveckorsperiod, i hur många möten deltog du främst för att gruppen behövde din auktoritet för att fatta beslut, lösa oenighet eller hålla fast vid en gemensam riktning?',
  M9: 'Under en vanlig tvåveckorsperiod, hur ofta stod arbete som någon annan ansvarade för stilla i väntan på din granskning, återkoppling eller ditt godkännande?',
  M10: 'Tänk på den senaste gången under de senaste sex månaderna då du var i stort sett helt otillgänglig för arbetet i minst två arbetsdagar. När du kom tillbaka, vad hade hänt?',
  M11: 'Om du från och med imorgon var helt otillgänglig i tio arbetsdagar, vilka delar av arbetet skulle sannolikt märkbart tappa tempo eller kvalitet?',
  M12: 'Under en vanlig arbetsvecka, ungefär hur många timmar lägger du på arbete som någon annan i organisationen rimligen skulle kunna ansvara för med acceptabel kvalitet och risk?',
  H1: 'När det gäller viktiga återkommande beslut i din del av organisationen, hur ofta är det tydligt redan innan frågan uppstår vem som har rätt att fatta det slutliga beslutet?',
  H2: 'När ett beslut ligger nära gränsen för någons mandat, hur ofta är det tydligt när personen ska avgöra frågan själv och när den ska eskaleras?',
  H3: 'När ett viktigt område i verksamheten underpresterar, hur ofta är det direkt tydligt vem som ansvarar för resultatet?',
  H4: 'För hur stor andel av de viktigaste ansvarsområdena i din del av organisationen finns det minst en person som du bedömer kan hantera normala beslut och problem i tio arbetsdagar utan löpande stöd från dig?',
  H5: 'Under en vanlig tvåveckorsperiod, hur ofta behövde någon vända sig till dig främst för att du hade information, historik eller sammanhang som andra behövde för att gå vidare?',
  H6: 'Under en vanlig tvåveckorsperiod, hur ofta behövde någon ditt godkännande för resurser, budget eller prioriteringar inom ett område som personen själv ansvarar för?',
  H7: 'När två personer eller team med olika mål behöver göra en viktig avvägning, hur ofta finns det ett fungerande sätt för dem att lösa frågan utan att du behöver avgöra den?',
  H8: 'Under en vanlig tvåveckorsperiod, när någon tog upp en beslutsfråga som du ansåg låg inom personens eget mandat, hur ofta slutade det med att personen själv fattade beslutet?',
  H9: 'Tänk på den senaste gången under de senaste tre månaderna då någon fattade ett beslut inom sitt mandat som du själv skulle ha fattat annorlunda, men som ändå låg inom acceptabla gränser för risk och kvalitet. Hur agerade du?'
};

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

test('all 25 locked question texts are byte-for-byte unchanged', () => {
  assert.deepEqual(Object.fromEntries(model.questions.map(question => [question.id, question.text])), lockedQuestionText);
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
