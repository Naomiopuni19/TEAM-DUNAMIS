import { useEffect, useState } from 'react'
import { api } from '../lib/api'

type BusinessInfo = {
  address: string
  phone: string
}

export function Footer() {
  const [info, setInfo] = useState<BusinessInfo | null>(null)

  useEffect(function () {
    let cancelled = false
    api.businessInfo().then(function (data) {
      if (!cancelled) setInfo(data)
    })
    return function () {
      cancelled = true
    }
  }, [])

  const socials = [
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@berylsbeautymark?_r=1&_t=ZS-98UfKBoOqmN',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/b_bmark',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.78.3-1.44.71-2.1 1.37C1.38 2.66 1 3.31.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.78.71 1.44 1.37 2.1.66.66 1.32 1.07 2.1 1.37.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.78-.3 1.44-.71 2.1-1.37.66-.66 1.07-1.32 1.37-2.1.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.78-.71-1.44-1.37-2.1C21.34 1.38 20.68 1 19.9.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/233591911212',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.134 1.585 5.939L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      ),
    },
    {
      label: 'Email',
      href: 'mailto:bbmark.abcp@gmail.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="bg-[#402231] text-[#fff8fb]">
      <section className="border-b border-white/10 px-6 py-14 sm:px-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f1a3c6]">
              Stay updated
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
              New arrivals, hair care notes and available appointment dates.
            </h2>
          </div>
          <form className="flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Email address"
              className="h-13 w-full flex-1 rounded-full border border-white/40 bg-white/20 px-5 text-sm text-white outline-none backdrop-blur-md placeholder:text-white/80 focus:border-[#dc2d83] focus:bg-white/25"
            />
            <button
              type="submit"
              className="h-13 shrink-0 rounded-full bg-[#dc2d83] px-8 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#b92068]"
            >
              Sign up
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-12 px-6 py-16 sm:px-10 lg:grid-cols-4 lg:gap-x-10 lg:px-12">
        <div className="col-span-2 lg:col-span-1">
          <h2 className="font-serif text-3xl uppercase tracking-[0.12em]">
            Beryl's
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">
            Quality raw hair, ready to wear wigs and professional salon services in Kumasi.
          </p>

          <div className="mt-6 flex items-center gap-3">
            {socials.map(function (item) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition hover:border-[#dc2d83] hover:bg-[#dc2d83] hover:text-white"
                >
                  {item.icon}
                </a>
              )
            })}
          </div>
        </div>

        <div>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#dc2d83]" />
          <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f1a3c6]">
            Visit
          </h3>
          <address className="mt-5 text-sm not-italic leading-8 text-white/60">
            {info ? info.address : 'Ayeduase Newsite, Kumasi, Ghana'}
            <br />
            By appointment only
          </address>
        </div>

        <nav>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#dc2d83]" />
          <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f1a3c6]">
            Explore
          </h3>
          <div className="mt-5 grid gap-3.5 text-sm text-white/60">
            <a href="#/shop" className="w-fit transition hover:text-white">Shop</a>
            <a href="#/services" className="w-fit transition hover:text-white">Services</a>
            <a href="#/appointments" className="w-fit transition hover:text-white">Appointments</a>
          </div>
        </nav>

        <nav className="col-span-2 lg:col-span-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#dc2d83]" />
          <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f1a3c6]">
            Information
          </h3>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3.5 text-sm text-white/60 lg:grid-cols-1">
            <a href="#/about" className="w-fit transition hover:text-white">About</a>
            <a href="#/reviews" className="w-fit transition hover:text-white">Reviews</a>
            <a href="#/privacy" className="w-fit transition hover:text-white">Privacy policy</a>
            <a href="#/faqs" className="w-fit transition hover:text-white">FAQs</a>
            <a href="#/terms" className="w-fit transition hover:text-white">Terms of service</a>
            <a href={info ? "tel:" + info.phone.replace(/\s/g, "") : "tel:0591911212"} className="w-fit transition hover:text-white">{info ? info.phone : "059 191 1212"}</a>
            <a
              href="#/staff-login"
              className="col-span-2 mt-3 w-fit border-t border-white/10 pt-4 font-semibold text-[#f1a3c6] transition hover:text-white lg:col-span-1"
            >
              Staff Portal
            </a>
          </div>
        </nav>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/40">
        &#169; 2026 Beryl's Beauty Mark. All rights reserved.
      </div>
    </footer>
  )
}
