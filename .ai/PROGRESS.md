# KV Railway progress

## Implemented

- New static PWA with 218 available stations across 12 operating lines.
- Service-aware routing, transfer-first option, optional separately ticketed airport trains and explicit walking connections.
- Responsive planner, interactive SVG map, optional 3D tilt, automatic animated train preview, saved and shareable journeys.
- Offline app cache, installation assets, reduced-motion and keyboard interaction support.
- Network source documentation, availability snapshot and exclusions.

## Latest upgrade

- Page zoom blocked by viewport, touch-action and gesture guards; SVG map zoom remains enabled.
- Dark map styling, exact reference palette, extracted curved rail shapes and improved station positions.
- Curved route highlighting and playback on the rail shapes.
- Parking layers and explorer: 116 station records, with 31 operator-supported records and source/unknown distinctions.
- 44 individually sourced MRT facility profiles and separate Facilities / Parking / Connections tabs.
- Parking choices along the departure line can become journey starting stations.
- Corrected planned KG12 Bukit Kiara Selatan and the unavailable Maluri at-grade car park.

## Mobile playback fix

- Found autoplay running while the mobile map was below the long journey/parking section; Network tab did not restart a completed preview.
- Playback now advances only while the map is visible, pauses on hidden pages/modals, and resumes without counting time off screen.
- Submitting a route on mobile opens Network; opening Network can replay a completed journey.
- Explicit Pause remains paused when scrolling away and back.
- Reduce Motion blocks automatic playback but explicit Play/Replay and a static, user-selected 3D view remain available.
- Coarse-pointer rendering avoids animated SVG blur/shadow filters and uses a composited map plane.

## Malaysia rail upgrade

- Added a second network scope with 44 ETS corridor stations and 20 planned ECRL passenger stations.
- Added a bundled Natural Earth 50m static Malaysia SVG, interactive geographic overlays, map-only zoom, station sheets, animated corridor playback, manual reduced-motion playback and optional 3D tilt.
- Added ETS timetable / KITS / onboard sources; ECRL phase targets and planned status remain visible.
- Butterworth branch changes are disclosed; no invented direct service, fare, departure, seat or duration.
- National saved/shareable corridors are separate from city saved journeys. Linked ETS station details open the existing Klang Valley facilities/parking explorer.
- Added national continuity / reverse / branch / phase / operating exclusion / geographic projection / offline cache tests.
- Inspected the rendered static geographic basemap and station overlays. This is artwork verification, not browser/device QA.

## Verified

- JavaScript syntax checks and static build.
- 41 automated checks for known journeys, directions, transfer counts, exclusions, connectivity to every available station, manifest/icon validity and offline navigation fallback.

## Verification limit

The original build did not have browser QA. The 19 October 2026 UI pass now has headless Chromium verification as recorded below. Physical-device Safari/Chrome rendering, installation and real multi-touch behavior remain unverified.

## Delivery

- Source pushed to `amnansyahmi/KVRailway`, branch `main`, using the connected GitHub API.
- Private app preview published successfully: https://kvrailway.arautroopers.chatgpt.site
- Vercel-ready static build configuration is included; no Vercel deployment was created in this session.

## Next worthwhile work

- Operator timetable/headway integration and actual fare data, if an authorised source becomes available.
- Measured walking durations and station access guidance.
- Malay language option and optional operator disruption feeds.


## Apple-inspired UI — 19 October 2026 (20 October MYT)

- System font stack, neutral grouped surfaces, blue action hierarchy, larger field text and journey summaries.
- Shared visual styling across city and Malaysia planners, ETS/ECRL service selection, parking/station sheets and saved journeys.
- Desktop Plan / Network / Saved navigation and a floating mobile navigation bar with safe-area support. Desktop Saved now exposes the existing saved-journey flow.
- Translucency only on navigation/floating map controls, with solid CSS fallbacks and reduced-transparency/increased-contrast preferences. Existing reduced-motion behavior retained.
- Matching blue SVG and raster install icons, including a padded maskable icon; matching app theme/background.
- New local stylesheet is automatically included in the content-hashed offline precache. No dependencies added and no route/station/source data changed.
- The requested `apple-design` skill was not available in the local or connected catalogs. Apple's official Human Interface Guidelines were used as an explicitly disclosed fallback.

### Verification

- `npm run check`, `npm run build`, `npm test`: all 41 existing checks passed.
- Headless Chromium: city and national views checked at 320, 390, 768, 1024 and 1440px without horizontal overflow. Navigation buttons met 44px minimum dimensions.
- Verified keyboard station selection; mobile form submission opens Network; city and national saving/loading; desktop Saved navigation; parking modal search; zoom; deliberate 3D with Reduce Motion; offline reload including the new stylesheet.
- Browser run reported no JavaScript errors and no failed HTTP responses.
- Reviewed desktop, mobile planner, city network and ECRL network screenshots. Headless browser checks do not verify Safari or physical-device installation/gestures.

### Delivery

- Review branch: `feat/apple-inspired-ui`; intended for a draft pull request against `main`.
- No merge to `main` or deployment performed for this UI pass.
