import { WRAP_BUILDER, type WrapFillingId } from '@/data/toys'
import type { AddItemInput } from '@/store/cart'
import { builderLabels, builderPrice } from './builder'

const ING = WRAP_BUILDER.ingredients

export const wrapPrice = (fillings: WrapFillingId[]) => builderPrice(WRAP_BUILDER.basePrice, ING, fillings)

/** Custom wrap cart line (same fillings in any order merge into one line). */
export function wrapToCartInput(fillings: WrapFillingId[]): AddItemInput {
  return {
    itemId: 'custom-wrap',
    slug: 'build-your-wrap',
    name: 'Your Custom Wrap',
    image: WRAP_BUILDER.image,
    emoji: '🌯',
    category: 'wrap',
    unitPrice: wrapPrice(fillings),
    options: { extras: fillings },
    optionLabels: builderLabels(ING, fillings),
    isCustom: true,
  }
}
