# Database Schema

This document describes the database schema for the CMS Headless Project.

## Overview

The database uses PostgreSQL with Drizzle ORM for type-safe database operations.

---

## Tables

### projects

Stores portfolio project information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PRIMARY KEY | Auto-incrementing ID |
| `title` | `varchar(255)` | NOT NULL | Project title |
| `slug` | `varchar(255)` | NOT NULL, UNIQUE | URL-friendly identifier |
| `year` | `integer` | | Project year |
| `client` | `varchar(255)` | | Client name |
| `role` | `varchar(255)` | | Your role in the project |
| `tech_stack` | `json` | | Array of technologies |
| `short_desc` | `text` | | Brief description |
| `detail_desc` | `text` | | Detailed description (HTML) |
| `url_live` | `varchar(500)` | | Live website URL |
| `url_github` | `varchar(500)` | | GitHub repository URL |
| `url_figma` | `varchar(500)` | | Figma design URL |
| `thumbnail` | `varchar(500)` | | Thumbnail image URL |
| `created_at` | `timestamp` | DEFAULT now() | Creation timestamp |
| `updated_at` | `timestamp` | DEFAULT now() | Last update timestamp |

### sites

Stores website/domain configurations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PRIMARY KEY | Auto-incrementing ID |
| `name` | `varchar(255)` | NOT NULL | Site display name |
| `slug` | `varchar(255)` | NOT NULL, UNIQUE | URL-friendly identifier |
| `description` | `text` | | Site description |
| `created_at` | `timestamp` | DEFAULT now() | Creation timestamp |

### site_endpoints

Stores endpoint configurations for each site.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PRIMARY KEY | Auto-incrementing ID |
| `site_id` | `integer` | NOT NULL, FK → sites | Parent site reference |
| `name` | `varchar(255)` | NOT NULL | Endpoint display name |
| `slug` | `varchar(255)` | NOT NULL | Endpoint URL path |
| `type` | `varchar(50)` | NOT NULL | `'page'` or `'collection'` |
| `content` | `json` | | Page content (for page type) |
| `created_at` | `timestamp` | DEFAULT now() | Creation timestamp |

**Unique constraint**: (`site_id`, `slug`) - Each site can have unique endpoint slugs.

### site_project_selections

Junction table for collection-type endpoints to select projects.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PRIMARY KEY | Auto-incrementing ID |
| `endpoint_id` | `integer` | NOT NULL, FK → site_endpoints | Parent endpoint reference |
| `project_id` | `integer` | NOT NULL, FK → projects | Selected project reference |
| `order` | `integer` | DEFAULT 0 | Display order |

---

## Relationships

```
sites (1) ─────────── (N) site_endpoints
                              │
                              │ (for collection type)
                              ▼
                     site_project_selections
                              │
                              ▼
                          projects
```

### Relationship Details

- **sites → site_endpoints**: One site can have many endpoints
- **site_endpoints → site_project_selections**: One endpoint can have many project selections (collection type only)
- **site_project_selections → projects**: Links to the projects table

---

## Content JSON Structure (Page Type)

For `page` type endpoints, the `content` column stores a JSON object with the field builder structure:

```json
{
  "title": "Page Title",
  "description": "Page description",
  "hero": {
    "headline": "Welcome",
    "image": "https://..."
  },
  "features": [
    { "name": "Feature 1", "icon": "..." },
    { "name": "Feature 2", "icon": "..." }
  ],
  "selected_projects": {
    "_type": "projects",
    "projectIds": [1, 2, 3]
  }
}
```

### Project Reference Format

When using the Projects field type, the data is stored as:

```json
{
  "_type": "projects",
  "projectIds": [1, 2, 3]
}
```

This is automatically resolved to full project data when accessed via the public API.

---

## Indexes

The following indexes are recommended for performance:

```sql
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_sites_slug ON sites(slug);
CREATE INDEX idx_endpoints_site_slug ON site_endpoints(site_id, slug);
CREATE INDEX idx_project_selections_endpoint ON site_project_selections(endpoint_id);
```

---

## Migrations

Migrations are managed by Drizzle Kit. Files are stored in the `drizzle/` directory.

### Commands

```bash
# Generate migration from schema changes
npm run db:generate

# Apply pending migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

---

## Schema File Location

The Drizzle schema is defined in:

```
server/src/db/schema.ts
```

This file contains all table definitions, relationships, and type exports.
