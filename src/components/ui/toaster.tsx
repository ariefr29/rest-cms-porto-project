import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'rounded-lg border p-4 shadow-lg bg-background min-w-[300px]',
            toast.variant === 'destructive' && 'border-destructive bg-destructive text-destructive-foreground'
          )}
        >
          <div className="flex justify-between items-start">
            <div>
              {toast.title && <p className="font-semibold">{toast.title}</p>}
              {toast.description && <p className="text-sm text-muted-foreground">{toast.description}</p>}
            </div>
            <button onClick={() => dismiss(toast.id)} className="opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
