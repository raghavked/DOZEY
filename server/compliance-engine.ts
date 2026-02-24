import OpenAI from "openai";

function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not configured");
  return new OpenAI({ apiKey: key });
}

export interface InstitutionRequirements {
  institutionName: string;
  location: string;
  requirements: Array<{
    vaccine_name: string;
    required_doses: number;
    notes: string | null;
    deadline_info: string | null;
  }>;
  additional_requirements: string[];
  submission_instructions: string;
  forms_needed: string[];
  contact_info: string;
  source_notes: string;
}

export type ComplianceLookupType = "institution" | "employer" | "country";

export async function lookupEmployerRequirements(employerName: string): Promise<InstitutionRequirements> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are an expert on employer and organizational health/vaccination requirements worldwide. Given an employer or organization name, return the vaccination and health screening requirements that employees must meet.

Return a JSON object with this exact structure:
{
  "institutionName": "Full official name of the employer/organization",
  "location": "City, State/Province, Country (or 'Global' if multinational)",
  "requirements": [
    {
      "vaccine_name": "Standard vaccine name (e.g., Hepatitis B, Influenza, COVID-19)",
      "required_doses": 2,
      "notes": "Any specific notes (e.g., annual booster required, titer accepted)",
      "deadline_info": "When this must be completed (e.g., before start date, annually)"
    }
  ],
  "additional_requirements": ["Annual TB screening", "Fit-for-duty exam", "Drug screening", etc.],
  "submission_instructions": "How and where to submit health records to employer",
  "forms_needed": ["Names of specific forms required"],
  "contact_info": "Occupational health or HR contact information",
  "source_notes": "Brief note about data accuracy and recommendation to verify with employer"
}

Rules:
- Healthcare employers (hospitals, clinics) typically require: Hepatitis B (3 doses), Influenza (annual), Tdap, MMR (2 doses), Varicella (2 doses), COVID-19, TB screening
- Military organizations require extensive vaccinations including: Smallpox, Anthrax, Adenovirus, etc.
- International organizations (UN, WHO, NGOs) may require: Yellow Fever, Typhoid, Hepatitis A, Rabies depending on deployment regions
- Food service/childcare employers may require: Hepatitis A, TB screening
- General office employers may have minimal requirements (COVID-19, Flu recommended)
- Always include a source_notes field reminding users to verify with the employer directly
- Be specific about dose counts and any alternatives
- If you don't have specific information about the employer, state that clearly in source_notes and provide general industry-standard requirements instead
- NEVER fabricate specific contact information, form names, or submission instructions if you don't know them — use null or a note to check with the employer`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `What are the vaccination/health requirements for employees at: ${employerName}` },
    ],
    max_tokens: 2000,
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return JSON.parse(content);
}

export async function lookupCountryRequirements(countryName: string): Promise<InstitutionRequirements> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are an expert on country-level immigration and visa vaccination requirements worldwide. Given a country name, return the vaccination requirements for immigration, visa applications, and entry.

Return a JSON object with this exact structure:
{
  "institutionName": "Country name - Immigration/Visa Requirements",
  "location": "Country",
  "requirements": [
    {
      "vaccine_name": "Standard vaccine name (e.g., Yellow Fever, Polio, COVID-19)",
      "required_doses": 1,
      "notes": "Any specific notes (e.g., required for travelers from endemic areas, certificate valid for life)",
      "deadline_info": "When this must be completed (e.g., 10 days before arrival, before visa interview)"
    }
  ],
  "additional_requirements": ["Medical examination by panel physician", "Chest X-ray for TB", "Blood tests", etc.],
  "submission_instructions": "How and where to submit vaccination records for visa/immigration",
  "forms_needed": ["Names of specific immigration health forms"],
  "contact_info": "Immigration health services or embassy contact",
  "source_notes": "Brief note about data accuracy and recommendation to verify with embassy/consulate"
}

