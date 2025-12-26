import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Check } from 'lucide-react'
import type { Project } from '@/lib/api'

interface ProjectSelectorProps {
    projects: Project[]
    selectedIds: number[]
    onChange: (ids: number[]) => void
    maxHeight?: string
}

export function ProjectSelector({ projects, selectedIds, onChange, maxHeight = '300px' }: ProjectSelectorProps) {
    const [search, setSearch] = useState('')

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.client?.toLowerCase().includes(search.toLowerCase()) ||
        project.techStack?.some(tech => tech.toLowerCase().includes(search.toLowerCase()))
    )

    const toggleProject = (projectId: number) => {
        if (selectedIds.includes(projectId)) {
            onChange(selectedIds.filter(id => id !== projectId))
        } else {
            onChange([...selectedIds, projectId])
        }
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b bg-muted/30">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 h-8"
                    />
                </div>
            </div>

            {/* Selected count */}
            <div className="px-3 py-1.5 bg-muted/20 border-b text-sm text-muted-foreground">
                {selectedIds.length} of {projects.length} selected
            </div>

            {/* Project list - simple div with overflow */}
            <div className="overflow-y-auto" style={{ maxHeight }}>
                <div className="divide-y">
                    {filteredProjects.map(project => {
                        const isSelected = selectedIds.includes(project.id)
                        return (
                            <div
                                key={project.id}
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
                                onClick={() => toggleProject(project.id)}
                            >
                                {/* Simple checkbox replacement */}
                                <div className={`h-4 w-4 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-input'}`}>
                                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{project.title}</div>
                                    <div className="text-sm text-muted-foreground truncate">
                                        {project.client && <span>{project.client} • </span>}
                                        {project.shortDesc || 'No description'}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    {project.year && (
                                        <Badge variant="outline" className="text-xs">{project.year}</Badge>
                                    )}
                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="flex gap-1">
                                            {project.techStack.slice(0, 2).map((tech, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs px-1.5 py-0">
                                                    {tech}
                                                </Badge>
                                            ))}
                                            {project.techStack.length > 2 && (
                                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                                    +{project.techStack.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {filteredProjects.length === 0 && (
                        <div className="p-6 text-center text-muted-foreground">
                            {search ? 'No projects match your search' : 'No projects available'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
