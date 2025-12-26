import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, ExternalLink } from 'lucide-react'

interface EndpointPreviewProps {
  method?: string
  path: string
  description?: string
  sampleResponse?: unknown
}

export function EndpointPreview({ method = 'GET', path, description, sampleResponse }: EndpointPreviewProps) {
  const [copied, setCopied] = useState(false)
  const fullUrl = `${window.location.origin}${path}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {method}
            </Badge>
            <code className="text-sm bg-muted px-2 py-1 rounded">{path}</code>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
      </CardHeader>
      {sampleResponse && (
        <CardContent>
          <CardTitle className="text-sm mb-2">Response Structure</CardTitle>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-[200px]">
            {JSON.stringify(sampleResponse, null, 2)}
          </pre>
        </CardContent>
      )}
    </Card>
  )
}
