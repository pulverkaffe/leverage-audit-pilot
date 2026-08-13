import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const TESTS_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REPO_ROOT = path.dirname(TESTS_DIR);
const APP_PATH = path.join(REPO_ROOT, 'public', 'app.js');
const RESULT_MODEL_PATH = path.join(REPO_ROOT, 'public', 'result-model-v2.js');
const HOOK_ANCHOR = '  // Resume completed audits directly to result, otherwise show welcome.';

function createContext() {
  const storage = new Map();
  const context = {
    URLSearchParams,
    console,
    crypto: { randomUUID: () => '00000000-0000-4000-8000-000000000000' },
    document: { getElementById: () => ({}) },
    location: { pathname: '/', search: '' },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      removeItem: key => storage.delete(key),
      setItem: (key, value) => storage.set(key, String(value))
    },
    __LEVERAGE_AUDIT_TEST_MODE__: true
  };
  context.globalThis = context;
  return vm.createContext(context);
}

function instrument(source) {
  const occurrences = source.split(HOOK_ANCHOR).length - 1;
  if (occurrences !== 1) {
    throw new Error(`Expected one result-model hook anchor in public/app.js, found ${occurrences}.`);
  }

  return source.replace(HOOK_ANCHOR, `  if (globalThis.__LEVERAGE_AUDIT_TEST_MODE__) {
    globalThis.__LEVERAGE_AUDIT_TEST_HOOKS__ = {
      questions,
      evaluate(answers) {
        state.answers = answers;
        const diagnostic = makeDiagnostic();
        return {
          diagnostic,
          profile: resultProfile(diagnostic),
          dimensions: resultDimensions(diagnostic)
        };
      }
    };
    return;
  }

${HOOK_ANCHOR}`);
}

function inflateAnswers(questions, fixtureAnswers) {
  return Object.fromEntries(questions.map(question => {
    const supplied = fixtureAnswers[question.id];
    if (question.type === 'multi') {
      const labels = supplied.map(value => question.options.find(option => option.value === value)?.label);
      return [question.id, { values: [...supplied], labels }];
    }

    const optionIndex = question.options.findIndex(option => option.value === supplied);
    const option = question.options[optionIndex];
    return [question.id, {
      label: option.label,
      missing: Boolean(option.missing),
      optionIndex,
      value: option.value
    }];
  }));
}

export function loadResultModel() {
  const context = createContext();
  vm.runInContext(fs.readFileSync(RESULT_MODEL_PATH, 'utf8'), context, { filename: RESULT_MODEL_PATH });
  const source = instrument(fs.readFileSync(APP_PATH, 'utf8'));
  vm.runInContext(source, context, { filename: APP_PATH });

  const hooks = context.__LEVERAGE_AUDIT_TEST_HOOKS__;
  if (!hooks) throw new Error('Could not load result-model test hooks.');

  return {
    questions: [...hooks.questions],
    evaluate(fixtureAnswers) {
      const answers = inflateAnswers(hooks.questions, fixtureAnswers);
      const result = hooks.evaluate(answers);
      return {
        ...result,
        v2: context.LeverageAuditResultModel.evaluate(answers)
      };
    }
  };
}