Rules:
- For the United States: Immigration requires MMR, Polio, Tdap, Hepatitis A & B, Varicella, Influenza, COVID-19, Meningococcal, Hib, Pneumococcal, Rotavirus (age-dependent). Medical exam by USCIS-designated civil surgeon. Form I-693 required.
- For Canada: Immigration medical exam, TB screening, proof of vaccinations per IRCC requirements
- For Australia: Must meet immunization requirements per Department of Home Affairs, medical exam required
- For UK: TB test required for some nationalities, NHS surcharge
- For Gulf states (Saudi Arabia, UAE): Meningococcal for work visa, Yellow Fever if from endemic areas
- For countries in Africa: Yellow Fever certificate often mandatory
- Include IHR (International Health Regulations) requirements when applicable
- Always mention the medical examination requirement for immigration if applicable
- Always include a source_notes field reminding users to verify with the embassy/consulate directly
- Be specific about which vaccines are legally required vs recommended
- If you don't have specific information about this country's requirements, state that clearly in source_notes and provide commonly required vaccines for the region instead
- NEVER fabricate specific form names, contact information, or submission instructions if you don't know them — use null or advise checking with the embassy`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `What are the vaccination and health requirements for immigration/visa to: ${countryName}` },
    ],
    max_tokens: 2000,
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return JSON.parse(content);
}

export async function lookupInstitutionRequirements(institutionName: string): Promise<InstitutionRequirements> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are an expert on university and institutional vaccination/immunization requirements worldwide. Given an institution name, return the vaccination requirements that students or employees must meet.

Return a JSON object with this exact structure:
{
  "institutionName": "Full official name of the institution",
  "location": "City, State/Province, Country",
  "requirements": [
    {
      "vaccine_name": "Standard vaccine name (e.g., MMR, Hepatitis B, Varicella)",
      "required_doses": 2,
      "notes": "Any specific notes about this requirement (e.g., titer accepted as alternative)",
      "deadline_info": "When this must be completed (e.g., before enrollment, within 30 days)"
    }
  ],
  "additional_requirements": ["TB screening", "Health insurance enrollment", etc.],
  "submission_instructions": "How and where to submit immunization records",
  "forms_needed": ["Names of specific forms required"],
  "contact_info": "Student health services contact information",
  "source_notes": "Brief note about data accuracy and recommendation to verify with institution"
}

Rules:
- Use your knowledge of common university immunization requirements
- For U.S. universities, requirements typically include: MMR (2 doses), Varicella (2 doses), Hepatitis B (3 doses), Tdap (1 dose within 10 years), Meningococcal ACWY (1 dose if under 22), and sometimes COVID-19
- For UC system schools, also include TB screening requirements
- Include state-specific mandates when known
- Always include a source_notes field reminding users to verify with the institution directly
- Be specific about dose counts and any alternatives (e.g., titer tests)
- Include the institution's health portal or submission method if known
- If you don't have specific information about this institution, state that clearly in source_notes and provide typical requirements for similar institutions in that region
- NEVER fabricate specific portal URLs, phone numbers, or form names if you don't know them — use null or advise checking with the institution`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `What are the immunization/vaccination requirements for: ${institutionName}` },
    ],
    max_tokens: 2000,
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  return JSON.parse(content);
}

export interface ComplianceCheckResult {
  vaccine_name: string;
  required_doses: number;
  completed_doses: number;
  status: "complete" | "partial" | "missing";
  matching_records: string[];
  notes: string | null;
}

export interface ExemptionRecord {
  vaccineName: string;
  exemptionType: string;
  reason: string;
  doctorName?: string | null;
}

