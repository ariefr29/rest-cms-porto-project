# Visual Field Builder

The Visual Field Builder is a powerful feature that allows you to create custom content structures for Page-type endpoints without writing JSON manually.

## Table of Contents

- [Overview](#overview)
- [Accessing the Field Builder](#accessing-the-field-builder)
- [Field Types](#field-types)
- [Working with Fields](#working-with-fields)
- [JSON Mode](#json-mode)
- [Best Practices](#best-practices)

---

## Overview

The Field Builder provides an intuitive interface to define the content structure for your page endpoints. Instead of manually writing JSON, you can visually add, configure, and organize fields.

### Key Features

- 🎨 **Visual Interface** - Drag-and-drop field management
- 📝 **9 Field Types** - Support for various data types
- 🔄 **JSON Toggle** - Switch between visual and JSON mode
- 📦 **Nested Structures** - Create complex content hierarchies
- 🔗 **Project Integration** - Embed project selections directly

---

## Accessing the Field Builder

1. Navigate to a **Site** in the sidebar
2. Click **"Add Endpoint"** or edit an existing Page endpoint
3. Ensure the **Type** is set to **"Page"**
4. The Field Builder appears in the **"Content Fields"** section

---

## Field Types

### Basic Fields

| Type | Icon | Description | Value Example |
|------|------|-------------|---------------|
| **Text** | 📝 | Single-line text input | `"Hello World"` |
| **Textarea** | 📄 | Multi-line text input | `"Long text content..."` |
| **Rich Text** | ✍️ | HTML content with formatting | `"<p>Formatted <strong>text</strong></p>"` |
| **Number** | 🔢 | Numeric values | `42` |
| **Boolean** | ✅ | True/False toggle | `true` |

### Media Fields

| Type | Icon | Description | Value Example |
|------|------|-------------|---------------|
| **Image** | 🖼️ | Image URL with preview | `"https://example.com/image.jpg"` |
| **Link** | 🔗 | URL with label | `{ "url": "https://...", "label": "Click here" }` |

### Complex Fields

| Type | Icon | Description |
|------|------|-------------|
| **Object** | 📦 | Nested group of fields |
| **Array** | 📚 | Repeatable items with template |
| **Projects** | 🗂️ | Select projects from your collection |

---

## Working with Fields

### Adding a Field

1. Click the **"+ Add Field"** button
2. Select the desired field type from the dropdown
3. Configure the field:
   - **Key**: The JSON property name (e.g., `hero_title`)
   - **Label**: Display name for the field
   - **Value**: The actual content

### Field Configuration

Each field has a collapsible card with:

- **Key Input**: The field's identifier (used in API responses)
- **Label Input**: Human-readable name
- **Value Editor**: Type-specific input (text field, toggle, etc.)

### Reordering Fields

Use the **↑** and **↓** buttons in the field header to move fields up or down.

### Duplicating Fields

Click the **copy icon** to duplicate a field with a new ID.

### Deleting Fields

Click the **trash icon** to remove a field.

---

## Working with Object Fields

Object fields allow you to group related fields together:

```
hero (Object)
├── title (Text): "Welcome"
├── subtitle (Text): "To our website"
└── background (Image): "https://..."
```

### Adding Nested Fields

1. Add an **Object** field
2. Click **"Add to object"** within the object card
3. Add child fields as needed

---

## Working with Array Fields

Array fields let you create repeatable content:

### 1. Define the Item Template

First, define what each item should contain:

```
features (Array)
├── Template:
│   ├── title (Text)
│   ├── description (Textarea)
│   └── icon (Image)
```

### 2. Add Items

Click **"+ Add Item"** to create new items based on the template.

### Output Example

```json
{
  "features": [
    { "title": "Fast", "description": "...", "icon": "..." },
    { "title": "Secure", "description": "...", "icon": "..." }
  ]
}
```

---

## Working with Projects Field

The Projects field allows you to select and embed project data:

### Features

- 🔍 **Search** - Filter projects by title, client, or tech stack
- ☑️ **Multi-select** - Choose multiple projects
- 📊 **Counter** - Shows "X of Y selected"

### How It Works

1. Add a **Projects** field
2. Use the search to find projects
3. Click on projects to select/deselect them
4. Selected project IDs are stored

### API Response

When accessed via the public API, project IDs are automatically resolved to full project data:

```json
{
  "featured_projects": [
    {
      "id": 1,
      "title": "My Project",
      "slug": "my-project",
      "techStack": ["React", "Node.js"],
      ...
    }
  ]
}
```

---

## JSON Mode

Toggle **"JSON Mode"** to view or edit the raw JSON representation.

### Use Cases

- **Advanced editing** - Make bulk changes
- **Copy/Paste** - Transfer content between endpoints
- **Debugging** - Verify the data structure

### Switching Modes

The toggle is located in the top-right of the Content Fields section.

> ⚠️ Invalid JSON will be rejected and an error message will appear.

---

## Best Practices

### Naming Conventions

- Use **snake_case** for keys: `hero_title`, `feature_list`
- Use **descriptive names**: `cta_button_text` instead of `btn`
- Keep keys **consistent** across similar endpoints

### Organizing Content

- Group related fields using **Object** type
- Use **Arrays** for repeatable content (features, testimonials, etc.)
- Keep nesting shallow (max 2-3 levels)

### Performance

- Avoid excessive nesting
- Limit array items to reasonable numbers
- Use Project references instead of duplicating project data

---

## Example: Homepage Structure

```
Homepage (Page Endpoint)
├── meta (Object)
│   ├── title (Text): "Welcome to MyApp"
│   └── description (Textarea): "..."
├── hero (Object)
│   ├── headline (Text): "Build Something Amazing"
│   ├── subheadline (Textarea): "..."
│   ├── cta_text (Text): "Get Started"
│   └── cta_link (Link): { url: "/signup", label: "Sign Up" }
├── features (Array)
│   └── [Template: title, description, icon]
├── featured_projects (Projects): [1, 3, 5]
└── show_testimonials (Boolean): true
```

This structure will generate a clean API response with all content properly organized.
