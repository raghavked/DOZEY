import { pgTable, varchar, integer, text, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  fullName: varchar("full_name").notNull(),
  dateOfBirth: varchar("date_of_birth"),
  currentCountry: varchar("current_country"),
  currentState: varchar("current_state"),
  countryOfOrigin: varchar("country_of_origin"),
  citizenships: text("citizenships"),
  languages: text("languages"),
  primaryProvider: varchar("primary_provider"),
  targetCountry: varchar("target_country"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vaccinations = pgTable("vaccinations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  vaccineName: varchar("vaccine_name").notNull(),
  date: varchar("date").notNull(),
  doseNumber: integer("dose_number").notNull(),
  location: varchar("location"),
  countryGiven: varchar("country_given"),
  provider: varchar("provider"),
  notes: text("notes"),
  verified: boolean("verified").default(false),
  documentId: varchar("document_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  country: varchar("country"),
  fileName: varchar("file_name"),
  filePath: varchar("file_path"),
  mimeType: varchar("mime_type"),
  fileSize: integer("file_size"),
  uploadDate: timestamp("upload_date").defaultNow(),
});

export const countryHistory = pgTable("country_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  country: varchar("country").notNull(),
  state: varchar("state"),
  startYear: integer("start_year").notNull(),
  endYear: varchar("end_year").notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type Vaccination = typeof vaccinations.$inferSelect;
export type InsertVaccination = typeof vaccinations.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;
export type CountryPeriod = typeof countryHistory.$inferSelect;
export type InsertCountryPeriod = typeof countryHistory.$inferInsert;
