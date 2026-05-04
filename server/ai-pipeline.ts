import fs from "fs";
import path from "path";
import { Mistral } from "@mistralai/mistralai";
import * as deepl from "deepl-node";
import OpenAI from "openai";

function getMistralClient() {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) throw new Error("MISTRAL_API_KEY not configured");
  return new Mistral({ apiKey: key });
}

function getDeepLClient() {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY not configured");
  return new deepl.Translator(key);
}

function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not configured");
  return new OpenAI({ apiKey: key });
}

export async function extractTextFromDocument(filePath: string, mimeType: string): Promise<{ text: string; language?: string }> {
  const mistral = getMistralClient();
  const sanitizedName = path.basename(filePath);
  if (!sanitizedName || sanitizedName === "." || sanitizedName === "..") {
    throw new Error("Invalid file path");
  }

  const uploadsDir = path.resolve(__dirname, "../uploads");
  const absolutePath = path.resolve(uploadsDir, sanitizedName);

  if (!absolutePath.startsWith(uploadsDir + path.sep)) {
    throw new Error("Invalid file path");
  }

  if (!fs.existsSync(absolutePath) || !fs.lstatSync(absolutePath).isFile()) {
    throw new Error("File not found on server");
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const base64 = fileBuffer.toString("base64");

  const isImage = mimeType.startsWith("image/");

  const result = await mistral.ocr.process({
    model: "mistral-ocr-latest",
    document: isImage
      ? { type: "image_url", imageUrl: `data:${mimeType};base64,${base64}` }
      : { type: "document_url", documentUrl: `data:${mimeType};base64,${base64}` },
  });

  const extractedText = result.pages
    .map((page: any) => page.markdown || "")
    .join("\n\n---\n\n");

  return { text: extractedText };
}

export async function detectAndTranslateText(text: string): Promise<{ translatedText: string; detectedLanguage: string }> {
  if (!text || text.trim().length === 0) {
    return { translatedText: "", detectedLanguage: "unknown" };
  }

  const translator = getDeepLClient();

  const result = await translator.translateText(text, null, "en-US");
  const translated = Array.isArray(result) ? result.map(r => r.text).join("\n") : result.text;
  const detected = Array.isArray(result) ? (result[0]?.detectedSourceLang || "unknown") : (result.detectedSourceLang || "unknown");

  if (detected.toLowerCase() === "en") {
    return { translatedText: text, detectedLanguage: "en" };
  }

  return { translatedText: translated, detectedLanguage: detected };
}

const SUPPORTED_TARGET_LANGUAGES: Record<string, string> = {
  "bg": "Bulgarian",
  "cs": "Czech",
  "da": "Danish",
  "de": "German",
  "el": "Greek",
  "en-US": "English (US)",
  "en-GB": "English (UK)",
  "es": "Spanish",
  "et": "Estonian",
  "fi": "Finnish",
  "fr": "French",
  "hu": "Hungarian",
  "id": "Indonesian",
  "it": "Italian",
  "ja": "Japanese",
  "ko": "Korean",
  "lt": "Lithuanian",
  "lv": "Latvian",
  "nb": "Norwegian",
  "nl": "Dutch",
  "pl": "Polish",
  "pt-BR": "Portuguese (Brazil)",
  "pt-PT": "Portuguese (Portugal)",
  "ro": "Romanian",
  "ru": "Russian",
  "sk": "Slovak",
  "sl": "Slovenian",
  "sv": "Swedish",
  "tr": "Turkish",
  "uk": "Ukrainian",
  "zh-Hans": "Chinese (Simplified)",
  "zh-Hant": "Chinese (Traditional)",
  "ar": "Arabic",
  "hi": "Hindi",
};

export function getSupportedTargetLanguages(): Record<string, string> {
  return { ...SUPPORTED_TARGET_LANGUAGES };
}

export async function translateToLanguage(
  text: string,
  targetLang: string
): Promise<{ translatedText: string; targetLanguage: string }> {
  if (!text || text.trim().length === 0) {
    return { translatedText: "", targetLanguage: targetLang };
  }

  if (!SUPPORTED_TARGET_LANGUAGES[targetLang]) {
    throw new Error(`Unsupported target language: ${targetLang}`);
  }

  const translator = getDeepLClient();
  const deepLTarget = targetLang as deepl.TargetLanguageCode;
  const result = await translator.translateText(text, null, deepLTarget);
  const translated = Array.isArray(result)
    ? result.map((r) => r.text).join("\n")
    : result.text;

  return { translatedText: translated, targetLanguage: targetLang };
}

function safeParseJSON(content: string): any {
  let cleaned = content.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const vaccMatch = cleaned.match(/"vaccinations"\s*:\s*\[[\s\S]*?\]/);
    const summaryMatch = cleaned.match(/"summary"\s*:\s*"([^"]*)"/);
    const originMatch = cleaned.match(/"document_origin"\s*:\s*\{[^}]*\}/);
    if (vaccMatch) {
      try {
        const originPart = originMatch ? `, ${originMatch[0]}` : ', "document_origin": null';
        const partialJson = `{${vaccMatch[0]}, "patient_info": null${originPart}, "document_type": "other", "summary": "${summaryMatch ? summaryMatch[1] : 'Partially parsed document'}"}`;
        return JSON.parse(partialJson);
      } catch {
        // fall through
      }
    }
    throw new Error(`Failed to parse AI response as JSON: ${(e as Error).message}. Response preview: ${cleaned.substring(0, 200)}...`);
  }
}

