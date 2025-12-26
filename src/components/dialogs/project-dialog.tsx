import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { RichTextEditor } from '@/components/rich-text-editor'
import { generateSlug } from '@/lib/utils'
import type { Project } from '@/lib/api'

interface ProjectDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    project: Partial<Project> | null
    onSubmit: (data: Partial<Project>) => Promise<void>
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

export function ProjectDialog({ open, onOpenChange, project, onSubmit }: ProjectDialogProps) {
    const [formData, setFormData] = useState<Partial<Project>>(emptyProject)
    const [techInput, setTechInput] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (project) {
            setFormData(project)
        } else {
            setFormData(emptyProject)
        }
    }, [project])

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onSubmit(formData)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{project?.id ? 'Edit Project' : 'Create Project'}</DialogTitle>
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
                                        slug: project?.id ? prev.slug : generateSlug(e.target.value),
                                    }))
                                }
                                }
                                placeholder="My Awesome Project"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                                placeholder="my-awesome-project"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                type="number"
                                value={formData.year}
                                onChange={(e) => setFormData((prev) => ({ ...prev, year: parseInt(e.target.value) }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client">Client</Label>
                            <Input
                                id="client"
                                value={formData.client}
                                onChange={(e) => setFormData((prev) => ({ ...prev, client: e.target.value }))}
                                placeholder="Client name or Personal"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tech">Tech Stack</Label>
                        <div className="flex gap-2">
                            <Input
                                id="tech"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                                placeholder="e.g. React, Tailwind"
                            />
                            <Button type="button" variant="outline" size="icon" onClick={handleAddTech}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.techStack?.map((tech, i) => (
                                <Badge key={i} variant="secondary" className="gap-1 px-2 py-1">
                                    {tech}
                                    <button type="button" onClick={() => handleRemoveTech(i)} className="hover:text-destructive">
                                        <X className="h-3 w-3" />
                                    </button>
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
                            placeholder="A brief overview of the project..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Detail Description (Rich Text)</Label>
                        <RichTextEditor
                            content={formData.detailDesc || ''}
                            onChange={(content) => setFormData((prev) => ({ ...prev, detailDesc: content }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="urlLive">Live URL</Label>
                            <Input
                                id="urlLive"
                                value={formData.urlLive || ''}
                                onChange={(e) => setFormData((prev) => ({ ...prev, urlLive: e.target.value }))}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="urlGithub">GitHub URL</Label>
                            <Input
                                id="urlGithub"
                                value={formData.urlGithub || ''}
                                onChange={(e) => setFormData((prev) => ({ ...prev, urlGithub: e.target.value }))}
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {project?.id ? 'Update Project' : 'Create Project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
