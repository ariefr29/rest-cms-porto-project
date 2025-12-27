# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2024-12-27

### Added
- **JWT Authentication** - Implemented a secure authentication layer for the CMS management dashboard:
  - **Login System**: Secure login page with credential validation against environment variables.
  - **JWT Tokens**: Session management using JSON Web Tokens.
  - **Secure Cookies**: Tokens are stored in `HTTP-only` cookies to prevent XSS attacks.
  - **CORS & Credentials**: Updated API client and server configuration to support cross-origin authenticated requests.

- **Protected Routes & APIs**:
  - **Backend Guard**: Implemented custom auth middleware for Hono to protect all management endpoints (`/api/projects`, `/api/sites`, etc.).
  - **Frontend Guard**: Added conditional rendering and redirection logic in the main `App` component to enforce login.
  - **Auto-Logout**: Implemented session termination with automatic cookie clearing.

- **Refined Data Loading Flow**:
  - Re-engineered the data-fetching sequence to wait for successful authentication, ensuring a cleaner console (no 401 errors) and better user experience.

### Fixed
- **Authentication Bypass**: Fixed an issue where the dashboard was accessible without login after page refreshes.
- **Console Errors**: Resolved fetch 401 errors during the initial application load by handling auth verification more gracefully.

### Changed
- **Sidebar UX**: Added a dedicated logout button with a clear red visual indicator for better discoverability.

## [1.2.0] - 2024-12-26

### Added
- **Modern Dashboard** - Implemented a new landing page for the dashboard with:
  - Real-time statistics for Projects and Sites.
  - Interactive "Quick Start Guide" with visual indicators.
  - Theme-aware design using modern card layouts.
  
- **Dark Mode System** - Comprehensive dark mode implementation:
  - **YouTube True Dark** palette for superior contrast and visual comfort.
  - **Persistent Theme**: Selected theme is saved to `localStorage` and applied across sessions.
  - **Animated Toggle**: Added a theme switcher in the Sidebar with smooth icon transitions.
  - **Hybrid Design**: Maintained the professional dark sidebar even in light mode for structural consistency.

- **Skeleton Loading UI** - Added pulse-animated placeholders for all data-fetching states:
  - Table rows in Projects page.
  - Site details and endpoint cards.
  - API Documentation previews.
  
- **Premium Design Enhancements**:
  - **Page Transitions**: Smooth fade-in animations for all navigation routes.
  - **Typography**: Integrated the **Outfit** Google Font for a more modern and premium aesthetic.
  - **Responsive Sidebar**: Re-engineered the mobile menu with an animated backdrop and better header UX.
  - **Design System**: Standardized on theme variables (`bg-background`, `text-foreground`, etc.) for all custom components.

### Fixed
- **Mobile Navigation**: Fixed backdrop contrast and header coloring in mobile view.
- **Color Consistency**: Removed all hardcoded slate colors to ensure 100% theme compatibility.

### Changed
- **Styling**: Refined the YouTube-inspired dark theme with neutral dark greys (`0 0% 7%`) for better accessibility.

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
