# KV Railway

An independent, installable Klang Valley journey planner and Malaysia rail corridor explorer. Mobile-first, offline-ready and built without a runtime dependency or paid API.

## Features

- Apple-inspired interface with system typography, blue actions, grouped station fields, segmented network/service controls, and clear journey summaries.
- Desktop navigation and a safe-area-aware floating mobile tab bar; opaque content cards with translucency limited to navigation/map controls.
- Larger interactive targets, visible keyboard focus, reduced transparency and increased contrast support, with solid fallbacks when backdrop blur is unavailable.

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

- Switch between the original Klang Valley schematic and a static geographic Malaysia map.
- Explore 44 ETS corridor stations from Padang Besar / Butterworth to JB Sentral, with timetable and KITS links. Stops depend on the selected train.
- Preview 20 planned ECRL passenger stations, with January 2027 / January 2028 phase targets clearly separated from operating services.
- National station sheets, animated previews, optional 3D tilt, device-local saved corridors and shareable links.
- Bundled Natural Earth basemap, with an explicitly smaller Sabah/Sarawak context inset; no map API, live tiles or map token required.

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

National routes are illustrative geographic corridors, not surveyed rail geometry or confirmed bookable itineraries. ECRL is available only through explicit preview exploration and never joins operating routing. National parking/facilities are unknown unless a linked Klang Valley station has an existing source-backed record. Opening targets and timetable availability are snapshots, not live feeds.

The bundled map uses Natural Earth public-domain country outlines. To regenerate after downloading `ne_50m_admin_0_countries.geojson`, run `python scripts/build-malaysia-map.py /path/to/ne_50m_admin_0_countries.geojson`. Its projection must stay aligned with `geoPoint` in `src/national-data.js`.

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
| `src/national-data.js` | ETS/ECRL stations, phase targets, approximate geographic positions and official sources |
| `src/national-router.js` | Separate corridor exploration, explicit planned previews and animation geometry |
| `src/national-app.js` | National UI, map gestures, station sheets, saving and sharing |
| `public/maps/malaysia.svg` | Bundled Natural Earth 50m Malaysia basemap |
| `src/style.css` | Base layout, map rendering, CSS 3D view and reduced motion |
| `src/apple-ui.css` | Apple-inspired visual tokens, responsive controls, navigation, sheets and accessibility preferences |
| `public/sw.js` | Versioned offline shell cache; populated during build |
| `scripts/build.mjs` | Deterministic static build and cache-version hash |
| `tests/` | Routing, graph continuity, offline navigation and install assets |

## Validation

41 automated checks cover known journeys, reverse direction, planned/suspended exclusions, airport preferences, interchange walks, transfer minimisation, connectivity to every available station and offline navigation, plus national branch continuity, all endpoint combinations, southern ETS stations, ECRL phase/exclusion behavior and offline map caching. Headless Chromium checks passed for city and national views at 320, 390, 768, 1024 and 1440px: no horizontal overflow, keyboard station selection, mobile route submission to Network, city/national saves, desktop Saved navigation, parking search, map zoom, deliberate 3D with Reduce Motion, and offline reload with the new stylesheet. No JavaScript errors or failed HTTP responses were observed. These are browser checks; physical iPhone/Android installation, real touch gestures and Safari rendering still need checking.


## UI design reference

The named `apple-design` skill was unavailable in this session. The interface instead draws on Apple's official [Materials](https://developer.apple.com/design/human-interface-guidelines/materials), [Layout](https://developer.apple.com/design/human-interface-guidelines/layout), and [Typography](https://developer.apple.com/design/human-interface-guidelines/typography) guidance. This is an Apple-inspired web implementation, not a native Liquid Glass component. No framework, font download, or runtime package was added.
