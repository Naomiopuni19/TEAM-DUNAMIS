import { useCallback } from 'react'
import { api } from '../../lib/api'
import { fieldClass, Notice, PageHeader, Panel } from '../components/AdminUi'
import { useAdminResource } from '../hooks/useAdminResource'

export function OrdersAdminPage() {
  const loader = useCallback((token: string) => api.adminOrders(token), [])
  const { data = [], loading, error, setError, reload, token } = useAdminResource(loader)

  async function change(id: string, status: string) {
    if (!token) return
    try { await api.updateOrderStatus(token, id, status); await reload() }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to update order.') }
  }

  return (
    <>
      <PageHeader eyebrow="Orders" title="Customer orders" description="Review purchases, update their status and track fulfilment." />
      <div className="mt-8 space-y-4">
        {loading && <Notice>Loading orders…</Notice>}
        {error && <Notice error>{error}</Notice>}
        {data?.map((order) => (
          <Panel key={order.id}>
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-serif text-xl text-[#3e2530]">{order.user.name}</p>
                <p className="mt-1 text-xs text-[#806b74]">{order.user.phone} · Order {order.id.slice(0, 8)}</p>
                <p className="mt-3 text-sm">{order.items.map((item) => `${item.quantity}× ${item.name}`).join(', ')}</p>
                <p className="mt-3 font-semibold text-[#a52261]">GH₵{Number(order.totalAmount).toLocaleString()}</p>
              </div>
              <select aria-label="Order status" value={order.status} onChange={(event) => change(order.id, event.target.value)} className={`${fieldClass} md:w-48`}>
                <option value="pending_payment">Pending payment</option><option value="paid">Paid</option><option value="fulfilled">Fulfilled</option><option value="cancelled">Cancelled</option>
              </select>
            </div>
          </Panel>
        ))}
      </div>
    </>
  )
}
