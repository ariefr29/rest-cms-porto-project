import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { generateSlug } from '@/lib/utils'

interface AddSiteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (site: { name: string; slug: string; description: string }) => Promise<void>
}

export function AddSiteDialog({ open, onOpenChange, onSubmit }: AddSiteDialogProps) {
    const [newSite, setNewSite] = useState({ name: '', slug: '', description: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onSubmit(newSite)
            setNewSite({ name: '', slug: '', description: '' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Site</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="newSiteName">Name *</Label>
                        <Input
                            id="newSiteName"
                            value={newSite.name}
                            onChange={(e) =>
                                setNewSite((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                    slug: generateSlug(e.target.value),
                                }))
                            }
                            placeholder="My Portfolio Site"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newSiteSlug">Slug *</Label>
                        <Input
                            id="newSiteSlug"
                            value={newSite.slug}
                            onChange={(e) => setNewSite((prev) => ({ ...prev, slug: e.target.value }))}
                            placeholder="my-portfolio"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            API base: /api/v1/<strong>{newSite.slug || 'slug'}</strong>/...
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newSiteDesc">Description</Label>
                        <Textarea
                            id="newSiteDesc"
                            value={newSite.description}
                            onChange={(e) => setNewSite((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Optional description..."
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Site'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
