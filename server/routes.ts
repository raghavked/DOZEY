import type { Express } from "express";
import path from "path";
import multer from "multer";
import { isAuthenticated, type AuthRequest } from "./auth";
import { db } from "./db";
import { users, profiles, vaccinations, documents, countryHistory, medicalExemptions } from "../shared/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { processDocument, processDoctorNotesDocument, translateToLanguage, getSupportedTargetLanguages } from "./ai-pipeline";
import { lookupInstitutionRequirements, lookupEmployerRequirements, lookupCountryRequirements, checkCompliance, generateFormattedReport, type ComplianceLookupType } from "./compliance-engine";
import { sanitizeString, sanitizeLongString, validateDate, validateId, validateDoseNumber, sanitizeProfileData } from "./validation";

import { asc } from "drizzle-orm";
import crypto from "crypto";

async function recalculateDoseNumbers(userId: string, vaccineName: string) {
  const normalizedName = vaccineName.toLowerCase().trim();
  const allDoses = await db
    .select()
    .from(vaccinations)
    .where(and(eq(vaccinations.userId, userId)))
    .orderBy(asc(vaccinations.date), asc(vaccinations.createdAt));

  const matching = allDoses.filter(
    (v) => (v.vaccineName || '').toLowerCase().trim() === normalizedName
  );

  for (let i = 0; i < matching.length; i++) {
    const correctDose = i + 1;
    if (matching[i].doseNumber !== correctDose) {
      await db
        .update(vaccinations)
        .set({ doseNumber: correctDose })
        .where(eq(vaccinations.id, matching[i].id));
    }
  }
}

