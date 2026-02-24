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
  const absolutePath = path.resolve(__dirname, "../uploads", filePath);

  if (!fs.existsSync(absolutePath)) {
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
    if (vaccMatch) {
      try {
        const partialJson = `{${vaccMatch[0]}, "patient_info": null, "document_type": "other", "summary": "${summaryMatch ? summaryMatch[1] : 'Partially parsed document'}"}`;
        return JSON.parse(partialJson);
      } catch {
        // fall through
      }
    }
    throw new Error(`Failed to parse AI response as JSON: ${(e as Error).message}. Response preview: ${cleaned.substring(0, 200)}...`);
  }
}

export async function parseVaccinationData(text: string): Promise<any> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are a medical document parser for the DOZEY vaccination records system. Extract vaccination and medical record data from the provided text.

Return a JSON object with this exact structure:
{
  "vaccinations": [
    {
      "vaccine_name": "Full vaccine name (e.g., COVID-19 Pfizer-BioNTech, Measles-Mumps-Rubella (MMR))",
      "date": "YYYY-MM-DD format if available, otherwise the date string as-is",
      "dose_number": 1,
      "provider": "Healthcare provider or clinic name if mentioned",
      "country_given": "Country where vaccine was administered if mentioned",
      "location": "Specific location/clinic/hospital if mentioned",
      "notes": "Any additional relevant notes (lot number, batch, etc.)"
    }
  ],
  "patient_info": {
    "full_name": "Patient name if found",
    "date_of_birth": "YYYY-MM-DD if found",
    "id_number": "Any patient ID number if found"
  },
  "document_type": "vaccination_card | immunization_record | medical_certificate | lab_result | other",
  "summary": "Brief 1-2 sentence summary of the document contents"
}

Rules:
- Extract ALL vaccinations mentioned, even partial data
- If a field is not found, use null
- Standardize vaccine names to common English names where possible
- For dates, try to parse into YYYY-MM-DD format
- Include lot/batch numbers in notes if present
- If no vaccination data is found, return empty vaccinations array with a summary of what the document contains`;

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

export async function parseDoctorNotes(text: string): Promise<any> {
  const openai = getOpenAIClient();

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
      "vaccine_name": "Full vaccine name",
      "date": "YYYY-MM-DD if available",
      "dose_number": 1,
      "provider": "Healthcare provider name if mentioned",
      "country_given": "Country if mentioned",
      "location": "Clinic/hospital if mentioned",
      "notes": "Any additional notes"
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
  "document_type": "doctor_note | medical_letter | lab_result | titer_report | exemption_form | clinical_record | other",
  "summary": "Brief 2-3 sentence summary of the document, noting key exemptions/immunity evidence found"
}

Rules:
- This is often HANDWRITTEN text that has been OCR'd, so expect spelling errors, abbreviations, and messy formatting
- Common handwriting abbreviations: "pt" = patient, "hx" = history, "dx" = diagnosis, "rx" = prescription, "c/o" = complaining of, "s/p" = status post, "w/" = with, "w/o" = without
- Look for ANY evidence of prior disease, positive titers, or medical reasons not to vaccinate
- If the doctor notes the patient "had" or "contracted" a disease, that's natural immunity
- Titer results showing "positive", "immune", or "reactive" indicate immunity
- Extract the doctor's name and credentials whenever visible
- If vaccination records are also mentioned, include those too
- Be generous in interpreting exemptions - if there's reasonable evidence of immunity, include it
- Always include enough detail in the "reason" field to support the exemption claim`;

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

export async function processDoctorNotesDocument(filePath: string, mimeType: string): Promise<{
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
  const parsedData = await parseDoctorNotes(textForParsing);

  return {
    extractedText: text,
    translatedText: detectedLanguage.toLowerCase() === "en" ? text : translatedText,
    originalLanguage: detectedLanguage,
    parsedData,
  };
}

export async function processDocument(filePath: string, mimeType: string): Promise<{
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
  const parsedData = await parseVaccinationData(textForParsing);

  return {
    extractedText: text,
    translatedText: detectedLanguage.toLowerCase() === "en" ? text : translatedText,
    originalLanguage: detectedLanguage,
    parsedData,
  };
}
