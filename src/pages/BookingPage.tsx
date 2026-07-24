import { useMemo, useState } from 'react'
import { services } from '../data/catalog'

const times = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM']
const dates = [
  ['Mon', '28'],
  ['Tue', '29'],
  ['Wed', '30'],
  ['Thu', '31'],
  ['Fri', '01'],
]

export function BookingPage() {
  const serviceFromHash = new URLSearchParams(
    window.location.hash.split('?')[1],
  ).get('service')
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(
    services.find((service) => service.id === serviceFromHash)?.id ?? '',
  )
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const activeService = useMemo(
    () => services.find((service) => service.id === selectedService),
    [selectedService],
  )

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
            Choose your service and preferred time. We’ll confirm every detail
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
              <h2 className="font-serif text-3xl text-[#3e2530]">Select a service</h2>
              <p className="mt-2 text-sm text-[#745f68]">
                Prices shown are starting prices and may vary after consultation.
              </p>
              <div className="mt-7 grid gap-3 md:grid-cols-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service.id)}
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
                        {service.duration}
                      </span>
                    </span>
                    <span className="whitespace-nowrap text-sm font-bold text-[#b32269]">
                      GH₵{service.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-serif text-3xl text-[#3e2530]">Choose your time</h2>
              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {dates.map(([day, date]) => (
                  <button
                    key={`${day}-${date}`}
                    type="button"
                    onClick={() => setSelectedDate(`${day} ${date}`)}
                    className={`rounded-2xl border px-4 py-4 text-center transition ${
                      selectedDate === `${day} ${date}`
                        ? 'border-[#dc2d83] bg-[#dc2d83] text-white'
                        : 'border-[#ecd8e1] bg-white text-[#604c55]'
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-[0.12em]">{day}</span>
                    <span className="mt-1 block font-serif text-2xl">{date}</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {times.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
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
                <h2 className="font-serif text-3xl text-[#3e2530]">Your details</h2>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  {['Full name', 'Phone number', 'Email address'].map((label) => (
                    <label key={label} className={label === 'Email address' ? 'sm:col-span-2' : ''}>
                      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#765b67]">
                        {label}
                      </span>
                      <input className="h-13 w-full rounded-xl border border-[#dfbdcb] bg-white px-4 outline-none focus:border-[#dc2d83] focus:ring-4 focus:ring-[#dc2d83]/10" />
                    </label>
                  ))}
                </div>
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
                    <dd>{selectedDate || 'To be selected'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Time</dt>
                    <dd>{selectedTime || 'To be selected'}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-white/15 pt-3">
                    <dt>Starting at</dt>
                    <dd>GH₵{activeService?.price ?? '—'}</dd>
                  </div>
                </dl>
              </aside>
            </div>
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
                className="rounded-full bg-[#dc2d83] px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white"
              >
                Request booking
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
