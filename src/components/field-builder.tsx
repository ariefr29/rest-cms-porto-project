import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ProjectSelector } from '@/components/project-selector'
import { RichTextEditor } from '@/components/rich-text-editor'
import {
    Plus,
    Trash2,
    GripVertical,
    ChevronDown,
    ChevronRight,
    Copy,
    Code
} from 'lucide-react'
import type {
    FieldDefinition,
    FieldType
} from '@/lib/field-types'
import {
    createField,
    generateFieldId,
    FIELD_TYPE_META,
    fieldsToContent,
    contentToFields
} from '@/lib/field-types'
import type { Project } from '@/lib/api'

interface FieldBuilderProps {
    fields: FieldDefinition[]
    onChange: (fields: FieldDefinition[]) => void
    projects: Project[]
}

export function FieldBuilder({ fields, onChange, projects }: FieldBuilderProps) {
    const [showJson, setShowJson] = useState(false)
    const [jsonError, setJsonError] = useState<string | null>(null)

    const handleAddField = (type: FieldType) => {
        const newField = createField(type)
        onChange([...fields, newField])
    }

    const handleUpdateField = (index: number, updated: FieldDefinition) => {
        const newFields = [...fields]
        newFields[index] = updated
        onChange(newFields)
    }

    const handleDeleteField = (index: number) => {
        onChange(fields.filter((_, i) => i !== index))
    }

    const handleMoveField = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= fields.length) return

        const newFields = [...fields]
        const [removed] = newFields.splice(index, 1)
        newFields.splice(newIndex, 0, removed)
        onChange(newFields)
    }

    const handleDuplicateField = (index: number) => {
        const field = fields[index]
        const duplicated: FieldDefinition = {
            ...JSON.parse(JSON.stringify(field)),
            id: generateFieldId(),
            key: `${field.key}_copy`
        }
        const newFields = [...fields]
        newFields.splice(index + 1, 0, duplicated)
        onChange(newFields)
    }

    const handleJsonChange = (json: string) => {
        try {
            const parsed = JSON.parse(json)
            const newFields = contentToFields(parsed, fields)
            onChange(newFields)
            setJsonError(null)
        } catch (e) {
            setJsonError('Invalid JSON')
        }
    }

    const jsonContent = JSON.stringify(fieldsToContent(fields), null, 2)

    return (
        <div className="space-y-4">
            {/* Header with JSON toggle */}
            <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Content Fields</Label>
                <div className="flex items-center gap-2">
                    <Label htmlFor="json-toggle" className="text-sm text-muted-foreground">
                        JSON Mode
                    </Label>
                    <Switch
                        id="json-toggle"
                        checked={showJson}
                        onCheckedChange={setShowJson}
                    />
                    <Code className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            {showJson ? (
                /* JSON Editor Mode */
                <div className="space-y-2">
                    <Textarea
                        value={jsonContent}
                        onChange={(e) => handleJsonChange(e.target.value)}
                        rows={15}
                        className="font-mono text-sm"
                        placeholder='{"key": "value"}'
                    />
                    {jsonError && (
                        <p className="text-sm text-destructive">{jsonError}</p>
                    )}
                </div>
            ) : (
                /* Visual Builder Mode */
                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <FieldItem
                            key={field.id}
                            field={field}
                            index={index}
                            totalFields={fields.length}
                            projects={projects}
                            onUpdate={(updated) => handleUpdateField(index, updated)}
                            onDelete={() => handleDeleteField(index)}
                            onMove={(dir) => handleMoveField(index, dir)}
                            onDuplicate={() => handleDuplicateField(index)}
                        />
                    ))}

                    {fields.length === 0 && (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                            <p className="mb-4">No fields yet. Add your first field!</p>
                        </div>
                    )}

                    <AddFieldButton onAdd={handleAddField} />
                </div>
            )}
        </div>
    )
}

// Individual field item component
interface FieldItemProps {
    field: FieldDefinition
    index: number
    totalFields: number
    projects: Project[]
    onUpdate: (field: FieldDefinition) => void
    onDelete: () => void
    onMove: (direction: 'up' | 'down') => void
    onDuplicate: () => void
}