export interface ResidenceHistoryEntry {
  country: string;
  state?: string | null;
  startYear: number;
  startMonth?: number | null;
  endYear: string;
  endMonth?: number | null;
}

function buildResidenceContext(residenceHistory?: ResidenceHistoryEntry[]): string {
  if (!residenceHistory || residenceHistory.length === 0) return '';

  const formatted = residenceHistory.map(r => {
    const startStr = r.startMonth ? `${r.startMonth}/${r.startYear}` : `${r.startYear}`;
    const endStr = r.endYear === 'Present' ? 'Present' : (r.endMonth ? `${r.endMonth}/${r.endYear}` : `${r.endYear}`);
    const location = r.state ? `${r.state}, ${r.country}` : r.country;
    return `- ${location}: ${startStr} to ${endStr}`;
  }).join('\n');

  return `\n\nUSER'S RESIDENCE HISTORY (context only — do NOT use this to fill in vaccination fields):
${formatted}

This residence history is provided as background context. Do NOT use it to fill in country_given or location fields — leave those null if not explicitly stated in the document. The system handles location enrichment separately after extraction. However, you MAY use it to help determine the document_origin country if no other clues exist.`;
}

export async function parseVaccinationData(text: string, residenceHistory?: ResidenceHistoryEntry[]): Promise<any> {
  const openai = getOpenAIClient();
  const residenceContext = buildResidenceContext(residenceHistory);

  const systemPrompt = `You are a strict medical document parser for the DOZEY vaccination records system. Your job is to extract ONLY data that is explicitly written in the document. NEVER guess, assume, or generate data that is not clearly present in the text.

Return a JSON object with this exact structure:
{
  "vaccinations": [
    {
      "vaccine_name": "Exact vaccine name as written in the document. Use standard English name if you can confidently identify it, otherwise use the name exactly as written.",
      "date": "YYYY-MM-DD format ONLY if a specific date is clearly written. Use null if no date is found. Do NOT guess or approximate dates.",
      "dose_number": null,
      "provider": null,
      "country_given": null,
      "location": null,
      "notes": "Any additional relevant notes (lot number, batch, etc.)",
      "confidence": "high | medium | low",
      "missing_fields": ["list of field names that could not be found in the document"]
    }
  ],
  "patient_info": {
    "full_name": "Patient name ONLY if explicitly written. null otherwise.",
    "date_of_birth": "YYYY-MM-DD ONLY if explicitly written. null otherwise.",
    "id_number": "Patient ID ONLY if explicitly written. null otherwise."
  },
  "document_origin": {
    "country": "The country this document originates from. Determine from explicit mentions, or infer from: clinic/hospital addresses, healthcare system identifiers (e.g. NHS = UK, SUS = Brazil, UIDAI/Aadhaar = India, Medicare = Australia), provider names, government logos/stamps, phone number formats, vaccine brand names (e.g. Covishield/Covaxin = India, Sinovac = China/Brazil), document language, and formatting conventions. Use your best judgment. null only if absolutely no clues exist.",
    "confidence": "high | medium | low",
    "evidence": "Brief explanation of how the country was determined (e.g. 'Document written in Portuguese with Brazilian health ministry stamp', 'Clinic address mentions Mumbai, India')"
  },
  "document_type": "vaccination_card | immunization_record | medical_certificate | lab_result | other",
  "summary": "Brief 1-2 sentence summary of what data was actually found in the document"
}

CRITICAL RULES:
- ONLY extract vaccination data that is explicitly written in the document text
- If a vaccination field value is not clearly present, you MUST set it to null — NEVER fabricate, guess, or assume
- Do NOT invent dates, providers, dose numbers, or any other vaccination field
- For dose_number: only include if explicitly stated (e.g., "Dose 2", "2nd dose"). Use null if not mentioned.
- For country_given: include if the country is explicitly mentioned per vaccination record. If not explicitly stated per record but the document_origin country is determined, you may use that as the country_given for individual vaccination entries. If neither is available but a residence history is provided, cross-reference the vaccination date to infer the country.
- For provider: only include if the healthcare provider name is explicitly written.
- For date: only include if a specific date is written. Do NOT use today's date or approximate.
- Set confidence to "high" if the vaccine name and date are both clear, "medium" if one is unclear or location was inferred from residence history, "low" if the record is very uncertain
- Include "missing_fields" array listing which important fields (date, dose_number, provider, country_given) were NOT found
- If no vaccination data is found at all, return empty vaccinations array with a summary of what the document actually contains
- Include lot/batch numbers in notes if present
- For document_origin: USE ALL available clues (language, addresses, provider names, vaccine brands, government identifiers, formatting) to determine the country. This is an inference — you ARE allowed to reason about where the document is from.${residenceContext}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Parse the following medical document text and extract vaccination records:\n\n${text}` },
    ],
    max_tokens: 4096,
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from parsing model");
  }

  return safeParseJSON(content);
}

