import { useState, useCallback } from 'react'
import { api, type Site, type Project } from '@/lib/api'

export function useCmsData() {
    const [sites, setSites] = useState<Site[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const loadData = useCallback(async () => {
        setIsLoading(true)
        try {
            const [sitesData, projectsData] = await Promise.all([
                api.sites.list(),
                api.projects.list()
            ])
            setSites(sitesData)
            setProjects(projectsData)
        } catch (err) {
            console.error('Failed to load CMS data:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const loadSites = useCallback(async () => {
        try {
            const sitesData = await api.sites.list()
            setSites(sitesData)
        } catch (err) {
            console.error('Failed to load sites:', err)
        }
    }, [])

    const loadProjects = useCallback(async () => {
        try {
            const projectsData = await api.projects.list()
            setProjects(projectsData)
        } catch (err) {
            console.error('Failed to load projects:', err)
        }
    }, [])

    return {
        sites,
        projects,
        isLoading,
        loadData,
        loadSites,
        loadProjects
    }
}
