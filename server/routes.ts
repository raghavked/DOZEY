import type { Express } from "express";
import { isAuthenticated } from "./replit_integrations/auth";
import { db } from "./db";
import { profiles, vaccinations, documents, countryHistory } from "../shared/schema";
import { eq, and } from "drizzle-orm";

export function registerRoutes(app: Express) {
  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
      res.json(profile || null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get("/api/vaccinations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const records = await db.select().from(vaccinations).where(eq(vaccinations.userId, userId));
      res.json(records);
    } catch (error) {
      console.error("Error fetching vaccinations:", error);
      res.status(500).json({ message: "Failed to fetch vaccinations" });
    }
  });

  app.post("/api/vaccinations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [record] = await db.insert(vaccinations).values({ ...req.body, userId }).returning();
      res.json(record);
    } catch (error) {
      console.error("Error creating vaccination:", error);
      res.status(500).json({ message: "Failed to create vaccination" });
    }
  });

  app.delete("/api/vaccinations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      await db.delete(vaccinations).where(and(eq(vaccinations.id, id), eq(vaccinations.userId, userId)));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting vaccination:", error);
      res.status(500).json({ message: "Failed to delete vaccination" });
    }
  });

  app.get("/api/documents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const docs = await db.select().from(documents).where(eq(documents.userId, userId));
      res.json(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [doc] = await db.insert(documents).values({ ...req.body, userId }).returning();
      res.json(doc);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  app.delete("/api/documents/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      await db.delete(documents).where(and(eq(documents.id, id), eq(documents.userId, userId)));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  app.get("/api/country-history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const periods = await db.select().from(countryHistory).where(eq(countryHistory.userId, userId));
      res.json(periods);
    } catch (error) {
      console.error("Error fetching country history:", error);
      res.status(500).json({ message: "Failed to fetch country history" });
    }
  });

  app.post("/api/country-history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [period] = await db.insert(countryHistory).values({ ...req.body, userId }).returning();
      res.json(period);
    } catch (error) {
      console.error("Error creating country period:", error);
      res.status(500).json({ message: "Failed to create country period" });
    }
  });

  app.delete("/api/country-history/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      await db.delete(countryHistory).where(and(eq(countryHistory.id, id), eq(countryHistory.userId, userId)));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting country period:", error);
      res.status(500).json({ message: "Failed to delete country period" });
    }
  });
}
