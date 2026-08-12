# Leverage Audit Pilot v0.1 — GitHub → Cloudflare utan Terminal

Det här paketet är förberett för att kunna publiceras via **GitHub → Cloudflare Pages** utan att du behöver använda Terminal.

## Översikt

Du gör installationen i webbläsaren i fyra delar:

1. Lägg projektfilerna i ett GitHub-repository.
2. Koppla repositoryt till Cloudflare Pages.
3. Skapa D1-databasen och klistra in databasschemat i Cloudflares SQL Console.
4. Koppla D1-databasen till Pages-projektet och lägg till ett exportlösenord.

När detta är klart kan ledare fylla i auditen på din `*.pages.dev`-adress och svaren sparas centralt i D1.

---

# DEL 1 — Lägg projektet på GitHub

## 1. Skapa ett nytt repository

Gå till GitHub och välj **New repository**.

Förslag:

- Repository name: `leverage-audit-pilot`
- Visibility: **Private** är lämpligt för piloten.
- Du behöver inte skapa README, `.gitignore` eller license eftersom de redan finns i paketet.

Klicka **Create repository**.

## 2. Ladda upp projektfilerna

I det tomma repositoryt:

1. Klicka **uploading an existing file** eller **Add file → Upload files**.
2. Packa upp zip-filen på din dator.
3. Öppna mappen `leverage-audit-cloudflare`.
4. Markera **innehållet i mappen**, inte själva överordnade mappen.
5. Dra filerna och mapparna till GitHub-fönstret.
6. Klicka **Commit changes**.

Repositoryts rot ska då bland annat innehålla:

```text
functions/
public/
schema.sql
package.json
README.md
START-HERE.md
```

Det viktiga är att `functions` och `public` ligger direkt i repositoryts rot.

---

# DEL 2 — Koppla GitHub till Cloudflare Pages

I Cloudflare:

1. Gå till **Workers & Pages**.
2. Välj **Create application**.
3. Välj **Pages**.
4. Välj **Connect to Git**.
5. Koppla GitHub om Cloudflare ber om behörighet.
6. Välj repositoryt `leverage-audit-pilot`.

## Build settings

Använd:

- **Production branch:** `main`
- **Framework preset:** None / ingen
- **Build command:** lämna tomt
- **Build output directory:** `public`
- **Root directory:** lämna tomt

Starta deploy.

Cloudflare ska nu publicera den statiska delen och även upptäcka `functions/` som Pages Functions.

Första deployen kan göras innan databasen är ansluten. Formuläret kan då visas, men inskick fungerar inte korrekt förrän D1-bindingen är klar.

---

# DEL 3 — Skapa D1-databasen utan Terminal

I Cloudflare-dashboarden:

1. Gå till **Storage & Databases → D1 SQL Database** (namnet kan visas något annorlunda beroende på dashboardversion).
2. Klicka **Create database**.
3. Namnge databasen: `leverage-audit`.
4. Skapa databasen.
5. Öppna databasen.
6. Välj fliken **Console**.
7. Klistra in SQL-koden nedan.
8. Klicka **Execute**.

```sql
CREATE TABLE IF NOT EXISTS audit_submissions (
  submission_id TEXT PRIMARY KEY,
  participant_id TEXT NOT NULL,
  audit_version TEXT NOT NULL,
  started_at TEXT,
  completed_at TEXT NOT NULL,
  duration_seconds INTEGER,
  answers_json TEXT NOT NULL,
  timings_json TEXT NOT NULL,
  diagnostic_json TEXT NOT NULL,
  analysis_status TEXT NOT NULL DEFAULT 'not_requested',
  analysis_json TEXT,
  analysis_updated_at TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_submissions_participant
  ON audit_submissions(participant_id);

CREATE INDEX IF NOT EXISTS idx_audit_submissions_completed
  ON audit_submissions(completed_at);

CREATE INDEX IF NOT EXISTS idx_audit_submissions_analysis_status
  ON audit_submissions(analysis_status);
```

Detta är samma schema som finns i `schema.sql` i repositoryt.

---

# DEL 4 — Koppla databasen till Pages

Öppna ditt Pages-projekt i Cloudflare:

1. Gå till **Settings**.
2. Öppna **Bindings**.
3. Klicka **Add**.
4. Välj **D1 database**.
5. Variable name ska vara exakt:

```text
DB
```

6. Välj databasen `leverage-audit`.
7. Spara.
8. Gör en ny deploy/redeploy så att bindingen börjar gälla.

`DB` måste skrivas exakt så eftersom serverkoden använder `context.env.DB`.

---

# DEL 5 — Lägg till lösenord för export

På Pages-projektet:

1. Gå till **Settings → Variables and Secrets**.
2. Klicka **Add**.
3. Variable name:

```text
EXPORT_TOKEN
```

4. Ange ett långt privat lösenord/token.
5. Välj **Encrypt / Secret**.
6. Spara och deploya om om Cloudflare begär det.

Du använder detta lösenord på:

```text
https://DIN-SIDA.pages.dev/admin.html
```

för att exportera pilotdata som CSV eller JSON.

Spara token någonstans säkert. Lägg den inte i GitHub.

---

# DEL 6 — Testa installationen

## Health check

Öppna:

```text
https://DIN-SIDA.pages.dev/api/health
```

Du ska få ett JSON-svar som visar att API och D1 fungerar.

## Testaudit

Öppna exempelvis:

```text
https://DIN-SIDA.pages.dev/?pid=TEST01
```

Fyll i hela auditen och skicka in den.

## Kontrollera databasen

Öppna D1-databasen i Cloudflare → **Console** och kör:

```sql
SELECT submission_id, participant_id, completed_at, analysis_status
FROM audit_submissions
ORDER BY completed_at DESC;
```

Du ska se `TEST01`.

## Testa export

Öppna:

```text
https://DIN-SIDA.pages.dev/admin.html
```

Ange `EXPORT_TOKEN` och ladda ner CSV eller JSON.

---

# Extern AI — avstängd tills vidare

Pilotappen är förberedd för att senare skicka auditdata till en extern AI eller automation, men det sker **inte** om du inte aktivt lägger till variabeln `EXTERNAL_ANALYSIS_URL`.

Låt därför följande vara odefinierade under första piloten:

- `EXTERNAL_ANALYSIS_URL`
- `EXTERNAL_ANALYSIS_TOKEN`
- `ANALYSIS_CALLBACK_TOKEN`

När vi senare aktiverar AI-lagret behöver formuläret eller databasen inte byggas om.

---

# När du vill ändra appen senare

Det fina med GitHub-upplägget är att Cloudflare automatiskt deployar nya versioner när `main` ändras.

Du kan därför senare:

1. öppna en fil i GitHub,
2. klicka pennikonen **Edit**,
3. göra ändringen,
4. klicka **Commit changes**.

Cloudflare bygger då automatiskt en ny version.

För större uppdateringar kan du även ladda upp ersättningsfiler via GitHub-webben.

---

# Rekommenderat för själva piloten

Skicka unika länkar:

```text
?pid=P01
?pid=P02
?pid=P03
```

Använd inte namn eller e-postadresser som pilot-ID om det inte finns ett faktiskt behov. Det gör pilotdatan enklare att hantera som pseudonymiserad data.
