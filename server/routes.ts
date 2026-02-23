import type { Express } from "express";
import path from "path";
import multer from "multer";
import { isAuthenticated, type AuthRequest } from "./auth";
import { db } from "./db";
import { users, profiles, vaccinations, documents, countryHistory } from "../shared/schema";
import { eq, and } from "drizzle-orm";
import { processDocument } from "./ai-pipeline";

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

        res.json({
          success: true,
          document: updated,
          parsedData: result.parsedData,
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

      const parsed = JSON.parse(doc.parsedData);
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

  app.post("/api/chat", isAuthenticated, async (req, res) => {
    try {
      const { message, history } = req.body;
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

      const systemPrompt = `You are Doze, a friendly health records assistant for the DOZEY app. DOZEY helps immigrants, international students, and global workers manage vaccination records and medical documents across borders.

You help users with:
- Understanding vaccination requirements for different countries
- Navigating the DOZEY app features (profile, document upload, vaccination timeline, country history, sharing records, alerts)
- General questions about immunization schedules
- Explaining how to upload and manage health documents

Keep responses concise, warm, and helpful. Use simple language. If unsure about specific medical advice, recommend consulting a healthcare provider.`;

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
        max_tokens: 500,
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
