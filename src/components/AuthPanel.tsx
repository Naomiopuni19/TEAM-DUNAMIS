import { useState, type FormEvent } from 'react'

type AuthPanelProps = {
  open: boolean
  onClose: () => void
}

export function AuthPanel({ open, onClose }: AuthPanelProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState('')

  if (!open) return null

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(
      mode === 'login'
        ? 'Welcome back. Your client area is ready.'
        : 'Your client profile has been created.',
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24131b]/60 px-5 py-10 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative w-full max-w-md rounded-[2rem] border border-[#e7b9cd] bg-[#f8d7e5] p-7 shadow-2xl sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close account panel"
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/45 text-2xl text-[#4d2838]"
        >
          ×
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d92c83]">
          Client account
        </p>
        <h2 id="auth-title" className="mt-3 font-serif text-4xl text-[#3e2530]">
          {mode === 'login' ? 'Welcome back' : 'Join the ritual'}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#765c68]">
          {mode === 'login'
            ? 'Access bookings, order history and saved services.'
            : 'Create your profile for faster bookings and personalised care.'}
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          {mode === 'signup' && (
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em]">
                Full name
              </span>
              <input required className="h-13 w-full rounded-xl border border-[#d99eb7] bg-white px-4 outline-none focus:border-[#d92c83]" />
            </label>
          )}
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em]">
              Email
            </span>
            <input required type="email" className="h-13 w-full rounded-xl border border-[#d99eb7] bg-white px-4 outline-none focus:border-[#d92c83]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em]">
              Password
            </span>
            <input required type="password" className="h-13 w-full rounded-xl border border-[#d99eb7] bg-white px-4 outline-none focus:border-[#d92c83]" />
          </label>
          <button
            type="submit"
            className="min-h-13 w-full rounded-full bg-[#d92c83] px-6 py-3 font-serif text-xl font-bold text-white transition hover:bg-[#b92068]"
          >
            {mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        {message && (
          <p className="mt-4 rounded-xl bg-white/50 px-4 py-3 text-sm text-[#6b4657]" role="status">
            {message}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login')
            setMessage('')
          }}
          className="mt-5 text-sm font-semibold text-[#9f205f] underline underline-offset-4"
        >
          {mode === 'login' ? 'Create a client account' : 'I already have an account'}
        </button>
      </section>
    </div>
  )
}
