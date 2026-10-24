# Shortlist React

A React and CSS directory of 40 AI tools. Built with Vite and deployed to GitHub Pages. The app includes searchable, filterable browsing, tool detail pages, saved favorites, a scored three-question recommender, and light/dark themes.

## Run locally

Install Node.js 24 or newer, then run these commands in PowerShell:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite. For a production build, run `npm.cmd run build`; the deployable site is written to `dist/`. On macOS or Linux, use `npm` in place of `npm.cmd`.

## Deploy to GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and deploys the app whenever changes are pushed to `main`. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. Hash-based routes work under the repository's project URL.

## Project structure

- `src/App.jsx` contains the React views, navigation, filters, recommendations, and saved state.
- `src/main.jsx` mounts the app and imports the shared styles and tool data.
- `assets/data.js` is the source for all 40 tool and category records.
- `assets/styles.css` contains the responsive design system and component styles.
- `vite.config.js` configures Vite with relative asset paths for GitHub Pages.

All site views are rendered by React. The root `index.html` is only the Vite mount document; GitHub Pages publishes the compiled React app from `dist/`.
