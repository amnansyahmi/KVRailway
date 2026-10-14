# Project instructions

Keep this a lightweight, dependency-free static PWA unless a real feature requires a framework or server. Preserve mobile and desktop use, safe-area support, accessible SVG controls, reduced-motion behavior and offline functionality.

Network accuracy comes before decorative changes. Read DATA_SOURCES.md before changing stations. Explicit walking links must stay distinct from in-station transfers. Planned and suspended services must never enter routing. Never label estimated journey times, preview vehicles or availability snapshots as live data.

Before pushing: `npm run check`, `npm run build`, `npm test`. Tests consume `dist`, so build first. Do not commit `dist`, credentials or the user-supplied PDF.

Keep README.md and .ai/PROGRESS.md accurate about what has been implemented, tested, pushed and deployed. Physical-device checks must not be claimed unless performed.
