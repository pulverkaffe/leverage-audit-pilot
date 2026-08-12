# Cloudflare-installation — Leverage Audit Pilot v0.1

Det här är den enklaste vägen. Du behöver ett Cloudflare-konto och Node.js installerat på datorn.

## 1. Packa upp och öppna Terminal

Gå till projektmappen:

```bash
cd leverage-audit-cloudflare
npm install
```

## 2. Logga in i Cloudflare från terminalen

```bash
npx wrangler login
```

Ett webbläsarfönster öppnas där du godkänner åtkomst.

## 3. Skapa Pages-projektet

```bash
npx wrangler pages project create leverage-audit-pilot
```

Välj `main` som production branch om Cloudflare frågar.

## 4. Skapa D1-databasen

```bash
npx wrangler d1 create leverage-audit
```

Cloudflare visar ett database ID. Du behöver inte lägga in det i koden om du använder dashboard-bindingen i steg 6.

## 5. Skapa tabellen i D1

```bash
npx wrangler d1 execute leverage-audit --remote --file=./schema.sql
```

Svara `y` om Wrangler ber om bekräftelse.

## 6. Koppla databasen till Pages

I Cloudflare-dashboarden:

1. Workers & Pages
2. Öppna `leverage-audit-pilot`
3. Settings → Bindings
4. Add → D1 database binding
5. Variable name: **DB**
6. Välj databasen **leverage-audit**
7. Save

Binding-namnet måste vara exakt `DB` eftersom Functions-koden använder `context.env.DB`.

## 7. Skapa ett exportlösenord

Kör:

```bash
npx wrangler pages secret put EXPORT_TOKEN --project-name leverage-audit-pilot
```

Skriv ett långt slumpmässigt lösenord när Wrangler frågar. Spara det i din password manager.

Det används på `/admin.html` för att exportera pilotdata till CSV eller JSON.

## 8. Deploya

Från projektmappen:

```bash
npx wrangler pages deploy public --project-name leverage-audit-pilot
```

Wrangler visar din `pages.dev`-adress när deployen är klar.

## 9. Kontrollera att databasen fungerar

Öppna:

`https://DIN-ADRESS.pages.dev/api/health`

Du ska få ungefär:

```json
{"ok":true,"checks":{"function":true,"d1":true}}
```

Gör sedan en test-audit med exempelvis:

`https://DIN-ADRESS.pages.dev/?pid=TEST01`

Efter att auditen är slutförd ska resultatsidan säga **Pilotdata sparad i Cloudflare.**

## 10. Exportera svar

Öppna:

`https://DIN-ADRESS.pages.dev/admin.html`

Ange din `EXPORT_TOKEN` och välj CSV eller JSON.

---

# Extern AI senare — redan förberett

Pilotversionen skickar **inte** data till någon extern AI som standard.

Om vi senare vill aktivera det sätter vi två secrets/variables i Cloudflare:

- `EXTERNAL_ANALYSIS_URL` — endpoint som tar emot vårt diagnostic JSON
- `EXTERNAL_ANALYSIS_TOKEN` — bearer token för endpointen, om den kräver det

När `EXTERNAL_ANALYSIS_URL` finns kommer `/api/submit` automatiskt att vidarebefordra en kopia efter att svaret först har sparats säkert i D1.

För att en extern analystjänst ska kunna skriva tillbaka sitt resultat till D1 finns endpointen:

`POST /api/analysis-result`

Den skyddas med secret:

```bash
npx wrangler pages secret put ANALYSIS_CALLBACK_TOKEN --project-name leverage-audit-pilot
```

Callback-requesten ska ha:

```http
Authorization: Bearer DIN_ANALYSIS_CALLBACK_TOKEN
Content-Type: application/json
```

med body:

```json
{
  "submission_id": "...",
  "analysis": {
    "report": "..."
  }
}
```

Det här behöver inte aktiveras under de första 5–10 testerna.

## Om något går fel

- `/api/health` visar `d1:false` → kontrollera D1-bindingen och att den heter `DB`.
- Auditen fungerar men data sparas inte → titta i Workers & Pages → projektet → Functions logs.
- Export ger 401 → fel `EXPORT_TOKEN`.
- Export ger 503 → `EXPORT_TOKEN` är inte konfigurerad.
