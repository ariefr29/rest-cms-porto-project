import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ProjectDialog } from '@/components/dialogs/project-dialog'
import { EndpointPreview } from '@/components/endpoint-preview'
import { Plus, Pencil, Trash2, ExternalLink, Github, Figma } from 'lucide-react'
import { api, type Project } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'

interface ProjectsPageProps {
  projects: Project[]
  onRefresh: () => void
  isLoading?: boolean
}

export function ProjectsPage({ projects, onRefresh, isLoading }: ProjectsPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)

  const handleCreate = () => {
    setEditingProject(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    await api.projects.delete(id)
    onRefresh()
  }

  const handleSubmit = async (formData: Partial<Project>) => {
    if (editingProject?.id) {
      await api.projects.update(editingProject.id, formData)
    } else {
      await api.projects.create(formData)
    }
    setIsDialogOpen(false)
    onRefresh()
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

      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={editingProject}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
