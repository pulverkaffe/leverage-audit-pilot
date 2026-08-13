# Resultatmodell v1

Den här versionen bygger ett nytt presentationslager ovanpå den befintliga pilotdiagnostiken. Frågor, svarsvärden, klassificeringar och regelmotorn i `makeDiagnostic()` är oförändrade.

## Det som visas nu

- En tydlig plats för en övergripande Leverage Score.
- En preliminär profil: Självständig organisation, Växande beroende, Central ledare eller Operativ flaskhals.
- Fem svenska resultatområden.
- Ett rekommenderat fokusområde i stället för en lång åtgärdslista.
- Ett expanderbart underlag med observationer, möjliga förklaringar och begränsningar.

Profilen är tills vidare en presentationsmappning från de fyra befintliga pilotsignalernas nivåer. Den är inte en ny validerad scoremodell. En högsta signalnivå mappas preliminärt så här:

| Befintlig pilotsignal | Preliminär profil |
| --- | --- |
| Begränsad eller inget dominerande mönster | Självständig organisation |
| Framväxande | Växande beroende |
| Tydlig | Central ledare |
| Stark | Operativ flaskhals |

Mönstret `leaderHeldWork` visas tills vidare som Central ledare.

## Låst struktur för nästa scoringsteg

| Område | Frågor som ska kopplas in |
| --- | --- |
| Beslut och mandat | M1, M2, H1, H2, H8 |
| Problemlösning och ansvar | M4, M5, M6, M7 |
| Operativ självständighet | M3, M9, M10, M11 |
| Organisationsdesign | H3, H4, H6, H7 |
| Kunskapsberoende | M12, H5 |

Resultatvyn använder i nuläget dagens direkta pilotsignaler för de tre första områdena. Organisationsdesign och kunskapsberoende visas som kvalitativa indikationer från de befintliga orsakshypoteserna.

## Beslut som återstår innan numerisk Leverage Score aktiveras

1. Bestäm om alla frågor inom ett område ska väga lika eller om vissa ska vara ankare.
2. Bestäm hur M11:s flervalsdata ska omvandlas till en dimensionssignal. M11 är i dag inte poängsatt.
3. Bestäm hur saknade svar i M10, H8 och H9 ska påverka områdespoäng och minsta datakrav.
4. Bestäm om M12 ska påverka både Kunskapsberoende och den övergripande poängen eller bara användas som kontext.
5. Definiera riktningen tydligt: hög Leverage Score bör betyda hög organisatorisk självständighet och lågt onödigt ledarberoende.
6. Lås normalisering till 0–100, viktning mellan de fem områdena och gränserna för de fyra profilerna.
7. Testa gränserna mot pilotdata innan ett exakt tal visas som en stabil diagnos.

Fram till dess visar resultatsidan `–/100` och förklarar varför. Det undviker att ett nytt tal ser mer validerat ut än det faktiskt är.
