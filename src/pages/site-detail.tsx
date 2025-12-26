import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EndpointPreview } from '@/components/endpoint-preview'
import { EndpointDialog } from '@/components/dialogs/endpoint-dialog'
import { SiteSettingsDialog } from '@/components/dialogs/site-settings-dialog'
import { Plus, Pencil, Trash2, FileJson, FolderKanban, ArrowLeft, Settings } from 'lucide-react'
import { api, type Site, type SiteEndpoint, type Project } from '@/lib/api'

import { Skeleton } from '@/components/ui/skeleton'

interface SiteDetailPageProps {
  siteId: number
  projects: Project[]
  onBack: () => void
  onRefreshSites: () => void
}

export function SiteDetailPage({ siteId, projects, onBack, onRefreshSites }: SiteDetailPageProps) {
  const [site, setSite] = useState<Site | null>(null)
  const [endpoints, setEndpoints] = useState<SiteEndpoint[]>([])
  const [isEndpointDialogOpen, setIsEndpointDialogOpen] = useState(false)
  const [isSiteDialogOpen, setIsSiteDialogOpen] = useState(false)
  const [editingEndpoint, setEditingEndpoint] = useState<SiteEndpoint | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    loadSite()
  }, [siteId])

  const loadSite = async () => {
    try {
      const data = await api.sites.get(siteId)
      setSite(data)
      setEndpoints(data.endpoints || [])
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleCreateEndpoint = () => {
    setEditingEndpoint(null)
    setIsEndpointDialogOpen(true)
  }

  const handleEditEndpoint = async (endpoint: SiteEndpoint) => {
    const fullEndpoint = await api.endpoints.get(siteId, endpoint.id)
    setEditingEndpoint(fullEndpoint)
    setIsEndpointDialogOpen(true)
  }

  const handleDeleteEndpoint = async (endpointId: number) => {
    if (!confirm('Are you sure?')) return
    await api.endpoints.delete(siteId, endpointId)
    loadSite()
  }

  const handleSubmitEndpoint = async (data: any) => {
    if (editingEndpoint) {
      await api.endpoints.update(siteId, editingEndpoint.id, data)
    } else {
      await api.endpoints.create(siteId, data)
    }
    setIsEndpointDialogOpen(false)
    loadSite()
  }

  const handleUpdateSite = async (data: { name: string; slug: string; description: string }) => {
    await api.sites.update(siteId, data)
    setIsSiteDialogOpen(false)
    onRefreshSites()
    loadSite()
  }

  const handleDeleteSite = async () => {
    await api.sites.delete(siteId)
    setIsSiteDialogOpen(false)
    onRefreshSites()
    onBack()
  }

  if (isInitialLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border shadow-sm">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-52" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Skeleton className="h-32 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!site) return null

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{site.name}</h1>
          <p className="text-muted-foreground">
            <code className="text-sm">/api/v1/{site.slug}/...</code>
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsSiteDialogOpen(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button onClick={handleCreateEndpoint}>
          <Plus className="h-4 w-4 mr-2" />
          Add Endpoint
        </Button>
      </div>

      <div className="grid gap-4">
        {endpoints.map((endpoint) => (
          <Card key={endpoint.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {endpoint.type === 'page' ? (
                    <FileJson className="h-5 w-5 text-blue-500" />
                  ) : (
                    <FolderKanban className="h-5 w-5 text-green-500" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mr-2">
                        {endpoint.type}
                      </Badge>
                      <code className="text-xs">GET /api/v1/{site.slug}/{endpoint.slug}</code>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditEndpoint(endpoint)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteEndpoint(endpoint.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <EndpointPreview
                path={`/api/v1/${site.slug}/${endpoint.slug}`}
                sampleResponse={
                  endpoint.type === 'page'
                    ? { name: endpoint.name, slug: endpoint.slug, content: { '...': '...' } }
                    : { name: endpoint.name, slug: endpoint.slug, data: ['...'] }
                }
              />
            </CardContent>
          </Card>
        ))}

        {endpoints.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No endpoints yet. Create your first endpoint!</p>
              <Button onClick={handleCreateEndpoint}>
                <Plus className="h-4 w-4 mr-2" />
                Add Endpoint
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <EndpointDialog
        open={isEndpointDialogOpen}
        onOpenChange={setIsEndpointDialogOpen}
        endpoint={editingEndpoint}
        projects={projects}
        onSubmit={handleSubmitEndpoint}
      />

      <SiteSettingsDialog
        open={isSiteDialogOpen}
        onOpenChange={setIsSiteDialogOpen}
        site={site}
        onSubmit={handleUpdateSite}
        onDelete={handleDeleteSite}
      />
    </div>
  )
}
