import { useState } from 'react'
import { useAppData } from '../context/appData'
import type { Product } from '../data/catalog'
import { productImage } from '../data/catalog'
import { api } from '../lib/api'

type CartDrawerProps = {
  items: Product[]
  open: boolean
  onClose: () => void
  onRemove: (index: number) => void
  onRequireAuth: () => void
  onOrderComplete: () => void
}

export function CartDrawer({
  items,
  open,
  onClose,
  onRemove,
  onRequireAuth,
  onOrderComplete,
}: CartDrawerProps) {
  const { token, user } = useAppData()
  const [momoNumber, setMomoNumber] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  if (!open) return null

  const total = items.reduce((sum, item) => sum + item.price, 0)

  async function checkout() {
    if (!token) {
      setMessage('Sign in or create an account to complete checkout.')
      onRequireAuth()
      return
    }
    if (!momoNumber.trim()) {
      setMessage('Please enter a phone number to continue.')
      return
    }

    setBusy(true)
    setMessage('')
    try {
      const quantities = new Map<string, number>()
      items.forEach((item) =>
        quantities.set(item.id, (quantities.get(item.id) ?? 0) + 1),
      )
      const result = await api.createOrder(
        token,
        [...quantities].map(([productId, quantity]) => ({
          productId,
          quantity,
        })),
      )

      const payment = await api.initiatePayment(token, {
        type: 'order',
        refId: result.order.id,
        momoNumber: momoNumber.trim(),
      })

      onOrderComplete()
      window.location.href = payment.authorizationUrl
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Checkout failed.')
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#24131b]/55 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close shopping bag"
        onClick={onClose}
        className="absolute inset-0 h-full w-full"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#fffaf8] p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d92c83]">
              Your bag
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#3e2530]">Shopping bag</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5e1e9] text-2xl"
          >
            x
          </button>
        </div>

        <div className="mt-8 flex-1 space-y-5 overflow-y-auto">
          {items.length === 0 ? (
            <div className="rounded-2xl bg-[#f8e5ed] p-6 text-center">
              <p className="font-serif text-2xl text-[#3e2530]">Your bag is waiting.</p>
              <p className="mt-2 text-sm text-[#765c68]">
                Browse the shop and add a product when you are ready.
              </p>
            </div>
          ) : (
            items.map((item, index) => (
              <article key={`${item.id}-${index}`} className="flex gap-4 border-b border-[#ecd8e1] pb-5">
                <img
                  src={productImage(item)}
                  alt=""
                  className="h-24 w-20 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg text-[#3e2530]">{item.name}</p>
                  <p className="mt-2 text-sm font-semibold text-[#b32269]">
                    GHC {item.price.toLocaleString()}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="mt-2 text-xs text-[#816873] underline"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="border-t border-[#e7ccd7] pt-5">
          <div className="flex justify-between font-serif text-xl text-[#3e2530]">
            <span>Total</span>
            <span>GHC {total.toLocaleString()}</span>
          </div>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#765b67]">
              Phone number
            </span>
            <input
              type="tel"
              value={momoNumber}
              onChange={(event) => setMomoNumber(event.target.value)}
              placeholder={user?.phone ?? '024 000 0000'}
              className="h-12 w-full rounded-xl border border-[#dfbdcb] bg-white px-4 text-sm outline-none focus:border-[#dc2d83]"
            />
          </label>
          <button
            type="button"
            onClick={() => void checkout()}
            disabled={!items.length || busy}
            className="mt-5 min-h-13 w-full rounded-full bg-[#d92c83] px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white disabled:opacity-40"
          >
            {busy ? 'Redirecting to payment...' : 'Pay now'}
          </button>
          {message && (
            <p className="mt-3 text-sm leading-6 text-[#74485a]" role="status">
              {message}
            </p>
          )}
        </div>
      </aside>
    </div>
  )
}