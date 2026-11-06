import { useRef, useState } from 'react'
import { getItemBySlug } from '@/data/menu'
import { useAddToCart } from '@/hooks/useAddToCart'
import { toCartInput, unitPriceFor, type OptionSelection } from '@/lib/itemOptions'
import { cn, formatPKR } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { RollingNumber } from '@/components/ui/RollingNumber'
import { OptionPills } from '@/components/item/OptionPills'
import { CoffeeCup, type CupMilk, type CupSize } from './CoffeeCup'

/** The lab configures a REAL menu item, so the cart line + price match the menu exactly. */
const LATTE = getItemBySlug('classic-latte')

const pills = (choices: { id: string; label: string; priceDelta: number }[] = []) =>
  choices.map((c) => ({ id: c.id, label: c.label, hint: c.priceDelta ? `+${formatPKR(c.priceDelta)}` : undefined }))

/** Coffee panel of the Build Studio (sits on oat): pick size / milk / hot-iced, watch the cup change, add the exact drink. */
export function CoffeeBuilder() {
  const [size, setSize] = useState<CupSize>('m')
  const [milk, setMilk] = useState<CupMilk>('regular')
  const [iced, setIced] = useState(false)
  const cup = useRef<HTMLDivElement>(null)
  const addToCart = useAddToCart()
  if (!LATTE) return null

  const selection: OptionSelection = { size, milk, temp: iced ? 'iced' : 'hot', extras: [] }
  const price = unitPriceFor(LATTE, selection)
  const add = () => addToCart(toCartInput(LATTE, selection), { source: cup.current })

  return (
    <div className="grid items-center gap-10 text-espresso md:grid-cols-2">
        <div ref={cup} className="relative mx-auto flex h-[300px] items-end justify-center md:h-[440px]">
          <span aria-hidden="true" className="absolute bottom-6 size-[85%] rounded-full bg-caramel/25 blur-2xl" />
          <div className="relative h-full" role="img" aria-label={`${iced ? 'Iced' : 'Hot'} latte, ${size === 's' ? 'small' : size === 'm' ? 'medium' : 'large'}, ${milk} milk`}>
            <CoffeeCup size={size} milk={milk} iced={iced} />
          </div>
        </div>

        <div>
          <div className="space-y-5">
            <OptionPills legend="Size" name="lab-size" options={pills(LATTE.options.sizes)} selected={[size]} onToggle={(id) => setSize(id as CupSize)} />
            <OptionPills legend="Milk" name="lab-milk" options={pills(LATTE.options.milks)} selected={[milk]} onToggle={(id) => setMilk(id as CupMilk)} />
            <div>
              <p id="lab-temp" className="mb-2 text-xs font-extrabold tracking-widest text-ink uppercase">Hot or iced</p>
              <button
                type="button"
                role="switch"
                aria-checked={iced}
                aria-labelledby="lab-temp"
                onClick={() => setIced((v) => !v)}
                className="relative inline-flex min-h-12 items-center rounded-full border-[2.5px] border-espresso bg-oat p-1 font-bold text-espresso shadow-hard-sm"
              >
                <span
                  aria-hidden="true"
                  className={cn('absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full transition-[translate,background-color] duration-300 ease-bouncy', iced ? 'translate-x-full bg-pickle' : 'translate-x-0 bg-chili')}
                />
                <span className="relative z-10 px-5">🔥 Hot</span>
                <span className="relative z-10 px-5">🧊 Iced {LATTE.options.temps?.[1]?.priceDelta ? `+${formatPKR(LATTE.options.temps[1].priceDelta)}` : ''}</span>
              </button>
            </div>
          </div>

          <Button size="lg" onClick={add} className="mt-8 w-full whitespace-nowrap sm:w-auto">
            Add to cart · <RollingNumber value={price} format={formatPKR} />
          </Button>
        </div>
    </div>
  )
}