function FieldItem({ field, index, totalFields, projects, onUpdate, onDelete, onMove, onDuplicate }: FieldItemProps) {
    const [isOpen, setIsOpen] = useState(true)
    const meta = FIELD_TYPE_META[field.type]

    const updateValue = (value: unknown) => {
        onUpdate({ ...field, value })
    }

    const updateKey = (key: string) => {
        onUpdate({ ...field, key, label: field.label || key })
    }

    const updateLabel = (label: string) => {
        onUpdate({ ...field, label })
    }

    // Handle children update for object type
    const updateChildren = (children: FieldDefinition[]) => {
        onUpdate({ ...field, children })
    }

    // Handle array items
    const updateArrayItem = (itemIndex: number, itemFields: FieldDefinition[]) => {
        const newValue = [...(field.value as FieldDefinition[][])]
        newValue[itemIndex] = itemFields
        onUpdate({ ...field, value: newValue })
    }

    const addArrayItem = () => {
        const template = field.itemTemplate || []
        const newItem = template.map(f => ({
            ...f,
            id: generateFieldId(),
            value: f.type === 'number' ? 0 : f.type === 'boolean' ? false : ''
        }))
        const newValue = [...(field.value as FieldDefinition[][] || []), newItem]
        onUpdate({ ...field, value: newValue })
    }

    const removeArrayItem = (itemIndex: number) => {
        const newValue = (field.value as FieldDefinition[][]).filter((_, i) => i !== itemIndex)
        onUpdate({ ...field, value: newValue })
    }

    const updateItemTemplate = (template: FieldDefinition[]) => {
        onUpdate({ ...field, itemTemplate: template })
    }

    return (
        <Card className="overflow-hidden">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className="p-3 bg-muted/30">
                    <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />

                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-auto">
                                {isOpen ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </Button>
                        </CollapsibleTrigger>

                        <span className="text-lg">{meta.icon}</span>

                        <div className="flex-1 flex items-center gap-2">
                            <Input
                                value={field.key}
                                onChange={(e) => updateKey(e.target.value)}
                                placeholder="field_key"
                                className="h-7 w-32 text-sm font-mono"
                            />
                            <span className="text-muted-foreground text-sm">({meta.label})</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => onMove('up')}
                                disabled={index === 0}
                            >
                                <span className="text-xs">↑</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => onMove('down')}
                                disabled={index === totalFields - 1}
                            >
                                <span className="text-xs">↓</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={onDuplicate}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={onDelete}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CollapsibleContent>
                    <CardContent className="p-3 pt-3 space-y-3">
                        {/* Label input */}
                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground w-16">Label:</Label>
                            <Input
                                value={field.label}
                                onChange={(e) => updateLabel(e.target.value)}
                                placeholder="Display label"
                                className="h-7 text-sm"
                            />
                        </div>

                        {/* Value editor based on type */}
                        {field.type === 'text' && (
                            <Input
                                value={field.value as string}
                                onChange={(e) => updateValue(e.target.value)}
                                placeholder="Enter text..."
                            />
                        )}

                        {field.type === 'textarea' && (
                            <Textarea
                                value={field.value as string}
                                onChange={(e) => updateValue(e.target.value)}
                                placeholder="Enter text..."
                                rows={3}
                            />
                        )}

                        {field.type === 'richtext' && (
                            <RichTextEditor
                                content={field.value as string}
                                onChange={(content) => updateValue(content)}
                            />
                        )}

                        {field.type === 'number' && (
                            <Input
                                type="number"
                                value={field.value as number}
                                onChange={(e) => updateValue(Number(e.target.value))}
                            />
                        )}

                        {field.type === 'boolean' && (
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={field.value as boolean}
                                    onCheckedChange={(checked) => updateValue(checked)}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {field.value ? 'True' : 'False'}
                                </span>
                            </div>
                        )}

                        {field.type === 'image' && (
                            <div className="space-y-2">
                                <Input
                                    value={field.value as string}
                                    onChange={(e) => updateValue(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {field.value && (
                                    <img
                                        src={field.value as string}
                                        alt="Preview"
                                        className="max-h-32 rounded border"
                                        onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                    />
                                )}
                            </div>
                        )}

                        {field.type === 'link' && (
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    value={(field.value as { url: string; label: string })?.url || ''}
                                    onChange={(e) => updateValue({
                                        ...(field.value as object),
                                        url: e.target.value
                                    })}
                                    placeholder="URL"
                                />
                                <Input
                                    value={(field.value as { url: string; label: string })?.label || ''}
                                    onChange={(e) => updateValue({
                                        ...(field.value as object),
                                        label: e.target.value
                                    })}
                                    placeholder="Label"
                                />
                            </div>
                        )}

                        {field.type === 'object' && (
                            <div className="pl-4 border-l-2 border-muted space-y-3">
                                {(field.children || []).map((child, childIndex) => (
                                    <FieldItem
                                        key={child.id}
                                        field={child}
                                        index={childIndex}
                                        totalFields={(field.children || []).length}
                                        projects={projects}
                                        onUpdate={(updated) => {
                                            const newChildren = [...(field.children || [])]
                                            newChildren[childIndex] = updated
                                            updateChildren(newChildren)
                                        }}
                                        onDelete={() => {
                                            updateChildren((field.children || []).filter((_, i) => i !== childIndex))
                                        }}
                                        onMove={(dir) => {
                                            const newIndex = dir === 'up' ? childIndex - 1 : childIndex + 1
                                            if (newIndex < 0 || newIndex >= (field.children || []).length) return
                                            const newChildren = [...(field.children || [])]
                                            const [removed] = newChildren.splice(childIndex, 1)
                                            newChildren.splice(newIndex, 0, removed)
                                            updateChildren(newChildren)
                                        }}
                                        onDuplicate={() => {
                                            const child = field.children![childIndex]
                                            const duplicated: FieldDefinition = {
                                                ...JSON.parse(JSON.stringify(child)),
                                                id: generateFieldId(),
                                                key: `${child.key}_copy`
                                            }
                                            const newChildren = [...(field.children || [])]
                                            newChildren.splice(childIndex + 1, 0, duplicated)
                                            updateChildren(newChildren)
                                        }}
                                    />
                                ))}
                                <AddFieldButton
                                    onAdd={(type) => {
                                        const newField = createField(type)
                                        updateChildren([...(field.children || []), newField])
                                    }}
                                    variant="secondary"
                                    label="Add to object"
                                />
                            </div>
                        )}

                        {field.type === 'array' && (
                            <div className="space-y-3">
                                {/* Template definition */}
                                <div className="bg-muted/30 rounded-lg p-3">
                                    <Label className="text-xs text-muted-foreground mb-2 block">
                                        Item Template (define fields for each item)
                                    </Label>
                                    <div className="pl-4 border-l-2 border-primary/30 space-y-2">
                                        {(field.itemTemplate || []).map((templateField, tIndex) => (
                                            <div key={templateField.id} className="flex items-center gap-2 bg-background rounded p-2">
                                                <span>{FIELD_TYPE_META[templateField.type].icon}</span>
                                                <Input
                                                    value={templateField.key}
                                                    onChange={(e) => {
                                                        const newTemplate = [...(field.itemTemplate || [])]
                                                        newTemplate[tIndex] = { ...templateField, key: e.target.value }
                                                        updateItemTemplate(newTemplate)
                                                    }}
                                                    className="h-7 text-sm font-mono"
                                                    placeholder="field_key"
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    ({FIELD_TYPE_META[templateField.type].label})
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => {
                                                        updateItemTemplate((field.itemTemplate || []).filter((_, i) => i !== tIndex))
                                                    }}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                                    <Plus className="h-3 w-3 mr-1" />
                                                    Add Template Field
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {(['text', 'textarea', 'number', 'boolean', 'image', 'link'] as FieldType[]).map(type => (
                                                    <DropdownMenuItem
                                                        key={type}
                                                        onClick={() => {
                                                            const newField = createField(type)
                                                            updateItemTemplate([...(field.itemTemplate || []), newField])
                                                        }}
                                                    >
                                                        {FIELD_TYPE_META[type].icon} {FIELD_TYPE_META[type].label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Array items */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">
                                        Items ({(field.value as FieldDefinition[][] || []).length})
                                    </Label>
                                    {(field.value as FieldDefinition[][] || []).map((itemFields, itemIndex) => (
                                        <Card key={itemIndex} className="bg-muted/20">
                                            <CardHeader className="p-2 flex-row items-center justify-between">
                                                <span className="text-sm font-medium">Item {itemIndex + 1}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => removeArrayItem(itemIndex)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </CardHeader>
                                            <CardContent className="p-2 pt-0 space-y-2">
                                                {itemFields.map((itemField, fieldIndex) => (
                                                    <div key={itemField.id} className="grid grid-cols-[100px,1fr] gap-2 items-center">
                                                        <Label className="text-xs">{itemField.key}</Label>
                                                        {itemField.type === 'text' && (
                                                            <Input
                                                                value={itemField.value as string}
                                                                onChange={(e) => {
                                                                    const newItemFields = [...itemFields]
                                                                    newItemFields[fieldIndex] = { ...itemField, value: e.target.value }
                                                                    updateArrayItem(itemIndex, newItemFields)
                                                                }}
                                                                className="h-8"
                                                            />
                                                        )}
                                                        {itemField.type === 'textarea' && (
                                                            <Textarea
                                                                value={itemField.value as string}
                                                                onChange={(e) => {
                                                                    const newItemFields = [...itemFields]
                                                                    newItemFields[fieldIndex] = { ...itemField, value: e.target.value }
                                                                    updateArrayItem(itemIndex, newItemFields)
                                                                }}
                                                                rows={2}
                                                            />
                                                        )}
                                                        {itemField.type === 'number' && (
                                                            <Input
                                                                type="number"
                                                                value={itemField.value as number}
                                                                onChange={(e) => {
                                                                    const newItemFields = [...itemFields]
                                                                    newItemFields[fieldIndex] = { ...itemField, value: Number(e.target.value) }
                                                                    updateArrayItem(itemIndex, newItemFields)
                                                                }}
                                                                className="h-8"
                                                            />
                                                        )}
                                                        {itemField.type === 'boolean' && (
                                                            <Switch
                                                                checked={itemField.value as boolean}
                                                                onCheckedChange={(checked) => {
                                                                    const newItemFields = [...itemFields]
                                                                    newItemFields[fieldIndex] = { ...itemField, value: checked }
                                                                    updateArrayItem(itemIndex, newItemFields)
                                                                }}
                                                            />
                                                        )}
                                                        {itemField.type === 'image' && (
                                                            <Input
                                                                value={itemField.value as string}
                                                                onChange={(e) => {
                                                                    const newItemFields = [...itemFields]
                                                                    newItemFields[fieldIndex] = { ...itemField, value: e.target.value }
                                                                    updateArrayItem(itemIndex, newItemFields)
                                                                }}
                                                                placeholder="Image URL"
                                                                className="h-8"
                                                            />
                                                        )}
                                                        {itemField.type === 'link' && (
                                                            <div className="flex gap-1">
                                                                <Input
                                                                    value={(itemField.value as { url?: string })?.url || ''}
                                                                    onChange={(e) => {
                                                                        const newItemFields = [...itemFields]
                                                                        newItemFields[fieldIndex] = {
                                                                            ...itemField,
                                                                            value: { ...(itemField.value as object), url: e.target.value }
                                                                        }
                                                                        updateArrayItem(itemIndex, newItemFields)
                                                                    }}
                                                                    placeholder="URL"
                                                                    className="h-8"
                                                                />
                                                                <Input
                                                                    value={(itemField.value as { label?: string })?.label || ''}
                                                                    onChange={(e) => {
                                                                        const newItemFields = [...itemFields]
                                                                        newItemFields[fieldIndex] = {
                                                                            ...itemField,
                                                                            value: { ...(itemField.value as object), label: e.target.value }
                                                                        }
                                                                        updateArrayItem(itemIndex, newItemFields)
                                                                    }}
                                                                    placeholder="Label"
                                                                    className="h-8"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={addArrayItem}
                                        disabled={!field.itemTemplate || field.itemTemplate.length === 0}
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add Item
                                    </Button>
                                </div>
                            </div>
                        )}

                        {field.type === 'projects' && (
                            <ProjectSelector
                                projects={projects}
                                selectedIds={field.value as number[] || []}
                                onChange={(ids) => updateValue(ids)}
                            />
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}

// Add field button with dropdown
interface AddFieldButtonProps {
    onAdd: (type: FieldType) => void
    variant?: 'default' | 'secondary'
    label?: string
}

function AddFieldButton({ onAdd, variant = 'default', label = 'Add Field' }: AddFieldButtonProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant === 'secondary' ? 'outline' : 'default'}
                    className={variant === 'secondary' ? 'w-full h-8 text-sm' : 'w-full'}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuLabel>Basic Fields</DropdownMenuLabel>
                {(['text', 'textarea', 'richtext', 'number', 'boolean'] as FieldType[]).map(type => (
                    <DropdownMenuItem key={type} onClick={() => onAdd(type)}>
                        <span className="mr-2">{FIELD_TYPE_META[type].icon}</span>
                        <span>{FIELD_TYPE_META[type].label}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                            {FIELD_TYPE_META[type].description}
                        </span>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Media</DropdownMenuLabel>
                {(['image', 'link'] as FieldType[]).map(type => (
                    <DropdownMenuItem key={type} onClick={() => onAdd(type)}>
                        <span className="mr-2">{FIELD_TYPE_META[type].icon}</span>
                        <span>{FIELD_TYPE_META[type].label}</span>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Complex</DropdownMenuLabel>
                {(['object', 'array', 'projects'] as FieldType[]).map(type => (
                    <DropdownMenuItem key={type} onClick={() => onAdd(type)}>
                        <span className="mr-2">{FIELD_TYPE_META[type].icon}</span>
                        <span>{FIELD_TYPE_META[type].label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
