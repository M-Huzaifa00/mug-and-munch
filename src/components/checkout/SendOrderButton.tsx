import { MessageCircle, Phone } from 'lucide-react'
import { site } from '@/config/site'
import { formatPKR, cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { RollingNumber } from '@/components/ui/RollingNumber'

interface SendOrderButtonProps {
  total: number
  onSend: () => void
  /** Delivery below minimum / unavailable lines. */
  disabled?: boolean
  disabledReason?: string
  /** WhatsApp number configured in site.ts? Production never opens wa.me to a placeholder. */
  configured: boolean
  className?: string
  /** Unique per instance (mobile bar + desktop summary both render one). */
  idSuffix: string
}

/** "Send order on WhatsApp · Rs X" + explainer, or the "coming soon, call us" fallback. */
export function SendOrderButton({ total, onSend, disabled, disabledReason, configured, className, idSuffix }: SendOrderButtonProps) {
  if (!configured && import.meta.env.PROD) {
    return (
      <div className={cn('space-y-2', className)}>
        <p className="text-sm font-bold text-espresso">Online ordering is coming soon, call us: {site.contact.phoneDisplay}</p>
        <a href={site.contact.phoneHref} className={buttonClasses('primary', 'lg', 'w-full')}>
          <Phone size={20} aria-hidden="true" /> Call to order
        </a>
      </div>
    )
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      <Button size="lg" onClick={onSend} disabled={disabled} aria-describedby={`send-explainer-${idSuffix}`} className="w-full px-4 py-2 text-[1.1875rem] leading-tight text-balance">
        <MessageCircle size={20} strokeWidth={2.6} aria-hidden="true" />
        <span>
          Send order on WhatsApp · <RollingNumber value={total} format={formatPKR} className="whitespace-nowrap" />
        </span>
      </Button>
      <p id={`send-explainer-${idSuffix}`} className="text-center text-xs font-semibold text-ink/80">
        {disabled && disabledReason ? disabledReason : "Your order opens in WhatsApp. Just hit send and we'll confirm it there."}
      </p>
    </div>
  )
}
