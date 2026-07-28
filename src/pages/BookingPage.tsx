import { useMemo, useState } from 'react'
import { useAppData } from '../context/appData'
import { formatDuration } from '../data/catalog'
import { api, type Availability } from '../lib/api'

const times = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM']

type BookingPageProps = {
  onRequireAuth: () => void
}

export function BookingPage({ onRequireAuth }: BookingPageProps) {
  const { services, catalogLoading, catalogError, token, user } = useAppData()
  const serviceFromHash = new URLSearchParams(
    window.location.hash.split('?')[1],
  ).get('service')
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(serviceFromHash ?? '')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [momoNumber, setMomoNumber] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const dates = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() + index + 1)
        return {
          iso: date.toISOString().slice(0, 10),
          day: date.toLocaleDateString('en-GB', { weekday: 'short' }),
          date: date.toLocaleDateString('en-GB', { day: '2-digit' }),
        }
      }),
    [],
  )

  const activeService = useMemo(
    () => services.find((service) => service.id === selectedService),
    [selectedService, services],
  )

  async function chooseDate(date: string) {
    setSelectedDate(date)
    setSelectedTime('')
    setAvailability(null)
    setMessage('')
    if (!selectedService) return

    try {
      setAvailability(await api.availability(selectedService, date))
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to check availability.',
      )
    }
  }

  async function requestBooking() {
    if (!token) {
      setMessage('Sign in or create a client account to complete your booking.')
      onRequireAuth()
      return
    }

    setBusy(true)
    setMessage('')
    try {
      const result = await api.createBooking(token, {
        serviceId: selectedService,
        date: selectedDate,
        timeSlot: selectedTime,
      })

      if (momoNumber.trim()) {
        const payment = await api.initiatePayment(token, {
          type: 'booking',
          refId: result.booking.id,
          momoNumber: momoNumber.trim(),
        })
        window.location.href = payment.authorizationUrl
        return
      }
      setMessage('Your booking request was submitted. You can pay online from your account, or in the studio.')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to request this booking.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-[760px] bg-[#f9e8ef] px-5 py-12 sm:px-10 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d92c83]">
            Reserve your time
          </p>
          <h1 className="mt-4 font-serif text-[42px] leading-tight text-[#3e2530] sm:text-6xl">
            Book an appointment
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#745f68]">
            Choose your service and preferred time. Weâ€™ll confirm every detail
            before your visit.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  step >= item
                    ? 'bg-[#dc2d83] text-white'
                    : 'border border-[#d9aabd] bg-white text-[#8f707d]'
                }`}
              >
                {item}
              </span>
              {item < 3 && (
                <span
                  className={`h-px w-12 sm:w-24 ${
                    step > item ? 'bg-[#dc2d83]' : 'bg-[#d9aabd]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <section className="mt-9 rounded-[1.75rem] border border-[#ebc8d7] bg-[#fffaf8] p-5 shadow-[0_20px_55px_rgba(80,34,54,0.08)] sm:mt-10 sm:rounded-[2rem] sm:p-10">
          {step === 1 && (
            <div>
              <h2 className="font-serif text-3xl text-[#3e2530]">
                Select a service
              </h2>
              <p className="mt-2 text-sm text-[#745f68]">
                Prices are supplied by the salon and shown as a range.
              </p>
              {catalogLoading && <p className="mt-7">Loading servicesâ€¦</p>}
              {catalogError && (
                <p className="mt-7 text-[#8b435f]">{catalogError}</p>
              )}
              <div className="mt-7 grid gap-3 md:grid-cols-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setSelectedService(service.id)
                      setSelectedDate('')
                      setSelectedTime('')
                      setAvailability(null)
                    }}
                    className={`flex items-start justify-between gap-4 rounded-2xl border p-5 text-left transition ${
                      selectedService === service.id
                        ? 'border-[#dc2d83] bg-[#fbe0eb] shadow-sm'
                        : 'border-[#ecd8e1] bg-white hover:border-[#dc2d83]'
                    }`}
                  >
                    <span>
                      <span className="block font-serif text-lg text-[#3e2530]">
                        {service.name}
                      </span>
                      <span className="mt-1 block text-xs text-[#8f707d]">
                        {service.category.name} Â·{' '}
                        {formatDuration(service.durationMinutes)}
                      </span>
                    </span>
                    <span className="whitespace-nowrap text-sm font-bold text-[#b32269]">
                      GHâ‚µ{service.priceMin.toLocaleString()}â€“
                      {service.priceMax.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-serif text-3xl text-[#3e2530]">
                Choose your time
              </h2>
              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {dates.map((date) => (
                  <button
                    key={date.iso}
                    type="button"
                    onClick={() => void chooseDate(date.iso)}
                    className={`rounded-2xl border px-4 py-4 text-center transition ${
                      selectedDate === date.iso
                        ? 'border-[#dc2d83] bg-[#dc2d83] text-white'
                        : 'border-[#ecd8e1] bg-white text-[#604c55]'
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-[0.12em]">
                      {date.day}
                    </span>
                    <span className="mt-1 block font-serif text-2xl">
                      {date.date}
                    </span>
                  </button>
                ))}
              </div>
              {availability && (
                <p className="mt-5 text-sm text-[#745f68]">
                  {availability.available
                    ? `${availability.slotsRemaining} booking spaces remain for this service category.`
                    : 'This service category is fully booked for the selected date.'}
                </p>
              )}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {times.map((time) => (
                  <button
                    key={time}
                    type="button"
                    disabled={!availability?.available}
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-full border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      selectedTime === time
                        ? 'border-[#dc2d83] bg-[#fbe0eb] text-[#a51e61]'
                        : 'border-[#e5cbd6] bg-white text-[#604c55]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <h2 className="font-serif text-3xl text-[#3e2530]">
                  Confirm your booking
                </h2>
                {user ? (
                  <div className="mt-7 rounded-2xl border border-[#e6c5d3] bg-white p-5">
                    <p className="font-semibold text-[#3e2530]">{user.name}</p>
                    <p className="mt-1 text-sm text-[#745f68]">{user.phone}</p>
                  </div>
                ) : (
                  <p className="mt-7 rounded-2xl bg-[#f7e4ec] p-5 text-sm leading-7 text-[#745f68]">
                    Youâ€™ll be asked to sign in before the request is submitted.
                  </p>
                )}
                <label className="mt-5 block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#765b67]">
                    Mobile Money number (optional)
                  </span>
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={(event) => setMomoNumber(event.target.value)}
                    placeholder={user?.phone ?? '024 000 0000'}
                    className="h-13 w-full rounded-xl border border-[#dfbdcb] bg-white px-4 outline-none focus:border-[#dc2d83] focus:ring-4 focus:ring-[#dc2d83]/10"
                  />
                </label>
              </div>
              <aside className="rounded-2xl bg-[#4b2637] p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f2a7c9]">
                  Booking summary
                </p>
                <h3 className="mt-4 font-serif text-2xl">
                  {activeService?.name ?? 'Your service'}
                </h3>
                <dl className="mt-5 space-y-3 text-sm text-white/75">
                  <div className="flex justify-between gap-4">
                    <dt>Date</dt>
                    <dd>{selectedDate}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Time</dt>
                    <dd>{selectedTime}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-white/15 pt-3">
                    <dt>Price range</dt>
                    <dd>
                      GHâ‚µ{activeService?.priceMin.toLocaleString()}â€“
                      {activeService?.priceMax.toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>
          )}

          {message && (
            <p
              role="status"
              className="mt-6 rounded-xl bg-[#f7e4ec] px-4 py-3 text-sm text-[#74485a]"
            >
              {message}
            </p>
          )}

          <div className="mt-9 flex items-center justify-between border-t border-[#ecd8e1] pt-6">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              disabled={step === 1}
              className="text-sm font-bold text-[#725761] disabled:opacity-30"
            >
              Back
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((current) => Math.min(3, current + 1))}
                disabled={
                  (step === 1 && !selectedService) ||
                  (step === 2 && (!selectedDate || !selectedTime))
                }
                className="rounded-full bg-[#dc2d83] px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void requestBooking()}
                disabled={busy}
                className="rounded-full bg-[#dc2d83] px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
              >
                {busy ? 'Submittingâ€¦' : 'Request booking'}
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