export function checkCompliance(
  requirements: InstitutionRequirements,
  vaccinations: Array<{ vaccineName: string; date: string; doseNumber: number; id: number }>,
  exemptions: ExemptionRecord[] = []
): { compliance: ComplianceCheckResult[]; overallPercentage: number; totalRequired: number; totalCompleted: number } {
  const vaccineAliases: Record<string, string[]> = {
    "mmr": ["mmr", "measles", "mumps", "rubella", "measles-mumps-rubella", "m-m-r", "mr vaccine", "priorix", "tresivac"],
    "varicella": ["varicella", "chickenpox", "chicken pox", "varivax", "varilrix"],
    "hepatitis b": ["hepatitis b", "hep b", "hepb", "engerix", "recombivax", "shanvac", "bevac", "gene vac"],
    "hepatitis a": ["hepatitis a", "hep a", "hepa", "havrix", "vaqta", "avaxim", "biovac-a"],
    "tdap": ["tdap", "tetanus", "diphtheria", "pertussis", "boostrix", "adacel", "td vaccine", "dpt", "pentavalent", "pentavac"],
    "meningococcal": ["meningococcal", "menacwy", "meningo", "meningitis", "menquadfi", "menveo", "nimenrix"],
    "polio": ["polio", "ipv", "opv", "inactivated polio", "oral polio", "biopol"],
    "covid": ["covid", "covid-19", "sars-cov-2", "pfizer", "moderna", "biontech", "covishield", "covaxin", "astrazeneca", "johnson", "corbevax", "covovax", "sputnik"],
    "hpv": ["hpv", "human papillomavirus", "gardasil", "cervarix"],
    "influenza": ["influenza", "flu", "fluzone", "fluvax"],
    "tb": ["tb", "tuberculosis", "tuberculin", "ppd", "igra", "quantiferon", "mantoux", "bcg"],
    "typhoid": ["typhoid", "typbar", "typhim"],
    "japanese encephalitis": ["japanese encephalitis", "je vaccine", "jenvac", "ixiaro"],
    "yellow fever": ["yellow fever", "yf-vax", "stamaril"],
    "rabies": ["rabies", "rabipur", "abhayrab"],
  };

  function matchesVaccine(recordName: string, requirementName: string): boolean {
    const rLower = recordName.toLowerCase();
    const qLower = requirementName.toLowerCase();

    if (rLower.includes(qLower) || qLower.includes(rLower)) return true;

    for (const [, aliases] of Object.entries(vaccineAliases)) {
      const reqMatches = aliases.some(a => qLower.includes(a));
      const recMatches = aliases.some(a => rLower.includes(a));
      if (reqMatches && recMatches) return true;
    }

    return false;
  }

  let totalRequired = 0;
  let totalCompleted = 0;

  const compliance: ComplianceCheckResult[] = requirements.requirements.map(req => {
    const matching = vaccinations.filter(v => matchesVaccine(v.vaccineName, req.vaccine_name));
    const matchingExemptions = exemptions.filter(e => matchesVaccine(e.vaccineName, req.vaccine_name));
    const hasExemption = matchingExemptions.length > 0;

    const completedDoses = hasExemption ? req.required_doses : Math.min(matching.length, req.required_doses);

    totalRequired += req.required_doses;
    totalCompleted += completedDoses;

    let status: "complete" | "partial" | "missing" = "missing";
    if (hasExemption || completedDoses >= req.required_doses) status = "complete";
    else if (completedDoses > 0) status = "partial";

    const matchingRecords = matching.map(m => `${m.vaccineName} (${m.date})`);
    if (hasExemption) {
      const exemptionTypeLabels: Record<string, string> = {
        natural_immunity: "Natural Immunity",
        medical_contraindication: "Medical Exemption",
        prior_infection: "Prior Infection",
        titer_positive: "Positive Titer/Antibody",
        other: "Medical Exemption",
      };
      matchingExemptions.forEach(e => {
        const label = exemptionTypeLabels[e.exemptionType] || "Exemption";
        matchingRecords.push(`${label}: ${e.reason}${e.doctorName ? ` (Dr. ${e.doctorName})` : ''}`);
      });
    }

    const notesArr: string[] = [];
    if (req.notes) notesArr.push(req.notes);
    if (hasExemption) notesArr.push("Requirement satisfied by medical exemption/immunity documentation");

    return {
      vaccine_name: req.vaccine_name,
      required_doses: req.required_doses,
      completed_doses: completedDoses,
      status,
      matching_records: matchingRecords,
      notes: notesArr.length > 0 ? notesArr.join(". ") : null,
    };
  });

  const overallPercentage = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;

  return { compliance, overallPercentage, totalRequired, totalCompleted };
}

