(() => {
  'use strict';

  const VERSION = '0.1-cloudflare-pilot';
  const STORAGE_KEY = 'leverageAuditPilotV01';

  const F5 = [
    { label: '0 gånger', value: 0 },
    { label: '1–2 gånger', value: 1 },
    { label: '3–5 gånger', value: 2 },
    { label: '6–10 gånger', value: 3 },
    { label: '11 eller fler gånger', value: 4 }
  ];

  const P5 = [
    { label: 'Nästan aldrig', value: 4 },
    { label: 'Sällan', value: 3 },
    { label: 'Ungefär hälften av gångerna', value: 2 },
    { label: 'Oftast', value: 1 },
    { label: 'Nästan alltid', value: 0 }
  ];

  const C5 = [
    { label: '0–20 %', value: 4 },
    { label: '21–40 %', value: 3 },
    { label: '41–60 %', value: 2 },
    { label: '61–80 %', value: 1 },
    { label: '81–100 %', value: 0 }
  ];

  const T5 = [
    { label: 'Mindre än 2 timmar', value: 0 },
    { label: '2–5 timmar', value: 1 },
    { label: '6–10 timmar', value: 2 },
    { label: '11–15 timmar', value: 3 },
    { label: '16+ timmar', value: 4 }
  ];

  const questions = [
    { id: 'C1', section: 'Kontext', type: 'single', scored: false, text: 'Vilken roll beskriver dig bäst?', options: [
      'Founder/ägare och vd', 'Anställd vd', 'Annan C-level-roll', 'Affärsområdes- eller divisionschef', 'Funktionschef', 'Annan senior ledarroll'
    ].map((label, i) => ({ label, value: i })) },
    { id: 'C2', section: 'Kontext', type: 'single', scored: false, text: 'Ungefär hur många personer arbetar i den del av organisationen som du leder?', options: [
      '1–14', '15–29', '30–59', '60–149', '150–499', '500+'
    ].map((label, i) => ({ label, value: i })) },
    { id: 'C3', section: 'Kontext', type: 'single', scored: false, text: 'Hur många personer rapporterar direkt till dig?', options: [
      '1–3', '4–6', '7–9', '10–12', '13+'
    ].map((label, i) => ({ label, value: i })) },
    { id: 'C4', section: 'Kontext', type: 'single', scored: false, text: 'Hur har antalet personer i den del av organisationen du leder förändrats under de senaste 12 månaderna?', options: [
      'Minskat', 'Ungefär oförändrat', 'Ökat med upp till 25 %', 'Ökat med 26–50 %', 'Ökat med mer än 50 %', 'Vet inte'
    ].map((label, i) => ({ label, value: i })) },

    { id: 'M1', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under de senaste två veckorna, hur ofta bad någon dig fatta ett beslut som du bedömde låg inom personens eller teamets normala ansvarsområde?', options: F5 },
    { id: 'M2', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under de senaste två veckorna, hur ofta bad någon dig bekräfta eller godkänna ett beslut som personen formellt eller praktiskt hade mandat att fatta själv?', options: F5 },
    { id: 'M3', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under de senaste två veckorna, hur ofta väntade ett viktigt beslut minst en arbetsdag främst därför att du inte var tillgänglig?', options: F5 },
    { id: 'M4', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under de senaste två veckorna, hur ofta kom en fråga tillbaka till dig efter att du tidigare hade lämnat tydligt ansvar för den till någon annan?', options: F5 },
    { id: 'M5', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under de senaste två veckorna, hur ofta tog du själv över ett problem eller en uppgift som redan hade en tydlig ägare?', options: F5 },
    { id: 'M6', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under de senaste två veckorna, hur ofta löste du ett problem åt en person eller ett team när du tidigare hade hjälpt dem att lösa samma typ av problem?', options: F5 },
    { id: 'M7', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under de senaste två veckorna, hur ofta behövde du själv lösa en prioriteringskonflikt eller trade-off mellan två personer, team eller funktioner som de inte kunde lösa utan dig?', options: F5 },
    { id: 'M8', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under de senaste två veckorna, i hur många möten var en huvudanledning till din närvaro att gruppen behövde din auktoritet för att fatta beslut, lösa oenighet eller hålla riktning?', options: [
      { label: '0 möten', value: 0 }, { label: '1 möte', value: 1 }, { label: '2–3 möten', value: 2 }, { label: '4–6 möten', value: 3 }, { label: '7+ möten', value: 4 }
    ] },
    { id: 'M9', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under de senaste två veckorna, hur ofta stod arbete som andra ägde stilla i väntan på din review, feedback eller sign-off?', options: F5 },
    { id: 'M10', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Tänk på den senaste gången under de senaste sex månaderna då du var så gott som helt otillgänglig för arbetet i minst två arbetsdagar. När du kom tillbaka, vad hade hänt?', options: [
      { label: 'Verksamheten hade i stort sett fortsatt utan att viktiga frågor väntade på mig.', value: 0 },
      { label: 'Några få frågor hade väntat.', value: 1 },
      { label: 'Flera viktiga frågor eller beslut hade väntat.', value: 2 },
      { label: 'En betydande mängd viktigt arbete eller beslut hade väntat.', value: 3 },
      { label: 'Delar av verksamheten hade tydligt tappat fart eller stannat.', value: 4 },
      { label: 'Jag har inte varit så otillgänglig under de senaste sex månaderna.', value: null, missing: true }
    ] },
    { id: 'M11', section: 'Vad händer i praktiken?', type: 'multi', scored: false, text: 'Om du från och med imorgon var helt otillgänglig i tio arbetsdagar, vilka delar skulle sannolikt tappa tydligt tempo eller kvalitet? Välj alla som gäller.', options: [
      'Återkommande operativa beslut', 'Prioriteringar och resursavvägningar', 'Tvärfunktionell koordinering', 'Problemlösning och undantag', 'Personal- och bemanningsfrågor', 'Kund- eller kommersiella beslut inom mitt ansvarsområde', 'Leverans eller kvalitet', 'Inget av ovanstående', 'Annat'
    ].map((label, i) => ({ label, value: i })) },
    { id: 'M12', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under en normal arbetsvecka, ungefär hur många timmar lägger du på arbete som någon annan i organisationen rimligen skulle kunna äga med acceptabel kvalitet och risk?', options: T5 },

    { id: 'H1', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'För viktiga återkommande beslut i din del av organisationen: hur ofta är det tydligt redan innan frågan uppstår vem som har rätt att fatta slutbeslutet?', options: P5 },
    { id: 'H2', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'När ett beslut ligger nära gränsen för någons mandat: hur ofta är det tydligt när personen ska avgöra själv och när frågan ska eskaleras?', options: P5 },
    { id: 'H3', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'När ett viktigt återkommande område underpresterar: hur ofta är det omedelbart tydligt vilken person som äger utfallet?', options: P5 },
    { id: 'H4', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'För hur stor andel av de viktigaste ansvarsområdena under dig finns minst en person som du bedömer kan hantera normala beslut och problem under tio arbetsdagar utan löpande stöd från dig?', options: C5 },
    { id: 'H5', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'Under de senaste två veckorna, hur ofta kom en fråga till dig främst därför att du satt på information, historik eller kontext som andra behövde för att gå vidare?', options: F5 },
    { id: 'H6', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'Under de senaste två veckorna, hur ofta behövde någon ditt personliga godkännande för resurser, budget eller prioriteringar inom ett område som personen själv ansvarar för?', options: F5 },
    { id: 'H7', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'När två personer eller team med olika mål behöver göra en viktig trade-off: hur ofta finns en fungerande mekanism för att lösa frågan utan att du behöver bli slutlig integrator?', options: P5 },
    { id: 'H8', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'Under de senaste två veckorna, när någon tog upp ett beslut som du bedömde låg inom personens eget mandat: hur ofta slutade situationen med att personen själv fattade slutbeslutet?', options: [
      ...P5,
      { label: 'Inget sådant tillfälle', value: null, missing: true }
    ] },
    { id: 'H9', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'Tänk på den senaste gången under de senaste tre månaderna då någon fattade ett beslut inom sitt mandat som du själv skulle ha fattat annorlunda, men där beslutet ändå låg inom acceptabel risk och kvalitet. Vad hände?', options: [
      { label: 'Jag ändrade eller tog över beslutet.', value: 4 },
      { label: 'Jag bad personen ändra beslutet.', value: 3 },
      { label: 'Vi diskuterade det och fattade i praktiken slutbeslutet tillsammans.', value: 2 },
      { label: 'Jag gav min syn, men lät personen fatta slutbeslutet.', value: 1 },
      { label: 'Jag lät beslutet stå utan att kräva någon förändring.', value: 0 },
      { label: 'Jag minns ingen sådan situation under perioden.', value: null, missing: true }
    ] }
  ];

  const sectionIntros = {
    'Kontext': {
      title: 'Först: din kontext',
      text: 'Svaren behöver tolkas utifrån vilken del av organisationen du leder. De här frågorna används som kontext – inte för att bedöma dig.'
    },
    'Vad händer i praktiken?': {
      title: 'Vad händer i praktiken?',
      text: 'Utgå så långt det går från de senaste två veckorna. Vi är mer intresserade av faktiska händelser än av hur organisationen är tänkt att fungera.'
    },
    'Vad kan ligga bakom?': {
      title: 'Vad kan ligga bakom?',
      text: 'De sista frågorna hjälper oss att formulera möjliga förklaringar. De fastställer inte orsaken – de hjälper oss att veta vad som är värt att undersöka.'
    }
  };

  const state = loadState();
  let screen = state.screen || 'welcome';
  let qIndex = Number.isInteger(state.qIndex) ? state.qIndex : 0;
  let sectionShown = state.sectionShown || {};
  let screenStartedAt = Date.now();

  const app = document.getElementById('app');
  const participantFooter = document.getElementById('participantFooter');
  const participantId = getParticipantId();
  const submissionId = getSubmissionId();
  participantFooter.textContent = `Pilot-ID: ${participantId}`;

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { answers: {}, timings: {}, startedAt: null };
    } catch (_) {
      return { answers: {}, timings: {}, startedAt: null };
    }
  }

  function saveState() {
    state.screen = screen;
    state.qIndex = qIndex;
    state.sectionShown = sectionShown;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getParticipantId() {
    const params = new URLSearchParams(location.search);
    const pid = params.get('pid');
    if (pid) {
      state.participantId = pid;
      saveState();
      return pid;
    }
    if (state.participantId) return state.participantId;
    const id = `LA-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    state.participantId = id;
    saveState();
    return id;
  }

  function getSubmissionId() {
    if (state.submissionId) return state.submissionId;
    const id = (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function')
      ? globalThis.crypto.randomUUID()
      : `sub-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    state.submissionId = id;
    saveState();
    return id;
  }

  function optionLabel(question, stored) {
    if (stored == null) return null;
    if (question.type === 'multi') {
      return (stored.labels || []).join(', ');
    }
    return stored.label;
  }

  function recordTiming(key) {
    const now = Date.now();
    const seconds = Math.max(0, Math.round((now - screenStartedAt) / 1000));
    if (!state.timings) state.timings = {};
    state.timings[key] = (state.timings[key] || 0) + seconds;
    screenStartedAt = now;
  }

  function renderWelcome() {
    screen = 'welcome';
    saveState();
    app.innerHTML = `
      <section class="card">
        <div class="eyebrow">Leverage Audit · Pilot</div>
        <h1>Hur beroende är din organisation av dig?</h1>
        <p class="lede">Auditen hjälper dig att se var beslut, problem och arbete fortfarande behöver gå genom dig – och var organisationen skulle kunna fungera mer självständigt.</p>
        <div class="notice">
          <strong>Mindre involvering är inte alltid bättre.</strong><br>
          Vissa beslut ska ligga hos dig. Vi försöker identifiera var organisationen verkar vara mer beroende av dig än vad rollen eller situationen kräver.
        </div>
        <p class="muted">Svara utifrån den del av organisationen som du leder. När vi frågar om en vanlig tvåveckorsperiod menar vi två representativa arbetsveckor – inte semester, kris eller en ovanligt intensiv period. Om en exakt siffra är svår, välj din bästa uppskattning.</p>
        <label class="consent">
          <input type="checkbox" id="consentCheck" ${state.consent ? 'checked' : ''} />
          <span><strong>Pilotmedgivande.</strong> Mina svar får användas för att förbättra Leverage Audit. Jag lämnar inga känsliga personuppgifter i testet.</span>
        </label>
        <div class="btn-row">
          <button class="btn btn-primary" id="startBtn" ${state.consent ? '' : 'disabled'}>${state.startedAt ? 'Fortsätt piloten' : 'Starta – cirka 5–8 min'}</button>
          ${state.startedAt ? '<button class="btn btn-secondary" id="restartBtn">Börja om</button>' : ''}
        </div>
        <p class="small muted">Pilot-ID: ${escapeHtml(participantId)}</p>
      </section>`;

    const consent = document.getElementById('consentCheck');
    const startBtn = document.getElementById('startBtn');
    consent.addEventListener('change', () => {
      state.consent = consent.checked;
      startBtn.disabled = !consent.checked;
      saveState();
    });
    startBtn.addEventListener('click', () => {
      if (!state.startedAt) state.startedAt = new Date().toISOString();
      screen = 'questions';
      saveState();
      renderCurrentQuestion(true);
    });
    const restart = document.getElementById('restartBtn');
    if (restart) restart.addEventListener('click', resetAudit);
  }

  function maybeRenderSectionIntro() {
    const q = questions[qIndex];
    if (!q) return false;
    if (sectionShown[q.section]) return false;
    sectionShown[q.section] = true;
    saveState();
    const meta = sectionIntros[q.section];
    app.innerHTML = `
      <div class="progress-wrap">
        <div class="progress-meta"><span>${escapeHtml(q.section)}</span><span>${qIndex} av ${questions.length} besvarade</span></div>
        <div class="progress"><div style="width:${Math.round((qIndex/questions.length)*100)}%"></div></div>
      </div>
      <section class="card section-intro">
        <div class="eyebrow">Nästa del</div>
        <h2>${escapeHtml(meta.title)}</h2>
        <p class="lede">${escapeHtml(meta.text)}</p>
        <div class="btn-row"><button class="btn btn-primary" id="continueSection">Fortsätt</button></div>
      </section>`;
    document.getElementById('continueSection').addEventListener('click', () => {
      recordTiming(`section:${q.section}`);
      renderQuestion(q);
    });
    return true;
  }

  function renderCurrentQuestion(useSectionIntro = false) {
    screen = 'questions';
    saveState();
    if (qIndex >= questions.length) return finishAudit();
    screenStartedAt = Date.now();
    if (useSectionIntro && maybeRenderSectionIntro()) return;
    renderQuestion(questions[qIndex]);
  }

  function renderQuestion(q) {
    screenStartedAt = Date.now();
    const stored = state.answers[q.id];
    const progress = Math.round((qIndex / questions.length) * 100);
    const optionsHtml = q.options.map((opt, i) => {
      const selected = q.type === 'multi'
        ? Boolean(stored && stored.values && stored.values.includes(opt.value))
        : Boolean(stored && stored.optionIndex === i);
      return `
        <label class="option ${selected ? 'selected' : ''}">
          <input type="${q.type === 'multi' ? 'checkbox' : 'radio'}" name="q" value="${i}" ${selected ? 'checked' : ''} />
          <span class="option-label">${escapeHtml(opt.label)}</span>
        </label>`;
    }).join('');

    app.innerHTML = `
      <div class="progress-wrap">
        <div class="progress-meta"><span>${escapeHtml(q.section)}</span><span>Fråga ${qIndex + 1} av ${questions.length}</span></div>
        <div class="progress"><div style="width:${progress}%"></div></div>
      </div>
      <section class="card question-card">
        <div class="question-number">${q.id}</div>
        <h2 class="question-title">${escapeHtml(q.text)}</h2>
        ${q.id === 'M11' ? '<p class="question-help">Välj alla som gäller.</p>' : ''}
        <div class="options">${optionsHtml}</div>
        <div class="btn-row">
          <button class="btn btn-secondary" id="prevBtn" ${qIndex === 0 ? 'disabled' : ''}>Tillbaka</button>
          <button class="btn btn-primary" id="nextBtn" ${stored ? '' : 'disabled'}>${qIndex === questions.length - 1 ? 'Se resultat' : 'Nästa'}</button>
        </div>
      </section>`;

    const inputs = [...app.querySelectorAll('input[name="q"]')];
    const nextBtn = document.getElementById('nextBtn');

    inputs.forEach(input => input.addEventListener('change', () => {
      if (q.type === 'multi') {
        const selectedIndices = inputs.filter(x => x.checked).map(x => Number(x.value));
        const opts = selectedIndices.map(i => q.options[i]);
        // "Inget av ovanstående" is exclusive.
        const noneIdx = q.options.findIndex(o => o.label === 'Inget av ovanstående');
        if (Number(input.value) === noneIdx && input.checked) {
          inputs.forEach(x => { if (Number(x.value) !== noneIdx) x.checked = false; });
        } else if (input.checked && noneIdx >= 0) {
          inputs[noneIdx].checked = false;
        }
        const finalIndices = inputs.filter(x => x.checked).map(x => Number(x.value));
        const finalOpts = finalIndices.map(i => q.options[i]);
        state.answers[q.id] = {
          values: finalOpts.map(o => o.value),
          labels: finalOpts.map(o => o.label)
        };
        nextBtn.disabled = finalOpts.length === 0;
      } else {
        const i = Number(input.value);
        const opt = q.options[i];
        state.answers[q.id] = {
          optionIndex: i,
          value: opt.value,
          label: opt.label,
          missing: Boolean(opt.missing)
        };
        nextBtn.disabled = false;
      }
      saveState();
      // Update styling without re-rendering so question timing includes the full deliberation period.
      inputs.forEach(x => x.closest('.option')?.classList.toggle('selected', x.checked));
    }));

    document.getElementById('prevBtn').addEventListener('click', () => {
      if (qIndex === 0) return;
      recordTiming(q.id);
      qIndex -= 1;
      renderCurrentQuestion(false);
    });

    nextBtn.addEventListener('click', () => {
      if (!state.answers[q.id]) return;
      recordTiming(q.id);
      qIndex += 1;
      if (qIndex >= questions.length) finishAudit();
      else renderCurrentQuestion(true);
    });
  }

  function resetAudit() {
    localStorage.removeItem(STORAGE_KEY);
    location.href = location.pathname + (new URLSearchParams(location.search).get('pid') ? `?pid=${encodeURIComponent(new URLSearchParams(location.search).get('pid'))}` : '');
  }

  function risk(id) {
    const a = state.answers[id];
    return (!a || a.missing || a.value == null) ? null : Number(a.value);
  }

  function classify(ids, minRequired) {
    const vals = ids.map(risk).filter(v => v != null);
    if (vals.length < minRequired) return { level: 'insufficient', rank: -1, mean: null, vals };
    const ge2 = vals.filter(v => v >= 2).length;
    const ge3 = vals.filter(v => v >= 3).length;
    const has4 = vals.some(v => v === 4);
    const has2plusOther = has4 && vals.filter(v => v >= 2).length >= 2;
    let level = 'limited';
    if (ge3 >= 2 || has2plusOther) level = 'strong';
    else if (ge2 >= 2 || vals.some(v => v >= 3)) level = 'notable';
    else if (vals.filter(v => v === 2).length === 1 && vals.every(v => v <= 2)) level = 'emerging';
    const rank = { limited: 0, emerging: 1, notable: 2, strong: 3 }[level];
    return { level, rank, mean: vals.reduce((a,b)=>a+b,0)/vals.length, vals };
  }

  function makeDiagnostic() {
    const signals = {
      decision: classify(['M1','M2','M3'], 2),
      intervention: classify(['M4','M5','M6'], 2),
      coordination: classify(['M7','M8'], 2),
      availability: classify(['M9','M10'], 2)
    };

    const eligible = Object.entries(signals)
      .filter(([,s]) => s.rank >= 2)
      .map(([key,s]) => ({ key, ...s }))
      .sort((a,b) => (b.rank - a.rank) || ((b.mean ?? 0) - (a.mean ?? 0)));

    const leaderHeld = risk('M12') != null && risk('M12') >= 3 && signals.decision.rank <= 1 && signals.intervention.rank <= 1;
    let primary = null;
    let secondary = null;
    let dual = false;

    if (eligible.length) {
      primary = eligible[0].key;
      if (eligible.length > 1) {
        const a = eligible[0], b = eligible[1];
        if (a.rank === b.rank && Math.abs((a.mean ?? 0) - (b.mean ?? 0)) < 0.35) {
          secondary = b.key;
          dual = true;
        } else if (b.rank >= 2) secondary = b.key;
      }
      if (leaderHeld && !secondary) secondary = 'leaderHeldWork';
    } else if (leaderHeld) {
      primary = 'leaderHeldWork';
    } else {
      primary = 'none';
    }

    const drivers = buildDrivers(signals);
    const contradictions = buildContradictions(signals);
    const localization = state.answers.M11?.labels || [];
    const evidence = buildEvidence(signals);

    return {
      version: VERSION,
      participant_id: participantId,
      signals: Object.fromEntries(Object.entries(signals).map(([k,v]) => [k, { level: v.level, mean: v.mean, values: v.vals }])),
      primary_pattern: primary,
      secondary_pattern: secondary,
      dual_primary: dual,
      executive_attention_cost: state.answers.M12?.label || null,
      executive_attention_risk: risk('M12'),
      localization,
      drivers,
      contradictions,
      evidence
    };
  }

  function relevantManifestCount(ids) {
    return ids.map(risk).filter(v => v != null && v >= 2).length;
  }

  function driverStrength(driverRisks, relevantIds) {
    const vals = driverRisks.filter(v => v != null);
    if (!vals.length) return null;
    const relevantCount = relevantManifestCount(relevantIds);
    const highDrivers = vals.filter(v => v >= 2).length;
    const veryHigh = vals.some(v => v >= 3);
    if (relevantCount >= 2 && (highDrivers >= 2 || veryHigh)) return 'supported';
    if (relevantCount >= 1 && highDrivers >= 1) return 'weak';
    return null;
  }

  function buildDrivers(signals) {
    const out = [];
    const add = (key, label, strength) => { if (strength) out.push({ key, label, strength }); };
    add('decision_authority_ambiguity', 'Otydliga beslut- eller eskaleringsgränser', driverStrength([risk('H1'), risk('H2')], ['M1','M2','M3']));
    add('accountability_ambiguity', 'Otydligt outcome-ansvar', driverStrength([risk('H3')], ['M4','M5','M6']));
    add('capability_constraint', 'Begränsad distribuerad capability', driverStrength([risk('H4')], ['M1','M2','M4','M6','M9','M10']));
    add('information_concentration', 'Information eller kontext är koncentrerad hos dig', driverStrength([risk('H5')], ['M1','M4','M6','M9']));
    add('resource_authority_mismatch', 'Ansvar och resursmandat kan vara separerade', driverStrength([risk('H6')], ['M1','M2','M3']));
    add('coordination_architecture_gap', 'Koordinationsmekanismer kan vara otillräckliga', driverStrength([risk('H7')], ['M7','M8']));
    add('leader_recentralization', 'Ditt eget beteende kan återcentralisera mandat', driverStrength([risk('H8'), risk('H9')], ['M1','M2','M4','M5']));
    return out;
  }

  function buildContradictions(signals) {
    const c = [];
    const authorityVals = [risk('H1'), risk('H2')].filter(v => v != null);
    if (signals.decision.rank >= 2 && authorityVals.length === 2 && authorityVals.every(v => v <= 1)) {
      c.push({ key: 'decision_high_authority_clear', text: 'Beslutsberoendet är högt trots att du rapporterar tydliga decision rights. Otydliga mandat verkar därför inte vara den uppenbara huvudförklaringen.' });
    }
    if (signals.decision.rank <= 1 && signals.intervention.rank <= 1 && risk('M12') >= 3) {
      c.push({ key: 'low_escalation_high_held_work', text: 'Få frågor verkar skickas uppåt, men du rapporterar mycket arbete som någon annan rimligen skulle kunna äga. Det pekar mot leader-held work snarare än klassisk uppåtdelegering.' });
    }
    if (risk('H4') != null && risk('H4') <= 1 && signals.intervention.rank >= 2) {
      c.push({ key: 'capability_high_intervention_high', text: 'Du bedömer capability som relativt stark samtidigt som frågor återkommer till dig. Antingen överskattas capability, eller så får den inte fullt genomslag i praktiken.' });
    }
    const everyday = ['M1','M2','M3','M4','M5','M6','M7','M8','M9'].map(risk).filter(v => v != null);
    const everydayMean = everyday.length ? everyday.reduce((a,b)=>a+b,0)/everyday.length : null;
    if (everydayMean != null && everydayMean <= 1.25 && risk('M10') >= 3) {
      c.push({ key: 'daily_low_absence_high', text: 'Vardagsfrågorna visar låg dependency, men den senaste faktiska frånvaron exponerade betydligt större beroende.' });
    }
    if (signals.coordination.rank >= 2 && risk('H7') != null && risk('H7') <= 1) {
      c.push({ key: 'coordination_high_architecture_strong', text: 'Koordinationsberoendet är högt trots att du rapporterar en fungerande koordinationsmekanism. Beroendet kan därför vara legitimt eller bero på att mekanismen inte fungerar i de svårare fallen.' });
    }
    if (risk('M3') >= 3 && (risk('M1') ?? 9) <= 1 && (risk('M2') ?? 9) <= 1) {
      c.push({ key: 'delay_high_escalation_low', text: 'Viktiga beslut väntar på dig, men de verkar inte huvudsakligen vara beslut som du själv bedömer borde ligga någon annanstans. Det kan vara legitim centralisering.' });
    }
    return c;
  }

  function buildEvidence(signals) {
    const concrete = ['M1','M2','M3','M4','M5','M6','M7','M8','M9'].map(risk).filter(v => v != null && v >= 2).length;
    const actualAbsence = risk('M10') != null;
    let level = 'limited';
    if (actualAbsence && risk('M10') >= 2 && concrete >= 2) level = 'strong-within-self-report';
    else if (concrete >= 3 || (actualAbsence && risk('M10') >= 2)) level = 'moderate';
    else if (concrete >= 1) level = 'some';
    return { level, actual_absence_available: actualAbsence, concrete_signal_count: concrete };
  }

  const patternMeta = {
    decision: {
      name: 'Decision Bottleneck',
      short: 'Beslut och godkännanden är koncentrerade runt dig.',
      explain: 'Dina svar visar ett återkommande mönster där beslut, bekräftelser eller decision throughput behöver gå genom dig. Det säger inte i sig att besluten ligger på fel nivå, men det gör din tillgänglighet till en tydlig del av beslutsflödet.'
    },
    intervention: {
      name: 'Intervention Loop',
      short: 'Frågor som andra äger tenderar att komma tillbaka till dig.',
      explain: 'Mönstret ligger främst i problemlösning och återtagande: ansvar finns hos andra, men frågor återkommer ändå till dig för hjälp, korrigering eller övertagande.'
    },
    coordination: {
      name: 'Coordination Hub',
      short: 'Organisationen använder dig som integrator mellan roller och funktioner.',
      explain: 'Det tydligaste mönstret ligger mellan människor och team snarare än inne i enskilda roller. Din auktoritet behövs återkommande för trade-offs, oenighet eller riktning över gränser.'
    },
    availability: {
      name: 'Availability Dependency',
      short: 'Arbete och beslut påverkas tydligt av om du är tillgänglig.',
      explain: 'Dina svar tyder på att organisationens throughput faller när din tillgänglighet minskar. Auditen kan dock inte ensam avgöra hur stor del av detta beroende som är legitimt.'
    },
    leaderHeldWork: {
      name: 'Leader-Held Work',
      short: 'Organisationen verkar inte primärt skicka arbetet uppåt – du håller själv kvar en betydande del.',
      explain: 'Du rapporterar relativt få klassiska eskaleringar men mycket arbete som någon annan rimligen skulle kunna äga. Leverage-frågan ligger därför mer i vad som fortfarande finns kvar i din roll än i vad teamet skickar tillbaka.'
    },
    none: {
      name: 'No Dominant Dependency Pattern',
      short: 'Auditen hittar inget tydligt koncentrerat dependency-mönster i dina svar.',
      explain: 'Det betyder inte att organisationen är oberoende av dig. Det betyder att de rapporterade situationerna inte ger tillräckligt samstämmiga signaler för att peka ut ett tydligt mönster.'
    }
  };

  function signalSv(level) {
    return ({ limited: 'Begränsad', emerging: 'Framväxande', notable: 'Tydlig', strong: 'Stark', insufficient: 'Otillräcklig data' })[level] || level;
  }

  function observationText(id) {
    const a = state.answers[id];
    if (!a) return null;
    const label = optionLabel(questions.find(q => q.id === id), a);
    const map = {
      M1: `${label}: någon bad dig fatta beslut som du bedömde låg inom personens eller teamets normala ansvar.`,
      M2: `${label}: någon bad om din bekräftelse trots eget mandat.`,
      M3: `${label}: ett viktigt beslut väntade minst en arbetsdag främst för att du inte var tillgänglig.`,
      M4: `${label}: en fråga kom tillbaka efter att ansvar redan hade lämnats till någon annan.`,
      M5: `${label}: du tog själv över ett problem eller en uppgift som redan hade en tydlig ägare.`,
      M6: `${label}: du löste återkommande samma typ av problem åt andra.`,
      M7: `${label}: du behövde lösa en prioriteringskonflikt eller trade-off mellan personer/team.`,
      M8: `${label}: din auktoritet var en huvudanledning till att du behövde vara med i möten.`,
      M9: `${label}: arbete som andra ägde stod stilla i väntan på din review, feedback eller sign-off.`,
      M10: label,
      M12: `${label} per normalvecka uppskattar du går till arbete som någon annan rimligen skulle kunna äga.`
    };
    return map[id] || label;
  }

  function strongestObservations(diagnostic) {
    const idsByPattern = {
      decision: ['M1','M2','M3'], intervention: ['M4','M5','M6'], coordination: ['M7','M8'], availability: ['M9','M10'], leaderHeldWork: ['M12'], none: ['M10','M12']
    };
    const ids = [...(idsByPattern[diagnostic.primary_pattern] || []), ...(idsByPattern[diagnostic.secondary_pattern] || [])];
    const unique = [...new Set(ids)];
    return unique
      .filter(id => risk(id) != null)
      .sort((a,b) => (risk(b) ?? -1) - (risk(a) ?? -1))
      .slice(0,4)
      .map(observationText)
      .filter(Boolean);
  }

  function driverText(driver) {
    const texts = {
      decision_authority_ambiguity: 'Dina svar antyder att det inte alltid är tydligt vem som fattar slutbeslutet eller när en fråga faktiskt ska eskaleras.',
      accountability_ambiguity: 'En möjlig mekanism är att outcome-ansvaret inte alltid är tillräckligt tydligt när ett område underpresterar.',
      capability_constraint: 'En möjlig förklaring är att det saknas tillräcklig distribuerad capability för att normala beslut och problem ska kunna hanteras utan ditt löpande stöd.',
      information_concentration: 'Flera frågor verkar kunna nå dig därför att viktig information, historik eller kontext fortfarande är koncentrerad hos dig.',
      resource_authority_mismatch: 'Ansvar kan ha flyttats längre än resurs- och prioriteringsmandatet, vilket gör att frågor ändå behöver komma tillbaka till dig.',
      coordination_architecture_gap: 'Dina svar är förenliga med att organisationen saknar en tillräckligt fungerande mekanism för att lösa vissa tvärfunktionella trade-offs utan dig.',
      leader_recentralization: 'Det finns en signal om att formellt mandat ibland kan bli smalare i praktiken genom hur beslut återtas eller påverkas.'
    };
    return texts[driver.key];
  }

  function biggestOpportunity(diagnostic) {
    const dKeys = diagnostic.drivers.map(d => d.key);
    switch (diagnostic.primary_pattern) {
      case 'decision':
        if (dKeys.includes('decision_authority_ambiguity')) return 'Identifiera de 3–5 återkommande beslut som oftast når dig och gör gränsen mellan “avgör själv” och “eskalera” explicit.';
        if (dKeys.includes('information_concentration')) return 'Kartlägg vilka beslut som når dig därför att du ensam sitter på kontexten – och gör just den informationen tillgänglig där besluten ska fattas.';
        return 'Välj de återkommande beslut som oftast väntar på dig och avgör vilka som faktiskt kräver din roll och vilka som bara råkar passera dig.';
      case 'intervention':
        return 'Välj de två problemtyper som oftast kommer tillbaka till dig och undersök varför ansvar inte blir faktisk självständighet i just de situationerna.';
      case 'coordination':
        return 'Kartlägg de återkommande tvärfunktionella trade-offs som kräver dig och skilj på dem som kräver ditt omdöme och dem som behöver en bättre koordinationsmekanism.';
      case 'availability':
        return 'Identifiera vad som faktiskt väntar när du är otillgänglig och klassificera varje punkt som legitimt ledarbeslut, informationsberoende eller onödig approval.';
      case 'leaderHeldWork':
        return 'Gör en konkret inventering av ditt återkommande arbete och identifiera vilket ansvar som ligger kvar hos dig främst därför att det alltid har gjort det.';
      default:
        return 'Använd nästa två veckor som observationsperiod: notera varje beslut, problem eller trade-off som verkligen måste gå genom dig och varför.';
    }
  }

  function nextSteps(diagnostic) {
    const steps = [biggestOpportunity(diagnostic)];
    if (diagnostic.contradictions.length) steps.push('Använd motsägelsen i svaren som en Deep Dive-fråga i stället för att försöka välja en enkel förklaring nu.');
    else if (diagnostic.drivers.length) steps.push(`Testa den starkaste hypotesen – ${diagnostic.drivers[0].label.toLowerCase()} – mot 3–5 konkreta händelser från de senaste två veckorna.`);
    else steps.push('Samla 5–10 konkreta exempel på när din uppmärksamhet behövs och kategorisera vad som faktiskt gör din medverkan nödvändig.');
    steps.push('Jämför din egen bild med minst en direktrapporterandes observation innan du gör en större strukturförändring.');
    return steps.slice(0,3);
  }

  function renderResults(diagnostic) {
    screen = 'results';
    state.completedAt = state.completedAt || new Date().toISOString();
    state.diagnostic = diagnostic;
    saveState();

    const primary = patternMeta[diagnostic.primary_pattern];
    const secondary = diagnostic.secondary_pattern ? patternMeta[diagnostic.secondary_pattern] : null;
    const observations = strongestObservations(diagnostic);
    const drivers = diagnostic.drivers.slice(0,2);
    const limitations = [];
    if (diagnostic.contradictions.length) limitations.push(diagnostic.contradictions[0].text);
    if (diagnostic.evidence.level === 'limited' || diagnostic.evidence.level === 'some') limitations.push('Underlaget bygger på relativt få konkreta dependency-signaler. Resultatet bör därför ses som en screening, inte som en fastställd organisationsdiagnos.');
    if (!diagnostic.evidence.actual_absence_available) limitations.push('Du saknade en relevant faktisk frånvaroepisod. Bedömningen av continuity dependency blir därför svagare.');
    if (!limitations.length) limitations.push('Det här är en 5–8 minuters självskattning. Den kan visa ett mönster, men kan inte fastställa om beroendet är legitimt eller exakt vad som orsakar det utan ytterligare data.');

    const signalCards = [
      ['Beslut', diagnostic.signals.decision.level],
      ['Intervention', diagnostic.signals.intervention.level],
      ['Koordinering', diagnostic.signals.coordination.level],
      ['Tillgänglighet', diagnostic.signals.availability.level]
    ].map(([label, level]) => `<div class="signal-card"><div class="signal-label">${label}</div><div class="signal-value">${signalSv(level)}</div><div class="signal-note">Preliminär pilotsignal – inte benchmark.</div></div>`).join('');

    app.innerHTML = `
      <section class="card">
        <div class="result-header">
          <div class="pattern-chip">${diagnostic.dual_primary ? 'Två sammanhängande mönster' : 'Primärt dependency-mönster'}</div>
          <h2>${escapeHtml(primary.name)}${diagnostic.dual_primary && secondary ? ` + ${escapeHtml(secondary.name)}` : ''}</h2>
          <p class="lede">${escapeHtml(primary.short)}${diagnostic.dual_primary && secondary ? ' ' + escapeHtml(secondary.short) : ''}</p>
        </div>

        <div class="signal-grid">${signalCards}</div>

        <div class="section">
          <h3>Vad vi observerade</h3>
          <ul class="obs-list">${observations.length ? observations.map(x => `<li>${escapeHtml(x)}</li>`).join('') : '<li>Inga tillräckligt konkreta högriskobservationer stack ut.</li>'}</ul>
          ${diagnostic.localization.length ? `<p class="small muted"><strong>Var beroendet sannolikt märks:</strong> ${escapeHtml(diagnostic.localization.join(', '))}.</p>` : ''}
        </div>

        <div class="section">
          <h3>Vad mönstret kan betyda</h3>
          <p>${escapeHtml(primary.explain)}</p>
          ${secondary && !diagnostic.dual_primary ? `<p><strong>Sekundär signal:</strong> ${escapeHtml(secondary.name)} – ${escapeHtml(secondary.short)}</p>` : ''}
          ${diagnostic.executive_attention_cost ? `<p><strong>Executive attention cost:</strong> Du uppskattar ${escapeHtml(diagnostic.executive_attention_cost.toLowerCase())} per normalvecka till arbete som någon annan rimligen skulle kunna äga. Auditen fastställer inte hur mycket av tiden som faktiskt går att frigöra.</p>` : ''}
        </div>

        <div class="section">
          <h3>Vad som kan ligga bakom</h3>
          ${drivers.length ? drivers.map(d => `<div class="driver"><div class="driver-title">${escapeHtml(d.label)}</div><div class="driver-strength">${d.strength === 'supported' ? 'Stödd hypotes i pilotlogiken' : 'Svag hypotes – värd att undersöka'}</div><p>${escapeHtml(driverText(d))}</p></div>`).join('') : '<p>Auditen pekar inte ut någon tydlig bakomliggande mekanism. Det är bättre att lämna orsaken öppen än att fylla i den med en gissning.</p>'}
        </div>

        <div class="section">
          <h3>Vad vi inte kan avgöra här</h3>
          <div class="limitation">${limitations.map(x => `<p>${escapeHtml(x)}</p>`).join('')}</div>
        </div>

        <div class="section">
          <h3>Största leverage opportunity</h3>
          <p>${escapeHtml(biggestOpportunity(diagnostic))}</p>
        </div>

        <div class="section">
          <h3>Nästa steg</h3>
          <ol class="obs-list">${nextSteps(diagnostic).map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ol>
        </div>

        <div class="btn-row">
          <button class="btn btn-primary" id="printBtn">Spara / skriv ut resultat</button>
          <button class="btn btn-secondary" id="jsonBtn">Ladda ner pilotdata</button>
          <button class="btn btn-ghost" id="restartBtn">Ny genomföring</button>
        </div>
        <div class="status" id="submitStatus">Försöker spara pilotdata…</div>

        <details class="debug">
          <summary>Pilotverktyg: diagnostic JSON</summary>
          <pre>${escapeHtml(JSON.stringify(diagnostic, null, 2))}</pre>
        </details>
      </section>`;

    document.getElementById('printBtn').addEventListener('click', () => window.print());
    document.getElementById('jsonBtn').addEventListener('click', () => downloadPilotData(diagnostic));
    document.getElementById('restartBtn').addEventListener('click', resetAudit);
    submitToCloudflare(diagnostic);
  }

  function finishAudit() {
    recordTiming('completion');
    qIndex = questions.length;
    const diagnostic = makeDiagnostic();
    renderResults(diagnostic);
  }

  function payload(diagnostic) {
    const completedAt = state.completedAt || new Date().toISOString();
    const startedMs = state.startedAt ? Date.parse(state.startedAt) : null;
    const completedMs = Date.parse(completedAt);
    const duration = startedMs ? Math.max(0, Math.round((completedMs - startedMs)/1000)) : null;
    return {
      version: VERSION,
      submission_id: submissionId,
      participant_id: participantId,
      started_at: state.startedAt,
      completed_at: completedAt,
      duration_seconds: duration,
      answers: state.answers,
      timings: state.timings || {},
      diagnostic
    };
  }

  async function submitToCloudflare(diagnostic) {
    const status = document.getElementById('submitStatus');
    if (!status) return;

    if (state.savedSubmissionId === submissionId) {
      status.textContent = 'Pilotdata sparad i Cloudflare.';
      return;
    }

    const p = payload(diagnostic);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || `HTTP ${response.status}`);
      state.savedSubmissionId = result.submission_id || submissionId;
      saveState();
      status.textContent = 'Pilotdata sparad i Cloudflare.';
    } catch (err) {
      console.error('Cloudflare submission failed', err);
      status.innerHTML = 'Kunde inte spara centralt just nu. <strong>Data finns kvar lokalt</strong> och kan laddas ner med knappen ovan.';
    }
  }

  function downloadPilotData(diagnostic) {
    const data = JSON.stringify(payload(diagnostic), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leverage-audit-${participantId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // Resume completed audits directly to result, otherwise show welcome.
  if (state.completedAt && state.diagnostic) {
    renderResults(state.diagnostic);
  } else {
    renderWelcome();
  }
})();
