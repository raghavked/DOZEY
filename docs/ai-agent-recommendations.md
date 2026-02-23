# DOZEY - AI Agent/API Recommendations for Document Processing

## Overview

DOZEY needs AI capabilities to:
1. **OCR** - Extract text from uploaded medical documents (PDFs, images)
2. **Translation** - Translate medical records between languages
3. **Parsing/Formatting** - Structure extracted data into standardized formats (vaccinations, dates, providers)

Below are the best options organized by architecture approach.

---

## Recommended Architecture: Multi-Agent Pipeline

```
[User Upload] 
    -> Agent 1: OCR & Extraction (Mistral OCR or GPT-4.1 Vision)
    -> Agent 2: Translation (DeepL or Google Translate API)
    -> Agent 3: Parsing & Structuring (GPT-4.1 / Claude)
    -> [Structured Data saved to database]
```

---

## Agent 1: OCR & Document Extraction

### Top Pick: Mistral OCR
- **Cost**: $1 per 1,000 pages (cheapest)
- **Accuracy**: 74% win rate vs competitors on benchmarks
- **Strengths**: Handles complex tables, multi-page PDFs, mixed layouts
- **API**: REST API, simple integration
- **Get API Key**: https://console.mistral.ai/
- **Pricing page**: https://mistral.ai/products#pricing

### Runner-Up: GPT-4.1 Vision (OpenAI)
- **Cost**: ~$10-20 per 1,000 pages
- **Accuracy**: Strong on printed text, moderate on handwriting
- **Strengths**: OCR + reasoning in one step, 1M token context, can extract AND structure in a single call
- **API**: OpenAI API
- **Get API Key**: https://platform.openai.com/api-keys
- **Pricing page**: https://openai.com/api/pricing/

### Best for Medical-Specific: Affinda
- **Cost**: Usage-based (contact sales)
- **Accuracy**: 99%+ on medical records, including handwritten notes
- **Strengths**: Pre-trained on medical documents, EHR/FHIR output, ICD-10 code extraction
- **API**: REST API with auto-generated TypeScript client
- **Get API Key**: https://www.affinda.com/
- **Best if**: You need HIPAA compliance and specialized medical document understanding

---

## Agent 2: Translation

### Top Pick: DeepL API
- **Cost**: $25/month for 500K characters (Pro), or $5.49 per 1M characters (API)
- **Accuracy**: Best general translation quality, especially European languages
- **Languages**: 30+ languages
- **API**: REST API
- **Get API Key**: https://www.deepl.com/pro-api
- **Pricing page**: https://www.deepl.com/pro#developer

### Runner-Up: Google Cloud Translation API
- **Cost**: $20 per 1M characters (basic), $80 per 1M (advanced with medical glossaries)
- **Accuracy**: Strong across 100+ languages, especially Asian languages
- **Strengths**: Custom glossaries for medical terminology, auto-detect language
- **API**: REST API, Node.js SDK
- **Get API Key**: https://console.cloud.google.com/apis/library/translate.googleapis.com
- **Pricing page**: https://cloud.google.com/translate/pricing

### Best for Medical: X-doc.AI
- **Cost**: Custom enterprise pricing
- **Accuracy**: 99% on medical/legal documents, 11% better than Google Translate on technical text
- **Strengths**: Combined OCR + Translation in one API (replaces Agent 1 + Agent 2)
- **API**: REST API
- **Get API Key**: https://x-doc.ai
- **Best if**: You want an all-in-one OCR + Translation solution for medical documents

---

## Agent 3: Parsing & Structuring

### Top Pick: OpenAI GPT-4.1
- **Cost**: $2.50 per 1M input tokens, $10 per 1M output tokens
- **Strengths**: Excellent at extracting structured JSON from unstructured text, understands medical terminology
- **Use case**: Takes OCR text and extracts: vaccine names, dates, dose numbers, providers, countries
- **Get API Key**: https://platform.openai.com/api-keys

### Runner-Up: Anthropic Claude 3.5 Sonnet
- **Cost**: $3 per 1M input tokens, $15 per 1M output tokens
- **Strengths**: Strong reasoning, handles ambiguous medical records well, good at following structured output schemas
- **Get API Key**: https://console.anthropic.com/

### Either works well with a structured prompt like:
```
Extract vaccination records from this text and return JSON:
{
  "vaccinations": [
    {
      "vaccine_name": "...",
      "date": "YYYY-MM-DD",
      "dose_number": 1,
      "provider": "...",
      "country_given": "...",
      "location": "...",
      "notes": "..."
    }
  ],
  "patient_info": {
    "full_name": "...",
    "date_of_birth": "YYYY-MM-DD"
  }
}
```

---

## Recommended Combinations

### Option A: Best Value (Recommended for Startup)
| Role | Service | Monthly Cost (est.) |
|------|---------|-------------------|
| OCR | Mistral OCR | ~$5-20 |
| Translation | DeepL API | ~$25 |
| Parsing | OpenAI GPT-4.1 | ~$10-30 |
| **Total** | | **~$40-75/month** |

### Option B: All-in-One Medical
| Role | Service | Monthly Cost (est.) |
|------|---------|-------------------|
| OCR + Translation | X-doc.AI | Custom pricing |
| Parsing | OpenAI GPT-4.1 | ~$10-30 |
| **Total** | | **Contact X-doc.AI** |

### Option C: Single Provider (Simplest)
| Role | Service | Monthly Cost (est.) |
|------|---------|-------------------|
| OCR + Parsing | OpenAI GPT-4.1 Vision | ~$30-60 |
| Translation | DeepL API | ~$25 |
| **Total** | | **~$55-85/month** |

### Option D: Enterprise Medical
| Role | Service | Monthly Cost (est.) |
|------|---------|-------------------|
| OCR | Affinda | Contact sales |
| Translation | Google Cloud Translation (Advanced) | ~$40-80 |
| Parsing | OpenAI GPT-4.1 | ~$10-30 |
| **Total** | | **Contact Affinda** |

---

## Single-Agent vs Multi-Agent

### Single Agent (GPT-4.1 Vision does everything)
- **Pros**: Simplest to implement, one API key, one call per document
- **Cons**: Higher cost per page, less accurate on translation, no medical-specific training
- **Best for**: MVP / early stage

### Multi-Agent Pipeline (Recommended)
- **Pros**: Best accuracy per step, cheapest overall, can swap providers, better error handling
- **Cons**: More complex to build, multiple API keys
- **Best for**: Production / scale

---

## API Keys to Obtain

Based on **Option A (Recommended)**, you will need:

1. **Mistral AI API Key** - https://console.mistral.ai/ (for OCR)
2. **DeepL API Key** - https://www.deepl.com/pro-api (for translation)
3. **OpenAI API Key** - https://platform.openai.com/api-keys (for parsing/structuring)

These should be stored as Supabase/environment secrets:
- `MISTRAL_API_KEY`
- `DEEPL_API_KEY`
- `OPENAI_API_KEY`