export function generateFormattedReport(
  institution: InstitutionRequirements,
  compliance: ComplianceCheckResult[],
  profile: { fullName: string; dateOfBirth: string; countryOfOrigin: string },
  vaccinations: Array<{ vaccineName: string; date: string; doseNumber: number; provider: string; location: string; countryGiven: string; verified: boolean }>,
  overallPercentage: number,
  lookupType: ComplianceLookupType = "institution"
): string {
  const now = new Date();
  let report = "";

  const reportTitle = lookupType === "employer"
    ? "EMPLOYMENT HEALTH COMPLIANCE REPORT"
    : lookupType === "country"
    ? "IMMIGRATION / VISA HEALTH COMPLIANCE REPORT"
    : "IMMUNIZATION COMPLIANCE REPORT";

  const preparedLabel = lookupType === "employer"
    ? "Employer"
    : lookupType === "country"
    ? "Destination"
    : "Prepared for";

  const personLabel = lookupType === "employer"
    ? "EMPLOYEE / APPLICANT INFORMATION"
    : lookupType === "country"
    ? "VISA APPLICANT / IMMIGRANT INFORMATION"
    : "STUDENT / APPLICANT INFORMATION";

  report += "╔══════════════════════════════════════════════════════════════╗\n";
  report += `║           ${reportTitle.padEnd(49)}║\n`;
  report += `║           ${preparedLabel}: ${institution.institutionName.substring(0, 35 - preparedLabel.length).padEnd(49 - preparedLabel.length - 2)}║\n`;
  report += "╚══════════════════════════════════════════════════════════════╝\n\n";

  report += `Report Generated: ${now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n`;
  report += `Powered by DOZEY - Healthcare That Moves With You\n\n`;

  report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  report += `  ${personLabel}\n`;
  report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  report += `  Full Name:         ${profile.fullName}\n`;
  report += `  Date of Birth:     ${profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Not provided"}\n`;
  report += `  Country of Origin: ${profile.countryOfOrigin}\n\n`;

  const destLabel = lookupType === "employer" ? "EMPLOYER" : lookupType === "country" ? "DESTINATION COUNTRY" : "DESTINATION INSTITUTION";
  report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  report += `  ${destLabel}: ${institution.institutionName.toUpperCase()}\n`;
  report += `  Location: ${institution.location}\n`;
  report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

  report += `  OVERALL COMPLIANCE: ${overallPercentage}%\n\n`;

  report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  report += "  REQUIREMENT-BY-REQUIREMENT STATUS\n";
  report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

  compliance.forEach((item, i) => {
    const statusIcon = item.status === "complete" ? "✅" : item.status === "partial" ? "⚠️" : "❌";
    report += `  ${i + 1}. ${statusIcon} ${item.vaccine_name}\n`;
    report += `     Required: ${item.required_doses} dose(s) | Completed: ${item.completed_doses} dose(s)\n`;
    report += `     Status: ${item.status === "complete" ? "COMPLETE" : item.status === "partial" ? "PARTIALLY COMPLETE" : "MISSING"}\n`;
    if (item.matching_records.length > 0) {
      report += `     Records: ${item.matching_records.join("; ")}\n`;
    }
    if (item.notes) {
      report += `     Note: ${item.notes}\n`;
    }
    report += "\n";
  });

  report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  report += "  COMPLETE VACCINATION HISTORY\n";
  report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

  const sorted = [...vaccinations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  sorted.forEach((v, i) => {
    report += `  ${i + 1}. ${v.vaccineName} - Dose ${v.doseNumber}\n`;
    report += `     Date: ${new Date(v.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n`;
    report += `     Provider: ${v.provider || "Not recorded"}\n`;
    report += `     Location: ${v.location || "Not recorded"}, ${v.countryGiven || ""}\n`;
    report += `     Verified: ${v.verified ? "Yes ✓" : "Pending"}\n\n`;
  });

  if (institution.additional_requirements.length > 0) {
    report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    report += "  ADDITIONAL REQUIREMENTS\n";
    report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    institution.additional_requirements.forEach(req => {
      report += `  • ${req}\n`;
    });
    report += "\n";
  }

  if (institution.submission_instructions) {
    report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    report += "  SUBMISSION INSTRUCTIONS\n";
    report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    report += `  ${institution.submission_instructions}\n\n`;
  }

  if (institution.forms_needed.length > 0) {
    report += "  Forms Needed:\n";
    institution.forms_needed.forEach(form => {
      report += `  • ${form}\n`;
    });
    report += "\n";
  }

  if (institution.contact_info) {
    report += `  Contact: ${institution.contact_info}\n\n`;
  }

  report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  report += "  DISCLAIMER\n";
  report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
  report += `  ${institution.source_notes || "Requirements are based on publicly available information. Please verify directly with the institution for the most current requirements."}\n\n`;
  report += "  This report was generated by DOZEY (dozeyrecords.com) and is\n";
  report += "  intended for informational purposes. Official verification\n";
  report += "  should be done through the institution's student health services.\n\n";
  report += "╔══════════════════════════════════════════════════════════════╗\n";
  report += "║  DOZEY - Healthcare That Moves With You                    ║\n";
  report += "║  www.dozeyrecords.com                                      ║\n";
  report += "╚══════════════════════════════════════════════════════════════╝\n";

  return report;
}
