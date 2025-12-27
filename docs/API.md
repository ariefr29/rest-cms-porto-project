# API Reference

Complete API documentation for CMS Headless Project.

## Table of Contents

- [Authentication](#authentication)
- [CMS API (Internal)](#cms-api-internal)
  - [Projects](#projects)
  - [Sites](#sites)
  - [Endpoints](#endpoints)
- [Public API (External)](#public-api-external)
  - [Projects Public](#projects-public)
  - [Site Content](#site-content)
- [Response Examples](#response-examples)

---

## Authentication

The Internal CMS API is protected using JWT (JSON Web Token) stored in HTTP-only cookies.

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate and receive session cookie |
| GET | `/api/auth/verify` | Verify current session status |
| POST | `/api/auth/logout` | Clear session cookie |

#### Login Body

```json
{
  "username": "admin",
  "password": "yourpassword"
}
```

> **Note:** Credentials are configured via environment variables on the server.

---

## CMS API (Internal)

Base URL: `http://localhost:3000/api`

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get project by ID |
| POST | `/api/projects` | Create a new project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

#### Create/Update Project Body

```json
{
  "title": "Project Title",
  "slug": "project-slug",
  "year": 2024,
  "client": "Client Name",
  "role": "Full Stack Developer",
  "techStack": ["React", "Node.js", "PostgreSQL"],
  "shortDesc": "Short description",
  "detailDesc": "<p>Detailed HTML description</p>",
  "urlLive": "https://example.com",
  "urlGithub": "https://github.com/user/repo",
  "urlFigma": "https://figma.com/file/xxx",
  "thumbnail": "https://example.com/thumbnail.jpg"
}
```

### Sites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sites` | List all sites |
| GET | `/api/sites/:id` | Get site with endpoints |
| POST | `/api/sites` | Create a new site |
| PUT | `/api/sites/:id` | Update a site |
| DELETE | `/api/sites/:id` | Delete a site |

#### Create/Update Site Body

```json
{
  "name": "My Website",
  "slug": "my-website",
  "description": "Description of the site"
}
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sites/:siteId/endpoints` | List site endpoints |
| POST | `/api/sites/:siteId/endpoints` | Create endpoint |
| PUT | `/api/sites/:siteId/endpoints/:endpointId` | Update endpoint |
| DELETE | `/api/sites/:siteId/endpoints/:endpointId` | Delete endpoint |

#### Create Endpoint Body (Page Type)

```json
{
  "name": "Homepage",
  "slug": "homepage",
  "type": "page",
  "content": {
    "title": "Welcome",
    "description": "Page description",
    "hero_image": "https://example.com/hero.jpg"
  }
}
```

#### Create Endpoint Body (Collection Type)

```json
{
  "name": "Featured Projects",
  "slug": "featured-projects",
  "type": "collection",
  "projectIds": [1, 2, 3]
}
```

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

---

## Public API (External)

Base URL: `http://localhost:3000/api/v1`

### Projects Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/projects` | List all projects |
| GET | `/api/v1/projects/:slug` | Get project by slug |

### Site Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/:siteSlug/:endpointSlug` | Get endpoint content |

---

## Response Examples

### GET /api/v1/projects

```json
{
  "data": [
    {
      "id": 1,
      "title": "My Portfolio",
      "slug": "my-portfolio",
      "year": 2024,
      "client": "Personal",
      "role": "Full Stack Developer",
      "techStack": ["React", "Node.js", "PostgreSQL"],
      "shortDesc": "A personal portfolio website",
      "detailDesc": "<p>Detailed description with HTML content...</p>",
      "urlLive": "https://example.com",
      "urlGithub": "https://github.com/user/repo",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/v1/:siteSlug/:endpointSlug (Page Type)

Page endpoints return the content with project references automatically resolved:

```json
{
  "name": "About Page",
  "slug": "about",
  "content": {
    "title": "About Us",
    "description": "Welcome to our company...",
    "featured_projects": [
      {
        "id": 1,
        "title": "Project 1",
        "slug": "project-1",
        "techStack": ["React", "Node.js"]
      }
    ]
  }
}
```

### GET /api/v1/:siteSlug/:endpointSlug (Collection Type)

```json
{
  "name": "Featured Projects",
  "slug": "featured-projects",
  "data": [
    { "id": 1, "title": "Project 1", "slug": "project-1", ... },
    { "id": 2, "title": "Project 2", "slug": "project-2", ... }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Session missing or expired |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |
