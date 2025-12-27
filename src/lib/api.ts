const API_BASE = '/api'

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || error.message || 'Request failed')
  }
  return res.json()
}

export interface Project {
  id: number
  title: string
  slug: string
  year?: number
  client?: string
  role?: string
  techStack?: string[]
  shortDesc?: string
  detailDesc?: string
  urlLive?: string
  urlGithub?: string
  urlFigma?: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

export interface Site {
  id: number
  name: string
  slug: string
  description?: string
  createdAt: string
  endpoints?: SiteEndpoint[]
}

export interface SiteEndpoint {
  id: number
  siteId: number
  name: string
  slug: string
  type: 'page' | 'collection'
  content?: Record<string, unknown>
  projectIds?: number[]
  selectedProjects?: Project[]
  createdAt: string
}

export const api = {
  auth: {
    login: (credentials: { username: string; password: string }) =>
      fetchApi<{ success: boolean; message: string }>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    verify: async (): Promise<{ authenticated: boolean }> => {
      try {
        const res = await fetch(`${API_BASE}/auth/verify`, {
          credentials: 'include',
        })
        if (res.ok) {
          return await res.json()
        }
        // Return false for any non-ok response (including 401)
        return { authenticated: false }
      } catch {
        return { authenticated: false }
      }
    },
    logout: () => fetchApi<{ success: boolean }>('/auth/logout', { method: 'POST' }),
  },
  projects: {
    list: () => fetchApi<Project[]>('/projects'),
    get: (id: number) => fetchApi<Project>(`/projects/${id}`),
    create: (data: Partial<Project>) => fetchApi<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Project>) => fetchApi<Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/projects/${id}`, { method: 'DELETE' }),
  },
  sites: {
    list: () => fetchApi<Site[]>('/sites'),
    get: (id: number) => fetchApi<Site>(`/sites/${id}`),
    create: (data: Partial<Site>) => fetchApi<Site>('/sites', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Site>) => fetchApi<Site>(`/sites/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/sites/${id}`, { method: 'DELETE' }),
  },
  endpoints: {
    list: (siteId: number) => fetchApi<SiteEndpoint[]>(`/sites/${siteId}/endpoints`),
    get: (siteId: number, endpointId: number) => fetchApi<SiteEndpoint>(`/sites/${siteId}/endpoints/${endpointId}`),
    create: (siteId: number, data: Partial<SiteEndpoint> & { projectIds?: number[] }) =>
      fetchApi<SiteEndpoint>(`/sites/${siteId}/endpoints`, { method: 'POST', body: JSON.stringify(data) }),
    update: (siteId: number, endpointId: number, data: Partial<SiteEndpoint> & { projectIds?: number[] }) =>
      fetchApi<SiteEndpoint>(`/sites/${siteId}/endpoints/${endpointId}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (siteId: number, endpointId: number) =>
      fetchApi<{ success: boolean }>(`/sites/${siteId}/endpoints/${endpointId}`, { method: 'DELETE' }),
  },
}
