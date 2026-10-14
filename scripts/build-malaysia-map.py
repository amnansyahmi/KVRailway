# Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson
# Natural Earth country outlines are public domain. Not part of the runtime build.
import json,argparse
from pathlib import Path
parser=argparse.ArgumentParser(description='Build the bundled Malaysia SVG from Natural Earth 50m admin-0 GeoJSON.')
parser.add_argument('geojson');parser.add_argument('--output',default='public/maps/malaysia.svg');args=parser.parse_args()
features=json.loads(Path(args.geojson).read_text())['features']
# Equirectangular diagram: Peninsular map plus an explicitly smaller Borneo inset.
def peninsula(lon,lat):return (60+(lon-99.5)*92,55+(7.4-lat)*92)
def borneo(lon,lat):return (535+(lon-108.5)*35,435+(7.5-lat)*35)
parts=['<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="820" viewBox="0 0 1000 820"><title>Malaysia rail journey basemap</title><desc>Natural Earth country outlines. Peninsular Malaysia with Sabah and Sarawak in a smaller context inset. Rail routes are overlaid separately.</desc><defs><clipPath id="peninsula"><rect x="30" y="30" width="495" height="690" rx="15"/></clipPath><clipPath id="borneo"><rect x="520" y="405" width="455" height="345" rx="15"/></clipPath><pattern id="sea" width="35" height="35" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="#435e68" opacity=".3"/></pattern></defs><rect width="1000" height="820" fill="#18282e"/><rect width="1000" height="820" fill="url(#sea)"/>']
for clip,project,extent in [('peninsula',peninsula,(99.1,105.4,.0,7.7)),('borneo',borneo,(107.7,121.,-.8,8.0))]:
 parts.append(f'<g clip-path="url(#{clip})">')
 for f in features:
  if f['properties']['ADMIN'] not in ['Malaysia','Thailand','Indonesia','Brunei','Singapore']:continue
  geom=f['geometry'];polys=geom['coordinates'] if geom['type']=='MultiPolygon' else [geom['coordinates']]
  for poly in polys:
   if not poly:continue
   xs=[p[0] for p in poly[0]];ys=[p[1] for p in poly[0]]
   if max(xs)<extent[0] or min(xs)>extent[1] or max(ys)<extent[2] or min(ys)>extent[3]:continue
   path=' '.join('M'+' L'.join(f'{project(*p)[0]:.2f},{project(*p)[1]:.2f}' for p in ring)+'Z' for ring in poly)
   country=f['properties']['ADMIN'];fill='#3f6255' if country=='Malaysia' else '#263c40';stroke='#6c8d77' if country=='Malaysia' else '#3b5359'
   parts.append(f'<path d="{path}" fill="{fill}" stroke="{stroke}" stroke-width="1.1" fill-rule="evenodd"/>')
 parts.append('</g>')
labels=[('PERLIS',100.15,6.7),('KEDAH',100.85,6.15),('PERAK',101.2,4.95),('KELANTAN',102.,5.65),('TERENGGANU',103.2,4.95),('PAHANG',102.7,3.65),('SELANGOR',100.95,3.6),('N. SEMBILAN',102.45,2.85),('MELAKA',102.45,2.05),('JOHOR',103.55,1.9)]
for text,lon,lat in labels:
 x,y=peninsula(lon,lat);parts.append(f'<text x="{x:.2f}" y="{y:.2f}" fill="#78978a" font-family="Arial,sans-serif" font-size="8.5" letter-spacing="1.4">{text}</text>')
parts.extend(['<g fill="#809a9d" font-family="Arial,sans-serif"><text x="575" y="310" font-size="13" letter-spacing="4">SOUTH CHINA SEA</text><text x="560" y="398" font-size="11" letter-spacing="2">EAST MALAYSIA</text><text x="560" y="414" font-size="8">Sabah &amp; Sarawak · smaller context inset</text><text x="640" y="600" font-size="10" letter-spacing="2">SARAWAK</text><text x="845" y="482" font-size="10" letter-spacing="2">SABAH</text><text x="720" y="697" font-size="8">ETS / ECRL do not serve East Malaysia</text><text x="52" y="764" font-size="9" letter-spacing="2">PENINSULAR MALAYSIA</text><text x="52" y="782" font-size="8">Static basemap · rail corridors are illustrative</text><text x="560" y="782" font-size="8">Made with Natural Earth · country outlines</text></g><g transform="translate(485 60)" fill="#9bb2a8"><path d="M0 0l-5 15 5-3 5 3Z"/><text x="0" y="-6" text-anchor="middle" font-family="Arial" font-size="9">N</text></g></svg>'])
Path(args.output).write_text(''.join(parts))
print('Static Malaysia map saved.')
