# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-12-26

### Added
- **Visual Field Builder** - New intuitive field builder for Page-type endpoints with support for:
  - Text fields (single line)
  - Textarea fields (multi-line)
  - Rich Text fields (TipTap editor)
  - Number fields
  - Boolean fields (toggle switch)
  - Image fields (URL with preview)
  - Link fields (URL + label)
  - Object fields (nested field groups)
  - Array fields (with customizable item templates)
  - Projects field (project selector with search and multi-select)
  
- **Project Resolution API** - Added `resolveProjectFields` helper function to recursively resolve project references within endpoint content. Project IDs are automatically replaced with full project data in API responses.

- **JSON Mode Toggle** - Field Builder now includes a toggle to switch between visual builder and raw JSON editing mode.

### Fixed
- **Maximum update depth exceeded error** - Fixed infinite loop caused by Radix UI ScrollArea component in ProjectSelector by replacing with native overflow-y-auto div.
- **Checkbox infinite loop** - Replaced Radix UI Checkbox with native styled checkbox to prevent render loop issues.
- **DOM nesting warning** - Fixed `validateDOMNesting` error by changing CardDescription from `<p>` to `<div>` element.
- **DialogContent aria-describedby warning** - Added `aria-describedby={undefined}` to suppress Radix UI accessibility warning.

### Changed
- **Button component** - Updated to support `asChild` prop using Radix UI Slot for polymorphic rendering.
- **ProjectSelector component** - Simplified component with native checkbox styling and removed problematic ScrollArea.

## [1.0.0] - 2024-12-25

### Added
- Initial release of CMS Headless Project
- Project Management with full CRUD operations
- Multi-site management functionality
- Custom endpoint creation (Page and Collection types)
- Public API for content consumption
- Rich text editor integration (TipTap)
- API documentation page
- PostgreSQL database with Drizzle ORM
- React frontend with Tailwind CSS and Radix UI
