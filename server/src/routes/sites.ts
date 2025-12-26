import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '../db'
import { sites, siteEndpoints, siteProjectSelections, projects } from '../db/schema'
import { eq, and, inArray } from 'drizzle-orm'

const siteSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
})

const endpointSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(['page', 'collection']).default('page'),
  content: z.record(z.unknown()).optional(),
  projectIds: z.array(z.number()).optional(),
})

export const siteRoutes = new Hono()

// Sites CRUD
siteRoutes.get('/', async (c) => {
  const allSites = await db.select().from(sites).orderBy(sites.createdAt)
  return c.json(allSites)
})

siteRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const site = await db.select().from(sites).where(eq(sites.id, id)).limit(1)
  if (!site.length) {
    return c.json({ error: 'Site not found' }, 404)
  }
  
  const endpoints = await db.select().from(siteEndpoints).where(eq(siteEndpoints.siteId, id))
  
  return c.json({ ...site[0], endpoints })
})

siteRoutes.post('/', zValidator('json', siteSchema), async (c) => {
  const data = c.req.valid('json')
  const result = await db.insert(sites).values(data).returning()
  return c.json(result[0], 201)
})

siteRoutes.put('/:id', zValidator('json', siteSchema.partial()), async (c) => {
  const id = Number(c.req.param('id'))
  const data = c.req.valid('json')
  const result = await db.update(sites).set(data).where(eq(sites.id, id)).returning()
  if (!result.length) {
    return c.json({ error: 'Site not found' }, 404)
  }
  return c.json(result[0])
})

siteRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const result = await db.delete(sites).where(eq(sites.id, id)).returning()
  if (!result.length) {
    return c.json({ error: 'Site not found' }, 404)
  }
  return c.json({ success: true })
})

// Endpoints CRUD
siteRoutes.get('/:siteId/endpoints', async (c) => {
  const siteId = Number(c.req.param('siteId'))
  const endpoints = await db.select().from(siteEndpoints).where(eq(siteEndpoints.siteId, siteId))
  return c.json(endpoints)
})

siteRoutes.get('/:siteId/endpoints/:endpointId', async (c) => {
  const siteId = Number(c.req.param('siteId'))
  const endpointId = Number(c.req.param('endpointId'))
  
  const endpoint = await db
    .select()
    .from(siteEndpoints)
    .where(and(eq(siteEndpoints.id, endpointId), eq(siteEndpoints.siteId, siteId)))
    .limit(1)
  
  if (!endpoint.length) {
    return c.json({ error: 'Endpoint not found' }, 404)
  }
  
  const selections = await db
    .select()
    .from(siteProjectSelections)
    .where(eq(siteProjectSelections.endpointId, endpointId))
    .orderBy(siteProjectSelections.order)
  
  const projectIds = selections.map(s => s.projectId)
  let selectedProjects: typeof projects.$inferSelect[] = []
  
  if (projectIds.length > 0) {
    selectedProjects = await db
      .select()
      .from(projects)
      .where(inArray(projects.id, projectIds))
  }
  
  return c.json({ ...endpoint[0], projectIds, selectedProjects })
})

siteRoutes.post('/:siteId/endpoints', zValidator('json', endpointSchema), async (c) => {
  const siteId = Number(c.req.param('siteId'))
  const { projectIds, ...data } = c.req.valid('json')
  
  const result = await db
    .insert(siteEndpoints)
    .values({ ...data, siteId })
    .returning()
  
  const endpoint = result[0]
  
  if (projectIds && projectIds.length > 0) {
    await db.insert(siteProjectSelections).values(
      projectIds.map((projectId, index) => ({
        endpointId: endpoint.id,
        projectId,
        order: index,
      }))
    )
  }
  
  return c.json(endpoint, 201)
})

siteRoutes.put('/:siteId/endpoints/:endpointId', zValidator('json', endpointSchema.partial()), async (c) => {
  const siteId = Number(c.req.param('siteId'))
  const endpointId = Number(c.req.param('endpointId'))
  const { projectIds, ...data } = c.req.valid('json')
  
  const result = await db
    .update(siteEndpoints)
    .set(data)
    .where(and(eq(siteEndpoints.id, endpointId), eq(siteEndpoints.siteId, siteId)))
    .returning()
  
  if (!result.length) {
    return c.json({ error: 'Endpoint not found' }, 404)
  }
  
  if (projectIds !== undefined) {
    await db.delete(siteProjectSelections).where(eq(siteProjectSelections.endpointId, endpointId))
    
    if (projectIds.length > 0) {
      await db.insert(siteProjectSelections).values(
        projectIds.map((projectId, index) => ({
          endpointId,
          projectId,
          order: index,
        }))
      )
    }
  }
  
  return c.json(result[0])
})

siteRoutes.delete('/:siteId/endpoints/:endpointId', async (c) => {
  const siteId = Number(c.req.param('siteId'))
  const endpointId = Number(c.req.param('endpointId'))
  
  const result = await db
    .delete(siteEndpoints)
    .where(and(eq(siteEndpoints.id, endpointId), eq(siteEndpoints.siteId, siteId)))
    .returning()
  
  if (!result.length) {
    return c.json({ error: 'Endpoint not found' }, 404)
  }
  
  return c.json({ success: true })
})
