import { useIsItemPage } from '@/hooks/useIsItemPage'
import { whatsappLink, WHATSAPP_GREETING } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'
import { useCartCount } from '@/store/cart'
import { WhatsAppIcon } from '@/components/ui/SocialIcons'

/**
 * Floating WhatsApp chat button. On mobile it sits above the bottom tab bar and lifts further
 * when a full-width bottom overlay shows (the "View cart" pill, or the item page's sticky add bar).
 */
export function WhatsAppFab() {
  const count = useCartCount()
  const isItemPage = useIsItemPage()
  const lifted = count > 0 || isItemPage

  return (
    <a
      href={whatsappLink(WHATSAPP_GREETING)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in new tab)"
      className={cn(
        'sticker fixed right-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-full bg-pickle text-espresso',
        'transition-[translate,scale,rotate] duration-300 ease-bouncy hover:scale-110 hover:-rotate-12 active:scale-90 md:right-6 md:bottom-6',
        lifted && 'max-md:-translate-y-[4.75rem]',
      )}
    >
      <WhatsAppIcon size={28} />
    </a>
  )
}
