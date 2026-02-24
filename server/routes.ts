import type { Express } from "express";
import path from "path";
import multer from "multer";
import { isAuthenticated, type AuthRequest } from "./auth";
import { db } from "./db";
import { users, profiles, vaccinations, documents, countryHistory, medicalExemptions } from "../shared/schema";
import { eq, and } from "drizzle-orm";
import { processDocument, processDoctorNotesDocument } from "./ai-pipeline";
import { lookupInstitutionRequirements, lookupEmployerRequirements, lookupCountryRequirements, checkCompliance, generateFormattedReport, type ComplianceLookupType } from "./compliance-engine";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(__dirname, "../uploads"));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed. Supported: PDF, images, Word documents."));
    }
  },
});

export function registerRoutes(app: Express) {
  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const [user] = await db.select().from(users).where(eq(users.id, authReq.userId));
      res.json(user || null);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/auth/accept-tos", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const [updated] = await db
        .update(users)
        .set({ tosAcceptedAt: new Date(), updatedAt: new Date() })
        .where(eq(users.id, authReq.userId))
        .returning();
      res.json({ success: true, tosAcceptedAt: updated.tosAcceptedAt });
    } catch (error) {
      console.error("Error accepting TOS:", error);
      res.status(500).json({ message: "Failed to record TOS acceptance" });
    }
  });

  app.put("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const { firstName, lastName } = req.body;
      const [updated] = await db
        .update(users)
        .set({ firstName, lastName, updatedAt: new Date() })
        .where(eq(users.id, authReq.userId))
        .returning();
      res.json(updated);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
      res.json(profile || null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const data = { ...req.body, userId, updatedAt: new Date() };
      const [existing] = await db.select().from(profiles).where(eq(profiles.userId, userId));
      if (existing) {
        const [updated] = await db.update(profiles).set(data).where(eq(profiles.userId, userId)).returning();
        res.json(updated);
      } else {
        const [created] = await db.insert(profiles).values(data).returning();
        res.json(created);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ message: "Failed to save profile" });
    }
  });

  app.get("/api/vaccinations", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const records = await db.select().from(vaccinations).where(eq(vaccinations.userId, userId));
      res.json(records);
    } catch (error) {
      console.error("Error fetching vaccinations:", error);
      res.status(500).json({ message: "Failed to fetch vaccinations" });
    }
  });

  app.post("/api/vaccinations", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const [record] = await db.insert(vaccinations).values({ ...req.body, userId }).returning();
      res.json(record);
    } catch (error) {
      console.error("Error creating vaccination:", error);
      res.status(500).json({ message: "Failed to create vaccination" });
    }
  });

  app.delete("/api/vaccinations/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      await db.delete(vaccinations).where(and(eq(vaccinations.id, id), eq(vaccinations.userId, userId)));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting vaccination:", error);
      res.status(500).json({ message: "Failed to delete vaccination" });
    }
  });

  app.get("/api/documents", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const docs = await db.select().from(documents).where(eq(documents.userId, userId));
      res.json(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", isAuthenticated, upload.single("file"), async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const file = req.file;
      const { name, type, country } = req.body;

      const docData: any = { name, type, country, userId };
      if (file) {
        docData.fileName = file.originalname;
        docData.filePath = file.filename;
        docData.mimeType = file.mimetype;
        docData.fileSize = file.size;
      }

      const [doc] = await db.insert(documents).values(docData).returning();
      res.json(doc);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  app.get("/api/documents/:id/download", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      const [doc] = await db.select().from(documents).where(and(eq(documents.id, id), eq(documents.userId, userId)));

      if (!doc || !doc.filePath) {
        return res.status(404).json({ message: "File not found" });
      }

      const filePath = path.resolve(__dirname, "../uploads", doc.filePath);
      res.download(filePath, doc.fileName || doc.name);
    } catch (error) {
      console.error("Error downloading document:", error);
      res.status(500).json({ message: "Failed to download document" });
    }
  });

  app.delete("/api/documents/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      const [doc] = await db.select().from(documents).where(and(eq(documents.id, id), eq(documents.userId, userId)));

      if (doc?.filePath) {
        const fs = await import("fs");
        const filePath = path.resolve(__dirname, "../uploads", doc.filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await db.delete(documents).where(and(eq(documents.id, id), eq(documents.userId, userId)));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  app.get("/api/country-history", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const periods = await db.select().from(countryHistory).where(eq(countryHistory.userId, userId));
      res.json(periods);
    } catch (error) {
      console.error("Error fetching country history:", error);
      res.status(500).json({ message: "Failed to fetch country history" });
    }
  });

  app.post("/api/country-history", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const [period] = await db.insert(countryHistory).values({ ...req.body, userId }).returning();
      res.json(period);
    } catch (error) {
      console.error("Error creating country period:", error);
      res.status(500).json({ message: "Failed to create country period" });
    }
  });

  app.delete("/api/country-history/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      await db.delete(countryHistory).where(and(eq(countryHistory.id, id), eq(countryHistory.userId, userId)));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting country period:", error);
      res.status(500).json({ message: "Failed to delete country period" });
    }
  });

  app.patch("/api/documents/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      const { name, type, country } = req.body;
      const updates: Record<string, any> = {};
      if (name !== undefined) updates.name = name;
      if (type !== undefined) updates.type = type;
      if (country !== undefined) updates.country = country;

      const [updated] = await db
        .update(documents)
        .set(updates)
        .where(and(eq(documents.id, id), eq(documents.userId, userId)))
        .returning();
      if (!updated) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  app.post("/api/documents/:id/process", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      const [doc] = await db
        .select()
        .from(documents)
        .where(and(eq(documents.id, id), eq(documents.userId, userId)));

      if (!doc) {
        return res.status(404).json({ message: "Document not found" });
      }

      if (!doc.filePath) {
        return res.status(400).json({ message: "No file attached to this document" });
      }

      await db
        .update(documents)
        .set({ processingStatus: "processing" })
        .where(eq(documents.id, id));

      try {
        const result = await processDocument(doc.filePath, doc.mimeType || "application/pdf");

        const [updated] = await db
          .update(documents)
          .set({
            extractedText: result.extractedText,
            translatedText: result.translatedText,
            originalLanguage: result.originalLanguage,
            parsedData: JSON.stringify(result.parsedData),
            processingStatus: "completed",
          })
          .where(eq(documents.id, id))
          .returning();

        let autoImported = 0;
        const existingFromDoc = await db
          .select()
          .from(vaccinations)
          .where(and(eq(vaccinations.userId, userId), eq(vaccinations.documentId, String(id))));

        if (existingFromDoc.length === 0) {
          const parsedVaccs = result.parsedData?.vaccinations || [];
          for (const v of parsedVaccs) {
            try {
              await db.insert(vaccinations).values({
                userId,
                vaccineName: v.vaccine_name || "Unknown Vaccine",
                date: v.date || new Date().toISOString().split("T")[0],
                doseNumber: v.dose_number || 1,
                location: v.location || null,
                countryGiven: v.country_given || doc.country || null,
                provider: v.provider || null,
                notes: v.notes || null,
                verified: false,
                documentId: String(id),
              });
              autoImported++;
            } catch (insertErr) {
              console.error("Failed to auto-import vaccination:", insertErr);
            }
          }
        }

        res.json({
          success: true,
          document: updated,
          parsedData: result.parsedData,
          autoImported,
        });
      } catch (processingError: any) {
        await db
          .update(documents)
          .set({ processingStatus: "error" })
          .where(eq(documents.id, id));

        console.error("Document processing error:", processingError);
        res.status(500).json({
          message: processingError.message || "Failed to process document",
        });
      }
    } catch (error) {
      console.error("Error processing document:", error);
      res.status(500).json({ message: "Failed to process document" });
    }
  });

  app.post("/api/documents/:id/import-vaccinations", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      const [doc] = await db
        .select()
        .from(documents)
        .where(and(eq(documents.id, id), eq(documents.userId, userId)));

      if (!doc || !doc.parsedData) {
        return res.status(400).json({ message: "Document has no parsed data" });
      }

      const existingFromDoc = await db
        .select()
        .from(vaccinations)
        .where(and(eq(vaccinations.userId, userId), eq(vaccinations.documentId, String(id))));

      if (existingFromDoc.length > 0) {
        return res.json({ success: true, imported: 0, alreadyImported: existingFromDoc.length, message: "Vaccinations from this document were already imported automatically." });
      }

      let parsed: any;
      try {
        parsed = typeof doc.parsedData === 'object' ? doc.parsedData : JSON.parse(doc.parsedData);
      } catch (parseErr: any) {
        console.error("Failed to parse stored document data:", parseErr.message);
        return res.status(400).json({ message: "Document data is corrupted. Please re-process the document." });
      }
      const vaccs = parsed.vaccinations || [];

      if (vaccs.length === 0) {
        return res.status(400).json({ message: "No vaccination records found in document" });
      }

      const inserted = [];
      for (const v of vaccs) {
        const [record] = await db
          .insert(vaccinations)
          .values({
            userId,
            vaccineName: v.vaccine_name || "Unknown Vaccine",
            date: v.date || new Date().toISOString().split("T")[0],
            doseNumber: v.dose_number || 1,
            location: v.location || null,
            countryGiven: v.country_given || doc.country || null,
            provider: v.provider || null,
            notes: v.notes || null,
            verified: false,
            documentId: String(doc.id),
          })
          .returning();
        inserted.push(record);
      }

      res.json({ success: true, imported: inserted.length, vaccinations: inserted });
    } catch (error) {
      console.error("Error importing vaccinations:", error);
      res.status(500).json({ message: "Failed to import vaccinations" });
    }
  });

  app.post("/api/documents/:id/process-doctor-notes", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      const [doc] = await db
        .select()
        .from(documents)
        .where(and(eq(documents.id, id), eq(documents.userId, userId)));

      if (!doc) return res.status(404).json({ message: "Document not found" });
      if (!doc.filePath) return res.status(400).json({ message: "No file attached to this document" });

      await db.update(documents).set({ processingStatus: "processing" }).where(eq(documents.id, id));

      const result = await processDoctorNotesDocument(doc.filePath, doc.mimeType || "application/pdf");

      await db.update(documents).set({
        extractedText: result.extractedText,
        translatedText: result.translatedText,
        originalLanguage: result.originalLanguage,
        parsedData: JSON.stringify(result.parsedData),
        processingStatus: "completed",
      }).where(eq(documents.id, id));

      let autoImportedVacc = 0;
      let autoImportedExempt = 0;

      const existingVaccs = await db
        .select()
        .from(vaccinations)
        .where(and(eq(vaccinations.userId, userId), eq(vaccinations.documentId, String(id))));

      if (existingVaccs.length === 0) {
        const parsedVaccs = result.parsedData?.vaccinations || [];
        for (const v of parsedVaccs) {
          try {
            await db.insert(vaccinations).values({
              userId,
              vaccineName: v.vaccine_name || "Unknown Vaccine",
              date: v.date || new Date().toISOString().split("T")[0],
              doseNumber: v.dose_number || 1,
              location: v.location || null,
              countryGiven: v.country_given || doc.country || null,
              provider: v.provider || null,
              notes: v.notes || null,
              verified: false,
              documentId: String(id),
            });
            autoImportedVacc++;
          } catch (insertErr) {
            console.error("Failed to auto-import vaccination:", insertErr);
          }
        }
      }

      const existingExempts = await db
        .select()
        .from(medicalExemptions)
        .where(and(eq(medicalExemptions.userId, userId), eq(medicalExemptions.documentId, id)));

      if (existingExempts.length === 0) {
        const parsedExemptions = result.parsedData?.exemptions || [];
        for (const ex of parsedExemptions) {
          try {
            await db.insert(medicalExemptions).values({
              userId,
              vaccineName: ex.vaccine_name || "Unknown",
              exemptionType: ex.exemption_type || "other",
              reason: ex.reason || "Documented in medical records",
              doctorName: ex.doctor_name || null,
              doctorLicense: ex.doctor_license || null,
              documentDate: ex.document_date || null,
              documentId: id,
              notes: ex.notes || null,
              verified: false,
            });
            autoImportedExempt++;
          } catch (insertErr) {
            console.error("Failed to auto-import exemption:", insertErr);
          }
        }
      }

      res.json({ success: true, parsedData: result.parsedData, autoImportedVacc, autoImportedExempt });
    } catch (error: any) {
      const id = parseInt(req.params.id as string);
      await db.update(documents).set({ processingStatus: "error" }).where(eq(documents.id, id));
      console.error("Error processing doctor notes:", error);
      res.status(500).json({ message: error.message || "Failed to process doctor notes" });
    }
  });

  app.post("/api/documents/:id/import-exemptions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      const [doc] = await db
        .select()
        .from(documents)
        .where(and(eq(documents.id, id), eq(documents.userId, userId)));

      if (!doc || !doc.parsedData) {
        return res.status(400).json({ message: "Document has no parsed data" });
      }

      const parsed = JSON.parse(doc.parsedData);
      const exempts = parsed.exemptions || [];

      if (exempts.length === 0) {
        return res.status(400).json({ message: "No medical exemptions found in document" });
      }

      const inserted = [];
      for (const ex of exempts) {
        const [record] = await db
          .insert(medicalExemptions)
          .values({
            userId,
            vaccineName: ex.vaccine_name || "Unknown",
            exemptionType: ex.exemption_type || "other",
            reason: ex.reason || "See attached document",
            doctorName: ex.doctor_name || null,
            doctorLicense: ex.doctor_license || null,
            documentDate: ex.document_date || null,
            documentId: doc.id,
            notes: ex.notes || null,
            verified: false,
          })
          .returning();
        inserted.push(record);
      }

      res.json({ success: true, imported: inserted.length, exemptions: inserted });
    } catch (error) {
      console.error("Error importing exemptions:", error);
      res.status(500).json({ message: "Failed to import exemptions" });
    }
  });

  app.get("/api/exemptions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const results = await db.select().from(medicalExemptions).where(eq(medicalExemptions.userId, userId));
      res.json(results);
    } catch (error) {
      console.error("Error fetching exemptions:", error);
      res.status(500).json({ message: "Failed to fetch exemptions" });
    }
  });

  app.post("/api/exemptions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const [record] = await db.insert(medicalExemptions).values({ ...req.body, userId }).returning();
      res.json(record);
    } catch (error) {
      console.error("Error creating exemption:", error);
      res.status(500).json({ message: "Failed to create exemption" });
    }
  });

  app.delete("/api/exemptions/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      await db.delete(medicalExemptions).where(and(eq(medicalExemptions.id, id), eq(medicalExemptions.userId, userId)));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting exemption:", error);
      res.status(500).json({ message: "Failed to delete exemption" });
    }
  });

  app.post("/api/compliance/lookup", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const { institutionName, lookupType = "institution" } = req.body;

      if (!institutionName || institutionName.trim().length < 2) {
        return res.status(400).json({ message: "Search query is required" });
      }

      let requirements;
      const query = institutionName.trim();
      
      switch (lookupType as ComplianceLookupType) {
        case "employer":
          requirements = await lookupEmployerRequirements(query);
          break;
        case "country":
          requirements = await lookupCountryRequirements(query);
          break;
        case "institution":
        default:
          requirements = await lookupInstitutionRequirements(query);
          break;
      }

      const userVaccinations = await db
        .select()
        .from(vaccinations)
        .where(eq(vaccinations.userId, userId));

      const userExemptions = await db
        .select()
        .from(medicalExemptions)
        .where(eq(medicalExemptions.userId, userId));

      const { compliance, overallPercentage, totalRequired, totalCompleted } = checkCompliance(
        requirements,
        userVaccinations,
        userExemptions
      );

      res.json({
        institution: requirements,
        compliance,
        overallPercentage,
        totalRequired,
        totalCompleted,
      });
    } catch (error: any) {
      console.error("Compliance lookup error:", error);
      res.status(500).json({ message: error.message || "Failed to look up requirements" });
    }
  });

  app.post("/api/compliance/report", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const { institution, compliance, overallPercentage, lookupType = "institution" } = req.body;

      if (!institution || !compliance) {
        return res.status(400).json({ message: "Institution and compliance data required" });
      }

      const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
      const userVaccinations = await db.select().from(vaccinations).where(eq(vaccinations.userId, userId));

      const profileData = {
        fullName: profile?.fullName || "Not provided",
        dateOfBirth: profile?.dateOfBirth || "",
        countryOfOrigin: profile?.countryOfOrigin || "Not provided",
      };

      const vaccinationData = userVaccinations.map(v => ({
        vaccineName: v.vaccineName,
        date: v.date,
        doseNumber: v.doseNumber,
        provider: v.provider || "",
        location: v.location || "",
        countryGiven: v.countryGiven || "",
        verified: v.verified || false,
      }));

      const report = generateFormattedReport(
        institution,
        compliance,
        profileData,
        vaccinationData,
        overallPercentage,
        lookupType as ComplianceLookupType
      );

      res.json({ report });
    } catch (error: any) {
      console.error("Report generation error:", error);
      res.status(500).json({ message: error.message || "Failed to generate report" });
    }
  });

  app.post("/api/chat", isAuthenticated, async (req, res) => {
    try {
      const { message, history, language } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) {
        return res.json({
          reply: "I'm not fully set up yet, but I'll be ready soon! In the meantime, feel free to explore the app. You can upload documents, add vaccinations, and manage your health records.",
        });
      }

      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: openaiKey });

      const langMap: Record<string, string> = {
        en: "English", es: "Spanish", fr: "French", hi: "Hindi",
        zh: "Chinese (Simplified)", pt: "Portuguese", ar: "Arabic",
      };
      const userLang = langMap[language] || "English";

      const systemPrompt = `You are Doze, the friendly AI health records assistant for the DOZEY app. DOZEY helps immigrants, international students, and global workers manage vaccination records and medical documents across borders.

IMPORTANT: The user's selected language is ${userLang}. You MUST respond in ${userLang}. Always reply in the user's language, regardless of what language they write in.

## DOZEY App Pages & Navigation
When users ask how to do something, direct them to the correct page. Use these exact page names:
- **Dashboard** — Overview of their health records, quick stats, and shortcuts to other pages.
- **Profile** — Set up personal information: full name, date of birth, country of origin, current location, citizenships, languages, primary healthcare provider (with contact details), target country for visa/immigration, target institution/school, and target employer.
- **Country History** — Track all countries/regions the user has lived in with start and end years. Important for determining which vaccines were given where.
- **Upload Documents** — Upload vaccination cards, medical records, doctor's notes, or any health documents (PDF, images). The AI pipeline will: 1) Extract text using OCR (even handwritten documents), 2) Detect language and translate to English, 3) Parse vaccinations and medical exemptions automatically. Users can also manually add document entries.
- **Vaccine Timeline** — View all vaccination records in chronological order. Add new vaccinations manually or import them from processed documents. Each record includes vaccine name, date, dose number, location, country, provider, and notes.
- **Compliance** — Check if vaccinations meet requirements for a specific institution/school, employer, or country/visa. The AI looks up real requirements and compares them against the user's records and exemptions. Generates downloadable compliance reports.
- **Share** — Generate shareable vaccination records in multiple formats. Export or share records with institutions, employers, or healthcare providers.
- **Alerts** — View notifications about missing vaccinations, upcoming boosters, or compliance gaps.

## What You Can Help With
1. **Navigation**: Tell users which page to go to and what they can do there.
2. **Vaccination questions**: General information about vaccines, schedules, and requirements for different countries.
3. **Document uploads**: Explain how to upload documents and how the AI processing pipeline works (OCR → translate → parse → import).
4. **Compliance checks**: Explain how to check if records meet requirements for schools, employers, or immigration.
5. **Medical exemptions**: Explain how exemptions work and how they're extracted from doctor's notes.
6. **Profile setup**: Guide users through filling out their profile completely.

## Rules
- Keep responses concise, warm, and helpful (2-4 short paragraphs max).
- Use simple, everyday language — many users are non-native English speakers.
- When directing to a page, mention the page name clearly so users can find it in the navigation bar.
- If asked for specific medical advice, recommend consulting their healthcare provider.
- If asked something outside the scope of the app, politely redirect to what you can help with.
- Format responses with line breaks for readability. Use bullet points when listing steps.`;

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...(history || []).slice(-10).map((m: any) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: message },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 600,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't process that. Please try again.";
      res.json({ reply });
    } catch (error) {
      console.error("Chat error:", error);
      res.json({
        reply: "I'm having trouble connecting right now. Please try again in a moment!",
      });
    }
  });
}
