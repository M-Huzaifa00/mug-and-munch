import { Button } from '@/components/ui/Button'
import { Munchy } from '@/components/mascot/Munchy'

/** No search/filter results. */
export function MenuEmpty({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <Munchy mood="oops" label="Munchy looking confused" />
      <p className="font-display text-3xl font-extrabold text-espresso">Ye toh hamare paas nahi 😅</p>
      <p className="max-w-sm text-ink/80">
        {query ? <>Nothing matches “{query}”. </> : null}Try another word or clear the filters.
      </p>
      <Button variant="outline" size="md" onClick={onReset} className="mt-3">
        Clear search & filters
      </Button>
    </div>
  )
}
