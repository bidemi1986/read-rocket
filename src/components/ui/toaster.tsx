"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { cln } from '@/lib/utils'; // Utility function for conditionally applying classNames

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant,...props }) {
        return (
          <Toast key={id} {...props}
          className={cln(
            'border-l-4',
            variant === 'destructive' ? 'bg-red-50 border-red-500' : '',
            variant === 'success' ? 'bg-green-50 border-green-500' : '',
            variant === 'info' ? 'bg-blue-50 border-blue-500' : '',
            variant === 'warning' ? 'bg-yellow-50 border-yellow-500' : ''
          )}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
