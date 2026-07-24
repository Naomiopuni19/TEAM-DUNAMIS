import { useEffect, useState, type FormEvent } from 'react'
import { useAppData } from '../context/appData'
import {
  api,
  type CustomerBooking,
  type CustomerOrder,
} from '../lib/api'

type AccountPageProps = {
  onRequireAuth: () => void
}

const tabs = [
  ['profile', 'Profile'],
  ['bookings', 'Appointments'],
  ['orders', 'Orders'],
  ['security', 'Security'],
] as const

export function AccountPage({ onRequireAuth }: AccountPageProps) {
  const {
    authLoading,
    changePassword,
    token,
    updateProfile,
    user,
  } = useAppData()
  const requestedTab =
    new URLSearchParams(window.location.hash.split('?')[1]).get('tab') ?? 'profile'
  const activeTab = tabs.some(([value]) => value === requestedTab)
    ? requestedTab
    : 'profile'
  const [bookings, setBookings] = useState<CustomerBooking[]>([])
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [recordsLoading, setRecordsLoading] = useState(() => Boolean(token))
  const [recordsError, setRecordsError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!token) return
    Promise.all([api.myBookings(token), api.myOrders(token)])
      .then(([nextBookings, nextOrders]) => {
        setBookings(nextBookings)
        setOrders(nextOrders)
      })
      .catch((error: unknown) =>
        setRecordsError(
          error instanceof Error ? error.message : 'Unable to load your account.',
        ),
      )
      .finally(() => setRecordsLoading(false))
  }, [token])

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    const form = new FormData(event.currentTarget)
    try {
      await updateProfile(String(form.get('name')), String(form.get('phone')))
      setMessage('Your profile has been updated.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Update failed.')
    } finally {
      setBusy(false)
    }
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    const form = new FormData(event.currentTarget)
    const nextPassword = String(form.get('newPassword'))
    const confirmation = String(form.get('confirmPassword'))
    if (nextPassword !== confirmation) {
      setMessage('The new passwords do not match.')
      setBusy(false)
      return
    }

    try {
      const result = await changePassword(
        String(form.get('currentPassword')),
        nextPassword,
      )
      event.currentTarget.reset()
      setMessage(result)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Password update failed.')
    } finally {
      setBusy(false)
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-[620px] bg-[#fffaf8] px-6 py-20 text-center">
        <p>Checking your account…</p>
      </main>
    )
  }

  if (!token || !user) {
    return (
      <main className="flex min-h-[620px] items-center bg-[#fffaf8] px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d92c83]">
            Client account
          </p>
          <h1 className="mt-4 font-serif text-5xl text-[#3e2530]">
            Sign in to continue
          </h1>
          <p className="mt-5 text-base leading-8 text-[#745f68]">
            View your appointments, orders and account settings after signing in.
          </p>
          <button
            type="button"
            onClick={onRequireAuth}
            className="mt-8 rounded-full bg-[#dc2d83] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white"
          >
            Sign in or register
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[720px] bg-[#fffaf8] px-5 py-12 sm:px-10 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d92c83]">
            Client account
          </p>
          <h1 className="mt-3 font-serif text-5xl text-[#3e2530]">
            Welcome, {user.name.split(' ')[0]}
          </h1>
          <p className="mt-3 text-sm text-[#745f68]">
            Manage your details and review your activity.
          </p>
        </div>

        <div className="mt-9 grid gap-8 lg:grid-cols-[240px_1fr]">
          <nav
            aria-label="Account sections"
            className="flex gap-2 overflow-x-auto lg:flex-col"
          >
            {tabs.map(([value, label]) => (
              <a
                key={value}
                href={`#/account?tab=${value}`}
                className={`shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  activeTab === value
                    ? 'bg-[#4b2637] text-white'
                    : 'border border-[#ead4de] bg-white text-[#604c55] hover:border-[#d92c83]'
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          <section className="rounded-[1.75rem] border border-[#ead4de] bg-white p-6 shadow-[0_16px_50px_rgba(76,35,53,0.06)] sm:p-9">
            {activeTab === 'profile' && (
              <>
                <h2 className="font-serif text-3xl text-[#3e2530]">
                  Profile details
                </h2>
                <form onSubmit={saveProfile} className="mt-7 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em]">
                      Full name
                    </span>
                    <input
                      required
                      name="name"
                      minLength={2}
                      defaultValue={user.name}
                      autoComplete="name"
                      className="h-13 w-full rounded-xl border border-[#dfbdcb] px-4 outline-none focus:border-[#dc2d83]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em]">
                      Phone number
                    </span>
                    <input
                      required
                      name="phone"
                      type="tel"
                      minLength={7}
                      maxLength={20}
                      defaultValue={user.phone}
                      autoComplete="tel"
                      className="h-13 w-full rounded-xl border border-[#dfbdcb] px-4 outline-none focus:border-[#dc2d83]"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-fit rounded-full bg-[#dc2d83] px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50 sm:col-span-2"
                  >
                    {busy ? 'Saving…' : 'Save changes'}
                  </button>
                </form>
              </>
            )}

            {activeTab === 'bookings' && (
              <>
                <h2 className="font-serif text-3xl text-[#3e2530]">
                  My appointments
                </h2>
                <div className="mt-7 space-y-4">
                  {recordsLoading ? (
                    <p>Loading appointments…</p>
                  ) : bookings.length ? (
                    bookings.map((booking) => (
                      <article
                        key={booking.id}
                        className="grid gap-3 rounded-2xl bg-[#fff6f9] p-5 sm:grid-cols-[1fr_auto] sm:items-center"
                      >
                        <div>
                          <h3 className="font-serif text-xl text-[#3e2530]">
                            {booking.serviceName}
                          </h3>
                          <p className="mt-2 text-sm text-[#745f68]">
                            {new Date(booking.date).toLocaleDateString()} ·{' '}
                            {booking.timeSlot}
                          </p>
                        </div>
                        <span className="w-fit rounded-full bg-[#f5d5e3] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#a82061]">
                          {booking.status}
                        </span>
                      </article>
                    ))
                  ) : (
                    <p className="text-sm text-[#745f68]">
                      You have no appointments yet.
                    </p>
                  )}
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <>
                <h2 className="font-serif text-3xl text-[#3e2530]">My orders</h2>
                <div className="mt-7 space-y-4">
                  {recordsLoading ? (
                    <p>Loading orders…</p>
                  ) : orders.length ? (
                    orders.map((order) => (
                      <article
                        key={order.id}
                        className="rounded-2xl border border-[#eadbe1] p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-[#937781]">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="mt-1 font-serif text-xl text-[#3e2530]">
                              GH₵{Number(order.totalAmount).toLocaleString()}
                            </p>
                          </div>
                          <span className="rounded-full bg-[#f5d5e3] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#a82061]">
                            {order.status.replaceAll('_', ' ')}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-[#745f68]">
                          {order.items
                            .map((item) => `${item.quantity} × ${item.name}`)
                            .join(', ')}
                        </p>
                      </article>
                    ))
                  ) : (
                    <p className="text-sm text-[#745f68]">
                      You have no orders yet.
                    </p>
                  )}
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <h2 className="font-serif text-3xl text-[#3e2530]">
                  Change password
                </h2>
                <form onSubmit={savePassword} className="mt-7 max-w-xl space-y-5">
                  {[
                    ['currentPassword', 'Current password'],
                    ['newPassword', 'New password'],
                    ['confirmPassword', 'Confirm new password'],
                  ].map(([name, label]) => (
                    <label key={name} className="block">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em]">
                        {label}
                      </span>
                      <input
                        required
                        name={name}
                        type="password"
                        minLength={6}
                        autoComplete={
                          name === 'currentPassword'
                            ? 'current-password'
                            : 'new-password'
                        }
                        className="h-13 w-full rounded-xl border border-[#dfbdcb] px-4 outline-none focus:border-[#dc2d83]"
                      />
                    </label>
                  ))}
                  <button
                    type="submit"
                    disabled={busy}
                    className="rounded-full bg-[#dc2d83] px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
                  >
                    {busy ? 'Updating…' : 'Update password'}
                  </button>
                </form>
              </>
            )}

            {(message || recordsError) && (
              <p
                role="status"
                className="mt-6 rounded-xl bg-[#f8e7ee] px-4 py-3 text-sm text-[#7a4258]"
              >
                {message || recordsError}
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
