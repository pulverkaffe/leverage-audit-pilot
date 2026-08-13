# Leverage Audit Result Model v2

Det här dokumentet är source of truth för Leverage Audits regelstyrda resultatmodell. Frågornas texter, svarsalternativ och lagrade svarsvärden ändras inte av modellen.

## 1. Syfte

Resultatet ska svara på:

> Hur mycket av organisationens kapacitet är fortfarande beroende av ledarens direkta involvering – och var finns de största möjligheterna att skapa mer självständighet?

Auditen mäter inte hur bra ledare personen är, hur mycket ansvar personen tar eller om all involvering är fel. Den letar efter onödigt organisatoriskt beroende, glapp mellan ansvar och mandat samt platser där beslut och problemlösning fastnar.

## 2. Fem dimensioner

| Dimension | Frågor | Mäter |
| --- | --- | --- |
| Beslut och mandat | M1, M2, H1, H2, H8 | Om människor kan fatta beslut inom sitt ansvar utan att gå via ledaren. |
| Problemlösning och ansvar | M4, M5, M6, M7 | Om problem löses där de uppstår eller flyttas tillbaka till ledaren. |
| Organisationens självständighet | M3, M8, M9, M10, M11, M12 | Om organisationen fortsätter fungera och driva arbetet framåt utan ledarens direkta närvaro. |
| Organisationsdesign | H3, H4, H6, H7 | Om ansvar, mandat, förmåga och samordning gör självständighet möjlig. |
| Kunskapsberoende | M5, H5 | Om viktig kunskap och problemlösningsförmåga finns i organisationen eller främst hos ledaren. |

M5 ingår avsiktligt i två dimensioner. Att ledaren tar över kan vara både ett problemlösningsmönster och ett tecken på att nödvändig problemlösningskunskap är koncentrerad hos ledaren.

C1–C4 används endast som kontext. H9 ingår inte i den låsta dimensionskartläggningen, men behålls oförändrad som kvalitativ kontext i den befintliga pilotdiagnostikens förklaringar och motsägelsekontroller.

### Beslut och mandat

Högt självständighetsutfall innebär att beslut fattas nära verksamheten, mandatgränserna är begripliga och människor använder sitt ansvar. Lågt utfall innebär att beslut söker godkännande, eskaleras eller väntar på ledaren.

Rekommenderat fokus: Skapa tydligare beslutskriterier och mandat.

### Problemlösning och ansvar

Högt självständighetsutfall innebär att människor bygger egen problemlösningsförmåga och att ansvaret stannar hos ägaren. Lågt utfall innebär att samma problem återkommer, ledaren går in och löser och ansvaret flyttas uppåt.

Rekommenderat fokus: Flytta fokus från att lösa fler problem till att bygga fler problemlösare.

### Organisationens självständighet

Högt självständighetsutfall innebär att arbetet fortsätter, viktiga områden har ägare och löpande arbete inte kräver ledarens granskning. Lågt utfall innebär att arbete väntar, tappar fart eller kräver ledarens närvaro för att komma vidare.

Rekommenderat fokus: Identifiera vilka delar av organisationen som fortfarande kräver din närvaro och bygg bort onödiga beroenden.

### Organisationsdesign

Högt självständighetsutfall innebär att ansvar och mandat hänger ihop, konflikter kan lösas där de uppstår och personer kan bära sina områden. Lågt utfall innebär ansvar utan mandat, oklara gränser eller samordning som kräver ledaren.

Rekommenderat fokus: Bygg tydligare ägarskap och beslutsprinciper.

### Kunskapsberoende

Högt självständighetsutfall innebär att kunskap är spridd och att organisationen kan agera utan att hämta personlig historik eller sammanhang från ledaren. Lågt utfall innebär att ledaren blir informationsnav.

Rekommenderat fokus: Gör erfarenhet tillgänglig genom principer, system och dokumentation.

## 3. Kategorisk dimensionslogik

Alla befintliga enkelval använder redan en intern riskskala 0–4 där 0 betyder lägst och 4 högst rapporterat beroende. Varje dimensions interna signal är medelvärdet av dess tillgängliga frågor. Ingen numerisk poäng visas för deltagaren.

M11 behåller sin flervalsform och omvandlas enbart i resultatmotorn:

- “Inget av ovanstående” ger risk 0.
- Ett markerat beroendeområde ger risk 1.
- Två, tre eller fyra eller fler markerade beroendeområden ger risk 2, 3 respektive 4.

En dimension kräver minst 60 procent tillgängliga svar. Saknade svar räknas inte som noll. Kategorierna är:

| Intern medelrisk | Resultatkategorin |
| --- | --- |
| 0–1,00 | Fungerar självständigt |
| 1,01–1,75 | Visar visst beroende |
| 1,76–2,50 | Visar tydligt beroende |
| 2,51–4,00 | Visar starkt beroende |

Trösklarna är deterministiska pilotregler, inte validerade normvärden. De ska kalibreras mot riktiga pilotdata utan att frågekartläggningen ändras.

## 4. Profillogik

