(() => {
  'use strict';

  const MODEL_VERSION = '2.0';

  const levelPresentation = {
    strong: { label: 'Fungerar självständigt', tone: 'positive' },
    developing: { label: 'Visar visst beroende', tone: 'watch' },
    constrained: { label: 'Visar tydligt beroende', tone: 'elevated' },
    critical: { label: 'Visar starkt beroende', tone: 'high' },
    insufficient: { label: 'Otillräckligt underlag', tone: 'neutral' }
  };

  const dimensions = [
    {
      id: 'decision_authority',
      title: 'Beslut och mandat',
      question: 'Kan människor fatta beslut utan att behöva gå via dig?',
      questionIds: ['M1', 'M2', 'H1', 'H2', 'H8'],
      highInterpretation: 'Beslut fattas nära verksamheten, mandatgränserna är begripliga och människor använder sitt ansvar.',
      lowInterpretation: 'Beslut söker godkännande, eskaleras eller väntar på ledaren.',
      recommendation: 'Skapa tydligare beslutskriterier och mandat.',
      resultCopy: {
        strong: 'Beslut verkar oftast kunna fattas nära arbetet utan att din bekräftelse avgör tempot.',
        developing: 'Vissa beslut eller godkännanden söker fortfarande vägen via dig, men mönstret är inte genomgående.',
        constrained: 'Flera beslut och godkännanden verkar behöva passera dig innan arbetet går vidare.',
        critical: 'Beslutsflödet verkar starkt beroende av din närvaro, bekräftelse eller tolkning av mandatgränser.',
        insufficient: 'Det finns inte tillräckligt underlag för att bedöma beslut och mandat.'
      }
    },
    {
      id: 'problem_solving',
      title: 'Problemlösning och ansvar',
      question: 'Löses problem där de uppstår, eller hamnar de fortfarande hos dig?',
      questionIds: ['M4', 'M5', 'M6', 'M7'],
      highInterpretation: 'Människor bygger egen problemlösningsförmåga och ansvaret stannar hos ägaren.',
      lowInterpretation: 'Problem återkommer, ledaren går in och löser och ansvaret flyttas uppåt.',
      recommendation: 'Flytta fokus från att lösa fler problem till att bygga fler problemlösare.',
      resultCopy: {
        strong: 'Problem och uppgifter verkar oftast stanna hos den som ansvarar för dem.',
        developing: 'Vissa problem eller uppgifter kommer tillbaka till dig trots att någon annan äger dem.',
        constrained: 'Problemlösning och ansvar verkar återkommande förflyttas tillbaka till dig.',
        critical: 'Du verkar ofta bli den plats där problem landar eller där ansvar tas tillbaka.',
        insufficient: 'Det finns inte tillräckligt underlag för att bedöma problemlösning och ansvar.'
      }
    },
    {
      id: 'organizational_independence',
      title: 'Organisationens självständighet',
      question: 'Fortsätter organisationen framåt utan din direkta närvaro?',
      questionIds: ['M3', 'M8', 'M9', 'M10', 'M11', 'M12'],
      highInterpretation: 'Arbetet fortsätter, viktiga områden har ägare och löpande arbete kräver inte ledarens granskning.',
      lowInterpretation: 'Arbete väntar, tappar fart eller kräver ledarens närvaro för att komma vidare.',
      recommendation: 'Identifiera vilka delar av organisationen som fortfarande kräver din närvaro och bygg bort onödiga beroenden.',
      resultCopy: {
        strong: 'Organisationen verkar i stor utsträckning kunna fortsätta när du inte är tillgänglig.',
        developing: 'Vissa delar av arbetet tappar tempo, kvalitet eller väntar när du inte är tillgänglig.',
        constrained: 'Din tillgänglighet verkar ha tydlig betydelse för att organisationen ska fortsätta framåt.',
        critical: 'Organisationens tempo och kontinuitet verkar starkt kopplade till din direkta närvaro.',
        insufficient: 'Det finns inte tillräckligt underlag för att bedöma organisationens självständighet.'
      }
    },
    {
      id: 'organization_design',
      title: 'Organisationsdesign',
      question: 'Är ansvar, mandat och samarbete byggda för självständighet?',
      questionIds: ['H3', 'H4', 'H6', 'H7'],
      highInterpretation: 'Ansvar och mandat hänger ihop, konflikter kan lösas där de uppstår och personer kan bära sina områden.',
      lowInterpretation: 'Ansvar saknar mandat, gränser är oklara eller samordning kräver ledaren.',
      recommendation: 'Bygg tydligare ägarskap och beslutsprinciper.',
      resultCopy: {
        strong: 'Ansvar, förmåga, resursmandat och samordning verkar i huvudsak stödja självständighet.',
        developing: 'Det finns vissa glapp mellan ansvar, förmåga, resursmandat eller sättet att samordna arbetet.',
        constrained: 'Organisationens struktur verkar på flera sätt göra arbetet mer beroende av dig än nödvändigt.',
        critical: 'Ansvar, mandat och samordning verkar vara så starkt separerade att din involvering blir en nödvändig del av systemet.',
        insufficient: 'Det finns inte tillräckligt underlag för att bedöma organisationsdesignen.'
      }
    },
    {
      id: 'knowledge_dependency',
      title: 'Kunskapsberoende',
      question: 'Finns viktig kunskap i organisationen eller främst hos dig?',
      questionIds: ['M5', 'H5'],
      highInterpretation: 'Kunskap är spridd och organisationen kan agera utan att hämta personlig historik eller sammanhang från ledaren.',
      lowInterpretation: 'Ledaren blir informationsnav och människor behöver ledarens bakgrund för att komma vidare.',
      recommendation: 'Gör erfarenhet tillgänglig genom principer, system och dokumentation.',
      resultCopy: {
        strong: 'Viktig kunskap och problemlösningsförmåga verkar inte vara tydligt koncentrerade hos dig.',
        developing: 'Det finns vissa tecken på att din kunskap eller ditt ingripande fortfarande behövs för att andra ska komma vidare.',
        constrained: 'Din kunskap, historik eller problemlösning verkar vara en tydlig del av organisationens förmåga att agera.',
        critical: 'Organisationen verkar vara starkt beroende av kunskap, sammanhang eller problemlösning som är koncentrerad hos dig.',
        insufficient: 'Det finns inte tillräckligt underlag för att bedöma kunskapsberoendet.'
      }
    }
  ];

  const profiles = {
    independent: {
      key: 'independent',
      name: 'Självständig organisation',
      description: 'Organisationen verkar kunna skapa resultat utan att du behöver vara involverad i varje steg.'
    },
    growing: {
      key: 'growing',
      name: 'Växande beroende',
      description: 'Organisationen fungerar, men arbetssätten har inte fullt hunnit utvecklas i takt med behoven och vissa beroenden börjar bli synliga.'
    },
    central: {
      key: 'central',
      name: 'Central ledare',
      description: 'Du är en viktig nod, men din involvering verkar främst ligga där den skapar störst värde.'
    },
    bottleneck: {
      key: 'bottleneck',
      name: 'Operativ flaskhals',
      description: 'Organisationen verkar fortfarande behöva din direkta involvering oftare än vad som är hållbart.'
    }
  };

  function singleRisk(answer) {
    if (answer == null) return null;
    if (typeof answer === 'number') return Number.isFinite(answer) ? answer : null;
    if (answer.missing || answer.value == null) return null;
    const value = Number(answer.value);
    return Number.isFinite(value) ? value : null;
  }

  function m11Risk(answer) {
    const values = Array.isArray(answer) ? answer : answer?.values;
    if (!Array.isArray(values) || !values.length) return null;
    if (values.includes(7)) return 0;
    return Math.min(4, values.filter(value => value !== 7).length);
  }

  function riskFor(answers, questionId) {
    if (questionId === 'M11') return m11Risk(answers?.[questionId]);
    return singleRisk(answers?.[questionId]);
  }

  function levelFor(score) {
    if (score == null) return 'insufficient';
    if (score <= 1) return 'strong';
    if (score <= 1.75) return 'developing';
    if (score <= 2.5) return 'constrained';
    return 'critical';
  }

  function scoreDimension(definition, answers) {
    const signals = definition.questionIds
      .map(questionId => ({ questionId, risk: riskFor(answers, questionId) }))
      .filter(signal => signal.risk != null);
    const minimumRequired = Math.ceil(definition.questionIds.length * 0.6);
    const score = signals.length >= minimumRequired
      ? signals.reduce((sum, signal) => sum + signal.risk, 0) / signals.length
      : null;
    const level = levelFor(score);

    return {
      id: definition.id,
      title: definition.title,
      question: definition.question,
      questionIds: [...definition.questionIds],
      level,
      score,
      availableSignals: signals.length,
      requiredSignals: minimumRequired,
      indicators: signals
        .filter(signal => signal.risk >= 2)
        .sort((a, b) => (b.risk - a.risk) || definition.questionIds.indexOf(a.questionId) - definition.questionIds.indexOf(b.questionId))
        .map(signal => signal.questionId),
      ...levelPresentation[level],
      diagnosis: definition.resultCopy[level],
      recommendation: definition.recommendation
    };
  }

  function meanRisk(answers, questionIds) {
    const values = questionIds.map(questionId => riskFor(answers, questionId)).filter(value => value != null);
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  }

  function classifyProfile(scoredDimensions, answers) {
    const byId = Object.fromEntries(scoredDimensions.map(dimension => [dimension.id, dimension]));
    const coordinationRisk = meanRisk(answers, ['M7', 'M8']);
    const absenceRisk = riskFor(answers, 'M10');

    // Profile selection is based on why the leader is needed, not on how many
    // dimensions happen to show dependency. These anchors distinguish direct
    // operational dependence from mandate and coordination-system dependence.
    const takeoverRisk = meanRisk(answers, ['M5', 'M6']);
    const operationalDependencyRisk = meanRisk(answers, ['M5', 'M6', 'M9', 'H5']);
    const structuralDependencyRisk = meanRisk(answers, ['H1', 'H2', 'H6', 'H7']);
    const mandateAmbiguityRisk = meanRisk(answers, ['H1', 'H2']);
    const approvalDependencyRisk = meanRisk(answers, ['M1', 'M2', 'H6']);
    const coordinationDependencyRisk = meanRisk(answers, ['M7', 'H7']);
    const operationalBottleneck = operationalDependencyRisk != null
      && (
        operationalDependencyRisk >= 2.5
        || (takeoverRisk >= 3 && byId.problem_solving?.score >= 2.5)
      );
    if (operationalBottleneck) return profiles.bottleneck;

    // When reduced independence, unclear mandates, upward approvals and
    // coordination gaps occur together, the leader's centrality is systemic.
    // This growing-dependency pattern takes priority over intentional centrality.
    const systemicStructuralDependency = byId.organizational_independence?.score > 1
      && mandateAmbiguityRisk >= 1.75
      && approvalDependencyRisk >= 1.75
      && coordinationDependencyRisk >= 1.75;
    if (systemicStructuralDependency) return profiles.growing;

    const structuralDependency = structuralDependencyRisk != null
      && (
        structuralDependencyRisk >= 1.75
        || byId.organization_design?.score > 1.75
      );

    const healthyFoundation = [
      byId.decision_authority,
      byId.problem_solving,
      byId.organization_design,
      byId.knowledge_dependency
    ].every(dimension => dimension.score != null && dimension.score <= 1);
    const intentionalCentrality = healthyFoundation
      && !structuralDependency
      && byId.organizational_independence?.score <= 1
      && coordinationRisk != null && coordinationRisk >= 1.5
      && (absenceRisk == null || absenceRisk <= 1);
    if (intentionalCentrality) return profiles.central;

    if (scoredDimensions.every(dimension => dimension.level === 'strong')) return profiles.independent;

    if (structuralDependency) return profiles.growing;

    return profiles.growing;
  }

  function evaluate(answers) {
    const scoredDimensions = dimensions.map(definition => scoreDimension(definition, answers));
    const profile = classifyProfile(scoredDimensions, answers);
    const rankedConcerns = scoredDimensions
      .filter(dimension => dimension.score != null && dimension.level !== 'strong')
      .sort((a, b) => (b.score - a.score) || dimensions.findIndex(item => item.id === a.id) - dimensions.findIndex(item => item.id === b.id));
    const strongestDimensions = scoredDimensions
      .filter(dimension => dimension.level === 'strong')
      .sort((a, b) => (a.score - b.score) || dimensions.findIndex(item => item.id === a.id) - dimensions.findIndex(item => item.id === b.id));

    return {
      version: MODEL_VERSION,
      profile: { ...profile },
      dimensions: scoredDimensions,
      primaryFocus: rankedConcerns[0] || null,
      focusDimensions: rankedConcerns.map(dimension => dimension.id),
      strongestDimensions: strongestDimensions.map(dimension => dimension.id),
      resultBlocks: {
        profile: { ...profile },
        primaryObservation: rankedConcerns[0]?.diagnosis
          || 'Organisationen visar inga tydliga beroenden i de fem dimensionerna.',
        recommendedFocus: rankedConcerns[0]?.recommendation
          || 'Behåll tydlig riktning samtidigt som du fortsätter skapa utrymme för andra att leda.',
        dimensions: scoredDimensions.map(dimension => ({
          id: dimension.id,
          title: dimension.title,
          level: dimension.level,
          label: dimension.label,
          diagnosis: dimension.diagnosis,
          indicators: [...dimension.indicators]
        }))
      }
    };
  }

  globalThis.LeverageAuditResultModel = Object.freeze({
    version: MODEL_VERSION,
    dimensions,
    profiles,
    evaluate
  });
})();
