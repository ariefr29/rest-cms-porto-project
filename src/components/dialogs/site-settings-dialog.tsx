import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Site } from '@/lib/api'

interface SiteSettingsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    site: Site | null
    onSubmit: (data: { name: string; slug: string; description: string }) => Promise<void>
    onDelete: () => Promise<void>
}

export function SiteSettingsDialog({ open, onOpenChange, site, onSubmit, onDelete }: SiteSettingsDialogProps) {
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (site) {
            setFormData({
                name: site.name,
                slug: site.slug,
                description: site.description || '',
            })
        }
    }, [site])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onSubmit(formData)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this site and all its endpoints? This cannot be undone.')) return
        await onDelete()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Site Settings</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name *</Label>
                        <Input
                            id="siteName"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="siteSlug">Site Slug *</Label>
                        <Input
                            id="siteSlug"
                            value={formData.slug}
                            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="siteDesc">Description</Label>
                        <Textarea
                            id="siteDesc"
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                        <Button type="button" variant="destructive" onClick={handleDelete}>
                            Delete Site
                        </Button>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