const complianceCache = new Map<string, { data: any; timestamp: number }>();
const COMPLIANCE_CACHE_TTL = 10 * 60 * 1000;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(__dirname, "../uploads"));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, "");
    const safeExt = [".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".doc", ".docx"].includes(ext) ? ext : "";
    cb(null, uniqueSuffix + safeExt);
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
  let cachedStats: any = null;
  let cacheTimestamp = 0;
  const CACHE_TTL = 60000;

  app.get("/api/platform-stats", async (_req, res) => {
    try {
      const now = Date.now();
      if (cachedStats && now - cacheTimestamp < CACHE_TTL) {
        return res.json(cachedStats);
      }

      const [userCount] = await db.select({ count: count() }).from(users);
      const [docCount] = await db.select({ count: count() }).from(documents);
      const [vacCount] = await db.select({ count: count() }).from(vaccinations);
      const [countryCount] = await db.select({ count: count() }).from(countryHistory);

      const totalUsers = Number(userCount.count) || 0;
      const totalDocs = Number(docCount.count) || 0;
      const totalVaccinations = Number(vacCount.count) || 0;
      const totalCountries = Number(countryCount.count) || 0;

      const HOURS_PER_DOC_TRADITIONAL = 4.5;
      const HOURS_PER_DOC_DOZEY = 0.25;
      const HOURS_PER_VACCINATION_TRADITIONAL = 1.5;
      const HOURS_PER_VACCINATION_DOZEY = 0.08;
      const HOURS_PER_COUNTRY_TRADITIONAL = 3;
      const HOURS_PER_COUNTRY_DOZEY = 0.17;
      const HOURS_PER_USER_SETUP_TRADITIONAL = 2;
      const HOURS_PER_USER_SETUP_DOZEY = 0.17;

      const traditionalHours =
        (totalDocs * HOURS_PER_DOC_TRADITIONAL) +
        (totalVaccinations * HOURS_PER_VACCINATION_TRADITIONAL) +
        (totalCountries * HOURS_PER_COUNTRY_TRADITIONAL) +
        (totalUsers * HOURS_PER_USER_SETUP_TRADITIONAL);

      const dozeyHours =
        (totalDocs * HOURS_PER_DOC_DOZEY) +
        (totalVaccinations * HOURS_PER_VACCINATION_DOZEY) +
        (totalCountries * HOURS_PER_COUNTRY_DOZEY) +
        (totalUsers * HOURS_PER_USER_SETUP_DOZEY);

      const hoursSaved = Math.round((traditionalHours - dozeyHours) * 10) / 10;

      const AVG_HOURLY_COST = 45;
      const AVG_REVACCINATION_COST = 150;
      const AVG_TRANSLATION_FEE = 75;
      const revaccinationsAvoided = Math.floor(totalVaccinations * 0.35);
      const translationsAvoided = Math.floor(totalDocs * 0.8);

      const dollarsSaved = Math.round(
        (hoursSaved * AVG_HOURLY_COST) +
        (revaccinationsAvoided * AVG_REVACCINATION_COST) +
        (translationsAvoided * AVG_TRANSLATION_FEE)
      );

      cachedStats = {
        totalUsers,
        totalDocuments: totalDocs,
        totalVaccinations,
        totalCountries,
        hoursSaved,
        dollarsSaved,
        revaccinationsAvoided,
        translationsAvoided,
        timestamp: now,
      };
      cacheTimestamp = now;

      res.json(cachedStats);
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      res.status(500).json({ message: "Failed to fetch platform stats" });
    }
  });

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
      const firstName = sanitizeString(req.body.firstName);
      const lastName = sanitizeString(req.body.lastName);
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
      const sanitized = sanitizeProfileData(req.body);
      const data = { ...sanitized, userId, updatedAt: new Date() } as any;
      const [existing] = await db.select().from(profiles).where(eq(profiles.userId, userId));
      if (existing) {
        const [updated] = await db.update(profiles).set(data).where(eq(profiles.userId, userId)).returning();
        clearComplianceCacheForUser(userId);
        res.json(updated);
      } else {
        const [created] = await db.insert(profiles).values(data).returning();
        clearComplianceCacheForUser(userId);
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
      const vaccineName = sanitizeString(req.body.vaccineName);
      if (!vaccineName) {
        return res.status(400).json({ message: "Vaccine name is required" });
      }
      const date = sanitizeString(req.body.date);
      if (!date || !validateDate(date)) {
        return res.status(400).json({ message: "A valid date is required" });
      }
      if (new Date(date) > new Date()) {
        return res.status(400).json({ message: "Date cannot be in the future" });
      }
      const vaccData: any = {
        userId,
        vaccineName,
        date,
        doseNumber: validateDoseNumber(req.body.doseNumber),
        location: sanitizeString(req.body.location),
        countryGiven: sanitizeString(req.body.countryGiven),
        provider: sanitizeString(req.body.provider),
        notes: sanitizeLongString(req.body.notes),
        verified: req.body.verified === true,
        documentId: sanitizeString(req.body.documentId),
      };
      const [record] = await db.insert(vaccinations).values(vaccData).returning();
      await recalculateDoseNumbers(userId, vaccineName);
      clearComplianceCacheForUser(userId);
      const [updated] = await db.select().from(vaccinations).where(eq(vaccinations.id, record.id));
      res.json(updated || record);
    } catch (error) {
      console.error("Error creating vaccination:", error);
      res.status(500).json({ message: "Failed to create vaccination" });
    }
  });

  app.patch("/api/vaccinations/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      const { verified } = req.body;
      const [updated] = await db.update(vaccinations)
        .set({ verified: !!verified })
        .where(and(eq(vaccinations.id, id), eq(vaccinations.userId, userId)))
        .returning();
      clearComplianceCacheForUser(userId);
      res.json(updated);
    } catch (error) {
      console.error("Error updating vaccination:", error);
      res.status(500).json({ message: "Failed to update vaccination" });
    }
  });

  app.delete("/api/vaccinations/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      const [toDelete] = await db.select().from(vaccinations).where(and(eq(vaccinations.id, id), eq(vaccinations.userId, userId)));
      if (!toDelete) return res.json({ success: true });
      await db.delete(vaccinations).where(and(eq(vaccinations.id, id), eq(vaccinations.userId, userId)));
      await recalculateDoseNumbers(userId, toDelete.vaccineName);
      clearComplianceCacheForUser(userId);
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
      const name = sanitizeString(req.body.name) || "Untitled Document";
      const type = sanitizeString(req.body.type);
      const country = sanitizeString(req.body.country);

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

      const uploadsDir = path.resolve(__dirname, "../uploads");
      const filePath = path.resolve(uploadsDir, path.basename(doc.filePath));
      if (!filePath.startsWith(uploadsDir)) {
        return res.status(403).json({ message: "Access denied" });
      }
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
        const uploadsBase = path.resolve(__dirname, "../uploads");
        const filePath = path.resolve(uploadsBase, path.basename(doc.filePath));
        if (filePath.startsWith(uploadsBase) && fs.existsSync(filePath)) {
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
      const country = sanitizeString(req.body.country);
      if (!country) {
        return res.status(400).json({ message: "Country is required" });
      }
      const historyData: any = {
        userId,
        country,
        state: sanitizeString(req.body.state),
        startYear: typeof req.body.startYear === 'number' ? req.body.startYear : parseInt(req.body.startYear) || null,
        endYear: req.body.endYear === 'Present' ? 'Present' : (typeof req.body.endYear === 'number' ? req.body.endYear : parseInt(req.body.endYear) || null),
        startMonth: typeof req.body.startMonth === 'number' ? Math.min(12, Math.max(1, req.body.startMonth)) : null,
        endMonth: typeof req.body.endMonth === 'number' ? Math.min(12, Math.max(1, req.body.endMonth)) : null,
      };
      const [period] = await db.insert(countryHistory).values(historyData).returning();
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
      const updates: Record<string, any> = {};
      if (req.body.name !== undefined) updates.name = sanitizeString(req.body.name);
      if (req.body.type !== undefined) updates.type = sanitizeString(req.body.type);
      if (req.body.country !== undefined) updates.country = sanitizeString(req.body.country);

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

      const residenceHistory = await db.select().from(countryHistory).where(eq(countryHistory.userId, userId));

      try {
        const result = await processDocument(doc.filePath, doc.mimeType || "application/pdf", residenceHistory);

        const detectedCountry = result.parsedData?.document_origin?.country || null;
        const updateData: Record<string, any> = {
          extractedText: result.extractedText,
          translatedText: result.translatedText,
          originalLanguage: result.originalLanguage,
          parsedData: JSON.stringify(result.parsedData),
          processingStatus: "completed",
        };
        if (detectedCountry) {
          updateData.country = detectedCountry;
        }

        const [updated] = await db
          .update(documents)
          .set(updateData)
          .where(eq(documents.id, id))
          .returning();

        let autoImported = 0;
        let needsReview = 0;
        const existingFromDoc = await db
          .select()
          .from(vaccinations)
          .where(and(eq(vaccinations.userId, userId), eq(vaccinations.documentId, String(id))));

        if (existingFromDoc.length === 0) {
          const parsedVaccs = result.parsedData?.vaccinations || [];
          const userProfile = await db.select().from(profiles).where(eq(profiles.userId, userId));
          const profile = userProfile[0] || null;

          const existingUserVaccs = await db.select().from(vaccinations).where(eq(vaccinations.userId, userId));

          const doseCounters: Record<string, number> = {};
          for (const ev of existingUserVaccs) {
            const key = (ev.vaccineName || '').toLowerCase().trim();
            const dose = ev.doseNumber ? parseInt(String(ev.doseNumber)) : 0;
            doseCounters[key] = Math.max(doseCounters[key] || 0, dose);
          }

          const docVaccIndexByName: Record<string, number[]> = {};
          const datedVaccs: { idx: number; key: string; date: string }[] = [];
          for (let idx = 0; idx < parsedVaccs.length; idx++) {
            const v = parsedVaccs[idx];
            if (!v.vaccine_name) continue;
            const key = v.vaccine_name.toLowerCase().trim();
            if (!docVaccIndexByName[key]) docVaccIndexByName[key] = [];
            if (v.date) {
              datedVaccs.push({ idx, key, date: v.date });
            }
            docVaccIndexByName[key].push(idx);
          }

          const doseAssignment: Record<number, number> = {};
          for (const key of Object.keys(docVaccIndexByName)) {
            const indices = docVaccIndexByName[key];
            const withDates = indices.filter(i => parsedVaccs[i].date).sort((a, b) =>
              new Date(parsedVaccs[a].date).getTime() - new Date(parsedVaccs[b].date).getTime()
            );
            const withoutDates = indices.filter(i => !parsedVaccs[i].date);
            const ordered = [...withDates, ...withoutDates];
            const existingMax = doseCounters[key] || 0;
            ordered.forEach((vaccIdx, seqIdx) => {
              const v = parsedVaccs[vaccIdx];
              if (v.dose_number) {
                doseAssignment[vaccIdx] = v.dose_number;
              } else {
                doseAssignment[vaccIdx] = existingMax + seqIdx + 1;
              }
            });
          }

          const docOriginCountry = detectedCountry;

          for (const v of parsedVaccs) {
            const hasRequiredFields = v.vaccine_name && v.date;
            if (!hasRequiredFields) {
              needsReview++;
              continue;
            }

            let enrichedCountry = v.country_given || null;
            let enrichedLocation = v.location || null;
            let enrichedProvider = v.provider || null;
            const vaccIdx = parsedVaccs.indexOf(v);
            let enrichedDose = v.dose_number || doseAssignment[vaccIdx] || 1;
            v.dose_number = enrichedDose;

            if (!enrichedCountry && v.date && residenceHistory.length > 0) {
              const vaccDate = new Date(v.date);
              const vaccYear = vaccDate.getFullYear();
              const vaccMonth = vaccDate.getMonth() + 1;
              for (const rh of residenceHistory) {
                const startMatch = rh.startMonth ? (vaccYear > rh.startYear || (vaccYear === rh.startYear && vaccMonth >= rh.startMonth)) : vaccYear >= rh.startYear;
                const endYearNum = rh.endYear === 'Present' ? new Date().getFullYear() + 1 : parseInt(String(rh.endYear));
                const endMatch = rh.endMonth ? (vaccYear < endYearNum || (vaccYear === endYearNum && vaccMonth <= rh.endMonth)) : vaccYear <= endYearNum;
                if (startMatch && endMatch) {
                  enrichedCountry = rh.country;
                  if (rh.state) enrichedLocation = `${rh.state}, ${rh.country}`;
                  break;
                }
              }
            }

            if (!enrichedCountry && docOriginCountry) {
              enrichedCountry = docOriginCountry;
            }

            if (!enrichedLocation && enrichedCountry) {
              enrichedLocation = enrichedCountry;
            }

            if (!enrichedProvider && profile?.primaryProvider) {
              enrichedProvider = profile.primaryProvider;
            }

            if (v.missing_fields) {
              v.missing_fields = v.missing_fields.filter((f: string) => {
                if (f === 'country_given' && enrichedCountry) return false;
                if (f === 'location' && enrichedLocation) return false;
                if (f === 'provider' && enrichedProvider) return false;
                if (f === 'dose_number' && enrichedDose) return false;
                return true;
              });
            }

            v.country_given = enrichedCountry || v.country_given;
            v.location = enrichedLocation || v.location;
            v.provider = enrichedProvider || v.provider;

            try {
              await db.insert(vaccinations).values({
                userId,
                vaccineName: v.vaccine_name,
                date: v.date,
                doseNumber: enrichedDose,
                location: enrichedLocation,
                countryGiven: enrichedCountry,
                provider: enrichedProvider,
                notes: v.notes || null,
                verified: true,
                documentId: String(id),
              });
              autoImported++;
            } catch (insertErr) {
              console.error("Failed to auto-import vaccination:", insertErr);
            }
          }

          if (autoImported > 0) {
            const importedNames = new Set(
              parsedVaccs
                .filter((v: any) => v.vaccine_name && v.date)
                .map((v: any) => v.vaccine_name)
            );
            for (const name of importedNames as Set<string>) {
              await recalculateDoseNumbers(userId, name);
            }
            clearComplianceCacheForUser(userId);
          }

          if (result.parsedData?.vaccinations) {
            const updateParsed = { ...result.parsedData };
            await db.update(documents).set({ parsedData: JSON.stringify(updateParsed) }).where(eq(documents.id, id));
          }
        }

        res.json({
          success: true,
          document: updated,
          parsedData: result.parsedData,
          autoImported,
          needsReview,
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
      const skipped = [];
      for (const v of vaccs) {
        if (!v.vaccine_name || !v.date) {
          skipped.push(v);
          continue;
        }
        const [record] = await db
          .insert(vaccinations)
          .values({
            userId,
            vaccineName: v.vaccine_name,
            date: v.date,
            doseNumber: v.dose_number || 1,
            location: v.location || null,
            countryGiven: v.country_given || null,
            provider: v.provider || null,
            notes: v.notes || null,
            verified: true,
            documentId: String(doc.id),
          })
          .returning();
        inserted.push(record);
      }

      const importedNames = new Set(inserted.map((r: any) => r.vaccineName));
      for (const name of importedNames) {
        await recalculateDoseNumbers(userId, name);
      }

      const updatedRecords = await db
        .select()
        .from(vaccinations)
        .where(and(eq(vaccinations.userId, userId), eq(vaccinations.documentId, String(doc.id))));

      res.json({ success: true, imported: inserted.length, skipped: skipped.length, skippedRecords: skipped, vaccinations: updatedRecords });
    } catch (error) {
      console.error("Error importing vaccinations:", error);
      res.status(500).json({ message: "Failed to import vaccinations" });
    }
  });

  app.post("/api/documents/:id/import-single-vaccination", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      const [doc] = await db
        .select()
        .from(documents)
        .where(and(eq(documents.id, id), eq(documents.userId, userId)));

      if (!doc) return res.status(404).json({ message: "Document not found" });

      const { vaccine_name, date, dose_number, provider, country_given, location, notes } = req.body;

      if (!vaccine_name || !date) {
        return res.status(400).json({ message: "Vaccine name and date are required" });
      }

      const [record] = await db
        .insert(vaccinations)
        .values({
          userId,
          vaccineName: vaccine_name,
          date,
          doseNumber: dose_number || 1,
          location: location || null,
          countryGiven: country_given || null,
          provider: provider || null,
          notes: notes || null,
          verified: true,
          documentId: String(id),
        })
        .returning();

      await recalculateDoseNumbers(userId, vaccine_name);
      clearComplianceCacheForUser(userId);
      const [updated] = await db.select().from(vaccinations).where(eq(vaccinations.id, record.id));
      res.json({ success: true, vaccination: updated || record });
    } catch (error) {
      console.error("Error importing single vaccination:", error);
      res.status(500).json({ message: "Failed to import vaccination" });
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

      const dnResidenceHistory = await db.select().from(countryHistory).where(eq(countryHistory.userId, userId));
      const result = await processDoctorNotesDocument(doc.filePath, doc.mimeType || "application/pdf", dnResidenceHistory);

      const detectedCountryDN = result.parsedData?.document_origin?.country || null;
      const dnUpdateData: Record<string, any> = {
        extractedText: result.extractedText,
        translatedText: result.translatedText,
        originalLanguage: result.originalLanguage,
        parsedData: JSON.stringify(result.parsedData),
        processingStatus: "completed",
      };
      if (detectedCountryDN) {
        dnUpdateData.country = detectedCountryDN;
      }
      await db.update(documents).set(dnUpdateData).where(eq(documents.id, id));

      let autoImportedVacc = 0;
      let autoImportedExempt = 0;

      const existingVaccs = await db
        .select()
        .from(vaccinations)
        .where(and(eq(vaccinations.userId, userId), eq(vaccinations.documentId, String(id))));

      let needsReviewVacc = 0;
      if (existingVaccs.length === 0) {
        const parsedVaccs = result.parsedData?.vaccinations || [];
        for (const v of parsedVaccs) {
          if (!v.vaccine_name || !v.date) {
            needsReviewVacc++;
            continue;
          }
          try {
            await db.insert(vaccinations).values({
              userId,
              vaccineName: v.vaccine_name,
              date: v.date,
              doseNumber: v.dose_number || null,
              location: v.location || null,
              countryGiven: v.country_given || null,
              provider: v.provider || null,
              notes: v.notes || null,
              verified: true,
              documentId: String(id),
            });
            autoImportedVacc++;
          } catch (insertErr) {
            console.error("Failed to auto-import vaccination:", insertErr);
          }
        }
      }

      let needsReviewExempt = 0;
      const existingExempts = await db
        .select()
        .from(medicalExemptions)
        .where(and(eq(medicalExemptions.userId, userId), eq(medicalExemptions.documentId, id)));

      if (existingExempts.length === 0) {
        const parsedExemptions = result.parsedData?.exemptions || [];
        for (const ex of parsedExemptions) {
          if (!ex.vaccine_name || !ex.reason) {
            needsReviewExempt++;
            continue;
          }
          try {
            await db.insert(medicalExemptions).values({
              userId,
              vaccineName: ex.vaccine_name,
              exemptionType: ex.exemption_type || "other",
              reason: ex.reason,
              doctorName: ex.doctor_name || null,
              doctorLicense: ex.doctor_license || null,
              documentDate: ex.document_date || null,
              documentId: id,
              notes: ex.notes || null,
              verified: true,
            });
            autoImportedExempt++;
          } catch (insertErr) {
            console.error("Failed to auto-import exemption:", insertErr);
          }
        }
      }

      if (autoImportedVacc > 0 || autoImportedExempt > 0) {
        clearComplianceCacheForUser(userId);
      }
      res.json({ success: true, parsedData: result.parsedData, autoImportedVacc, autoImportedExempt, needsReviewVacc, needsReviewExempt });
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
            verified: true,
          })
          .returning();
        inserted.push(record);
      }

      clearComplianceCacheForUser(userId);
      res.json({ success: true, imported: inserted.length, exemptions: inserted });
    } catch (error) {
      console.error("Error importing exemptions:", error);
      res.status(500).json({ message: "Failed to import exemptions" });
    }
  });

  app.get("/api/translate/languages", isAuthenticated, (req, res) => {
    res.json(getSupportedTargetLanguages());
  });

  app.post("/api/documents/:id/translate", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;
      const id = parseInt(req.params.id as string);
      const { targetLanguage } = req.body;

      if (!targetLanguage || typeof targetLanguage !== "string") {
        return res.status(400).json({ message: "Target language is required" });
      }

      const supportedLangs = getSupportedTargetLanguages();
      if (!supportedLangs[targetLanguage]) {
        return res.status(400).json({ message: "Unsupported target language" });
      }

      const [doc] = await db
        .select()
        .from(documents)
        .where(and(eq(documents.id, id), eq(documents.userId, userId)));

      if (!doc) return res.status(404).json({ message: "Document not found" });

      const sourceText = doc.translatedText || doc.extractedText;
      if (!sourceText || sourceText.trim().length === 0) {
        return res.status(400).json({ message: "No extracted text available for this document. Process the document first." });
      }

      const result = await translateToLanguage(sourceText, targetLanguage);

      res.json({
        translatedText: result.translatedText,
        targetLanguage: result.targetLanguage,
        targetLanguageName: supportedLangs[targetLanguage],
        sourceLanguage: doc.originalLanguage || "en",
      });
    } catch (error: any) {
      console.error("Error translating document:", error);
      if (error.message?.includes("DEEPL_API_KEY")) {
        return res.status(503).json({ message: "Translation service is not configured" });
      }
      res.status(500).json({ message: "Failed to translate document" });
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
      clearComplianceCacheForUser(userId);
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
      clearComplianceCacheForUser(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting exemption:", error);
      res.status(500).json({ message: "Failed to delete exemption" });
    }
  });

  function clearComplianceCacheForUser(userId: string) {
    for (const key of complianceCache.keys()) {
      if (key.startsWith(userId + ':')) {
        complianceCache.delete(key);
      }
    }
  }

  app.get("/api/compliance/summary", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as AuthRequest).userId;

      const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
      if (!profile) {
        return res.json({ hasTarget: false });
      }

      const targetName = profile.targetInstitution || profile.targetEmployment || profile.targetCountry;
      if (!targetName || !targetName.trim()) {
        return res.json({ hasTarget: false });
      }

      let lookupType: ComplianceLookupType = "institution";
      let targetLabel = "Institution";
      if (profile.targetInstitution && profile.targetInstitution.trim()) {
        lookupType = "institution";
        targetLabel = profile.targetInstitution.trim();
      } else if (profile.targetEmployment && profile.targetEmployment.trim()) {
        lookupType = "employer";
        targetLabel = profile.targetEmployment.trim();
      } else if (profile.targetCountry && profile.targetCountry.trim()) {
        lookupType = "country";
        targetLabel = profile.targetCountry.trim();
      }

      const cacheKey = `${userId}:${lookupType}:${targetLabel.toLowerCase()}`;
      const cached = complianceCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < COMPLIANCE_CACHE_TTL) {
        return res.json(cached.data);
      }

      let requirements;
      try {
        switch (lookupType) {
          case "employer":
            requirements = await lookupEmployerRequirements(targetLabel);
            break;
          case "country":
            requirements = await lookupCountryRequirements(targetLabel);
            break;
          case "institution":
          default:
            requirements = await lookupInstitutionRequirements(targetLabel);
            break;
        }
      } catch (aiError: any) {
        console.error("Compliance summary AI lookup failed:", aiError.message);
        return res.json({ hasTarget: true, targetLabel, lookupType, aiUnavailable: true });
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

      const missing = compliance
        .filter(c => c.status !== "complete")
        .map(c => ({
          name: c.vaccine_name,
          needed: c.required_doses - c.completed_doses,
          status: c.status,
        }));

      const result = {
        hasTarget: true,
        targetLabel,
        lookupType,
        percentage: overallPercentage,
        totalCompleted,
        totalRequired,
        missing,
        requirements: compliance,
      };

      complianceCache.set(cacheKey, { data: result, timestamp: Date.now() });
      res.json(result);
    } catch (error) {
      console.error("Error fetching compliance summary:", error);
      res.status(500).json({ message: "Failed to fetch compliance summary" });
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
