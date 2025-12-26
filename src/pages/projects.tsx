import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { RichTextEditor } from '@/components/rich-text-editor'
import { EndpointPreview } from '@/components/endpoint-preview'
import { Plus, Pencil, Trash2, ExternalLink, Github, Figma } from 'lucide-react'
import { api, type Project } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'

interface ProjectsPageProps {
  projects: Project[]
  onRefresh: () => void
  isLoading?: boolean
}

const emptyProject: Partial<Project> = {
  title: '',
  slug: '',
  year: new Date().getFullYear(),
  client: '',
  role: '',
  techStack: [],
  shortDesc: '',
  detailDesc: '',
  urlLive: '',
  urlGithub: '',
  urlFigma: '',
  thumbnail: '',
}

export function ProjectsPage({ projects, onRefresh, isLoading }: ProjectsPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)
  const [formData, setFormData] = useState<Partial<Project>>(emptyProject)
  const [techInput, setTechInput] = useState('')

  const handleCreate = () => {
    setEditingProject(null)
    setFormData(emptyProject)
    setTechInput('')
    setIsDialogOpen(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData(project)
    setTechInput('')
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    await api.projects.delete(id)
    onRefresh()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProject?.id) {
      await api.projects.update(editingProject.id, formData)
    } else {
      await api.projects.create(formData)
    }
    setIsDialogOpen(false)
    onRefresh()
  }

  const handleAddTech = () => {
    if (techInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...(prev.techStack || []), techInput.trim()],
      }))
      setTechInput('')
    }
  }

  const handleRemoveTech = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      techStack: (prev.techStack || []).filter((_, i) => i !== index),
    }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <EndpointPreview
        path="/api/v1/projects"
        description="Get all projects"
        sampleResponse={{ data: [{ id: 1, title: 'Project Name', slug: 'project-name', '...': '...' }] }}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>{projects.length} projects total</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Tech Stack</TableHead>
                <TableHead>Links</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton Rows
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <code className="text-xs text-muted-foreground">{project.slug}</code>
                      </div>
                    </TableCell>
                    <TableCell>{project.year}</TableCell>
                    <TableCell>{project.client || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(project.techStack || []).slice(0, 3).map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {(project.techStack || []).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(project.techStack || []).length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {project.urlLive && (
                          <a href={project.urlLive} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </a>
                        )}
                        {project.urlGithub && (
                          <a href={project.urlGithub} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </a>
                        )}
                        {project.urlFigma && (
                          <a href={project.urlFigma} target="_blank" rel="noopener noreferrer">
                            <Figma className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )))}
              {!isLoading && projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No projects yet. Create your first project!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Create Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                      slug: !editingProject ? generateSlug(e.target.value) : prev.slug,
                    }))
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, year: parseInt(e.target.value) || undefined }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={formData.client || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, client: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add technology..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                />
                <Button type="button" onClick={handleAddTech}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.techStack || []).map((tech, i) => (
                  <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTech(i)}>
                    {tech} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDesc">Short Description</Label>
              <Textarea
                id="shortDesc"
                value={formData.shortDesc || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortDesc: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Detail Description</Label>
              <RichTextEditor
                content={formData.detailDesc || ''}
                onChange={(content) => setFormData((prev) => ({ ...prev, detailDesc: content }))}
                placeholder="Write detailed description..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="urlLive">Live URL</Label>
                <Input
                  id="urlLive"
                  type="url"
                  value={formData.urlLive || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, urlLive: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="urlGithub">GitHub URL</Label>
                <Input
                  id="urlGithub"
                  type="url"
                  value={formData.urlGithub || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, urlGithub: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="urlFigma">Figma URL</Label>
                <Input
                  id="urlFigma"
                  type="url"
                  value={formData.urlFigma || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, urlFigma: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                type="url"
                value={formData.thumbnail || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingProject ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
