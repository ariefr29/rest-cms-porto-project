import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EndpointPreview } from '@/components/endpoint-preview'
import { FieldBuilder } from '@/components/field-builder'
import { ProjectSelector } from '@/components/project-selector'
import { Plus, Pencil, Trash2, FileJson, FolderKanban, ArrowLeft, Settings } from 'lucide-react'
import { api, type Site, type SiteEndpoint, type Project } from '@/lib/api'
import { type FieldDefinition, fieldsToContent, contentToFields } from '@/lib/field-types'

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
  const [endpointForm, setEndpointForm] = useState({
    name: '',
    slug: '',
    type: 'page' as 'page' | 'collection',
    content: {} as Record<string, unknown>,
    projectIds: [] as number[],
  })
  const [siteForm, setSiteForm] = useState({ name: '', slug: '', description: '' })
  const [contentFields, setContentFields] = useState<FieldDefinition[]>([])

  useEffect(() => {
    loadSite()
  }, [siteId])

  const loadSite = async () => {
    // Artificial small delay for UX demonstration if needed, but not necessary here
    const data = await api.sites.get(siteId)
    setSite(data)
    setEndpoints(data.endpoints || [])
    setSiteForm({ name: data.name, slug: data.slug, description: data.description || '' })
  }

  const handleCreateEndpoint = () => {
    setEditingEndpoint(null)
    setEndpointForm({ name: '', slug: '', type: 'page', content: {}, projectIds: [] })
    setContentFields([])
    setIsEndpointDialogOpen(true)
  }

  const handleEditEndpoint = async (endpoint: SiteEndpoint) => {
    const fullEndpoint = await api.endpoints.get(siteId, endpoint.id)
    setEditingEndpoint(fullEndpoint)
    setEndpointForm({
      name: fullEndpoint.name,
      slug: fullEndpoint.slug,
      type: fullEndpoint.type,
      content: fullEndpoint.content || {},
      projectIds: fullEndpoint.projectIds || [],
    })
    // Convert existing content to fields for editing
    const existingContent = fullEndpoint.content || {}
    setContentFields(contentToFields(existingContent as Record<string, unknown>))
    setIsEndpointDialogOpen(true)
  }

  const handleDeleteEndpoint = async (endpointId: number) => {
    if (!confirm('Are you sure?')) return
    await api.endpoints.delete(siteId, endpointId)
    loadSite()
  }

  const handleSubmitEndpoint = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Convert fields to content
      const content = endpointForm.type === 'page'
        ? fieldsToContent(contentFields)
        : {}
      const data = { ...endpointForm, content }
      if (editingEndpoint) {
        await api.endpoints.update(siteId, editingEndpoint.id, data)
      } else {
        await api.endpoints.create(siteId, data)
      }
      setIsEndpointDialogOpen(false)
      loadSite()
    } catch (error) {
      console.error('Error saving endpoint:', error)
      alert('Error saving endpoint')
    }
  }

  const handleUpdateSite = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.sites.update(siteId, siteForm)
    setIsSiteDialogOpen(false)
    loadSite()
    onRefreshSites()
  }

  const handleDeleteSite = async () => {
    if (!confirm('Delete this site and all its endpoints?')) return
    await api.sites.delete(siteId)
    onRefreshSites()
    onBack()
  }

  const toggleProjectSelection = (projectId: number) => {
    setEndpointForm((prev) => ({
      ...prev,
      projectIds: prev.projectIds.includes(projectId)
        ? prev.projectIds.filter((id) => id !== projectId)
        : [...prev.projectIds, projectId],
    }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  if (!site) {
    return (
      <div className="p-6 space-y-6 animate-in fade-in duration-500">
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
                <Skeleton className="h-32 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

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

      <Dialog open={isEndpointDialogOpen} onOpenChange={setIsEndpointDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEndpoint ? 'Edit Endpoint' : 'Create Endpoint'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEndpoint} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endpointName">Name *</Label>
                <Input
                  id="endpointName"
                  value={endpointForm.name}
                  onChange={(e) => {
                    setEndpointForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: !editingEndpoint ? generateSlug(e.target.value) : prev.slug,
                    }))
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endpointSlug">Slug *</Label>
                <Input
                  id="endpointSlug"
                  value={endpointForm.slug}
                  onChange={(e) => setEndpointForm((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpointType">Type</Label>
              <Select
                value={endpointForm.type}
                onValueChange={(value: 'page' | 'collection') => setEndpointForm((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="page">Page (Custom Content)</SelectItem>
                  <SelectItem value="collection">Collection (Select Projects)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {endpointForm.type === 'page' ? (
              <FieldBuilder
                fields={contentFields}
                onChange={setContentFields}
                projects={projects}
              />
            ) : (
              <div className="space-y-2">
                <Label>Select Projects ({endpointForm.projectIds.length} selected)</Label>
                <ProjectSelector
                  projects={projects}
                  selectedIds={endpointForm.projectIds}
                  onChange={(ids) => setEndpointForm(prev => ({ ...prev, projectIds: ids }))}
                />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEndpointDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingEndpoint ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSiteDialogOpen} onOpenChange={setIsSiteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Site Settings</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Name</Label>
              <Input
                id="siteName"
                value={siteForm.name}
                onChange={(e) => setSiteForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteSlug">Slug</Label>
              <Input
                id="siteSlug"
                value={siteForm.slug}
                onChange={(e) => setSiteForm((prev) => ({ ...prev, slug: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDesc">Description</Label>
              <Textarea
                id="siteDesc"
                value={siteForm.description}
                onChange={(e) => setSiteForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <DialogFooter className="flex justify-between">
              <Button type="button" variant="destructive" onClick={handleDeleteSite}>
                Delete Site
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsSiteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
