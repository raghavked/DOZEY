export function sanitizeString(input: unknown): string | null {
  if (input === null || input === undefined) return null;
  if (typeof input !== 'string') return null;
  return input.trim().slice(0, 1000);
}

export function sanitizeLongString(input: unknown): string | null {
  if (input === null || input === undefined) return null;
  if (typeof input !== 'string') return null;
  return input.trim().slice(0, 10000);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validateDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  const parsed = new Date(date);
  return !isNaN(parsed.getTime()) && parsed.getFullYear() >= 1900 && parsed.getFullYear() <= 2100;
}

export function validateId(id: string | number): number | null {
  const parsed = typeof id === 'number' ? id : parseInt(String(id), 10);
  if (isNaN(parsed) || parsed <= 0 || parsed > 2147483647) return null;
  return parsed;
}

export function validateDoseNumber(dose: unknown): number | null {
  if (dose === null || dose === undefined) return null;
  const parsed = typeof dose === 'number' ? dose : parseInt(String(dose), 10);
  if (isNaN(parsed) || parsed < 1 || parsed > 20) return null;
  return parsed;
}

export function sanitizeProfileData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  const stringFields = [
    'fullName', 'dateOfBirth', 'nationality', 'currentCountry', 'currentState',
    'countryOfOrigin', 'primaryLanguage', 'primaryProvider', 'providerDetails',
    'bloodType', 'targetInstitution', 'targetEmployment', 'targetCountry'
  ];

  for (const field of stringFields) {
    if (data[field] !== undefined) {
      sanitized[field] = sanitizeString(data[field]);
    }
  }

  const jsonStringFields = ['citizenships', 'languages'];
  for (const field of jsonStringFields) {
    if (data[field] !== undefined) {
      sanitized[field] = sanitizeLongString(data[field]);
    }
  }

  if (data.allergies !== undefined) {
    sanitized.allergies = sanitizeLongString(data.allergies);
  }

  return sanitized;
}

export function sanitizeVaccinationData(data: Record<string, unknown>): Record<string, unknown> | null {
  const vaccineName = sanitizeString(data.vaccineName || data.vaccine_name);
  if (!vaccineName) return null;

  return {
    vaccineName,
    date: sanitizeString(data.date),
    doseNumber: validateDoseNumber(data.doseNumber || data.dose_number),
    location: sanitizeString(data.location),
    countryGiven: sanitizeString(data.countryGiven || data.country_given),
    provider: sanitizeString(data.provider),
    notes: sanitizeLongString(data.notes),
  };
}
