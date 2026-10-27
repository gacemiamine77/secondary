import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameFr: text("name_fr").notNull(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  titleFr: text("title_fr").notNull(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  type: text("type").notNull(), // course | exercise | homework | devoir | exam | video
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id),
  level: integer("level").notNull(), // 1 | 2 | 3
  trimester: integer("trimester").notNull(), // 1 | 2 | 3
  year: integer("year").notNull(),
  fileUrl: text("file_url"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  durationMin: integer("duration_min"),
  pages: integer("pages").notNull().default(4),
  sizeMb: text("size_mb").notNull().default("1.2 MB"),
  views: integer("views").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  teacherName: text("teacher_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Subject = typeof subjects.$inferSelect;
export type Resource = typeof resources.$inferSelect;
