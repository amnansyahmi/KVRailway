import {referencePoints,referenceColors} from './reference.js';
// Schematic alignment transcribed from @ziqtofu's October 2026 reference.
// Coordinates describe a diagram, not geographic locations. See DATA_SOURCES.md.
export const DATA_DATE = '14 October 2026';
const stationsById = new Map();
export const lines = [];
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
function line(id, number, name, type, color, minutes, text, status='available', airport=false) {
 const stops=text.trim().split('\n').filter(row=>row.trim()).map(row=>{
  const [code,name,xy,state='',side='r']=row.trim().split('|');
  const [x,y]=xy.split(',').map(Number);const sid=slug(name);
  if(!stationsById.has(sid))stationsById.set(sid,{id:sid,name,x,y,lines:[],codes:[],status:state||status,side});
  const station=stationsById.get(sid);station.lines.push(id);station.codes.push(code);
  if((state||status)==='available')station.status='available';
  return {station:sid,code,status:state||status,x,y};
 });
 lines.push({id,number,name,type,color,minutes,status,airport,stops});
}
line('kj','5','Kelana Jaya','LRT','#e84382',2.5,`
KJ1|Gombak|474,100
KJ2|Taman Melati|474,119
KJ3|Wangsa Maju|474,138
KJ4|Sri Rampai|474,157
KJ5|Setiawangsa|460,177
KJ6|Jelatek|443,191
KJ7|Dato’ Keramat|431,202
KJ8|Damai|418,213
KJ9|Ampang Park (LRT)|408,225
KJ10|KLCC|398,239
KJ11|Kampung Baru|382,250
KJ12|Dang Wangi|367,263
KJ13|Masjid Jamek|348,285
KJ14|Pasar Seni|331,328
KJ15|KL Sentral|311,354
KJ16|Bangsar|293,367
KJ17|Abdullah Hukum (LRT)|279,371
KJ18|Kerinchi|265,372
KJ19|Universiti|249,372
KJ20|Taman Jaya|234,372
KJ21|Asia Jaya|219,372
KJ22|Taman Paramount|202,372
KJ23|Taman Bahagia|185,372
KJ24|Kelana Jaya|166,372
KJ25|Lembah Subang|148,386
KJ26|Ara Damansara|133,400
KJ27|Glenmarie|142,413
KJ28|Subang Jaya|136,438
KJ29|SS15|136,458
KJ30|SS18|136,476
KJ31|USJ 7|136,494
KJ32|Taipan|144,511
KJ33|Wawasan|155,523
KJ34|USJ 21|166,535
KJ35|Alam Megah|179,546
KJ36|Subang Alam|190,557
KJ37|Putra Heights|208,564
`);
const shared=`
1|Sentul Timur|337,100
2|Sentul (LRT)|337,120
3|Titiwangsa|337,157
4|PWTC|337,224
5|Sultan Ismail|337,243
6|Bandaraya|337,264
7|Masjid Jamek|348,285
8|Plaza Rakyat|361,299
9|Hang Tuah|382,313
10|Pudu|396,326
11|Chan Sow Lin|428,339
`;
line('ag','3','Ampang','LRT','#ed7b2f',2.4,shared.replace(/^(\d+)\|/gm,'AG$1|')+`
AG12|Miharja|452,322
AG13|Maluri|484,293
AG14|Pandan Jaya|506,267
AG15|Pandan Indah|524,250
AG16|Cempaka|542,234
AG17|Cahaya|554,217
AG18|Ampang|566,190
`);
line('sp','4','Sri Petaling','LRT','#aa4140',2.5,shared.replace(/^(\d+)\|/gm,'SP$1|')+`
SP12|Cheras|444,374
SP13|Salak Selatan (LRT)|458,408
SP14|Bandar Tun Razak|453,427
SP15|Bandar Tasik Selatan|432,453
SP16|Sungai Besi|399,470
SP17|Bukit Jalil|378,470
SP18|Sri Petaling|361,470
SP19|Awan Besar|343,479
SP20|Muhibbah|328,489
SP21|Alam Sutera|313,500
SP22|Kinrara BK5|297,511
SP23|IOI Puchong Jaya|280,524
SP24|Pusat Bandar Puchong|264,536
SP25|Taman Perindustrian Puchong|249,547
SP26|Bandar Puteri|234,558
SP27|Puchong Perdana|221,569
SP28|Puchong Prima|213,582
SP29|Putra Heights|208,564
`);
line('kg','9','Kajang','MRT','#168750',2.6,`
KG04|Kwasa Damansara|151,227
KG05|Kwasa Sentral|151,243
KG06|Kota Damansara|151,259
KG07|Surian|151,276
KG08|Mutiara Damansara|164,289
KG09|Bandar Utama (MRT)|178,303
KG10|TTDI|184,319
KG11|Phileo Damansara|200,337
KG12|Bukit Kiara Selatan|217,347|planned
KG13|Pusat Bandar Damansara|249,347
KG14|Semantan|269,347
KG15|Muzium Negara|294,347
KG16|Pasar Seni|331,328
KG17|Merdeka|378,300
KG18A|Bukit Bintang (MRT)|386,288
KG20|Tun Razak Exchange|429,288
KG21|Cochrane|456,288
KG22|Maluri|484,293
KG23|Taman Pertama|504,306
KG24|Taman Midah|530,321
KG25|Taman Mutiara|551,338
KG26|Taman Connaught|551,355
KG27|Taman Suntex|551,372
KG28|Sri Raya|551,389
KG29|Bandar Tun Hussein Onn|551,406
KG30|Batu 11 Cheras|551,423
KG31|Bukit Dukung|536,437
KG33|Sungai Jernih|521,451
KG34|Stadium Kajang|506,465
KG35|Kajang|492,479
`);
line('py','12','Putrajaya','MRT','#d69521',2.6,`
PY01|Kwasa Damansara|151,227
PY02|RRI|151,212|planned
PY03|Kampung Selamat|151,197
PY04|Sungai Buloh|151,180
PY05|Damansara Damai|151,160
PY06|Sri Damansara Barat|151,143
PY07|Sri Damansara Sentral|151,128
PY08|Sri Damansara Timur|174,116
PY09|Metro Prima|193,116
PY10|Kepong Baru|212,116
PY11|Jinjang|231,116
PY12|Sri Delima|251,116
PY13|Kampung Batu|276,126
PY14|Kentonmen|285,144
PY15|Jalan Ipoh|294,160
PY16|Sentul Barat|311,167
PY17|Titiwangsa|337,157
PY18|Hospital Kuala Lumpur|367,180
PY19|Raja Uda|385,198
PY20|Ampang Park (MRT)|407,215
PY21|Persiaran KLCC|430,239
PY22|Conlay|440,259
PY23|Tun Razak Exchange|429,288
PY24|Chan Sow Lin|428,339
PY25|Bandar Malaysia Utara|420,366|planned
PY26|Bandar Malaysia Selatan|414,390|planned
PY27|Kuchai|400,441
PY28|Taman Naga Emas|400,456
PY29|Sungai Besi|399,470
PY30|Taman Teknologi|399,481|planned
PY31|Serdang Raya Utara|399,492
PY32|Serdang Raya Selatan|399,503
PY33|Serdang Jaya|399,514
PY34|UPM|399,525
PY35|Taman Universiti|399,536
PY36|Taman Equine|399,547
PY37|Putra Permai|399,558
PY38|16 Sierra|399,569
PY39|Cyberjaya Utara|391,580
PY40|Cyberjaya City Centre|380,590
PY41|Putrajaya Sentral|369,601
`);
line('mr','8','KL Monorail','Monorail','#7fa53e',2.2,`
MR1|KL Sentral (Monorail)|322,365
MR2|Tun Sambanthan|353,352
MR3|Maharajalela|368,337
MR4|Hang Tuah|382,313
MR5|Imbi|400,300
MR6|Bukit Bintang (Monorail)|393,277
MR7|Raja Chulan|379,263
MR8|Bukit Nanas|357,252
MR9|Medan Tuanku|356,241
MR10|Chow Kit|348,193
MR11|Titiwangsa|337,157
`);
line('sa','11','Shah Alam','LRT','#319dc0',2.7,`
SA01|Bandar Utama (LRT)|163,310
SA02|Kayu Ara|151,332
SA03|BU11|151,350
SA04|Tropicana|151,365|planned
SA05|Damansara Idaman|151,379
SA06|Subang (LRT)|151,394
SA07|Glenmarie 2|151,412
SA08|Temasya|113,430|planned
SA09|Kerjaya|91,430
SA10|Stadium Shah Alam|73,441
SA12|Dato’ Menteri|73,455
SA13|Raja Muda|73,469|planned
SA14|UiTM Shah Alam|73,483
SA15|Seksyen 7 Shah Alam|73,497
SA16|Bukit Raja Selatan|73,511|planned
SA17|Bandar Baru Klang|73,525
SA18|Pasar Klang|73,539
SA19|Jalan Meru|84,551
SA20|Jambatan Kota|100,565
SA21|Taman Selatan|100,578
SA22|Seri Andalas|100,591
SA23|Klang Jaya|100,604
SA24|Bandar Bukit Tinggi|100,617
SA25|Bandar Botanik|100,630|planned
SA26|Johan Setia|100,643
`);
line('brt','B1','Sunway','BRT','#4a9688',2.1,`
SB1|Sunway–Setia Jaya|178,451
SB2|Mentari|178,460
SB3|Sunway Lagoon|178,469
SB4|SunMed|178,479
SB5|SunU–Monash|178,489
SB6|South Quay–USJ 1|164,499
SB7|USJ 7|136,494
`);
const ktmShared=`
4|Putra|305,224
3|Bank Negara|305,264
2|Kuala Lumpur|305,321
1|KL Sentral|311,354
`;
line('ktm1','1','Batu Caves – Pulau Sebang','KTM','#3079bb',4.8,`
KC10|Batu Caves|294,100
KC9|Taman Wahyu|294,115
KC8|Kampung Batu|276,126
KC7|Batu Kentonmen|302,144
KC6|Sentul (KTM)|309,160
`+ktmShared.replace(/^(\d+)\|/gm,'KC$1|')+`
KB1|Mid Valley|352,383
KB2|Seputeh|373,383
KB2A|Bandar Malaysia Selatan (KTM)|394,400|planned
KB3|Salak Selatan (KTM)|415,418
KB4|Bandar Tasik Selatan|432,453
KB5|Serdang|457,467
KB6|Kajang|492,479
KB7|Kajang 2|492,493
KB8|UKM|492,507
KB9|Bangi|492,521
KB10|Batang Benar|492,535
KB11|Nilai|492,549
KB12|Labu|492,563
KB13|Tiroi|492,577
KB14|Seremban|492,591
KB15|Senawang|492,605
KB16|Sungai Gadut|492,619
KB17|Rembau|492,633
KB18|Pulau Sebang|492,647
`);
line('ktm2','2','Tanjung Malim – Port Klang','KTM','#d85457',4.8,`
KA15|Tanjung Malim|105,100
KA14|Kuala Kubu Bharu|105,114
KA13|Rasa|105,128
KA12|Batang Kali|105,142
KA11|Serendah|105,156
KA10|Rawang|105,170
KA9|Kuang|105,184
KA8|Sungai Buloh|151,180
KA7|Kepong Sentral|174,132
KA6|Kepong|198,132
KA5A|Segambut Utara|235,151|planned
KA5|Segambut|257,171
KA4B|KTM provisional station|275,191|planned
`+ktmShared.replace(/^(\d+)\|/gm,'KA$1|')+`
KD1|Abdullah Hukum (KTM)|307,393
KD2|Angkasapuri|294,410
KD3|Pantai Dalam|281,427
KD4|Petaling|265,441
KD5|Jalan Templer|248,441
KD6|Kampung Dato’ Harun|231,441
KD7|Seri Setia|214,441
KD8|Setia Jaya|178,441
KD9|Subang Jaya|136,438
KD10|Batu Tiga|111,461
KD11|Shah Alam|111,479
KD12|Padang Jawa|111,497
KD13|Bukit Badak|111,515
KD14|Klang|111,535
KD15|Teluk Pulai|92,556
KD16|Kampung Raja Uda|82,577
KD17|Jalan Kastam|82,598
KD18|Pelabuhan Klang|82,647
`);
line('ke','6','KLIA Ekspres','ERL','#a84bad',28,`
KE1|KL Sentral|311,354
KE2|KLIA T1|433,660
KE3|KLIA T2|403,660
`,'available',true);
line('kt','7','KLIA Transit','ERL','#20a6ac',8,`
KT1|KL Sentral|311,354
KT2|Bandar Tasik Selatan|432,453
KT3|Putrajaya Sentral|369,601
KT4|Salak Tinggi|433,625
KT5|KLIA T1|433,660
KT6|KLIA T2|403,660
`,'available',true);
line('sky','10','Skypark Link','KTM','#a87b55',10,`
KS1|KL Sentral|311,354
KS2|Subang Jaya|136,438
KS3|Terminal Skypark|62,410
`,'suspended');
line('cc','13','Circle Line','MRT','#8975c5',2.5,`
CC1|Bukit Kiara Selatan|217,347
CC2|Bukit Kiara|217,319
CC3|Sri Hartamas|217,289
CC4|Bukit Segambut|224,260
CC5|Taman Sri Sinar|238,231
CC6|Dutamas|250,210
CC7|Circle provisional west|265,185
CC8|Circle provisional north|290,160
CC9|Titiwangsa|337,157
CC10|Kampung Puah|365,147
CC11|Jalan Langkawi|392,147
CC12|Danau Kota|419,147
CC13|Setapak|442,157
CC14|Rejang|455,166
CC15|Setiawangsa|460,177
CC16|AU2|476,193
CC17|Taman Hillview|489,213
CC18|Tasik Ampang|503,229
CC19|Kampung Pandan|513,241
CC20|Pandan Indah|524,250
CC21|Taman Kencana|531,269
CC22|Taman Cheras|535,294
CC23|Taman Midah|530,321
CC24|Jalan Yaacob Latif|523,348
CC25|Sri Permaisuri|503,377
CC26|Salak Selatan (LRT)|458,408
CC27|Salak Jaya|430,428
CC28|Kuchai|400,441
CC29|Jalan Klang Lama|346,445
CC30|Pantai Dalam|281,427
CC31|Pantai Permai|260,401
CC32|Universiti|249,372
CC33|UM|230,358
CC1|Bukit Kiara Selatan|217,347
`,'planned');
for(const station of stationsById.values())if(referencePoints[station.id])Object.assign(station,referencePoints[station.id]);
for(const line of lines)line.color=referenceColors[line.id]||line.color;
export const stations=[...stationsById.values()];
export const stationById=Object.fromEntries(stations.map(s=>[s.id,s]));
export const lineById=Object.fromEntries(lines.map(l=>[l.id,l]));
// Walking links are explicit: similar names alone never create an interchange.
export const walkingLinks=[
 ['kl-sentral','muzium-negara',6],['kl-sentral','kl-sentral-monorail',7],
 ['plaza-rakyat','merdeka',5],['dang-wangi','bukit-nanas',6],
 ['sultan-ismail','medan-tuanku',7],['bank-negara','bandaraya',6],
 ['putra','pwtc',6],['ampang-park-lrt','ampang-park-mrt',5],
 ['bukit-bintang-mrt','bukit-bintang-monorail',5],
 ['bandar-utama-mrt','bandar-utama-lrt',7],['glenmarie','glenmarie-2',5],
 ['setia-jaya','sunway-setia-jaya',5],['sri-damansara-timur','kepong-sentral',5],
 ['abdullah-hukum-lrt','abdullah-hukum-ktm',5]
].map(([from,to,minutes])=>({from,to,minutes}));
export const activeStations=stations.filter(s=>s.status==='available').sort((a,b)=>a.name.localeCompare(b.name));
export const majorStations=new Set(['kl-sentral','klcc','gombak','putra-heights','kwasa-damansara','kajang','putrajaya-sentral','klia-t1','klia-t2','johan-setia','pelabuhan-klang','batu-caves','tanjung-malim','pulau-sebang','subang-jaya','bandar-utama-mrt','titiwangsa','tun-razak-exchange','masjid-jamek','pasar-seni','ampang','usj-7','shah-alam']);
