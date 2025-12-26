# CMS Headless Project

A modern headless CMS built with React, Hono (backend), PostgreSQL, and Drizzle ORM. This project provides a flexible content management system with multi-site support, custom endpoints, and a public API for consuming content.

![Dashboard Preview](./docs/dashboard-preview.png)

## ✨ Features

- **📁 Project Management** - Full CRUD operations for projects with rich text editor (TipTap)
- **🌐 Multi-site Management** - Create and manage multiple sites/domains
- **🔗 Custom Endpoints** - Define page or collection type endpoints per site
- **📖 API Documentation** - Built-in API docs with copy endpoint functionality
- **🚀 Public API** - RESTful API for consuming content: `/api/v1/:siteSlug/:endpointSlug`
- **🎨 Modern UI** - Built with React, Tailwind CSS, and Radix UI components

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **TipTap** - Rich text editor
- **Lucide React** - Icon library

### Backend
- **Hono** - Fast, lightweight web framework
- **Drizzle ORM** - TypeScript ORM
- **PostgreSQL** - Database
- **Zod** - Schema validation

## 📋 Prerequisites

- **Node.js** v18+ 
- **PostgreSQL** v14+
- **npm** or **yarn**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cms-headless-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

1. Create a PostgreSQL database named `cms_headless`:
   ```sql
   CREATE DATABASE cms_headless;
   ```

2. Copy `.env.example` to `.env` and update the database credentials:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your database credentials:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cms_headless
   PORT=3000
   ```

### 4. Run Database Migrations

```bash
# Generate migration files (if schema changed)
npm run db:generate

# Apply migrations
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at:
- 🌐 **Frontend**: http://localhost:5173
- ⚡ **Backend API**: http://localhost:3000

## 📚 API Documentation

### CMS API (Internal)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get project by ID |
| POST | `/api/projects` | Create a new project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |
| GET | `/api/sites` | List all sites |
| GET | `/api/sites/:id` | Get site with endpoints |
| POST | `/api/sites` | Create a new site |
| PUT | `/api/sites/:id` | Update a site |
| DELETE | `/api/sites/:id` | Delete a site |
| GET | `/api/sites/:siteId/endpoints` | List site endpoints |
| POST | `/api/sites/:siteId/endpoints` | Create endpoint |
| PUT | `/api/sites/:siteId/endpoints/:endpointId` | Update endpoint |
| DELETE | `/api/sites/:siteId/endpoints/:endpointId` | Delete endpoint |
| GET | `/api/health` | Health check |

### Public API (External)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/:siteSlug/:endpointSlug` | Get endpoint content |
| GET | `/api/v1/projects` | List all projects |
| GET | `/api/v1/projects/:slug` | Get project by slug |

### Example Responses

**GET /api/v1/projects**
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

**GET /api/v1/:siteSlug/:endpointSlug (Page Type)**
```json
{
  "name": "About Page",
  "slug": "about",
  "content": {
    "title": "About Us",
    "description": "Welcome to our company..."
  }
}
```

**GET /api/v1/:siteSlug/:endpointSlug (Collection Type)**
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

## 📁 Project Structure

```
cms-headless-project/
├── drizzle/                    # Database migrations
├── server/
│   └── src/
│       ├── db/
│       │   ├── index.ts        # Database connection
│       │   └── schema.ts       # Drizzle schema definitions
│       ├── routes/
│       │   ├── projects.ts     # Project routes
│       │   ├── sites.ts        # Site & endpoint routes
│       │   └── public-api.ts   # Public API routes
│       └── index.ts            # Server entry point
├── src/
│   ├── components/             # React components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities
│   ├── pages/                  # Page components
│   ├── App.tsx                 # Main app component
│   ├── index.css               # Global styles
│   └── main.tsx                # React entry point
├── .env.example                # Environment variables template
├── drizzle.config.ts           # Drizzle configuration
├── package.json
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json
└── vite.config.ts              # Vite configuration
```

## 🗄️ Database Schema

### Tables

**projects**
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| title | varchar(255) | Project title |
| slug | varchar(255) | URL-friendly identifier (unique) |
| year | integer | Project year |
| client | varchar(255) | Client name |
| role | varchar(255) | Your role |
| tech_stack | json | Array of technologies |
| short_desc | text | Short description |
| detail_desc | text | Detailed description (HTML) |
| url_live | varchar(500) | Live URL |
| url_github | varchar(500) | GitHub URL |
| url_figma | varchar(500) | Figma URL |
| thumbnail | varchar(500) | Thumbnail URL |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**sites**
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | varchar(255) | Site name |
| slug | varchar(255) | URL-friendly identifier (unique) |
| description | text | Site description |
| created_at | timestamp | Creation timestamp |

**site_endpoints**
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| site_id | integer | Foreign key to sites |
| name | varchar(255) | Endpoint name |
| slug | varchar(255) | Endpoint slug |
| type | varchar(50) | 'page' or 'collection' |
| content | json | Page content (for page type) |
| created_at | timestamp | Creation timestamp |

**site_project_selections**
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| endpoint_id | integer | Foreign key to site_endpoints |
| project_id | integer | Foreign key to projects |
| order | integer | Display order |

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (frontend + backend) |
| `npm run dev:client` | Start Vite dev server only |
| `npm run dev:server` | Start backend server only |
| `npm run build` | Build for production |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) - The web framework
- [Drizzle ORM](https://orm.drizzle.team/) - The TypeScript ORM
- [Radix UI](https://www.radix-ui.com/) - UI components
- [TipTap](https://tiptap.dev/) - Rich text editor
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
