# Quietcasts

A small, web-only podcast player inspired by the quiet, content-first feel of classic podcast apps.

## Run locally

```bash
npm install
npm run dev
```

For a production build and local preview:

```bash
npm run build
npm run preview
```

## Deploy with GitHub and Vercel

This project is configured for Vercel as a Vite single-page app. `vercel.json` keeps direct routes such as `/search`, `/podcast/:id`, and `/preview/:id` working after deployment.

To connect the local project to GitHub:

```bash
git init
git branch -M main
git remote add origin https://github.com/Ryna-Biz/Quitecasts.git
git add .
git commit -m "Initial Quietcasts web app"
git push -u origin main
```

Then in Vercel:

1. Choose **Add New Project**.
2. Import `Ryna-Biz/Quitecasts` from GitHub.
3. Keep the detected Vite settings:
	- Build command: `npm run build`
	- Output directory: `dist`
	- Install command: `npm install`
4. Deploy.

Future pushes to `main` will trigger a new Vercel deployment.

No Android tooling, backend, database, cloud account, API key, authentication, analytics, ads, or tracking is required.

## What is included

- Home with continue listening, new episodes, and discovery
- Search across podcast titles, authors, categories, and episode text
- Search the public iTunes podcast directory and add podcasts from their RSS feeds
- Preview online podcast descriptions and latest episodes before subscribing
- Podcast detail pages with subscriptions and episode actions
- Full-screen player and persistent mini-player
- Native browser audio with play, pause, seek, volume, speed, and 15/30-second skips
- Playback position, speed, subscriptions, history, queue, and download markers saved to localStorage
- Keyboard controls: Space to play/pause, Left Arrow to skip back, Right Arrow to skip forward
- Media Session controls where the browser supports them
- Responsive desktop sidebar and mobile bottom navigation

## Architecture

- `src/data/` contains replaceable mock podcast and episode data.
- `src/types/` contains the catalog contracts.
- `src/services/audio.ts` owns one native `HTMLAudioElement`.
- `src/services/storage.ts` safely reads and writes localStorage state.
- `src/context/PlayerContext.tsx` is the central player state and action boundary.
- `src/components/` contains shared navigation, artwork, rows, controls, and player UI.
- `src/pages/` contains route-level screens.
- `src/App.tsx` uses lightweight History API routing so no routing dependency is needed.

## Dependencies

Runtime:

- React
- React DOM

Development:

- Vite
- TypeScript
- `@vitejs/plugin-react`
- React type definitions

## Known limitations

The initial catalog uses mock data and publicly accessible remote artwork/audio URLs. Audio availability depends on the remote host and the browser network. Replace the files in `src/data/` with an RSS/API adapter later without changing the page components.

Online search uses Apple's public iTunes Search API. Selecting an online result first previews its RSS metadata and latest episodes without saving it. The `Subscribe and add` action then stores the podcast and up to 50 recent episodes in localStorage and opens the new podcast page. Some publishers block browser RSS requests with CORS; in that case the app still shows the directory metadata and allows subscribing, while clearly explaining that episodes could not be loaded.

The Download control stores a local marker for the episode, but it does not claim to cache audio for offline use. Reliable cross-browser persistent audio downloads require a larger storage and service-worker strategy than this minimal first version. Playback state remains available through localStorage.

Media Session support varies by browser. The app gracefully keeps its in-page controls when the API is unavailable.
