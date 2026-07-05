# kaiyaa-space

## Cursor Cloud specific instructions

This repository is a single self-contained static web app: `index.html` (the entire app) plus `README.md`. There is no package manager, build step, lint config, or automated tests.

### Services
- **Static file server** (required): serve the repo root over HTTP, e.g. `python3 -m http.server 8000`, then open `http://localhost:8000/index.html`. No build or install step exists.
- **Supabase (remote, hosted)** (required for data): the app talks to a remote hosted Supabase project whose URL and publishable anon key are hardcoded in `index.html`. There is no local backend/database to run — it just needs outbound internet access.
- **CDNs** (required): Tailwind, Lucide, and `@supabase/supabase-js` are loaded from public CDNs at runtime, so internet access is needed to render the page.

### Non-obvious notes
- Owner/admin mode is gated purely client-side via `localStorage.setItem('kaiyaa_admin', 'true')` (then reload). It unlocks CRUD on media items / Hearthstone decks and site settings, which write to the remote Supabase project shared by everyone using that key.
- Section visibility (reading/watching/listening/hearthstone) is driven by the `site_settings` row in Supabase; a section only appears in the nav when its `*_visible` flag is true.
- There is nothing to lint, test, or build; "running" the app just means serving the static file.