export async function parseDoctorNotes(text: string, residenceHistory?: ResidenceHistoryEntry[]): Promise<any> {
  const openai = getOpenAIClient();
  const residenceContext = buildResidenceContext(residenceHistory);

  const systemPrompt = `You are a medical document parser specializing in handwritten doctor's notes, medical letters, and clinical records for the DOZEY vaccination records system. Your task is to extract BOTH vaccination records AND medical exemptions/immunity evidence from the text.

Medical exemptions include:
- Natural immunity from prior disease (e.g., "patient had chickenpox in 2005" = varicella immunity)
- Positive titer/antibody tests proving immunity (e.g., "MMR titer positive", "Varicella IgG positive")
- Medical contraindications (e.g., "allergic to egg protein - cannot receive influenza vaccine", "immunocompromised - live vaccines contraindicated")
- Prior infection documentation (e.g., "confirmed COVID-19 infection March 2023")
- Doctor recommendations against vaccination (e.g., "Tdap contraindicated due to prior adverse reaction")

Common disease-to-vaccine mappings:
- Had chickenpox/varicella → Varicella vaccine exemption
- Had measles → MMR/Measles vaccine exemption  
- Had mumps → MMR/Mumps vaccine exemption
- Had rubella/German measles → MMR/Rubella vaccine exemption
- Had hepatitis A → Hepatitis A vaccine exemption
- Had hepatitis B → Hepatitis B vaccine exemption
- Had COVID-19 → COVID-19 vaccine may be deferred
- Positive titer for any disease → Corresponding vaccine exemption

Return a JSON object with this exact structure:
{
  "vaccinations": [
    {
      "vaccine_name": "Full vaccine name ONLY if explicitly found. null otherwise.",
      "date": "YYYY-MM-DD ONLY if explicitly written. null if not found. Do NOT guess.",
      "dose_number": null,
      "provider": null,
      "country_given": null,
      "location": null,
      "notes": "Any additional notes",
      "confidence": "high | medium | low",
      "missing_fields": ["list of field names not found in document"]
    }
  ],
  "exemptions": [
    {
      "vaccine_name": "Name of vaccine this exempts (use standard name: MMR, Varicella, Hepatitis B, etc.)",
      "exemption_type": "natural_immunity | medical_contraindication | prior_infection | titer_positive | other",
      "reason": "Clear explanation of why this exempts the requirement (e.g., 'Patient had confirmed chickenpox infection in childhood, conferring natural immunity to varicella')",
      "doctor_name": "Name of the doctor who wrote the note",
      "doctor_license": "Medical license number if found",
      "document_date": "YYYY-MM-DD of the doctor's note/letter",
      "notes": "Any additional clinical details"
    }
  ],
  "patient_info": {
    "full_name": "Patient name if found",
    "date_of_birth": "YYYY-MM-DD if found",
    "id_number": "Any patient ID if found"
  },
  "document_origin": {
    "country": "The country this document originates from. Determine from explicit mentions, or infer from: clinic/hospital addresses, healthcare system identifiers (NHS = UK, SUS = Brazil, Medicare = Australia), provider names, government stamps, phone number formats, vaccine brand names, document language, and formatting conventions. null only if absolutely no clues exist.",
    "confidence": "high | medium | low",
    "evidence": "Brief explanation of how the country was determined"
  },
  "document_type": "doctor_note | medical_letter | lab_result | titer_report | exemption_form | clinical_record | other",
  "summary": "Brief 2-3 sentence summary of the document, noting key exemptions/immunity evidence found"
}

CRITICAL RULES:
- ONLY extract data that is explicitly written in the document. NEVER guess, assume, or fabricate any information.
- This is often HANDWRITTEN text that has been OCR'd, so expect spelling errors, abbreviations, and messy formatting
- Common handwriting abbreviations: "pt" = patient, "hx" = history, "dx" = diagnosis, "rx" = prescription, "c/o" = complaining of, "s/p" = status post, "w/" = with, "w/o" = without
- If the doctor notes the patient "had" or "contracted" a disease, that's natural immunity
- Titer results showing "positive", "immune", or "reactive" indicate immunity
- Extract the doctor's name and credentials ONLY if explicitly visible in the text
- If vaccination records are also mentioned, include those too
- For ALL fields: if the information is not explicitly present in the text, use null. Do NOT invent names, dates, license numbers, or reasons.
- For dates: only include if explicitly written. Use null otherwise. Do NOT use today's date.
- For dose_number: only include if explicitly stated. Use null otherwise.
- Include "confidence" field ("high", "medium", "low") and "missing_fields" array for each vaccination entry
- Include enough detail in the "reason" field to support the exemption claim, but ONLY using information from the document${residenceContext}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Parse the following doctor's note/medical document (may be from handwriting OCR) and extract all vaccination records AND medical exemptions/immunity evidence:\n\n${text}` },
    ],
    max_tokens: 4096,
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("No response from parsing model");
  return safeParseJSON(content);
}

