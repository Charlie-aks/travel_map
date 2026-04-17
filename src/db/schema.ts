import { pgTable, text, timestamp, boolean, integer, jsonb, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// --- NEXT-AUTH SPECIFIC TABLES ---

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password"),
  image: text("image"),
  role: text("role").default("USER"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const accounts = pgTable("account", {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccountType>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}));

// --- APPLICATION SPECIFIC TABLES ---

export const locations = pgTable("location", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  coordinates: jsonb("coordinates").notNull(), // Expected format: [lat, lng] lưu tọa độ địa điểm
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  category: text("category").notNull(),
  authorId: text("authorId").references(() => users.id), //
  status: text("status").default("PENDING"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const reviews = pgTable("review", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  locationId: text("locationId").notNull().references(() => locations.id, { onDelete: "cascade" }),
  authorId: text("authorId").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  content: text("content"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const savedLocations = pgTable("saved_location", {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  locationId: text("locationId").notNull().references(() => locations.id, { onDelete: "cascade" }),
  savedAt: timestamp("savedAt").defaultNow(),
}, (t) => ({
  compoundKey: primaryKey({ columns: [t.userId, t.locationId] }),
}));

import { relations } from "drizzle-orm";

export const usersRelations = relations(users, ({ many }) => ({
  locations: many(locations),
  reviews: many(reviews),
  savedLocations: many(savedLocations),
}));

export const locationsRelations = relations(locations, ({ one, many }) => ({
  author: one(users, {
    fields: [locations.authorId],
    references: [users.id],
  }),
  reviews: many(reviews),
  savedBy: many(savedLocations),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  location: one(locations, {
    fields: [reviews.locationId],
    references: [locations.id],
  }),
  author: one(users, {
    fields: [reviews.authorId],
    references: [users.id],
  }),
}));

export const savedLocationsRelations = relations(savedLocations, ({ one }) => ({
  user: one(users, {
    fields: [savedLocations.userId],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [savedLocations.locationId],
    references: [locations.id],
  }),
}));
