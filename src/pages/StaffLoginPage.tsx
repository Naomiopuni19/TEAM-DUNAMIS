import { useState, type FormEvent } from 'react'
import { FiArrowLeft, FiLock } from 'react-icons/fi'
import { useAppData } from '../context/appData'

export function StaffLoginPage() {
  const { login, logout } = useAppData()
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    const form = new FormData(event.currentTarget)

    try {
      const user = await login(
        String(form.get('phone')),
        String(form.get('password')),
      )
      if (user.role !== 'admin') {
        logout()
        setMessage('This portal is restricted to authorised staff accounts.')
        return
      }
      window.location.hash = '#/dashboard'
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-[#2f1a24] px-5 py-14 sm:min-h-[calc(100vh-6rem)] sm:px-10 sm:py-20">
      <div className="absolute -left-24 top-20 -z-10 h-80 w-80 rounded-full bg-[#d92c83]/15 blur-3xl" />
      <div className="absolute -bottom-32 right-0 -z-10 h-96 w-96 rounded-full bg-[#f0a8c8]/10 blur-3xl" />

      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#fffaf8] shadow-[0_35px_90px_rgba(11,4,8,0.35)] lg:grid-cols-[0.85fr_1.15fr]">
        <section className="flex flex-col justify-between bg-[#4b2637] p-7 text-white sm:p-10 lg:p-12">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <FiLock aria-hidden="true" size={21} />
            </span>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.24em] text-[#f2a7c9]">
              Restricted access
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Beryl&apos;s staff portal
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/70 sm:text-base">
              This area is reserved for authorised administrators and salon
              staff. Customer account details cannot be used to sign in here.
            </p>
          </div>

          <a
            href="#/"
            className="mt-12 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#f2a7c9] transition hover:text-white"
          >
            <FiArrowLeft aria-hidden="true" />
            Return to website
          </a>
        </section>

        <section className="p-7 sm:p-10 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d92c83]">
            Administrator sign in
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[#3e2530]">
            Welcome back
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#745f68]">
            Enter the staff credentials issued by the salon administrator.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#604c55]">
                Staff phone number
              </span>
              <input
                required
                name="phone"
                type="tel"
                minLength={7}
                maxLength={20}
                autoComplete="username"
                placeholder="024 000 0000"
                className="h-14 w-full rounded-xl border border-[#dfb7c8] bg-white px-4 text-[#3e2530] outline-none placeholder:text-[#aa929c] focus:border-[#d92c83] focus:ring-4 focus:ring-[#d92c83]/10"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#604c55]">
                Password
              </span>
              <input
                required
                name="password"
                type="password"
                autoComplete="current-password"
                className="h-14 w-full rounded-xl border border-[#dfb7c8] bg-white px-4 text-[#3e2530] outline-none focus:border-[#d92c83] focus:ring-4 focus:ring-[#d92c83]/10"
              />
            </label>

            <div className="flex flex-col justify-between gap-3 text-sm sm:flex-row sm:items-center">
              <label className="inline-flex items-center gap-2 text-[#745f68]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#d4a8ba] accent-[#d92c83]"
                />
                Remember this device
              </label>
              <button
                type="button"
                className="w-fit font-semibold text-[#a32260] underline underline-offset-4"
              >
                Contact administrator
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="min-h-14 w-full rounded-full bg-[#d92c83] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#b92068] disabled:opacity-60"
            >
              {busy ? 'Signing in…' : 'Sign in securely'}
            </button>
          </form>

          {message && (
            <p
              role="status"
              className="mt-5 rounded-xl border border-[#e8c7d5] bg-[#f9e8ef] px-4 py-3 text-sm leading-6 text-[#70495a]"
            >
              {message}
            </p>
          )}

          <p className="mt-7 border-t border-[#ead4de] pt-5 text-xs leading-6 text-[#937b85]">
            Access is verified by the salon API. Customer accounts are rejected
            before the management dashboard is opened.
          </p>
        </section>
      </div>
    </main>
  )
}
