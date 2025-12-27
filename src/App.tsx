import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { DashboardPage } from '@/pages/dashboard'
import { ProjectsPage } from '@/pages/projects'
import { SiteDetailPage } from '@/pages/site-detail'
import { ApiDocsPage } from '@/pages/api-docs'
import { LoginPage } from '@/pages/login'
import { AddSiteDialog } from '@/components/dialogs/add-site-dialog'
import { Button } from '@/components/ui/button'

import { api } from '@/lib/api'
import { Menu, Globe, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'
import { useCmsData } from '@/hooks/use-cms-data'

type Page = 'dashboard' | 'projects' | 'site' | 'api-docs'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { sites, projects, isLoading, loadData, loadSites, loadProjects } = useCmsData()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [currentSiteId, setCurrentSiteId] = useState<number | undefined>()

  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const res = await api.auth.verify()
      setIsAuthenticated(res.authenticated)
    }
    checkAuth()
  }, [])

  // Load CMS data only after authentication is confirmed
  useEffect(() => {
    if (isAuthenticated === true) {
      loadData()
    }
  }, [isAuthenticated, loadData])

  const handleNavigate = (page: string, siteId?: number) => {
    setCurrentPage(page as Page)
    setCurrentSiteId(siteId)
    setIsMobileMenuOpen(false)
  }

  const handleAddSiteSubmit = async (siteData: { name: string; slug: string; description: string }) => {
    const site = await api.sites.create(siteData)
    setIsAddSiteOpen(false)
    await loadSites()
    handleNavigate('site', site.id)
  }

  const handleLogout = async () => {
    try {
      await api.auth.logout()
      setIsAuthenticated(false)
    } catch (err) {
      console.error('Logout failed', err)
      setIsAuthenticated(false)
    }
  }

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true)
    // Data will be loaded automatically by the useEffect above
  }

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        className={cn(
          "fixed inset-y-0 left-0 z-50 md:static md:flex shadow-xl md:shadow-none",
          !isMobileMenuOpen && "-translate-x-full md:translate-x-0"
        )}
        sites={sites}
        currentPage={currentPage}
        currentSiteId={currentSiteId}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigate={handleNavigate}
        onAddSite={() => setIsAddSiteOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative bg-background">
        <header className="md:hidden h-16 border-b bg-background/80 backdrop-blur flex items-center px-4 shrink-0 z-20">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <span className="ml-3 font-bold text-lg text-foreground flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
              <Globe className="h-3 w-3" />
            </div>
            CMS Headless
          </span>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 animate-in slide-in-from-right-2 duration-300 ease-out">
          <div className="max-w-7xl mx-auto space-y-6">
            {currentPage === 'dashboard' && (
              <DashboardPage
                stats={{ projectsCount: projects.length, sitesCount: sites.length }}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'projects' && <ProjectsPage projects={projects} onRefresh={loadProjects} isLoading={isLoading} />}

            {currentPage === 'site' && currentSiteId && (
              <SiteDetailPage
                siteId={currentSiteId}
                projects={projects}
                onBack={() => handleNavigate('projects')}
                onRefreshSites={loadSites}
              />
            )}

            {currentPage === 'api-docs' && <ApiDocsPage sites={sites} projects={projects} isLoading={isLoading} />}
          </div>
        </div>
      </main>

      <AddSiteDialog
        open={isAddSiteOpen}
        onOpenChange={setIsAddSiteOpen}
        onSubmit={handleAddSiteSubmit}
      />
    </div>
  )
}

export default App
