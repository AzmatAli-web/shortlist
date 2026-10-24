# Shortlist — AI tools worth keeping

A hand-edited directory of 40 AI tools, built as a dependency-free static site. Categorised browsing, a three-question recommender with transparent scoring, and a saved shortlist that lives in the browser.

## Pages

| File | What it does |
| --- | --- |
| `index.html` | Home: hero search, the editor's pick, six picks, the eight-job index, recent additions, method, and the recommender call to action |
| `browse.html` | The directory: 40 entries with category, price, platform, sort, picks and text search. Filters are reflected in the URL |
| `tools/<id>.html` | One pre-rendered page per tool: why it is here, what it is good at, what to watch, at-a-glance facts, alternatives |
| `recommend.html` | Three questions (job, budget, platform) scored against all 40 tools, with reasons, alternates and save-all |
| `favorites.html` | The saved shortlist, grouped by job, with affinity recommendations, copy-as-text and clear-all |
| `404.html` | Not-found page with routes back into the directory |

## Run it

Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000 --directory shortlist
```

Then visit `http://localhost:8000`. A local server is recommended: the Clipboard API used by **Copy list** is only available in a secure context. When it is blocked, the site falls back to a dialog with the list pre-selected.

There is no build step at runtime, no external font, script or image request, and no tracking. The only network requests are the ones a visitor makes by clicking **Visit site**.

## Features

- **Categorised browsing** — eight jobs (`write`, `design`, `code`, `video`, `audio`, `work`, `auto`, `data`), five tools each. Category, price, platform and editorial-pick filters, A–Z / newest sorting, and search across names, taglines, tags, categories and strengths.
- **Recommendations** — a deterministic three-question scorer. Budget and native platform add weight; editor's picks get a small nudge; reasons shown as chips. An "also worth a look" pair sits below the top three. If an open-source request has no open-source match in that job, the result note says so rather than pretending.
- **Favourites** — stored in `localStorage` under `shortlist.saved.v1`. The header count, every star and the favourites page stay in sync, including across tabs. The page groups saved tools by job, suggests unsaved tools from the same and adjacent jobs, copies a plain-text list, and clears with a two-step confirmation.
- **Theme** — light and dark, following the system on first visit and remembered under `shortlist.theme`. The chosen theme is applied before the first paint.
- **Keyboard and motion** — skip link, visible focus rings, `aria-pressed` state on every toggle, live result counts, `/` focuses search, native `<dialog>` for the copy fallback, and reduced-motion support.

## Structure

```
shortlist/
├── index.html
├── browse.html
├── favorites.html
├── recommend.html
├── 404.html
├── assets/
│   ├── styles.css      design tokens, components, responsive rules, dark theme
│   ├── app.js          favourites, filters, recommendations, theme
│   ├── data.js         the 40-tool dataset (window.SL)
│   └── favicon.svg
└── tools/              one static page per tool (40 files)
```

## Editing content

`assets/data.js` is the single data source for the directory, the recommender and the favourites recommendations. Each entry carries: `id`, `n` (name), `ab` (two-letter plate), `c` (category), `t` (tagline), `p` (price model), `pl` (platforms), `tags`, `url`, `note`, `good`, `watch`, and optionally `pick`, `pickNote`, `added`, `newRank`.

The tool pages in `tools/` are pre-rendered from the same dataset so they read without JavaScript and carry their own title and description. If you add a tool, add its entry to `assets/data.js` and create the matching `tools/<id>.html` page using an existing entry as the pattern.

## Verified

- **45 pages** crawled in headless Chrome at 1280 px: zero console errors, zero uncaught exceptions, zero failed requests.
- **No horizontal overflow** at 1440 px or 390 px on home, directory, tool, favourites, recommendations and 404, and across a 108-combination breakpoint sweep from 320 px to 1280 px (all six page types).
- **Interaction tests** passed: save → count → reload persistence; unsave; category, price and picks filters; A–Z and newest sort; text search; empty state and reset; saved-tools list, removal focus, clear-all confirmation; quiz flow, save-all, start-over; copy fallback dialog and Escape to close; dark-theme persistence; `/` search shortcut.
- **Opened from disk** (`file://`) as well as over HTTP: filters, theme, saving, favourites and the quiz all work, and the copy fallback appears when the Clipboard API is blocked.
- **HTML checks**: one `h1` per page, no duplicate IDs, every internal link and asset resolves, every page has a title, description, viewport and skip link.
- **Contrast**: body and secondary text meet WCAG AA on paper, surface and the footer band in both themes (faint metadata included).

Verified with Google Chrome 155 on Windows. The layout uses system fonts, CSS grid and `color-mix()` with a solid-colour fallback.
