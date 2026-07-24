import type { ReactNode } from 'react'

export const fieldClass =
  'h-11 w-full rounded-xl border border-[#dfcbd4] bg-white px-3 text-sm text-[#3e2530] outline-none focus:border-[#d92c83] focus:ring-4 focus:ring-[#d92c83]/10'

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d92c83]">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[#3e2530] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#806b74]">
          {description}
        </p>
      </div>
      {action}
    </header>
  )
}

export function Panel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl border border-[#ead7df] bg-white p-5 shadow-[0_12px_35px_rgba(71,32,50,0.04)] sm:p-6 ${className}`}
    >
      {children}
    </section>
  )
}

export function Notice({
  children,
  error = false,
}: {
  children: ReactNode
  error?: boolean
}) {
  return (
    <p
      role="status"
      className={`rounded-xl px-4 py-3 text-sm ${
        error ? 'bg-red-50 text-red-700' : 'bg-[#f8e7ee] text-[#7a4259]'
      }`}
    >
      {children}
    </p>
  )
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-full bg-[#d92c83] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#b92068] disabled:opacity-50 ${props.className ?? ''}`}
    >
      {children}
    </button>
  )
}