export async function processDoctorNotesDocument(filePath: string, mimeType: string, residenceHistory?: ResidenceHistoryEntry[]): Promise<{
  extractedText: string;
  translatedText: string;
  originalLanguage: string;
  parsedData: any;
}> {
  const { text } = await extractTextFromDocument(filePath, mimeType);

  if (!text || text.trim().length === 0) {
    throw new Error("No text could be extracted from the document. The handwriting may be too difficult to read - try a clearer scan.");
  }

  let translatedText = text;
  let detectedLanguage = "en";

  try {
    const translation = await detectAndTranslateText(text);
    translatedText = translation.translatedText;
    detectedLanguage = translation.detectedLanguage;
  } catch (translationError) {
    console.warn("Translation failed, proceeding with original text:", translationError);
  }

  const textForParsing = translatedText || text;
  const parsedData = await parseDoctorNotes(textForParsing, residenceHistory);

  return {
    extractedText: text,
    translatedText: detectedLanguage.toLowerCase() === "en" ? text : translatedText,
    originalLanguage: detectedLanguage,
    parsedData,
  };
}

export async function processDocument(filePath: string, mimeType: string, residenceHistory?: ResidenceHistoryEntry[]): Promise<{
  extractedText: string;
  translatedText: string;
  originalLanguage: string;
  parsedData: any;
}> {
  const { text } = await extractTextFromDocument(filePath, mimeType);

  if (!text || text.trim().length === 0) {
    throw new Error("No text could be extracted from the document");
  }

  let translatedText = text;
  let detectedLanguage = "en";

  try {
    const translation = await detectAndTranslateText(text);
    translatedText = translation.translatedText;
    detectedLanguage = translation.detectedLanguage;
  } catch (translationError) {
    console.warn("Translation failed, proceeding with original text:", translationError);
  }

  const textForParsing = translatedText || text;
  const parsedData = await parseVaccinationData(textForParsing, residenceHistory);

  return {
    extractedText: text,
    translatedText: detectedLanguage.toLowerCase() === "en" ? text : translatedText,
    originalLanguage: detectedLanguage,
    parsedData,
  };
}
