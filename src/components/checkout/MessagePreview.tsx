/** DEV-only stand-in for wa.me while the number is a placeholder: shows exactly what would be sent. */
export function MessagePreview({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <section aria-labelledby="wa-preview-title" className="mt-6 rounded-3xl border-[2.5px] border-dashed border-espresso bg-oat p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 id="wa-preview-title" className="font-display text-lg font-extrabold text-espresso">
          DEV preview: WhatsApp message (not sent)
        </h2>
        <button type="button" onClick={onClose} className="min-h-11 rounded-full px-3 font-bold text-espresso underline">
          Close
        </button>
      </div>
      <pre data-wa-preview className="mt-3 overflow-x-auto font-sans text-sm whitespace-pre-wrap text-ink">
        {text}
      </pre>
    </section>
  )
}
