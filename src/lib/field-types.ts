// Field type definitions for the Visual Field Builder

export type FieldType = 'text' | 'textarea' | 'richtext' | 'object' | 'array' | 'projects' | 'number' | 'boolean' | 'image' | 'link'

export interface FieldDefinition {
    id: string
    key: string
    type: FieldType
    label: string
    value: unknown
    children?: FieldDefinition[] // for object type - defines the structure
    itemTemplate?: FieldDefinition[] // for array type - defines the template for each item
}

export interface FieldValue {
    [key: string]: unknown
}

// Helper to generate unique IDs
export function generateFieldId(): string {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Convert fields to JSON content
export function fieldsToContent(fields: FieldDefinition[]): Record<string, unknown> {
    const content: Record<string, unknown> = {}

    for (const field of fields) {
        if (field.type === 'object' && field.children) {
            content[field.key] = fieldsToContent(field.children)
        } else if (field.type === 'array' && Array.isArray(field.value)) {
            content[field.key] = (field.value as FieldDefinition[][]).map(itemFields =>
                fieldsToContent(itemFields)
            )
        } else if (field.type === 'projects') {
            // Store project IDs with a special marker for backend resolution
            content[field.key] = {
                _type: 'projects',
                projectIds: field.value as number[]
            }
        } else {
            content[field.key] = field.value
        }
    }

    return content
}

// Convert JSON content back to fields (for editing)
export function contentToFields(content: Record<string, unknown>, existingFields?: FieldDefinition[]): FieldDefinition[] {
    const fields: FieldDefinition[] = []

    for (const [key, value] of Object.entries(content)) {
        // Check if we have existing field definition to preserve metadata
        const existingField = existingFields?.find(f => f.key === key)

        if (value && typeof value === 'object' && '_type' in (value as object) && (value as { _type: string })._type === 'projects') {
            // Projects field
            fields.push({
                id: existingField?.id || generateFieldId(),
                key,
                type: 'projects',
                label: existingField?.label || key,
                value: (value as { projectIds: number[] }).projectIds || []
            })
        } else if (Array.isArray(value)) {
            // Array field
            const arrayItems = value.map((item, index) => {
                if (typeof item === 'object' && item !== null) {
                    return contentToFields(item as Record<string, unknown>)
                }
                return [{
                    id: generateFieldId(),
                    key: 'value',
                    type: 'text' as FieldType,
                    label: 'Value',
                    value: item
                }]
            })

            fields.push({
                id: existingField?.id || generateFieldId(),
                key,
                type: 'array',
                label: existingField?.label || key,
                value: arrayItems,
                itemTemplate: existingField?.itemTemplate || (arrayItems[0] ? arrayItems[0].map(f => ({
                    ...f,
                    id: generateFieldId(),
                    value: ''
                })) : [])
            })
        } else if (value && typeof value === 'object') {
            // Object field
            fields.push({
                id: existingField?.id || generateFieldId(),
                key,
                type: 'object',
                label: existingField?.label || key,
                value: null,
                children: contentToFields(value as Record<string, unknown>, existingField?.children)
            })
        } else if (typeof value === 'number') {
            fields.push({
                id: existingField?.id || generateFieldId(),
                key,
                type: 'number',
                label: existingField?.label || key,
                value
            })
        } else if (typeof value === 'boolean') {
            fields.push({
                id: existingField?.id || generateFieldId(),
                key,
                type: 'boolean',
                label: existingField?.label || key,
                value
            })
        } else if (typeof value === 'string' && value.length > 100) {
            // Long text = textarea
            fields.push({
                id: existingField?.id || generateFieldId(),
                key,
                type: existingField?.type || 'textarea',
                label: existingField?.label || key,
                value
            })
        } else {
            // Default to text
            fields.push({
                id: existingField?.id || generateFieldId(),
                key,
                type: existingField?.type || 'text',
                label: existingField?.label || key,
                value: value ?? ''
            })
        }
    }

    return fields
}

// Create a new field with default values
export function createField(type: FieldType, key: string = ''): FieldDefinition {
    const id = generateFieldId()
    const baseField = {
        id,
        key,
        label: key || `New ${type} field`,
        type
    }

    switch (type) {
        case 'text':
            return { ...baseField, value: '' }
        case 'textarea':
            return { ...baseField, value: '' }
        case 'richtext':
            return { ...baseField, value: '' }
        case 'number':
            return { ...baseField, value: 0 }
        case 'boolean':
            return { ...baseField, value: false }
        case 'image':
            return { ...baseField, value: '' }
        case 'link':
            return { ...baseField, value: { url: '', label: '' } }
        case 'object':
            return { ...baseField, value: null, children: [] }
        case 'array':
            return { ...baseField, value: [], itemTemplate: [] }
        case 'projects':
            return { ...baseField, value: [] }
        default:
            return { ...baseField, value: '' }
    }
}

// Field type metadata for UI
export const FIELD_TYPE_META: Record<FieldType, { icon: string; label: string; description: string }> = {
    text: { icon: '📝', label: 'Text', description: 'Single line text' },
    textarea: { icon: '📄', label: 'Textarea', description: 'Multi-line text' },
    richtext: { icon: '✏️', label: 'Rich Text', description: 'Formatted content' },
    number: { icon: '🔢', label: 'Number', description: 'Numeric value' },
    boolean: { icon: '☑️', label: 'Boolean', description: 'True/False toggle' },
    image: { icon: '🖼️', label: 'Image', description: 'Image URL' },
    link: { icon: '🔗', label: 'Link', description: 'URL with label' },
    object: { icon: '📦', label: 'Object', description: 'Group of fields' },
    array: { icon: '📋', label: 'Array', description: 'List of items' },
    projects: { icon: '📁', label: 'Projects', description: 'Select projects' }
}
