const COUNTRY_ALIASES: Record<string, string> = {
  "United States Of America": "United States",
  "United States of America": "United States",
  "USA": "United States",
  "US": "United States",
  "U.S.A.": "United States",
  "U.S.": "United States",
  "UK": "United Kingdom",
  "Great Britain": "United Kingdom",
  "England": "United Kingdom",
  "Scotland": "United Kingdom",
  "Wales": "United Kingdom",
  "Northern Ireland": "United Kingdom",
  "Republic of Korea": "South Korea",
  "Korea, Republic of": "South Korea",
  "Korea, South": "South Korea",
  "Korea, North": "North Korea",
  "Democratic People's Republic of Korea": "North Korea",
  "Russian Federation": "Russia",
  "Viet Nam": "Vietnam",
  "Lao People's Democratic Republic": "Laos",
  "Iran, Islamic Republic of": "Iran",
  "Syrian Arab Republic": "Syria",
  "Czechia": "Czech Republic",
  "Brunei Darussalam": "Brunei",
  "Myanmar (Burma)": "Myanmar",
  "Taiwan, Province of China": "Taiwan",
  "Republic of China": "Taiwan",
  "Palestine, State of": "Palestine",
  "UAE": "United Arab Emirates",
  "Saudi": "Saudi Arabia",
  "KSA": "Saudi Arabia",
  "People's Republic of China": "China",
  "PRC": "China",
  "Holland": "Netherlands",
  "The Netherlands": "Netherlands",
  "Côte d'Ivoire": "Ivory Coast",
  "Cote d'Ivoire": "Ivory Coast",
  "Bosnia and Herz.": "Bosnia and Herzegovina",
  "Dominican Rep.": "Dominican Republic",
  "S. Sudan": "South Sudan",
  "Central African Rep.": "Central African Republic",
  "Dem. Rep. Congo": "Democratic Republic of the Congo",
  "eSwatini": "Eswatini",
  "Eq. Guinea": "Equatorial Guinea",
  "Solomon Is.": "Solomon Islands",
  "Falkland Is.": "Falkland Islands",
  "Fr. S. Antarctic Lands": "French Southern Territories",
  "N. Cyprus": "Northern Cyprus",
};

export function normalizeCountryName(name: string): string {
  if (!name) return name;
  const trimmed = name.trim();
  return COUNTRY_ALIASES[trimmed] || trimmed;
}

export const COUNTRY_NAME_TO_GEO: Record<string, string> = {
  "United States": "United States of America",
  "Czech Republic": "Czechia",
  "Ivory Coast": "Côte d'Ivoire",
  "Bosnia and Herzegovina": "Bosnia and Herz.",
  "Dominican Republic": "Dominican Rep.",
  "South Sudan": "S. Sudan",
  "Central African Republic": "Central African Rep.",
  "Democratic Republic of the Congo": "Dem. Rep. Congo",
  "Eswatini": "eSwatini",
  "Equatorial Guinea": "Eq. Guinea",
  "Solomon Islands": "Solomon Is.",
  "Falkland Islands": "Falkland Is.",
};

export function toGeoName(countryName: string): string[] {
  const normalized = normalizeCountryName(countryName);
  const geoName = COUNTRY_NAME_TO_GEO[normalized];
  return geoName ? [normalized, geoName] : [normalized];
}
