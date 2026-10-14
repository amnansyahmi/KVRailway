# Network data and credits

Snapshot: **14 October 2026**, Malaysia time.

## Layout reference

User-supplied **Klang Valley Transit System Map by ziqtofu.pdf**, designed by **@ziqtofu**, PDF metadata dated 13 October 2026. The station sequences and line identity were transcribed; the application uses an interactive schematic SVG with extracted centreline curves, sRGB line colours and marker positions. The original PDF is not included in this public repository. Credit is visible in the app and its information dialog.

## Availability references

- Rapid KL, Shah Alam Line: https://myrapid.com.my/bus-train/rapid-kl/shah-alam-line/ — 20 operating stations.
- Prasarana opening release: https://myrapid.com.my/wp-content/uploads/2026/06/PRASARANA-LALUAN-SHAH-ALAM-RASMI-DIBUKA-MEMPERKUKUH-MOBILITI-DAN-KESALINGHUBUNGAN-LEMBAH-KLANG_Website.pdf — operating from 29 June 2026.
- Prasarana July FAQ: https://myrapid.com.my/wp-content/uploads/2026/07/Soalan-Lazim-Lanjutan-Perkhidmatan-Percuma-Laluan-Shah-Alam.pdf — Bandar Utama to Johan Setia via 20 stations.
- MRT Corp, Circle Line: https://www.mymrt.com.my/projects/mrt3-circle-line/ — planned project; never used for routing.
- KTMB, commuter terms effective April 2026: https://www.ktmb.com.my/assets/pdf/2026/T%26C%20Komuter%20April%202026.pdf — KL Sentral–Terminal Skypark temporarily closed.
- MRT Corp, Kajang Line: https://www.mymrt.com.my/projects/kajang-line/ — Sungai Buloh and Kampung Selamat migrated to Putrajaya Line.

Operator starting points: https://myrapid.com.my/ · https://www.ktmb.com.my/ · https://www.kliaekspres.com/

## Transcription decisions

- Planned stations shown grey in the reference remain in the visual dataset but cannot be selected as route endpoints or used as stops. Through travel on an operating line bridges those future stops.
- Shah Alam's grey Tropicana, Temasya, Raja Muda, Bukit Raja Selatan and Bandar Botanik stations remain planned. Its 20 available stations enter routing.
- The source calls SA6 “Subang”; this is displayed as Subang (LRT) to distinguish it from Subang Jaya. Station positions are illustrative, not geographic.
- The source repeats KJ25 and several SP28 codes. Kelana Jaya and Sri Petaling codes are normalised to their line sequence; Kinrara BK3 and Kampung Seri Aman remain outside the operating dataset.
- BRT SunU–Monash is SB5; the source repeats SB4. The app uses its normalised sequence.
- “Putrajaya & Cyberjaya” and “Putrajaya Sentral” are represented as the shared Putrajaya Sentral interchange.
- Stations with distinct platforms/locations (Sentul KTM/LRT, Salak Selatan KTM/LRT, Ampang Park MRT/LRT, Bukit Bintang MRT/Monorail, Bandar Utama MRT/LRT, Abdullah Hukum KTM/LRT, KL Sentral Monorail) are kept distinct and, where shown connected, joined with an explicit walking edge.
- Transfer walks are heuristic 5–7 minute estimates, not measured accessibility or walking directions. Shared interchange line changes allow 4 minutes. Actual access can differ.
- Ride times use line-level assumptions (roughly 2–3 minutes for urban stops, longer KTM intervals and airport segments). These estimates are for route comparison only. No timetable/headway data is available; “fastest” means fastest within this model.
- The future KTM KA4B label is unspecified in the source and is identified generically as a provisional station.

## Maintenance

Recheck operator sources before changing service availability. Add a targeted route test for each new interchange or operating station. Do not enable MRT3, Skypark or planned stations merely because they appear on a map. Temporary disruptions, maintenance closures and changes after the snapshot are not ingested automatically.


## Parking and facilities upgrade

- Facilities are station-specific records from 44 successfully read MRT Corp station pages, under `https://www.mymrt.com.my/projects/putrajaya-line/stations/` and `https://www.mymrt.com.my/projects/kajang-line/stations/`. Each profile carries its exact source URL and check date. Unread station facilities remain unknown, including many LRT/KTM stations.
- Parking marks were extracted from the PDF's blue symbols and reviewed against labels. There are 116 parking records for available stations after adding operator-supported facilities absent from the map. A map mark alone does not prove a dedicated, operating Park & Ride.
- 31 records have operator evidence from a station-specific facilities page, dedicated Park & Ride page, or named Rapid KL facility notice. Older Rapid KL notices confirm the facility but their historic prices are not reused as current prices. The UI discloses this limitation.
- Bay counts refer to total capacity, not live spaces. Rates are recorded only from individual MRT Corp parking pages. Owner-managed stations use “charges set by parking owner”. Eligible MRT-user rates have same-card and return-trip conditions. Snapshot prices may change.
- The Maluri at-grade parking page says “Not Operational / No Parking Fees Collection”. It is labelled unavailable and excluded from parking alternatives: https://www.mymrt.com.my/projects/travel-with-mrt/park-n-ride/maluri-at-grade/ . This does not assert that all nearby Maluri parking is closed.
- Rapid KL's Park & Ride page supplied Gombak/Ampang capacities via indexed official results; the page blocked full retrieval. No current price was inferred: https://myrapid.com.my/bus-train/rapid-kl/park-ride/ .
- PDF orange bus-terminal marks are represented for Gombak, KL Sentral, Pasar Seni, Titiwangsa, Bandar Tasik Selatan and Putrajaya Sentral. Airport terminal marks are represented separately. An airport terminal does not imply its suspended rail service is available.
- Map-based stations and route coordinates are schematic, never latitude/longitude. External parking links use a named station search and do not pretend to target a surveyed car-park entrance.
- MRT Corp's operating Kajang station list omits the reserved Bukit Kiara Selatan station. KG12 is now planned and excluded from routing; Phileo Damansara connects directly to Pusat Bandar Damansara. Current available-station count is 218.

Detailed parking sources are stored with each record in `src/parking-data.js`, including Kwasa Sentral, Bandar Utama, Pusat Bandar Damansara, Kajang, Sri Damansara Barat, Jinjang, Serdang Raya Utara, Taman Naga Emas, Taman Equine, UPM and Bukit Dukung. General MRT parking information: https://www.mymrt.com.my/projects/travel-with-mrt/park-n-ride/ .
