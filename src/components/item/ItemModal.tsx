import { useNavigate } from 'react-router'
import { getItemBySlug } from '@/data/menu'
import { ButtonLink } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Mascot } from '@/components/mascot/Mascot'
import { ItemDetailContent } from './ItemDetailContent'

/**
 * Item detail as a modal over the page you came from (background-location pattern).
 * Rendered by RootLayout inside <AnimatePresence>; closing = history back.
 */
export function ItemModal({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const item = getItemBySlug(slug)
  const close = () => void navigate(-1)

  return (
    <Modal onClose={close} labelledBy="item-title">
      {item ? (
        <ItemDetailContent key={item.id} item={item} mode="modal" onAdded={close} />
      ) : (
        <div className="flex flex-col items-center gap-3 p-10 text-center">
          <Mascot mood="sad" className="h-40" />
          <h2 id="item-title" className="font-display text-3xl font-extrabold text-espresso">
            Ye toh hamare paas nahi 😅
          </h2>
          <ButtonLink to="/menu" replace>
            See the menu
          </ButtonLink>
        </div>
      )}
    </Modal>
  )
}
