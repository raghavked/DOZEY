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
    max_tokens: 2000,
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from parsing model");
  }

  return JSON.parse(content);
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
