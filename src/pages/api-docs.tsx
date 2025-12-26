import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { EndpointPreview } from '@/components/endpoint-preview'
import { Skeleton } from '@/components/ui/skeleton'
import type { Site, Project } from '@/lib/api'

interface ApiDocsPageProps {
  sites: Site[]
  projects: Project[]
  isLoading?: boolean
}

export function ApiDocsPage({ sites, projects, isLoading }: ApiDocsPageProps) {
  const sampleProject = projects[0] || {
    id: 1,
    title: 'Sample Project',
    slug: 'sample-project',
    year: 2024,
    techStack: ['React', 'TypeScript'],
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold">API Documentation</h1>
        <p className="text-muted-foreground">REST API endpoints reference</p>
      </div>

      <Tabs defaultValue="public">
        <TabsList>
          <TabsTrigger value="public">Public API</TabsTrigger>
          <TabsTrigger value="cms">CMS API</TabsTrigger>
        </TabsList>

        <TabsContent value="public" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Public Endpoints</CardTitle>
              <CardDescription>These endpoints are for consuming in your frontend applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EndpointPreview
                path="/api/v1/projects"
                description="Get all base projects"
                sampleResponse={{
                  data: [
                    {
                      id: sampleProject.id,
                      title: sampleProject.title,
                      slug: sampleProject.slug,
                      year: sampleProject.year,
                      client: 'Client Name',
                      role: 'Full Stack Developer',
                      techStack: sampleProject.techStack,
                      shortDesc: 'Short description...',
                      detailDesc: '<p>HTML content...</p>',
                      urlLive: 'https://example.com',
                      urlGithub: 'https://github.com/...',
                      urlFigma: 'https://figma.com/...',
                      thumbnail: 'https://...',
                    },
                  ],
                }}
              />

              <EndpointPreview
                path="/api/v1/projects/:slug"
                description="Get single project by slug"
                sampleResponse={{
                  id: sampleProject.id,
                  title: sampleProject.title,
                  slug: sampleProject.slug,
                  '...': '...',
                }}
              />

              {sites.map((site) => (
                <div key={site.id} className="pt-4 border-t">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    Site: {site.name}
                    <Badge variant="outline">{site.slug}</Badge>
                  </h4>
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : (
                    (site.endpoints || []).map((endpoint) => (
                      <EndpointPreview
                        key={endpoint.id}
                        path={`/api/v1/${site.slug}/${endpoint.slug}`}
                        description={`${endpoint.type === 'page' ? 'Page content' : 'Project collection'}: ${endpoint.name}`}
                        sampleResponse={
                          endpoint.type === 'page'
                            ? { name: endpoint.name, slug: endpoint.slug, content: { '...': '...' } }
                            : { name: endpoint.name, slug: endpoint.slug, data: [{ id: 1, title: '...', '...': '...' }] }
                        }
                      />
                    )))}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cms" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>CMS Endpoints</CardTitle>
              <CardDescription>Internal endpoints for dashboard management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Projects</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">GET</Badge>
                      <code>/api/projects</code>
                      <span className="text-muted-foreground">- List all</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">GET</Badge>
                      <code>/api/projects/:id</code>
                      <span className="text-muted-foreground">- Get by ID</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500">POST</Badge>
                      <code>/api/projects</code>
                      <span className="text-muted-foreground">- Create</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500">PUT</Badge>
                      <code>/api/projects/:id</code>
                      <span className="text-muted-foreground">- Update</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500">DELETE</Badge>
                      <code>/api/projects/:id</code>
                      <span className="text-muted-foreground">- Delete</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Sites</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">GET</Badge>
                      <code>/api/sites</code>
                      <span className="text-muted-foreground">- List all</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">GET</Badge>
                      <code>/api/sites/:id</code>
                      <span className="text-muted-foreground">- Get by ID (includes endpoints)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500">POST</Badge>
                      <code>/api/sites</code>
                      <span className="text-muted-foreground">- Create</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500">PUT</Badge>
                      <code>/api/sites/:id</code>
                      <span className="text-muted-foreground">- Update</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500">DELETE</Badge>
                      <code>/api/sites/:id</code>
                      <span className="text-muted-foreground">- Delete</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Site Endpoints</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">GET</Badge>
                      <code>/api/sites/:siteId/endpoints</code>
                      <span className="text-muted-foreground">- List all</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">GET</Badge>
                      <code>/api/sites/:siteId/endpoints/:id</code>
                      <span className="text-muted-foreground">- Get by ID</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500">POST</Badge>
                      <code>/api/sites/:siteId/endpoints</code>
                      <span className="text-muted-foreground">- Create</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500">PUT</Badge>
                      <code>/api/sites/:siteId/endpoints/:id</code>
                      <span className="text-muted-foreground">- Update</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500">DELETE</Badge>
                      <code>/api/sites/:siteId/endpoints/:id</code>
                      <span className="text-muted-foreground">- Delete</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
