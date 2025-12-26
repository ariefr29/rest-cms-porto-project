import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '../db'
import { projects } from '../db/schema'
import { eq } from 'drizzle-orm'

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  year: z.number().optional(),
  client: z.string().optional(),
  role: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  shortDesc: z.string().optional(),
  detailDesc: z.string().optional(),
  urlLive: z.string().optional(),
  urlGithub: z.string().optional(),
  urlFigma: z.string().optional(),
  thumbnail: z.string().optional(),
})

export const projectRoutes = new Hono()

projectRoutes.get('/', async (c) => {
  const allProjects = await db.select().from(projects).orderBy(projects.createdAt)
  return c.json(allProjects)
})

projectRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const project = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
  if (!project.length) {
    return c.json({ error: 'Project not found' }, 404)
  }
  return c.json(project[0])
})

projectRoutes.post('/', zValidator('json', projectSchema), async (c) => {
  const data = c.req.valid('json')
  const result = await db.insert(projects).values(data).returning()
  return c.json(result[0], 201)
})

projectRoutes.put('/:id', zValidator('json', projectSchema.partial()), async (c) => {
  const id = Number(c.req.param('id'))
  const data = c.req.valid('json')
  const result = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning()
  if (!result.length) {
    return c.json({ error: 'Project not found' }, 404)
  }
  return c.json(result[0])
})

projectRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const result = await db.delete(projects).where(eq(projects.id, id)).returning()
  if (!result.length) {
    return c.json({ error: 'Project not found' }, 404)
  }
  return c.json({ success: true })
})
