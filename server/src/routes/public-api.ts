import { Hono } from 'hono'
import { db } from '../db'
import { sites, siteEndpoints, siteProjectSelections, projects } from '../db/schema'
import { eq, and, inArray } from 'drizzle-orm'

export const publicApiRoutes = new Hono()

publicApiRoutes.get('/:siteSlug/:endpointSlug', async (c) => {
  const siteSlug = c.req.param('siteSlug')
  const endpointSlug = c.req.param('endpointSlug')
  
  const site = await db.select().from(sites).where(eq(sites.slug, siteSlug)).limit(1)
  if (!site.length) {
    return c.json({ error: 'Site not found' }, 404)
  }
  
  const endpoint = await db
    .select()
    .from(siteEndpoints)
    .where(and(eq(siteEndpoints.siteId, site[0].id), eq(siteEndpoints.slug, endpointSlug)))
    .limit(1)
  
  if (!endpoint.length) {
    return c.json({ error: 'Endpoint not found' }, 404)
  }
  
  const ep = endpoint[0]
  
  if (ep.type === 'page') {
    return c.json({
      name: ep.name,
      slug: ep.slug,
      content: ep.content,
    })
  }
  
  if (ep.type === 'collection') {
    const selections = await db
      .select()
      .from(siteProjectSelections)
      .where(eq(siteProjectSelections.endpointId, ep.id))
      .orderBy(siteProjectSelections.order)
    
    const projectIds = selections.map(s => s.projectId)
    
    if (projectIds.length === 0) {
      return c.json({
        name: ep.name,
        slug: ep.slug,
        data: [],
      })
    }
    
    const projectData = await db
      .select()
      .from(projects)
      .where(inArray(projects.id, projectIds))
    
    const orderedProjects = projectIds.map(id => projectData.find(p => p.id === id)).filter(Boolean)
    
    return c.json({
      name: ep.name,
      slug: ep.slug,
      data: orderedProjects,
    })
  }
  
  return c.json({ error: 'Unknown endpoint type' }, 400)
})

publicApiRoutes.get('/projects', async (c) => {
  const allProjects = await db.select().from(projects).orderBy(projects.createdAt)
  return c.json({ data: allProjects })
})

publicApiRoutes.get('/projects/:slug', async (c) => {
  const slug = c.req.param('slug')
  const project = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1)
  if (!project.length) {
    return c.json({ error: 'Project not found' }, 404)
  }
  return c.json(project[0])
})
