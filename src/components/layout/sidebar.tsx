import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { FolderKanban, Globe, FileCode, ChevronRight, Plus, LayoutDashboard } from 'lucide-react'
import type { Site } from '@/lib/api'

interface SidebarProps {
  className?: string
  sites: Site[]
  currentPage: string
  currentSiteId?: number
  onNavigate: (page: string, siteId?: number) => void
  onAddSite: () => void
}

export function Sidebar({ className, sites, currentPage, currentSiteId, onNavigate, onAddSite }: SidebarProps) {
  return (
    <div className={cn("w-64 border-r border-slate-800 bg-slate-950 flex flex-col h-screen transition-all duration-300 ease-in-out text-slate-100", className)}>
      <div className="p-4 border-b border-slate-800">
        <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
            <Globe className="h-5 w-5" />
          </div>
          CMS
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Headless API Manager</p>
      </div>

      <ScrollArea className="flex-1 px-3 py-6">
        <div className="space-y-1 mb-6">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main</p>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200 ease-out",
              currentPage === 'dashboard' && "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20"
            )}
            onClick={() => onNavigate('dashboard')}
          >
            <LayoutDashboard className="mr-3 h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200 ease-out",
              currentPage === 'projects' && "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20"
            )}
            onClick={() => onNavigate('projects')}
          >
            <FolderKanban className="mr-3 h-4 w-4" />
            Projects
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200 ease-out",
              currentPage === 'api-docs' && "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20"
            )}
            onClick={() => onNavigate('api-docs')}
          >
            <FileCode className="mr-3 h-4 w-4" />
            API Documentation
          </Button>
        </div>

        <div className="mb-2 px-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Websites</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full"
            onClick={onAddSite}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-slate-800/50 mb-3 mx-2 w-auto" />

        <div className="space-y-1">
          {sites.map((site) => (
            <Button
              key={site.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200 ease-out group",
                currentPage === 'site' && currentSiteId === site.id && "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20"
              )}
              onClick={() => onNavigate('site', site.id)}
            >
              <Globe className="mr-3 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="truncate flex-1 text-left">{site.name}</span>
              <ChevronRight className="h-3 w-3 opacity-30 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
            </Button>
          ))}

          {sites.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-lg mx-2 bg-slate-900/50">
              <p className="text-xs text-slate-500">No sites created yet.</p>
              <Button variant="link" className="h-auto p-0 text-blue-400 text-xs mt-1" onClick={onAddSite}>Create one</Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-slate-800">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-slate-500 truncate">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
