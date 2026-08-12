# Leverage Audit Pilot v0.1

Pilotwebb för Leverage Audit, byggd för **Cloudflare Pages + Pages Functions + D1**.

## Enklaste installationen

Vill du undvika Terminal helt: börja med **[START-HERE.md](START-HERE.md)**.

Den guiden beskriver:

- uppladdning via GitHubs webbgränssnitt,
- GitHub → Cloudflare Pages,
- D1-konfiguration via Cloudflares dashboard,
- SQL-schema via D1 Console,
- export-token via Cloudflare Secrets,
- test av deployment.

## Struktur

```text
public/                 Webbapp
functions/api/          Pages Functions / API
schema.sql              D1-schema
START-HERE.md           Installation utan Terminal
PILOT-GUIDE.md          Genomförande av pilot
package.json            Lokal utveckling, frivillig
wrangler.toml.example   CLI/config-as-code, frivillig
```

## API

- `POST /api/submit` — sparar audit i D1
- `GET /api/health` — enkel health check
- `GET /api/export` — skyddad CSV/JSON-export
- `POST /api/analysis-result` — framtida callback från extern analys

## Cloudflare-bindings

Obligatorisk:

- `DB` → D1-databasen

Rekommenderad:

- `EXPORT_TOKEN` → Secret för adminexport

Framtida/valfria:

- `EXTERNAL_ANALYSIS_URL`
- `EXTERNAL_ANALYSIS_TOKEN`
- `ANALYSIS_CALLBACK_TOKEN`

Extern AI är avstängd så länge `EXTERNAL_ANALYSIS_URL` inte är satt.

## Pilotprincip

Den här versionen är avsiktligt ett diagnostiskt pilotinstrument. Resultatmotorn är regelbaserad och använder inga externa benchmarks eller validerade normvärden. AI ska inte aktiveras förrän frågorna och regelmotorn har testats på riktiga respondenter.
