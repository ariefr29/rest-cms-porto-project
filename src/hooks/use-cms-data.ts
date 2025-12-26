import { useState, useEffect } from 'react'
import { api, type Site, type Project } from '@/lib/api'

export function useCmsData() {
    const [sites, setSites] = useState<Site[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const loadData = async () => {
        setIsLoading(true)
        try {
            const [sitesData, projectsData] = await Promise.all([
                api.sites.list(),
                api.projects.list()
            ])
            setSites(sitesData)
            setProjects(projectsData)
        } finally {
            setIsLoading(false)
        }
    }

    const loadSites = async () => {
        const sitesData = await api.sites.list()
        setSites(sitesData)
    }

    const loadProjects = async () => {
        const projectsData = await api.projects.list()
        setProjects(projectsData)
    }

    useEffect(() => {
        loadData()
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
