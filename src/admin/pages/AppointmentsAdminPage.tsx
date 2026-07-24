import { useCallback, useState } from 'react'
import { api, type AdminBooking } from '../../lib/api'
import { fieldClass, Notice, PageHeader, Panel, PrimaryButton } from '../components/AdminUi'
import { useAdminResource } from '../hooks/useAdminResource'

export function AppointmentsAdminPage() {
  const loader = useCallback((token: string) => api.adminBookings(token), [])
  const { data = [], loading, error, setError, reload, token } = useAdminResource(loader)
  const [drafts, setDrafts] = useState<Record<string, { date: string; time: string }>>({})

  async function status(booking: AdminBooking, next: string) {
    if (!token) return
    try { await api.updateBookingStatus(token, booking.id, next); await reload() }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Update failed.') }
  }

  async function reschedule(booking: AdminBooking) {
    if (!token) return
    const draft = drafts[booking.id]
    if (!draft?.date || !draft.time) return setError('Choose a new date and time.')
    try { await api.rescheduleBooking(token, booking.id, draft.date, draft.time); await reload() }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Reschedule failed.') }
  }

  return (
    <>
      <PageHeader eyebrow="Appointments" title="Manage bookings" description="Approve, complete, reschedule or cancel customer appointments." />
      <div className="mt-8 space-y-4">
        {loading && <Notice>Loading appointments…</Notice>}
        {error && <Notice error>{error}</Notice>}
        {data?.map((booking) => (
          <Panel key={booking.id}>
            <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr_auto] xl:items-center">
              <div>
                <p className="font-serif text-xl text-[#3e2530]">{booking.user.name}</p>
                <p className="mt-1 text-sm text-[#806b74]">{booking.service.name} · {booking.user.phone}</p>
                <span className="mt-3 inline-flex rounded-full bg-[#f8e7ee] px-3 py-1 text-[10px] font-bold uppercase text-[#a52261]">{booking.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className={fieldClass} value={drafts[booking.id]?.date ?? booking.date.slice(0, 10)} onChange={(e) => setDrafts((all) => ({...all, [booking.id]: {date:e.target.value, time:all[booking.id]?.time ?? booking.timeSlot}}))} />
                <input type="time" className={fieldClass} value={drafts[booking.id]?.time ?? booking.timeSlot} onChange={(e) => setDrafts((all) => ({...all, [booking.id]: {date:all[booking.id]?.date ?? booking.date.slice(0,10), time:e.target.value}}))} />
                <button onClick={() => reschedule(booking)} className="col-span-2 text-left text-xs font-bold uppercase text-[#a52261]">Save new schedule</button>
              </div>
              <div className="flex flex-wrap gap-2 xl:max-w-40">
                <PrimaryButton onClick={() => status(booking, 'confirmed')}>Approve</PrimaryButton>
                <button onClick={() => status(booking, 'completed')} className="text-xs font-bold text-emerald-700">Complete</button>
                <button onClick={() => status(booking, 'cancelled')} className="text-xs font-bold text-red-600">Cancel</button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  )
}
