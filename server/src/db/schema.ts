import { pgTable, text, integer, timestamp, json, serial, varchar } from 'drizzle-orm/pg-core'

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  year: integer('year'),
  client: varchar('client', { length: 255 }),
  role: varchar('role', { length: 255 }),
  techStack: json('tech_stack').$type<string[]>().default([]),
  shortDesc: text('short_desc'),
  detailDesc: text('detail_desc'),
  urlLive: varchar('url_live', { length: 500 }),
  urlGithub: varchar('url_github', { length: 500 }),
  urlFigma: varchar('url_figma', { length: 500 }),
  thumbnail: varchar('thumbnail', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const sites = pgTable('sites', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const siteEndpoints = pgTable('site_endpoints', {
  id: serial('id').primaryKey(),
  siteId: integer('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull().default('page'),
  content: json('content').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const siteProjectSelections = pgTable('site_project_selections', {
  id: serial('id').primaryKey(),
  endpointId: integer('endpoint_id').notNull().references(() => siteEndpoints.id, { onDelete: 'cascade' }),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  order: integer('order').default(0),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Site = typeof sites.$inferSelect
export type NewSite = typeof sites.$inferInsert
export type SiteEndpoint = typeof siteEndpoints.$inferSelect
export type NewSiteEndpoint = typeof siteEndpoints.$inferInsert
export type SiteProjectSelection = typeof siteProjectSelections.$inferSelect
