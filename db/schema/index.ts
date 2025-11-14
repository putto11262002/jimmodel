import { Category } from "@/lib/data/categories";
import { Country } from "@/lib/data/countries";
import { EyeColor } from "@/lib/data/eye-colors";
import { Gender } from "@/lib/data/genders";
import { HairColor } from "@/lib/data/hair-colors";
import { ImageType } from "@/lib/data/image-types";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Models Table
export const models = pgTable(
  "models",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    nickName: varchar("nick_name", { length: 100 }),
    gender: varchar("gender", { length: 20 }).notNull().$type<Gender>(),
    dateOfBirth: date("date_of_birth", { mode: "date" }),
    nationality: varchar("nationality", { length: 100 }).$type<Country>(),
    ethnicity: varchar("ethnicity", { length: 100 }),
    talents: text("talents").array(),
    bio: text("bio"),
    experiences: text("experiences").array(),

    local: boolean("local").notNull().default(false),
    inTown: boolean("in_town").notNull().default(false),
    published: boolean("published").notNull().default(false),
    category: varchar("category", { length: 20 }).notNull().$type<Category>(),
    // Note: category should be computed based on age and gender
    // if age < 18 then "kids"
    // else if age >= 60 then "seniors"
    // else gender

    height: numeric("height", { precision: 5, scale: 2, mode: "number" }), // in cm
    weight: numeric("weight", { precision: 5, scale: 2, mode: "number" }), // in kg
    hips: numeric("hips", { precision: 5, scale: 2, mode: "number" }), // in cm
    hairColor: text("hair_color").$type<HairColor>(),
    eyeColor: text("eye_color").$type<EyeColor>(),

    profileImageURL: text("profile_image_url"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // Indexes for frequently queried columns
    categoryIdx: index("models_category_idx").on(table.category),
    publishedIdx: index("models_published_idx").on(table.published),
    localIdx: index("models_local_idx").on(table.local),
    inTownIdx: index("models_in_town_idx").on(table.inTown),
  }),
);

// Model Images Table
export const modelImages = pgTable(
  "model_images",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    modelId: uuid("model_id")
      .notNull()
      .references(() => models.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    type: text("type").$type<ImageType>(),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    // Indexes
    modelIdx: index("model_images_model_idx").on(table.modelId),
    typeIdx: index("model_images_type_idx").on(table.type),
    orderIdx: index("model_images_order_idx").on(table.order),
  }),
);

export const modelRelationships = relations(models, ({ many }) => ({
  images: many(modelImages),
}));

export const modelImageRelationships = relations(modelImages, ({ one }) => ({
  model: one(models, {
    fields: [modelImages.modelId],
    references: [models.id],
  }),
}));

// Model Views Table (raw view events)
export const modelViews = pgTable(
  "model_views",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    modelId: uuid("model_id")
      .notNull()
      .references(() => models.id, { onDelete: "cascade" }),
    viewerIdentifier: varchar("viewer_identifier", { length: 255 }).notNull(),
    viewedAt: timestamp("viewed_at").notNull().defaultNow(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
  },
  (table) => ({
    // Indexes for analytics queries
    modelIdx: index("model_views_model_idx").on(table.modelId),
    viewedAtIdx: index("model_views_viewed_at_idx").on(table.viewedAt),
    viewerIdx: index("model_views_viewer_idx").on(table.viewerIdentifier),
    // Composite index for efficient GROUP BY queries
    modelViewerIdx: index("model_views_model_viewer_idx").on(
      table.modelId,
      table.viewerIdentifier,
    ),
  }),
);

// Export types
export type Model = typeof models.$inferSelect;
export type NewModel = typeof models.$inferInsert;
export type ModelImage = typeof modelImages.$inferSelect;
export type NewModelImage = typeof modelImages.$inferInsert;
export type ModelView = typeof modelViews.$inferSelect;
export type NewModelView = typeof modelViews.$inferInsert;
