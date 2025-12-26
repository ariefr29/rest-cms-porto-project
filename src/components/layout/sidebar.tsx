import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { FolderKanban, Globe, FileCode, ChevronRight, Plus } from 'lucide-react'
import type { Site } from '@/lib/api'

interface SidebarProps {
  sites: Site[]
  currentPage: string
  currentSiteId?: number
  onNavigate: (page: string, siteId?: number) => void
  onAddSite: () => void
}

export function Sidebar({ sites, currentPage, currentSiteId, onNavigate, onAddSite }: SidebarProps) {
  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col h-screen">
      <div className="p-4 border-b">
        <h1 className="font-bold text-lg">CMS Headless</h1>
        <p className="text-xs text-muted-foreground">Portfolio API Manager</p>
      </div>
      
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <Button
            variant={currentPage === 'projects' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onNavigate('projects')}
          >
            <FolderKanban className="mr-2 h-4 w-4" />
            Projects
          </Button>
          
          <Button
            variant={currentPage === 'api-docs' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onNavigate('api-docs')}
          >
            <FileCode className="mr-2 h-4 w-4" />
            API Docs
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sites</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddSite}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {sites.map((site) => (
            <Button
              key={site.id}
              variant={currentPage === 'site' && currentSiteId === site.id ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onNavigate('site', site.id)}
            >
              <Globe className="mr-2 h-4 w-4" />
              <span className="truncate flex-1 text-left">{site.name}</span>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Button>
          ))}
          
          {sites.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No sites yet. Create one!
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
