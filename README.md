# KV Railway

An independent, installable Klang Valley journey planner. Mobile-first, offline-ready and built without a runtime dependency or paid API.

## Features

- Search 218 available stations by name or station code.
- Estimated-fastest or fewer-transfer routing across 12 available lines.
- Clear boarding instructions, train directions, stops and explicit walking links.
- Interactive SVG network: pan, pinch, zoom, focus a line or journey, and choose stations on the map.
- Animated route reveal and train preview with pause/replay; optional CSS 3D map tilt.
- Visible-map playback: phone route submissions open Network, off-screen time is paused and completed previews can replay when returning to Network.
- Reduced-motion support with deliberate Play/Replay still available, keyboard station search, accessible controls, safe-area-aware mobile navigation.
- Page zoom locked, while map pinch, wheel and zoom controls change only the SVG map.
- Station explorer with 44 station-specific MRT facility profiles, explicit connecting walks and Maps search links.
- Parking markers and a searchable explorer covering 116 operating stations, including 31 operator-supported Park & Ride records.
- Published bay counts and charges only where sourced; unverified map parking stays clearly labelled.
- Parking alternatives on departure lines can become route origins.
- Save journeys on the device and share instructions and a reproducible journey link.
- Standalone PWA with PNG install icons and versioned offline app caching.
- Planned lines/stations and suspended Skypark Link visible as optional reference overlays, excluded from routing.

## Run and deploy

Node 22+; no package installation or environment variables required.

```sh
npm run check
npm run build
npm test
```

Serve `dist/` on any HTTPS static host. Vercel auto-detects `vercel.json` (`npm run build`, output `dist`). GitHub Pages requires adapting the root-relative URLs if deployed under a repository path. A private ChatGPT Sites preview uses `.openai/hosting.json`.

For a local preview outside the managed ChatGPT Sites environment, serve `dist/` with any static HTTP server. Service workers run on HTTPS or localhost.

On iPhone: Safari → Share → Add to Home Screen. On Android: browser install menu or the in-app Install button. Load the app completely once before using it offline.

## Accuracy and scope

The supplied October 2026 transit map by **@ziqtofu** is the layout/network reference. The SVG uses extracted line curves, colours and marker positions from the reference; it does not redistribute the PDF. See [DATA_SOURCES.md](DATA_SOURCES.md) for the availability checks and transcription decisions.

Times are heuristic estimates of riding and transferring. They **exclude waiting, real-time delays, first/last trains and operating hours**. The animated train is a preview, not a tracked vehicle. No fares, platform numbers, live status, or accessibility guarantees are inferred. ERL routes are opt-in, because they can introduce separately ticketed airport train shortcuts.

Walking links may require leaving ticket gates. Confirm current schedules and station access with Rapid KL, KTMB and ERL before travelling. Planned and suspended availability is a snapshot and requires maintenance.

## Structure

| File | Responsibility |
| --- | --- |
| `src/network.js` | Line sequences, availability, station codes, schematic positions, walking links |
| `src/facilities.js` | Station facilities, parking provenance and parking alternatives |
| `src/explorer.js` | Station sheets, parking browser and map station search |
| `src/gestures.js` | Page zoom prevention and clamped map zoom |
| `src/geometry.js` | Curve-following route rendering and train animation |
| `src/reference.js` | PDF line shapes, station coordinates and colour palette |
| `src/router.js` | Service-aware shortest path, transfer counting and boarding direction |
| `src/app.js` | Search, interactive map, animation, sharing and device-local saved journeys |
| `src/style.css` | Responsive desktop/mobile design, CSS 3D view and reduced motion |
| `public/sw.js` | Versioned offline shell cache; populated during build |
| `scripts/build.mjs` | Deterministic static build and cache-version hash |
| `tests/` | Routing, graph continuity, offline navigation and install assets |

## Validation

34 automated checks cover known journeys, reverse direction, planned/suspended exclusions, airport preferences, interchange walks, transfer minimisation, connectivity to every available station and offline navigation. Interactive browser/device QA was not available in the build environment; physical iPhone/Android install and touch behavior still need checking.
