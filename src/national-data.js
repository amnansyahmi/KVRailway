// Published corridor station names: KTMB ETS timetable effective 1 June 2026.
// Coordinates are approximate town/station-area positions, not entrance pins or surveyed track alignment.
export const nationalSources={ets:'https://www.ktmb.com.my/assets/pdf/2026/Jadual%20Tren%20ETS%201%20Jun%202026.pdf',tickets:'https://online.ktmb.com.my/',etsFacilities:'https://www.ktmb.com.my/Onboard.html',ecrl:'https://www.mrl.com.my/east-coast-rail-link',ecrlAlignment:'https://www.mrl.com.my/wp-content/uploads/2023/05/ECRL-Alignment-1552023.pdf',ecrlStatus:'https://www.mrl.com.my/announcement/fdc8e46ac0lwdnbmsjjtwmag',map:'https://www.naturalearthdata.com/about/terms-of-use/'};
export const nationalFullView=[0,0,1000,820],peninsularView=[25,25,510,725];
export const geoPoint=(lon,lat)=>({x:60+(lon-99.5)*92,y:55+(7.4-lat)*92});
function station(id,name,state,lat,lon,extra={}){return {id,name,state,lat,lon,...geoPoint(lon,lat),...extra};}
export const etsStations=[
 station('ets-padang-besar','Padang Besar','Perlis',6.66,100.32),
 station('ets-arau','Arau','Perlis',6.43,100.27),
 station('ets-anak-bukit','Anak Bukit','Kedah',6.19,100.37),
 station('ets-alor-setar','Alor Setar','Kedah',6.11,100.36),
 station('ets-gurun','Gurun','Kedah',5.82,100.47),
 station('ets-sungai-petani','Sungai Petani','Kedah',5.64,100.49),
 station('ets-tasek-gelugor','Tasek Gelugor','Penang',5.48,100.50),
 station('ets-bukit-mertajam','Bukit Mertajam','Penang',5.37,100.43),
 station('ets-nibong-tebal','Nibong Tebal','Penang',5.16,100.48),
 station('ets-parit-buntar','Parit Buntar','Perak',5.12,100.49),
 station('ets-bagan-serai','Bagan Serai','Perak',5.01,100.54),
 station('ets-taiping','Taiping','Perak',4.85,100.73),
 station('ets-kuala-kangsar','Kuala Kangsar','Perak',4.78,100.94),
 station('ets-sungai-siput','Sungai Siput','Perak',4.82,101.07),
 station('ets-ipoh','Ipoh','Perak',4.60,101.07),
 station('ets-batu-gajah','Batu Gajah','Perak',4.47,101.04),
 station('ets-kampar','Kampar','Perak',4.30,101.16),
 station('ets-tapah-road','Tapah Road','Perak',4.17,101.20),
 station('ets-sungkai','Sungkai','Perak',3.99,101.31),
 station('ets-slim-river','Slim River','Perak',3.83,101.40),
 station('ets-tanjung-malim','Tanjung Malim','Perak',3.69,101.52,{cityStation:'tanjung-malim'}),
 station('ets-batang-kali','Batang Kali','Selangor',3.47,101.66,{cityStation:'batang-kali'}),
 station('ets-rawang','Rawang','Selangor',3.32,101.58,{cityStation:'rawang'}),
 station('ets-sungai-buloh','Sungai Buloh','Selangor',3.21,101.58,{cityStation:'sungai-buloh'}),
 station('ets-kepong-sentral','Kepong Sentral','Kuala Lumpur',3.21,101.63,{cityStation:'kepong-sentral'}),
 station('ets-kuala-lumpur','Kuala Lumpur','Kuala Lumpur',3.139,101.693,{cityStation:'kuala-lumpur'}),
 station('ets-kl-sentral','KL Sentral','Kuala Lumpur',3.134,101.687,{cityStation:'kl-sentral'}),
 station('ets-bandar-tasik-selatan','Bandar Tasik Selatan','Kuala Lumpur',3.077,101.711,{cityStation:'bandar-tasik-selatan'}),
 station('ets-kajang','Kajang','Selangor',2.982,101.79,{cityStation:'kajang'}),
 station('ets-seremban','Seremban','Negeri Sembilan',2.72,101.94,{cityStation:'seremban'}),
 station('ets-pulau-sebang','Pulau Sebang / Tampin','Melaka',2.46,102.23,{cityStation:'pulau-sebang'}),
 station('ets-batang-melaka','Batang Melaka','Melaka',2.45,102.37),
 station('ets-gemas','Gemas','Negeri Sembilan',2.58,102.61),
 station('ets-segamat','Segamat','Johor',2.51,102.81),
 station('ets-labis','Labis','Johor',2.39,103.02),
 station('ets-bekok','Bekok','Johor',2.29,103.13),
 station('ets-paloh','Paloh','Johor',2.20,103.19),
 station('ets-kluang','Kluang','Johor',2.03,103.32),
 station('ets-rengam','Rengam','Johor',1.88,103.40),
 station('ets-layang-layang','Layang-Layang','Johor',1.82,103.47),
 station('ets-kulai','Kulai','Johor',1.66,103.60),
 station('ets-kempas-baru','Kempas Baru','Johor',1.54,103.71),
 station('ets-jb-sentral','JB Sentral','Johor',1.463,103.764),
 station('ets-butterworth','Butterworth','Penang',5.40,100.363,{branch:true})
];
export const etsMain=etsStations.filter(s=>!s.branch).map(s=>s.id);
export const etsBranches=[['ets-bukit-mertajam','ets-butterworth']];
export const ecrlStations=[
 station('ecrl-kota-bharu','Kota Bharu','Kelantan',6.08,102.26,{phase:1}),
 station('ecrl-pasir-puteh','Pasir Puteh','Kelantan',5.84,102.40,{phase:1}),
 station('ecrl-jerteh','Jerteh','Terengganu',5.73,102.49,{phase:1}),
 station('ecrl-bandar-permaisuri','Bandar Permaisuri','Terengganu',5.52,102.76,{phase:1}),
 station('ecrl-kuala-terengganu','Kuala Terengganu','Terengganu',5.28,103.04,{phase:1}),
 station('ecrl-dungun','Dungun','Terengganu',4.75,103.37,{phase:1}),
 station('ecrl-kemasik','Kemasik','Terengganu',4.42,103.45,{phase:1}),
 station('ecrl-chukai','Chukai','Terengganu',4.24,103.40,{phase:1}),
 station('ecrl-cherating','Cherating','Pahang',4.13,103.40,{phase:1}),
 station('ecrl-kuantan-port-city','Kuantan Port City','Pahang',3.98,103.36,{phase:1}),
 station('ecrl-kota-sas','KotaSAS','Pahang',3.87,103.26,{phase:1}),
 station('ecrl-paya-besar','Paya Besar','Pahang',3.76,103.09,{phase:1}),
 station('ecrl-maran','Maran','Pahang',3.59,102.78,{phase:1}),
 station('ecrl-temerloh','Temerloh','Pahang',3.46,102.40,{phase:1}),
 station('ecrl-bentong','Bentong','Pahang',3.45,101.94,{phase:1}),
 station('ecrl-itt-gombak','ITT Gombak','Selangor',3.23,101.72,{phase:1,cityStation:'gombak'}),
 station('ecrl-serendah-baru','Serendah Baru','Selangor',3.38,101.61,{phase:2}),
 station('ecrl-puncak-alam','Puncak Alam','Selangor',3.22,101.42,{phase:2}),
 station('ecrl-kapar','Kapar','Selangor',3.14,101.37,{phase:2}),
 station('ecrl-jalan-kastam','Jalan Kastam / Port Klang','Selangor',3.02,101.40,{phase:2,cityStation:'jalan-kastam'})
].map(s=>({...s,status:'planned'}));
export const nationalStationById=Object.fromEntries([...etsStations,...ecrlStations].map(s=>[s.id,s]));
export const nationalService={ets:{name:'KTM ETS',color:'#e8c46c',status:'available',badge:'Operating rail corridor',source:nationalSources.ets,stations:etsStations},ecrl:{name:'ECRL',color:'#52c2c0',status:'planned',badge:'Planned · preview only',source:nationalSources.ecrl,stations:ecrlStations}};
