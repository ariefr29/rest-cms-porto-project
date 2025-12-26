import { Hono } from 'hono'
import { db } from '../db'
import { sites, siteEndpoints, siteProjectSelections, projects } from '../db/schema'
import { eq, and, inArray } from 'drizzle-orm'

export const publicApiRoutes = new Hono()

// Helper function to resolve project fields in content
async function resolveProjectFields(content: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (!content || typeof content !== 'object') return content

  const resolved: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(content)) {
    if (value && typeof value === 'object') {
      // Check if this is a projects field type
      if ('_type' in value && (value as { _type: string })._type === 'projects') {
        const projectIds = ((value as unknown) as { projectIds: number[] }).projectIds || []
        if (projectIds.length > 0) {
          const projectData = await db
            .select()
            .from(projects)
            .where(inArray(projects.id, projectIds))

          // Maintain order based on projectIds
          resolved[key] = projectIds
            .map(id => projectData.find(p => p.id === id))
            .filter(Boolean)
        } else {
          resolved[key] = []
        }
      } else if (Array.isArray(value)) {
        // Recursively resolve arrays
        resolved[key] = await Promise.all(
          value.map(async (item) => {
            if (item && typeof item === 'object') {
              return resolveProjectFields(item as Record<string, unknown>)
            }
            return item
          })
        )
      } else {
        // Recursively resolve nested objects
        resolved[key] = await resolveProjectFields(value as Record<string, unknown>)
      }
    } else {
      resolved[key] = value
    }
  }

  return resolved
}

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
    // Resolve any project fields in the content
    const resolvedContent = await resolveProjectFields(ep.content as Record<string, unknown>)

    return c.json({
      name: ep.name,
      slug: ep.slug,
      content: resolvedContent,
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
