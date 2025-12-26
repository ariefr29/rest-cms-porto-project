import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FieldBuilder } from '@/components/field-builder'
import { ProjectSelector } from '@/components/project-selector'
import { generateSlug } from '@/lib/utils'
import { type FieldDefinition, fieldsToContent, contentToFields } from '@/lib/field-types'
import type { SiteEndpoint, Project } from '@/lib/api'

interface EndpointDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    endpoint: SiteEndpoint | null
    projects: Project[]
    onSubmit: (data: any) => Promise<void>
}

export function EndpointDialog({ open, onOpenChange, endpoint, projects, onSubmit }: EndpointDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        type: 'page' as 'page' | 'collection',
        content: {} as Record<string, unknown>,
        projectIds: [] as number[],
    })
    const [contentFields, setContentFields] = useState<FieldDefinition[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (endpoint) {
            setFormData({
                name: endpoint.name,
                slug: endpoint.slug,
                type: endpoint.type,
                content: endpoint.content || {},
                projectIds: endpoint.projectIds || [],
            })
            setContentFields(contentToFields(endpoint.content || {}))
        } else {
            setFormData({ name: '', slug: '', type: 'page', content: {}, projectIds: [] })
            setContentFields([])
        }
    }, [endpoint])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const content = formData.type === 'page' ? fieldsToContent(contentFields) : {}
            await onSubmit({ ...formData, content })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{endpoint ? 'Edit Endpoint' : 'Add New Endpoint'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="endpointName">Name *</Label>
                            <Input
                                id="endpointName"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                        slug: endpoint ? prev.slug : generateSlug(e.target.value),
                                    }))
                                }
                                placeholder="e.g. Services Page"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endpointSlug">Slug *</Label>
                            <Input
                                id="endpointSlug"
                                value={formData.slug}
                                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                                placeholder="e.g. services"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Endpoint Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(val: 'page' | 'collection') =>
                                setFormData((prev) => ({ ...prev, type: val }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="page">Page (Custom Builder)</SelectItem>
                                <SelectItem value="collection">Collection (List of Projects)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {formData.type === 'page'
                                ? 'Create a custom data structure for a single page.'
                                : 'Return a simple list of projects.'}
                        </p>
                    </div>

                    <Tabs value={formData.type} className="w-full">
                        <TabsContent value="page" className="mt-0 border p-4 rounded-lg bg-slate-50/30 dark:bg-card">
                            <FieldBuilder
                                fields={contentFields}
                                onChange={setContentFields}
                                projects={projects}
                            />
                        </TabsContent>
                        <TabsContent value="collection" className="mt-0 border p-4 rounded-lg bg-slate-50/30 dark:bg-card">
                            <div className="space-y-4">
                                <Label>Select Projects</Label>
                                <ProjectSelector
                                    projects={projects}
                                    selectedIds={formData.projectIds}
                                    onChange={(ids) => setFormData((prev) => ({ ...prev, projectIds: ids }))}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : endpoint ? 'Update Endpoint' : 'Create Endpoint'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
