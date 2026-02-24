import { useState, useMemo, memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { VaccinationRecord } from '@/types';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const COUNTRY_COORDS: Record<string, [number, number]> = {
  "Afghanistan": [67.71, 33.94], "Albania": [20.17, 41.15], "Algeria": [1.66, 28.03], "Angola": [17.87, -11.2],
  "Argentina": [-63.62, -38.42], "Armenia": [45.04, 40.07], "Australia": [133.78, -25.27], "Austria": [14.55, 47.52],
  "Azerbaijan": [47.58, 40.14], "Bangladesh": [90.36, 23.68], "Belarus": [27.95, 53.71], "Belgium": [4.47, 50.5],
  "Bolivia": [-63.59, -16.29], "Bosnia and Herzegovina": [17.68, 43.92], "Brazil": [-51.93, -14.24],
  "Bulgaria": [25.49, 42.73], "Cambodia": [104.99, 12.57], "Cameroon": [12.35, 7.37], "Canada": [-106.35, 56.13],
  "Chile": [-71.54, -35.68], "China": [104.2, 35.86], "Colombia": [-74.3, 4.57], "Costa Rica": [-83.75, 9.75],
  "Croatia": [15.2, 45.1], "Cuba": [-77.78, 21.52], "Czech Republic": [15.47, 49.82], "Denmark": [9.5, 56.26],
  "Dominican Republic": [-70.16, 18.74], "Ecuador": [-78.18, -1.83], "Egypt": [30.8, 26.82],
  "El Salvador": [-88.9, 13.79], "Estonia": [25.01, 58.6], "Ethiopia": [40.49, 9.15], "Finland": [25.75, 61.92],
  "France": [2.21, 46.23], "Georgia": [43.36, 42.32], "Germany": [10.45, 51.17], "Ghana": [-1.02, 7.95],
  "Greece": [21.82, 39.07], "Guatemala": [-90.23, 15.78], "Haiti": [-72.29, 18.97], "Honduras": [-86.24, 15.2],
  "Hungary": [19.5, 47.16], "Iceland": [-19.02, 64.96], "India": [78.96, 20.59], "Indonesia": [113.92, -0.79],
  "Iran": [53.69, 32.43], "Iraq": [43.68, 33.22], "Ireland": [-8.24, 53.41], "Israel": [34.85, 31.05],
  "Italy": [12.57, 41.87], "Jamaica": [-77.3, 18.11], "Japan": [138.25, 36.2], "Jordan": [36.24, 30.59],
  "Kazakhstan": [66.92, 48.02], "Kenya": [37.91, -0.02], "Kuwait": [47.48, 29.31], "Kyrgyzstan": [74.77, 41.2],
  "Laos": [102.5, 19.86], "Latvia": [24.6, 56.88], "Lebanon": [35.86, 33.85], "Libya": [17.23, 26.34],
  "Lithuania": [23.88, 55.17], "Luxembourg": [6.13, 49.82], "Madagascar": [46.87, -18.77],
  "Malaysia": [101.98, 4.21], "Mali": [-3.99, 17.57], "Mexico": [-102.55, 23.63], "Mongolia": [103.85, 46.86],
  "Morocco": [-7.09, 31.79], "Mozambique": [35.53, -18.67], "Myanmar": [95.96, 21.91], "Nepal": [84.12, 28.39],
  "Netherlands": [5.29, 52.13], "New Zealand": [174.89, -40.9], "Nicaragua": [-85.21, 12.87],
  "Nigeria": [8.68, 9.08], "North Korea": [127.51, 40.34], "Norway": [8.47, 60.47], "Oman": [55.98, 21.47],
  "Pakistan": [69.35, 30.38], "Panama": [-80.78, 8.54], "Paraguay": [-58.44, -23.44], "Peru": [-75.02, -9.19],
  "Philippines": [121.77, 12.88], "Poland": [19.15, 51.92], "Portugal": [-8.22, 39.4], "Qatar": [51.18, 25.35],
  "Romania": [24.97, 45.94], "Russia": [105.32, 61.52], "Rwanda": [29.87, -1.94],
  "Saudi Arabia": [45.08, 23.89], "Senegal": [-14.45, 14.5], "Serbia": [21.01, 44.02], "Singapore": [103.82, 1.35],
  "Slovakia": [19.7, 48.67], "Slovenia": [14.99, 46.15], "Somalia": [46.2, 5.15], "South Africa": [22.94, -30.56],
  "South Korea": [127.77, 35.91], "Spain": [-3.75, 40.46], "Sri Lanka": [80.77, 7.87], "Sudan": [30.22, 12.86],
  "Sweden": [18.64, 60.13], "Switzerland": [8.23, 46.82], "Syria": [38.99, 34.8], "Taiwan": [120.96, 23.7],
  "Tanzania": [34.89, -6.37], "Thailand": [100.99, 15.87], "Tunisia": [9.54, 33.89], "Turkey": [35.24, 38.96],
  "Uganda": [32.29, 1.37], "Ukraine": [31.17, 48.38], "United Arab Emirates": [53.85, 23.42],
  "United Kingdom": [-3.44, 55.38], "United States": [-95.71, 37.09], "Uruguay": [-55.77, -32.52],
  "Uzbekistan": [64.59, 41.38], "Venezuela": [-66.59, 6.42], "Vietnam": [108.28, 14.06],
  "Yemen": [48.52, 15.55], "Zambia": [27.85, -13.13], "Zimbabwe": [29.15, -19.02],
};

interface ImmunizationGlobeProps {
  vaccinations: VaccinationRecord[];
  onCountryClick: (country: string) => void;
  selectedCountry: string | null;
}

export const ImmunizationGlobe = memo(function ImmunizationGlobe({ vaccinations, onCountryClick, selectedCountry }: ImmunizationGlobeProps) {
  const [tooltip, setTooltip] = useState<{ country: string; count: number; x: number; y: number } | null>(null);

  const countryData = useMemo(() => {
    const map = new Map<string, VaccinationRecord[]>();
    vaccinations.forEach(v => {
      if (v.countryGiven) {
        const existing = map.get(v.countryGiven) || [];
        existing.push(v);
        map.set(v.countryGiven, existing);
      }
    });
    return map;
  }, [vaccinations]);

  const markers = useMemo(() => {
    return Array.from(countryData.entries())
      .filter(([country]) => COUNTRY_COORDS[country])
      .map(([country, records]) => ({
        country,
        coordinates: COUNTRY_COORDS[country] as [number, number],
        count: records.length,
      }));
  }, [countryData]);

  return (
    <div className="relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 120, center: [0, 20] }}
        width={700}
        height={380}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={4}>
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rpiKey}
                  geography={geo}
                  fill="#e8e8ed"
                  stroke="#fbfbfd"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#d1d1d6', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          {markers.map(({ country, coordinates, count }) => (
            <Marker
              key={country}
              coordinates={coordinates}
              onClick={() => onCountryClick(country)}
              onMouseEnter={(e: any) => {
                const rect = (e.target as SVGElement).closest('svg')?.getBoundingClientRect();
                if (rect) {
                  setTooltip({
                    country,
                    count,
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top - 40,
                  });
                }
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <circle
                r={Math.min(6 + count * 2, 16)}
                fill={selectedCountry === country ? '#4a7fb5' : '#4d9068'}
                fillOpacity={0.7}
                stroke={selectedCountry === country ? '#3a6a9a' : '#3d7a58'}
                strokeWidth={2}
                className="cursor-pointer transition-all hover:fill-opacity-100"
              />
              <text
                textAnchor="middle"
                y={4}
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  fill: '#fff',
                  pointerEvents: 'none',
                }}
              >
                {count}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="absolute pointer-events-none bg-[#1d1d1f] text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg z-50"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)' }}
        >
          {tooltip.country}: {tooltip.count} vaccine{tooltip.count !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
});
