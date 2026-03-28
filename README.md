# Bryllupsappen 💍

En komplett bryllupsplanlegger med gjesteportal, leverandørstyring, bordplan, budsjett og mer.

---

## Kom i gang

### 1. Klon og installer
```bash
git clone https://github.com/ditt-brukernavn/bryllupsapp.git
cd bryllupsapp
npm install
```

### 2. Sett opp miljøvariabler
```bash
cp .env.example .env
```
Åpne `.env` og fyll inn verdiene fra [Supabase-dashbordet](https://app.supabase.com):
- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public key** → `VITE_SUPABASE_ANON_KEY`

Du finner disse under: **Settings → API**

### 3. Sett opp databasen
1. Gå til Supabase → **SQL Editor → New Query**
2. Kopier innholdet fra `supabase/schema.sql`
3. Klikk **Run**

### 4. Start appen
```bash
npm run dev
```
Appen kjører på [http://localhost:5173](http://localhost:5173)

---

## Bygg for produksjon
```bash
npm run build
```
Output havner i `dist/` — kan deployes til Vercel, Netlify eller annen host.

### Deploy til Vercel (anbefalt)
1. Push til GitHub
2. Gå til [vercel.com](https://vercel.com) → **New Project** → velg repoet
3. Legg til miljøvariablene under **Environment Variables**
4. Deploy!

---

## Prosjektstruktur
```
bryllupsapp/
├── index.html
├── vite.config.js
├── package.json
├── .env.example          ← mal for miljøvariabler
├── .gitignore
├── supabase/
│   └── schema.sql        ← kjør i Supabase SQL Editor
└── src/
    ├── main.jsx           ← React entry point
    ├── App.jsx            ← hoved-app-komponent
    └── supabaseClient.js  ← Supabase-tilkobling
```

---

## Demo-brukere (innebygd)
| Brukernavn     | Passord       | Rolle     |
|----------------|---------------|-----------|
| sophie         | bryllup2025   | Planner   |
| marcus         | bryllup2025   | Planner   |
| gjest          | gjest123      | Gjest     |
| nordlys        | foto123       | Leverandør|

---

## Neste steg
- [ ] Koble `App.jsx` til Supabase (erstatt `localStorage` med Supabase-kall)
- [ ] Legg til Supabase Auth for ekte innlogging
- [ ] Aktiver Row Level Security i `schema.sql`
