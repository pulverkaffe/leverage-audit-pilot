import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCENARIO_DIR = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'scenarios');

export function loadScenarios() {
  return fs.readdirSync(SCENARIO_DIR)
    .filter(name => /^scenario_\d{2}_.+\.json$/.test(name))
    .sort()
    .map(name => JSON.parse(fs.readFileSync(path.join(SCENARIO_DIR, name), 'utf8')));
}
