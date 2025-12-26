import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { ProjectsPage } from '@/pages/projects'
import { SiteDetailPage } from '@/pages/site-detail'
import { ApiDocsPage } from '@/pages/api-docs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { api, type Site, type Project } from '@/lib/api'
import { Menu, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

type Page = 'projects' | 'site' | 'api-docs'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('projects')
  const [currentSiteId, setCurrentSiteId] = useState<number | undefined>()
  const [sites, setSites] = useState<Site[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [newSite, setNewSite] = useState({ name: '', slug: '', description: '' })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [sitesData, projectsData] = await Promise.all([api.sites.list(), api.projects.list()])
    setSites(sitesData)
    setProjects(projectsData)
  }

  const loadSites = async () => {
    const sitesData = await api.sites.list()
    setSites(sitesData)
  }

  const loadProjects = async () => {
    const projectsData = await api.projects.list()
    setProjects(projectsData)
  }

  const handleNavigate = (page: string, siteId?: number) => {
    setCurrentPage(page as Page)
    setCurrentSiteId(siteId)
    setIsMobileMenuOpen(false)
  }

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault()
    const site = await api.sites.create(newSite)
    setIsAddSiteOpen(false)
    setNewSite({ name: '', slug: '', description: '' })
    await loadSites()
    handleNavigate('site', site.id)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        className={cn(
          "fixed inset-y-0 left-0 z-50 md:static md:flex shadow-xl md:shadow-none z-50",
          !isMobileMenuOpen && "-translate-x-full md:translate-x-0"
        )}
        sites={sites}
        currentPage={currentPage}
        currentSiteId={currentSiteId}
        onNavigate={handleNavigate}
        onAddSite={() => setIsAddSiteOpen(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="md:hidden h-16 border-b bg-white/80 backdrop-blur flex items-center px-4 shrink-0 z-20">
          <Button variant="ghost" size="icon" className="text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <span className="ml-3 font-bold text-lg text-slate-800 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
              <Globe className="h-3 w-3" />
            </div>
            CMS Headless
          </span>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 animate-in slide-in-from-right-2 duration-300 ease-out">
          <div className="max-w-7xl mx-auto space-y-6">
            {currentPage === 'projects' && <ProjectsPage projects={projects} onRefresh={loadProjects} />}

            {currentPage === 'site' && currentSiteId && (
              <SiteDetailPage
                siteId={currentSiteId}
                projects={projects}
                onBack={() => handleNavigate('projects')}
                onRefreshSites={loadSites}
              />
            )}

            {currentPage === 'api-docs' && <ApiDocsPage sites={sites} projects={projects} />}
          </div>
        </div>
      </main>

      <Dialog open={isAddSiteOpen} onOpenChange={setIsAddSiteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Site</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSite} className="space-y-4">
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
              <Button type="button" variant="outline" onClick={() => setIsAddSiteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Site</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
