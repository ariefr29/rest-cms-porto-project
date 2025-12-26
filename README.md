# CMS Headless Project

A modern, flexible headless CMS built with React and Hono. Create custom content structures visually and consume them via a clean REST API.

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](./docs/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📁 **Project Management** | Full CRUD with rich text editor (TipTap) |
| 🌐 **Multi-site Support** | Manage multiple sites from one dashboard |
| 🛠️ **Visual Field Builder** | Create page content with drag-and-drop fields |
| 🔗 **Custom Endpoints** | Define page or collection endpoints per site |
| 🚀 **Public API** | RESTful API at `/api/v1/:site/:endpoint` |
| 📖 **API Documentation** | Built-in docs page with copy functionality |

### Visual Field Builder

Create complex content structures without writing JSON:

- **Text, Textarea, Rich Text** - Content fields
- **Number, Boolean** - Data fields  
- **Image, Link** - Media fields
- **Object, Array** - Nested structures
- **Projects** - Embed project references

> 📚 [Full Field Builder Documentation →](./docs/FIELD_BUILDER.md)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cms-headless-project

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

**Access Points:**
- 🌐 Frontend: http://localhost:5173
- ⚡ API: http://localhost:3000

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Radix UI |
| **Backend** | Hono, Drizzle ORM, Zod |
| **Database** | PostgreSQL |
| **Editor** | TipTap |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📖 API Reference](./docs/API.md) | Complete REST API documentation |
| [🛠️ Field Builder Guide](./docs/FIELD_BUILDER.md) | Visual field builder usage |
| [🗄️ Database Schema](./docs/DATABASE.md) | Tables and relationships |
| [📝 Changelog](./docs/CHANGELOG.md) | Version history |

---

## 📁 Project Structure

```
cms-headless-project/
├── docs/                   # Documentation
├── drizzle/                # Database migrations
├── server/src/
│   ├── db/                 # Database connection & schema
│   ├── routes/             # API routes
│   └── index.ts            # Server entry
├── src/
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   ├── field-builder.tsx
│   │   └── project-selector.tsx
│   ├── lib/
│   │   ├── api.ts          # API client
│   │   └── field-types.ts  # Field type definitions
│   ├── pages/              # Page components
│   └── App.tsx
└── package.json
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (frontend + backend) |
| `npm run build` | Build for production |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Open Drizzle Studio |

---

## 🔌 API Quick Reference

### Public Endpoints

```bash
# Get all projects
GET /api/v1/projects

# Get project by slug
GET /api/v1/projects/:slug

# Get site endpoint content
GET /api/v1/:siteSlug/:endpointSlug
```

> 📖 [Full API Documentation →](./docs/API.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) - Web framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [TipTap](https://tiptap.dev/) - Rich text editor
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