Profilerna byggs från mönstret över alla fem dimensioner, inte från en publik totalsiffra. Profilvalet är hierarkiskt och typen av beroende väger tyngre än mängden beroende. Flera belastade dimensioner är därför inte i sig tillräckligt för att klassificera en operativ flaskhals.

Motorn prövar profilerna i denna ordning:

1. Operativt beroende i M5, M6, M9 och H5 → Operativ flaskhals.
2. Stark självständighet och avgränsad central involvering i M7/M8 → Central ledare.
3. Alla fem dimensioner fungerar självständigt → Självständig organisation.
4. Strukturellt eller annat kvarvarande beroende → Växande beroende.

Det operativa ankaret är medelrisken i M5, M6, M9 och H5 och utlöses från 2,50. En mycket belastad problemlösningsdimension kan också utlösa profilen när medelrisken i M5/M6 är minst 3,00. Det strukturella ankaret är H1, H2, H6 och H7 och används från 1,75, med Organisationsdesign som sammanvägd bekräftelse.

### Självständig organisation

Alla fem dimensioner fungerar självständigt och inget särskilt legitimt centralitetsmönster identifieras.

Budskap: Organisationen verkar kunna skapa resultat utan att du behöver vara involverad i varje steg.

### Växande beroende

Beroendet är främst strukturellt eller visar ett annat utvecklingsbehov utan ett tydligt operativt flaskhalsmönster. H1, H2, H6 och H7 är ankarsignaler för otydliga mandat, många resursgodkännanden och samordningsproblem. Organisationsdesignen används som sammanvägd bekräftelse. Profilen fångar också andra avgränsade beroenden, till exempel kunskapsberoende.

Budskap: Organisationen fungerar, men arbetssätten har inte fullt hunnit utvecklas i takt med behoven och vissa beroenden börjar bli synliga.

### Central ledare

Beslut och mandat, problemlösning, organisationsdesign, kunskapsberoende och frånvarotålighet är starka, samtidigt som M7/M8 visar att ledaren avsiktligt används för vissa större avvägningar. Det motsvarar en ledare som är viktig för riktning, externa relationer eller större vägval medan vardagsbeslut och problemlösning fungerar självständigt. Profilen ska inte användas för generell operativ centralisering.

Budskap: Du är en viktig nod, men din involvering verkar främst ligga där den skapar störst värde.

### Operativ flaskhals

Profilen används när beroendet främst består i att ledaren tar över problem, löser samma typ av problem igen, blir en väntande granskningspunkt eller fungerar som kunskapsnav. M5, M6, M9 och H5 är ankarsignaler. M5/M6 kan också bekräfta profilen tillsammans med en mycket belastad problemlösningsdimension. Profilen väljs inte enbart för att många dimensioner visar beroende.

Budskap: Organisationen verkar fortfarande behöva din direkta involvering oftare än vad som är hållbart.

## 5. Förberedda resultatblock

Resultatmotorn producerar strukturerad data för:

- profil och profilbeskrivning,
- alla fem dimensioners kategori, diagnos och utlösande fråge-ID:n,
- primär observation,
- rekommenderat fokus,
- ordnad lista över fokusdimensioner och starka dimensioner.

Detta gör att presentationslagret och ett framtida AI-lager kan använda samma regelstyrda diagnos. AI får formulera en personlig sammanfattning, observationer, möjliga orsaker och första experiment, men får inte hitta på eller ändra dimensioner och profil.

## 6. Regressionstest

Alla ändringar ska fortsatt klara åtta scenarier:

1. Självständig organisation → Självständig organisation.
2. Grundaren som flaskhals → Operativ flaskhals.
3. Växande bolag → Växande beroende, inte Operativ flaskhals.
4. Stark central ledare → Central ledare, inte Operativ flaskhals.
5. Ansvar utan mandat → Växande beroende.
6. Kunskapsflaskhals → Växande beroende med Kunskapsberoende som svagt område.
7. Problemlösaren → Operativ flaskhals med Problemlösning och ansvar som primärt problem.
8. Falsk självständighet → Växande beroende, inte Självständig organisation.

Testsviten låser även alla 25 fråge-ID:n och frågetexter byte-för-byte. De fem exakta scenarier som användes i profilvalideringen finns dessutom som en separat regressionstestsvit, så att förändringen från mängd- till typbaserad prioritering inte kan återgå obemärkt.

## 7. Beslut som återstår

Inget av följande blockerar v2-implementationen, men ska valideras innan modellen behandlas som ett normerat instrument:

1. Kalibrera kategorigränser och profilregler mot verkliga pilotsvar.
2. Bekräfta eller justera M11:s 0–4-omvandling mot pilotdata.
3. Bedöm om någon fråga ska viktas som ankare i stället för att alla signaler väger lika inom sin dimension.
4. Fastställ minsta datakrav för skarpa resultat när ofullständiga äldre svar förekommer.
5. Validera namnet “Operativ flaskhals” med målgruppen.

En publik numerisk Leverage Score är uttryckligen utanför v2. Kategorier, profil och personens faktiska svar är huvudresultatet.
