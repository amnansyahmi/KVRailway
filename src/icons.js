const paths={
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',swap:'<path d="M8 4v16m-4-4 4 4 4-4m4 4V4m-4 4 4-4 4 4"/>',
 train:'<rect x="6" y="3" width="12" height="15" rx="4"/><path d="M6 10h12m-8 8-2 3m6-3 2 3"/><path d="M9 14h.01M15 14h.01"/>',
 cube:'<path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10m-5-18 10 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
 fit:'<path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"/>',focus:'<circle cx="12" cy="12" r="6"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>',
 play:'<path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none"/>',pause:'<path d="M9 5v14M15 5v14" stroke-width="3"/>',
 replay:'<path d="M3 11a9 9 0 1 1 3 7M3 4v7h7"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
 save:'<path d="M6 3h12v18l-6-4-6 4z"/>',share:'<path d="M12 16V3m-4 4 4-4 4 4M7 11H4v10h16V11h-3"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',
 route:'<circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v6h12v4"/>',map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zm6-2v16m6-14v16"/>',
 trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',walk:'<circle cx="14" cy="4" r="2"/><path d="m7 12 4-4 4 4 4 1m-8-5-2 8-4 5m4-5 5 2 2 4"/>'};
export const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.train}</svg>`;
