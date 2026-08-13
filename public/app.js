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
      'Grundare/ägare och vd', 'Anställd vd', 'Annan C-level-roll', 'Affärsområdes- eller divisionschef', 'Funktionschef', 'Annan senior ledarroll'
    ].map((label, i) => ({ label, value: i })) },
    { id: 'C2', section: 'Kontext', type: 'single', scored: false, text: 'Ungefär hur många personer arbetar i den del av organisationen som du leder?', options: [
      '1–14', '15–29', '30–59', '60–149', '150–499', '500+'
    ].map((label, i) => ({ label, value: i })) },
    { id: 'C3', section: 'Kontext', type: 'single', scored: false, text: 'Hur många personer rapporterar direkt till dig?', options: [
      '0', '1–3', '4–6', '7–9', '10–12', '13+'
    ].map((label, i) => ({ label, value: i })) },
    { id: 'C4', section: 'Kontext', type: 'single', scored: false, text: 'Hur har antalet personer i din del av organisationen förändrats under de senaste 12 månaderna?', options: [
      'Minskat', 'Ungefär oförändrat', 'Ökat med upp till 25 %', 'Ökat med 26–50 %', 'Ökat med mer än 50 %', 'Vet inte'
    ].map((label, i) => ({ label, value: i })) },

    { id: 'M1', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under en vanlig tvåveckorsperiod, hur ofta ber någon dig fatta ett beslut som du tycker att personen eller teamet borde kunna fatta själv?', options: F5 },
    { id: 'M2', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under en vanlig tvåveckorsperiod, hur ofta ber någon dig godkänna ett beslut som personen egentligen har rätt att fatta själv?', options: F5 },
    { id: 'M3', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under en vanlig tvåveckorsperiod, hur ofta blir ett viktigt beslut försenat med minst en arbetsdag främst för att du inte är tillgänglig?', options: F5 },
    { id: 'M4', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under en vanlig tvåveckorsperiod, hur ofta kommer en fråga eller uppgift tillbaka till dig trots att du redan har gjort det tydligt vem som ansvarar för den?', options: F5 },
    { id: 'M5', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under en vanlig tvåveckorsperiod, hur ofta tog du själv över ett problem eller en uppgift som redan hade en tydlig ägare?', options: F5 },
    { id: 'M6', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under en vanlig tvåveckorsperiod, hur ofta löste du ett problem åt en person eller ett team som du tidigare hade hjälpt att lösa samma typ av problem?', options: F5 },
    { id: 'M7', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under en vanlig tvåveckorsperiod, hur ofta behövde du själv gå in och lösa en prioriteringskonflikt eller avvägning mellan personer, team eller funktioner som inte kunde komma vidare utan dig?', options: F5 },
    { id: 'M8', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under en vanlig tvåveckorsperiod, i hur många möten deltog du främst för att gruppen behövde din auktoritet för att fatta beslut, lösa oenighet eller hålla fast vid en gemensam riktning?', options: [
      { label: '0 möten', value: 0 }, { label: '1 möte', value: 1 }, { label: '2–3 möten', value: 2 }, { label: '4–6 möten', value: 3 }, { label: '7+ möten', value: 4 }
    ] },
    { id: 'M9', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under en vanlig tvåveckorsperiod, hur ofta stod arbete som någon annan ansvarade för stilla i väntan på din granskning, återkoppling eller ditt godkännande?', options: F5 },
    { id: 'M10', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Tänk på den senaste gången under de senaste sex månaderna då du var i stort sett helt otillgänglig för arbetet i minst två arbetsdagar. När du kom tillbaka, vad hade hänt?', options: [
      { label: 'Verksamheten hade i stort sett fortsatt utan att viktiga frågor väntade på mig.', value: 0 },
      { label: 'Några få frågor hade väntat.', value: 1 },
      { label: 'Flera viktiga frågor eller beslut hade väntat.', value: 2 },
      { label: 'En betydande mängd viktigt arbete eller beslut hade väntat.', value: 3 },
      { label: 'Delar av verksamheten hade tydligt tappat fart eller stannat.', value: 4 },
      { label: 'Jag har inte varit så otillgänglig under de senaste sex månaderna.', value: null, missing: true }
    ] },
    { id: 'M11', section: 'Vad händer i praktiken?', type: 'multi', scored: false, text: 'Om du från och med imorgon var helt otillgänglig i tio arbetsdagar, vilka delar av arbetet skulle sannolikt märkbart tappa tempo eller kvalitet?', options: [
      'Återkommande operativa beslut', 'Prioriteringar och resursavvägningar', 'Samordning mellan team eller funktioner', 'Problemlösning och hantering av undantag', 'Personal- och bemanningsfrågor', 'Kund- eller kommersiella beslut inom mitt ansvarsområde', 'Leverans eller kvalitet', 'Inget av ovanstående', 'Annat'
    ].map((label, i) => ({ label, value: i })) },
    { id: 'M12', section: 'Vad händer i praktiken?', type: 'single', scored: true, text: 'Under en vanlig arbetsvecka, ungefär hur många timmar lägger du på arbete som någon annan i organisationen rimligen skulle kunna ansvara för med acceptabel kvalitet och risk?', options: T5 },

    { id: 'H1', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'När det gäller viktiga återkommande beslut i din del av organisationen, hur ofta är det tydligt redan innan frågan uppstår vem som har rätt att fatta det slutliga beslutet?', options: P5 },
    { id: 'H2', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'När ett beslut ligger nära gränsen för någons mandat, hur ofta är det tydligt när personen ska avgöra frågan själv och när den ska eskaleras?', options: P5 },
    { id: 'H3', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'När ett viktigt område i verksamheten underpresterar, hur ofta är det direkt tydligt vem som ansvarar för resultatet?', options: P5 },
    { id: 'H4', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'För hur stor andel av de viktigaste ansvarsområdena i din del av organisationen finns det minst en person som du bedömer kan hantera normala beslut och problem i tio arbetsdagar utan löpande stöd från dig?', options: C5 },
    { id: 'H5', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'Under en vanlig tvåveckorsperiod, hur ofta behövde någon vända sig till dig främst för att du hade information, historik eller sammanhang som andra behövde för att gå vidare?', options: F5 },
    { id: 'H6', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'Under en vanlig tvåveckorsperiod, hur ofta behövde någon ditt godkännande för resurser, budget eller prioriteringar inom ett område som personen själv ansvarar för?', options: F5 },
    { id: 'H7', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'När två personer eller team med olika mål behöver göra en viktig avvägning, hur ofta finns det ett fungerande sätt för dem att lösa frågan utan att du behöver avgöra den?', options: P5 },
    { id: 'H8', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'Under en vanlig tvåveckorsperiod, när någon tog upp en beslutsfråga som du ansåg låg inom personens eget mandat, hur ofta slutade det med att personen själv fattade beslutet?', options: [
      ...P5,
      { label: 'Inget sådant tillfälle', value: null, missing: true }
    ] },
    { id: 'H9', section: 'Vad kan ligga bakom?', type: 'single', scored: true, text: 'Tänk på den senaste gången under de senaste tre månaderna då någon fattade ett beslut inom sitt mandat som du själv skulle ha fattat annorlunda, men som ändå låg inom acceptabla gränser för risk och kvalitet. Hur agerade du?', options: [
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
      text: 'Utgå från den referensperiod som anges i frågan. När det står ”en vanlig tvåveckorsperiod”, tänk på två representativa arbetsveckor. Vi är mer intresserade av faktiska händelser än av hur organisationen är tänkt att fungera.'
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
      const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { answers: {}, timings: {}, startedAt: null };

      // Keep in-progress pilot answers aligned when copy or unscored context options change.
      if (loaded.answers?.C1?.label === 'Founder/ägare och vd') {
        loaded.answers.C1.label = 'Grundare/ägare och vd';
      }
      if (loaded.answers?.C3) {
        const c3 = questions.find(q => q.id === 'C3');
        const optionIndex = c3.options.findIndex(option => option.label === loaded.answers.C3.label);
        if (optionIndex >= 0) {
          loaded.answers.C3.optionIndex = optionIndex;
          loaded.answers.C3.value = c3.options[optionIndex].value;
        }
      }
      if (loaded.answers?.M11?.values) {
        const m11 = questions.find(q => q.id === 'M11');
        loaded.answers.M11.labels = loaded.answers.M11.values
          .map(value => m11.options.find(option => option.value === value)?.label)
          .filter(Boolean);
      }

      return loaded;
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
    add('decision_authority_ambiguity', 'Otydliga gränser för beslut och eskalering', driverStrength([risk('H1'), risk('H2')], ['M1','M2','M3']));
    add('accountability_ambiguity', 'Otydligt resultatansvar', driverStrength([risk('H3')], ['M4','M5','M6']));
    add('capability_constraint', 'Otillräckligt spridd förmåga', driverStrength([risk('H4')], ['M1','M2','M4','M6','M9','M10']));
    add('information_concentration', 'Kunskap eller sammanhang är koncentrerat hos dig', driverStrength([risk('H5')], ['M1','M4','M6','M9']));
    add('resource_authority_mismatch', 'Ansvar och mandat över resurser kan vara separerade', driverStrength([risk('H6')], ['M1','M2','M3']));
    add('coordination_architecture_gap', 'Sättet att samordna arbetet kan vara otillräckligt', driverStrength([risk('H7')], ['M7','M8']));
    add('leader_recentralization', 'Ditt eget beteende kan återcentralisera mandat', driverStrength([risk('H8'), risk('H9')], ['M1','M2','M4','M5']));
    return out;
  }

  function buildContradictions(signals) {
    const c = [];
    const authorityVals = [risk('H1'), risk('H2')].filter(v => v != null);
    if (signals.decision.rank >= 2 && authorityVals.length === 2 && authorityVals.every(v => v <= 1)) {
      c.push({ key: 'decision_high_authority_clear', text: 'Beslutsberoendet är högt trots att du rapporterar tydliga beslutsrätter. Otydliga mandat verkar därför inte vara den uppenbara huvudförklaringen.' });
    }
    if (signals.decision.rank <= 1 && signals.intervention.rank <= 1 && risk('M12') >= 3) {
      c.push({ key: 'low_escalation_high_held_work', text: 'Få frågor verkar skickas uppåt, men du rapporterar mycket arbete som någon annan rimligen skulle kunna ansvara för. Det pekar mot arbete som har stannat hos dig snarare än klassisk uppåtdelegering.' });
    }
    if (risk('H4') != null && risk('H4') <= 1 && signals.intervention.rank >= 2) {
      c.push({ key: 'capability_high_intervention_high', text: 'Du bedömer organisationens förmåga som relativt stark samtidigt som frågor återkommer till dig. Antingen överskattas förmågan, eller så får den inte fullt genomslag i praktiken.' });
    }
    const everyday = ['M1','M2','M3','M4','M5','M6','M7','M8','M9'].map(risk).filter(v => v != null);
    const everydayMean = everyday.length ? everyday.reduce((a,b)=>a+b,0)/everyday.length : null;
    if (everydayMean != null && everydayMean <= 1.25 && risk('M10') >= 3) {
      c.push({ key: 'daily_low_absence_high', text: 'Vardagsfrågorna visar lågt beroende, men den senaste faktiska frånvaron blottade ett betydligt större beroende.' });
    }
    if (signals.coordination.rank >= 2 && risk('H7') != null && risk('H7') <= 1) {
      c.push({ key: 'coordination_high_architecture_strong', text: 'Samordningsberoendet är högt trots att du rapporterar ett fungerande sätt att lösa tvärfunktionella frågor. Beroendet kan därför vara legitimt eller bero på att arbetssättet inte fungerar i de svårare fallen.' });
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

  const leverageProfiles = {
    independent: {
      name: 'Självständig organisation',
      description: 'Beslut och problemlösning verkar i stor utsträckning ske nära där arbetet händer. Din roll framstår inte som en nödvändig operativ mellanlandning i de flesta vardagssituationer.'
    },
    growing: {
      name: 'Växande beroende',
      description: 'Organisationen fungerar, men vissa beslut, problem eller prioriteringar börjar söka vägen via dig oftare än de behöver.'
    },
    central: {
      name: 'Central ledare',
      description: 'Din närvaro verkar vara en viktig del av hur organisationen fattar beslut, löser svåra frågor och håller tempot uppe.'
    },
    bottleneck: {
      name: 'Operativ flaskhals',
      description: 'För mycket ansvar, problemlösning och framdrift verkar ha samlats hos dig. När du inte är tillgänglig riskerar arbetet att tappa fart.'
    }
  };

  const signalRank = { insufficient: -1, limited: 0, emerging: 1, notable: 2, strong: 3 };

  function resultProfile(diagnostic) {
    const maxRank = Math.max(-1, ...Object.values(diagnostic.signals || {}).map(signal => signalRank[signal.level] ?? -1));
    let key = 'independent';
    if (maxRank >= 3) key = 'bottleneck';
    else if (maxRank >= 2 || diagnostic.primary_pattern === 'leaderHeldWork') key = 'central';
    else if (maxRank >= 1) key = 'growing';
    return { key, ...leverageProfiles[key] };
  }

  function signalStatus(level) {
    return ({
      limited: { label: 'Fungerar mer självständigt', tone: 'positive' },
      emerging: { label: 'Visar början till beroende', tone: 'watch' },
      notable: { label: 'Visar tydligt beroende', tone: 'elevated' },
      strong: { label: 'Visar starkt beroende', tone: 'high' },
      insufficient: { label: 'Otillräckligt underlag', tone: 'neutral' }
    })[level] || { label: 'Ej bedömt', tone: 'neutral' };
  }

  function signalDimension(diagnostic, signalKey, copy) {
    const level = diagnostic.signals?.[signalKey]?.level || 'insufficient';
    const status = signalStatus(level);
    return { ...status, diagnosis: copy[level] || copy.insufficient };
  }

  function driverDimension(diagnostic, keys, copy) {
    const drivers = (diagnostic.drivers || []).filter(driver => keys.includes(driver.key));
    if (drivers.some(driver => driver.strength === 'supported')) {
      return { label: 'Tydlig indikation att undersöka', tone: 'elevated', diagnosis: copy.supported };
    }
    if (drivers.some(driver => driver.strength === 'weak')) {
      return { label: 'Viss indikation att undersöka', tone: 'watch', diagnosis: copy.weak };
    }
    return { label: 'Ingen tydlig pilotsignal', tone: 'neutral', diagnosis: copy.none };
  }

  function resultDimensions(diagnostic) {
    const decision = signalDimension(diagnostic, 'decision', {
      limited: 'Beslut verkar oftast kunna röra sig vidare utan att din tillgänglighet avgör tempot.',
      emerging: 'Enstaka beslut eller godkännanden söker fortfarande vägen via dig.',
      notable: 'Flera beslut och godkännanden verkar behöva passera dig innan arbetet går vidare.',
      strong: 'Beslutsflödet verkar tydligt beroende av din närvaro eller bekräftelse.',
      insufficient: 'Det finns inte tillräckligt underlag för en preliminär bedömning av beslutsflödet.'
    });
    const problemSolving = signalDimension(diagnostic, 'intervention', {
      limited: 'Problem och uppgifter verkar oftast stanna hos den som ansvarar för dem.',
      emerging: 'Vissa problem eller uppgifter kommer tillbaka till dig trots att någon annan äger dem.',
      notable: 'Problemlösning och ansvar verkar återkommande förflyttas tillbaka till dig.',
      strong: 'Du verkar ofta bli den plats där problem landar eller där ansvar tas tillbaka.',
      insufficient: 'Det finns inte tillräckligt underlag för en preliminär bedömning av problemlösningen.'
    });
    const operations = signalDimension(diagnostic, 'availability', {
      limited: 'Arbetet verkar i stor utsträckning kunna fortsätta när du inte är tillgänglig.',
      emerging: 'Vissa delar av arbetet tappar tempo eller väntar när du inte är tillgänglig.',
      notable: 'Din tillgänglighet verkar ha tydlig betydelse för att arbetet ska fortsätta framåt.',
      strong: 'Arbetets tempo och kontinuitet verkar vara starkt kopplade till din närvaro.',
      insufficient: 'Det finns inte tillräckligt underlag för en preliminär bedömning av den operativa självständigheten.'
    });
    const organization = driverDimension(diagnostic, [
      'decision_authority_ambiguity',
      'accountability_ambiguity',
      'capability_constraint',
      'resource_authority_mismatch',
      'coordination_architecture_gap',
      'leader_recentralization'
    ], {
      supported: 'Dagens pilotlogik pekar på att ansvar, mandat eller samordning kan göra organisationen mer beroende av dig än nödvändigt.',
      weak: 'Det finns tecken på att ansvar, mandat eller samordning kan begränsa självständigheten, men underlaget är inte entydigt.',
      none: 'Dagens pilotlogik pekar inte ut någon särskild strukturell förklaring. Det betyder inte att området är fullt ut självständigt.'
    });
    const knowledge = driverDimension(diagnostic, ['information_concentration'], {
      supported: 'Viktig kunskap, historik eller sammanhang verkar vara koncentrerat hos dig och kan göra dig till en informationsflaskhals.',
      weak: 'Det finns tecken på att andra behöver kunskap eller sammanhang som främst finns hos dig.',
      none: 'Dagens pilotlogik visar ingen tydlig koncentration av kunskap hos dig, men området har ännu ingen egen dimensionspoäng.'
    });

    return [
      { title: 'Beslut och mandat', question: 'Kan människor fatta beslut utan att behöva gå via dig?', ...decision },
      { title: 'Problemlösning och ansvar', question: 'Löses problem där de uppstår, eller hamnar de fortfarande hos dig?', ...problemSolving },
      { title: 'Operativ självständighet', question: 'Fortsätter arbetet att röra sig framåt utan din direkta närvaro?', ...operations },
      { title: 'Organisationsdesign', question: 'Är ansvar, mandat och samarbete byggda för självständighet?', ...organization },
      { title: 'Kunskapsberoende', question: 'Finns viktig kunskap i organisationen eller främst hos dig?', ...knowledge }
    ];
  }

  function observationText(id) {
    const a = state.answers[id];
    if (!a) return null;
    const label = optionLabel(questions.find(q => q.id === id), a);
    const map = {
      M1: `${label}: någon bad dig fatta ett beslut som personen eller teamet borde kunna fatta själv.`,
      M2: `${label}: någon bad om ditt godkännande trots att personen hade rätt att fatta beslutet själv.`,
      M3: `${label}: ett viktigt beslut blev minst en arbetsdag försenat främst för att du inte var tillgänglig.`,
      M4: `${label}: en fråga eller uppgift kom tillbaka trots att du hade gjort det tydligt vem som ansvarade för den.`,
      M5: `${label}: du tog själv över ett problem eller en uppgift som redan hade en tydlig ägare.`,
      M6: `${label}: du löste återkommande samma typ av problem åt andra.`,
      M7: `${label}: du behövde gå in och lösa en prioriteringskonflikt eller avvägning mellan personer, team eller funktioner.`,
      M8: `${label}: du deltog i möten främst för att gruppen behövde din auktoritet.`,
      M9: `${label}: arbete som någon annan ansvarade för stod stilla i väntan på din granskning, återkoppling eller ditt godkännande.`,
      M10: label,
      M12: `Du uppskattar att ${label.toLowerCase()} under en vanlig arbetsvecka går till arbete som någon annan rimligen skulle kunna ansvara för.`
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
      accountability_ambiguity: 'En möjlig förklaring är att resultatansvaret inte alltid är tillräckligt tydligt när ett område underpresterar.',
      capability_constraint: 'En möjlig förklaring är att förmågan att hantera vanliga beslut och problem inte är tillräckligt spridd i organisationen.',
      information_concentration: 'Flera frågor verkar kunna nå dig därför att viktig kunskap, historik eller sammanhang fortfarande är koncentrerat hos dig.',
      resource_authority_mismatch: 'Ansvar kan ha flyttats längre än resurs- och prioriteringsmandatet, vilket gör att frågor ändå behöver komma tillbaka till dig.',
      coordination_architecture_gap: 'Dina svar tyder på att organisationen kan sakna ett tillräckligt fungerande sätt att lösa vissa tvärfunktionella avvägningar utan dig.',
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
        return 'Kartlägg de återkommande tvärfunktionella avvägningar som kräver dig och skilj på dem som kräver ditt omdöme och dem som behöver ett bättre sätt att samordna arbetet.';
      case 'availability':
        return 'Identifiera vad som faktiskt väntar när du är otillgänglig och klassificera varje punkt som legitimt ledarbeslut, informationsberoende eller onödigt godkännande.';
      case 'leaderHeldWork':
        return 'Gör en konkret inventering av ditt återkommande arbete och identifiera vilket ansvar som ligger kvar hos dig främst därför att det alltid har gjort det.';
      default:
        return 'Använd nästa två veckor som observationsperiod: notera varje beslut, problem eller avvägning som verkligen måste gå genom dig och varför.';
    }
  }

  function renderResults(diagnostic) {
    screen = 'results';
    state.completedAt = state.completedAt || new Date().toISOString();
    state.diagnostic = diagnostic;
    saveState();

    const profile = resultProfile(diagnostic);
    const dimensions = resultDimensions(diagnostic);
    const observations = strongestObservations(diagnostic);
    const drivers = diagnostic.drivers.slice(0,2);
    const limitations = [];
    if (diagnostic.contradictions.length) limitations.push(diagnostic.contradictions[0].text);
    if (diagnostic.evidence.level === 'limited' || diagnostic.evidence.level === 'some') limitations.push('Underlaget bygger på relativt få konkreta tecken på beroende. Resultatet bör därför ses som en första screening, inte som en fastställd organisationsdiagnos.');
    if (!diagnostic.evidence.actual_absence_available) limitations.push('Du saknade en relevant faktisk frånvaroepisod. Bedömningen av hur organisationen fungerar utan dig blir därför svagare.');
    if (!limitations.length) limitations.push('Det här är en 5–8 minuters självskattning. Den kan visa ett mönster, men kan inte fastställa om beroendet är legitimt eller exakt vad som orsakar det utan ytterligare data.');

    const profileScale = Object.entries(leverageProfiles).map(([key, item]) => `
      <div class="profile-step ${profile.key === key ? 'active' : ''}">
        <span class="profile-dot" aria-hidden="true"></span>
        <span>${escapeHtml(item.name)}</span>
      </div>`).join('');

    const dimensionCards = dimensions.map((dimension, index) => `
      <article class="dimension-card">
        <div class="dimension-topline">
          <span class="dimension-number">${String(index + 1).padStart(2, '0')}</span>
          <span class="dimension-status tone-${dimension.tone}">${escapeHtml(dimension.label)}</span>
        </div>
        <h3>${escapeHtml(dimension.title)}</h3>
        <p class="dimension-question">${escapeHtml(dimension.question)}</p>
        <p class="dimension-diagnosis">${escapeHtml(dimension.diagnosis)}</p>
      </article>`).join('');

    app.innerHTML = `
      <section class="card result-card">
        <div class="result-header">
          <div class="eyebrow">Leverage Audit · Ditt resultat</div>
          <h1 class="result-title">Hur mycket av organisationens kapacitet går fortfarande genom dig?</h1>
          <p class="lede">Resultatet visar inte hur bra ledare du är. Det visar var organisationen fortfarande verkar vara beroende av din direkta involvering.</p>
        </div>

        <div class="result-overview">
          <div class="score-card">
            <div class="score-label">Leverage Score</div>
            <div class="score-value" aria-label="Numerisk poäng är ännu inte aktiverad">–<span>/100</span></div>
            <p>Den numeriska poängen kopplas in när de fem områdenas viktning och profilgränser är låsta.</p>
          </div>
          <div class="profile-card">
            <div class="profile-kicker">Din preliminära profil</div>
            <h2>${escapeHtml(profile.name)}</h2>
            <p>${escapeHtml(profile.description)}</p>
            <div class="profile-basis">Bygger på befintlig pilotlogik</div>
          </div>
        </div>

        <div class="profile-scale" aria-label="Fyra preliminära Leverage-profiler">
          ${profileScale}
        </div>

        <div class="section dimension-section">
          <div class="section-heading">
            <div>
              <div class="eyebrow">Var beroendet finns</div>
              <h2>Fem områden i din organisation</h2>
            </div>
            <p>Områdena visar var självständigheten verkar starkare och var din involvering fortfarande kan vara en nödvändig del av flödet.</p>
          </div>
          <div class="dimension-grid">${dimensionCards}</div>
          <p class="model-note">De tre första områdena använder befintliga pilotsignaler. Organisationsdesign och kunskapsberoende visas som kvalitativa indikationer tills den fullständiga dimensionsscoringen är låst.</p>
        </div>

        <div class="section focus-section">
          <div class="eyebrow">Din största möjlighet just nu</div>
          <h2>${escapeHtml(biggestOpportunity(diagnostic))}</h2>
          <p>Fokusera på ett återkommande mönster först. Målet är inte att du ska vara mindre viktig, utan att organisationen ska behöva din direkta involvering i färre situationer där den kan bära ansvaret själv.</p>
        </div>

        <details class="result-details">
          <summary>Se underlaget bakom bedömningen</summary>
          <div class="details-content">
            <div class="details-block">
              <h3>Vad vi observerade</h3>
              <ul class="obs-list">${observations.length ? observations.map(x => `<li>${escapeHtml(x)}</li>`).join('') : '<li>Inga tillräckligt konkreta tecken på beroende stack ut.</li>'}</ul>
              ${diagnostic.localization.length ? `<p class="small muted"><strong>Var beroendet sannolikt märks:</strong> ${escapeHtml(diagnostic.localization.join(', '))}.</p>` : ''}
              ${diagnostic.executive_attention_cost ? `<p class="small muted"><strong>Tid i arbete som någon annan skulle kunna ansvara för:</strong> Du uppskattar ${escapeHtml(diagnostic.executive_attention_cost.toLowerCase())} under en vanlig arbetsvecka.</p>` : ''}
            </div>

            <div class="details-block">
              <h3>Vad som kan ligga bakom</h3>
              ${drivers.length ? drivers.map(d => `<div class="driver"><div class="driver-title">${escapeHtml(d.label)}</div><div class="driver-strength">${d.strength === 'supported' ? 'Tydlig indikation i pilotlogiken' : 'Svag indikation – värd att undersöka'}</div><p>${escapeHtml(driverText(d))}</p></div>`).join('') : '<p>Auditen pekar inte ut någon tydlig bakomliggande förklaring. Det är bättre att lämna orsaken öppen än att fylla i den med en gissning.</p>'}
            </div>

            <div class="details-block">
              <h3>Vad vi inte kan avgöra här</h3>
              <div class="limitation">${limitations.map(x => `<p>${escapeHtml(x)}</p>`).join('')}</div>
            </div>
          </div>
        </details>

        <div class="btn-row">
          <button class="btn btn-primary" id="printBtn">Spara eller skriv ut resultat</button>
          <button class="btn btn-secondary" id="jsonBtn">Ladda ner pilotdata</button>
          <button class="btn btn-ghost" id="restartBtn">Ny genomföring</button>
        </div>
        <div class="status" id="submitStatus">Försöker spara pilotdata…</div>

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
      status.textContent = 'Pilotdata sparad.';
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
      status.textContent = 'Pilotdata sparad.';
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
