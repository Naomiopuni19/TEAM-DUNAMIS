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

    api
      .businessInfo()
      .then(function (data) {
        if (!cancelled) {
          setInfo(data)
        }
      })
      .catch(function () {
        if (!cancelled) {
          setInfo(null)
        }
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
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-[18px] w-[18px]"
          aria-hidden="true"
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
    },

    {
      label: 'Instagram',
      href: 'https://www.instagram.com/b_bmark',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-[18px] w-[18px]"
          aria-hidden="true"
        >
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.27-.06-1.65-.07-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.78.3-1.44.71-2.1 1.37C1.38 2.66 1 3.31.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.78.71 1.44 1.37 2.1.66.66 1.32 1.07 2.1 1.37.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.78-.3 1.44-.71 2.1-1.37.66-.66 1.07-1.32 1.37-2.1.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.3-.78-.71-1.44-1.37-2.1C21.34 1.38 20.68 1 19.9.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
        </svg>
      ),
    },

    {
      label: 'WhatsApp',
      href: 'https://wa.me/233591911212',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-[18px] w-[18px]"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.134 1.585 5.939L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      ),
    },

    {
      label: 'Email',
      href: 'mailto:bbmark.abcp@gmail.com',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-[18px] w-[18px]"
          aria-hidden="true"
        >
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="relative overflow-hidden bg-[#3e2530] text-[#fffaf8]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#dc2d83]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#f5b0d0]/10 blur-3xl" />

      <div className="relative">
        {/* =====================================================
            NEWSLETTER
        ====================================================== */}
        <section className="border-b border-white/10 px-5 py-12 sm:px-8 sm:py-14 lg:px-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#f5b0d0]">
                Stay in the Luxe Circle
              </p>

              <h2 className="mt-3 font-serif text-[2rem] leading-tight sm:text-4xl">
                Beauty updates,
                <span className="italic text-[#f5b0d0]">
                  {' '}
                  exclusive offers.
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
                Be the first to know about new arrivals, beauty tips,
                exclusive offers and available appointment dates.
              </p>
            </div>

            <form
              onSubmit={function (event) {
                event.preventDefault()
              }}
              className="w-full max-w-xl"
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address
              </label>

              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="h-[60px] min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.08] px-5 text-sm text-white outline-none placeholder:text-white/35 backdrop-blur-md transition focus:border-[#f5b0d0] focus:bg-white/[0.12] sm:rounded-full sm:px-6"
                />

                <button
                  type="submit"
                  className="h-[60px] w-full rounded-2xl bg-[#dc2d83] px-8 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#c32672] hover:shadow-[0_15px_40px_-15px_rgba(220,45,131,0.8)] sm:w-auto sm:min-w-[135px] sm:rounded-full"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}

        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-16">

          {/* BRAND */}
          <div className="border-b border-white/10 pb-10">
            <a href="#" className="group inline-block">
              <div className="font-serif text-[2.4rem] italic leading-[0.9] text-white transition group-hover:text-[#f5b0d0] sm:text-4xl">
                Beryl's <span className="font-bold">Beauty</span> Mark
              </div>

              <p className="mt-3 text-[7px] font-bold uppercase tracking-[0.3em] text-[#f5b0d0]">
                Hair â€¢ Beauty â€¢ Luxury
              </p>
            </a>

            <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-sm leading-7 text-white/55">
                Premium raw hair, ready-to-wear wigs and professional beauty
                services created to help you look and feel your best.
              </p>

              <div className="flex gap-3">
                {socials.map(function (item) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition duration-300 hover:-translate-y-1 hover:border-[#dc2d83] hover:bg-[#dc2d83] hover:text-white"
                    >
                      {item.icon}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* =====================================================
              SHOP / SERVICES / INFORMATION
              SIDE BY SIDE ON MOBILE
          ====================================================== */}

          <div className="grid grid-cols-3 gap-3 pt-10 sm:gap-8 md:grid-cols-3 lg:grid-cols-3">

            {/* SHOP */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#dc2d83]" />

                <h3 className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#f5b0d0] sm:text-[9px] sm:tracking-[0.22em]">
                  Shop
                </h3>
              </div>

              <div className="mt-5 grid gap-3 text-[11px] leading-5 text-white/55 sm:text-sm">
                <a
                  href="#/shop"
                  className="transition hover:text-white"
                >
                  New Arrivals
                </a>

                <a
                  href="#/shop"
                  className="transition hover:text-white"
                >
                  Wigs
                </a>

                <a
                  href="#/shop"
                  className="transition hover:text-white"
                >
                  Bundles
                </a>

                <a
                  href="#/shop"
                  className="transition hover:text-white"
                >
                  Closures & Frontals
                </a>

                <a
                  href="#/shop"
                  className="transition hover:text-white"
                >
                  Hair Care
                </a>

                <a
                  href="#/shop"
                  className="transition hover:text-white"
                >
                  Best Sellers
                </a>
              </div>
            </div>

            {/* SERVICES */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#dc2d83]" />

                <h3 className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#f5b0d0] sm:text-[9px] sm:tracking-[0.22em]">
                  Services
                </h3>
              </div>

              <div className="mt-5 grid gap-3 text-[11px] leading-5 text-white/55 sm:text-sm">
                <a
                  href="#/services"
                  className="transition hover:text-white"
                >
                  Hair Styling
                </a>

                <a
                  href="#/services"
                  className="transition hover:text-white"
                >
                  Braiding
                </a>

                <a
                  href="#/services"
                  className="transition hover:text-white"
                >
                  Makeup
                </a>

                <a
                  href="#/services"
                  className="transition hover:text-white"
                >
                  Lashes
                </a>

                <a
                  href="#/services"
                  className="transition hover:text-white"
                >
                  Nails
                </a>

                <a
                  href="#/appointments"
                  className="font-semibold text-[#f5b0d0] transition hover:text-white"
                >
                  Book Now &#8594;
                </a>
              </div>
            </div>

            {/* INFORMATION */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#dc2d83]" />

                <h3 className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#f5b0d0] sm:text-[9px] sm:tracking-[0.22em]">
                  Information
                </h3>
              </div>

              <div className="mt-5 grid gap-3 text-[11px] leading-5 text-white/55 sm:text-sm">
                <a
                  href="#/about"
                  className="transition hover:text-white"
                >
                  About Us
                </a>

                <a
                  href="#/reviews"
                  className="transition hover:text-white"
                >
                  Reviews
                </a>

                <a
                  href="#/faq"
                  className="transition hover:text-white"
                >
                  FAQs
                </a>

                <a
                  href="#/delivery"
                  className="transition hover:text-white"
                >
                  Delivery
                </a>

                <a
                  href="#/privacy"
                  className="transition hover:text-white"
                >
                  Privacy Policy
                </a>

                <a
                  href="#/terms"
                  className="transition hover:text-white"
                >
                  Terms
                </a>

                <a
                  href="#/staff-login"
                  className="font-semibold text-[#f5b0d0] transition hover:text-white"
                >
                  Staff Portal â†’
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CONTACT INFORMATION
        ====================================================== */}

        <div className="border-y border-white/10">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-5 py-6 sm:px-8 md:grid-cols-3 lg:px-12">

            {/* ADDRESS */}
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-4 md:border-0 md:bg-transparent md:p-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#f5b0d0]">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#f5b0d0]">
                  Visit us
                </p>

                <p className="mt-1 text-xs leading-5 text-white/55">
                  {info?.address || 'Ayeduase Newsite, Kumasi, Ghana'}
                </p>
              </div>
            </div>

            {/* PHONE */}
            <a
              href={
                info?.phone
                  ? `tel:${info.phone.replace(/\s/g, '')}`
                  : 'tel:0591911212'
              }
              className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-4 transition hover:text-white md:border-0 md:bg-transparent md:p-0"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#f5b0d0]">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#f5b0d0]">
                  Call us
                </p>

                <p className="mt-1 text-xs text-white/55">
                  {info?.phone || '059 191 1212'}
                </p>
              </div>
            </a>

            {/* EMAIL */}
            <a
              href="mailto:bbmark.abcp@gmail.com"
              className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-4 transition hover:text-white md:border-0 md:bg-transparent md:p-0"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#f5b0d0]">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#f5b0d0]">
                  Email us
                </p>

                <p className="mt-1 text-[12px] leading-5 text-white/60">
                  bbmark.abcp@gmail.com
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BAR
        ====================================================== */}

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left lg:px-12">
          <p className="text-[10px] leading-5 text-white/35">
            Â© 2026 Beryl's Beauty Mark. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] text-white/35 md:justify-end">
            <a
              href="#/privacy"
              className="transition hover:text-[#f5b0d0]"
            >
              Privacy
            </a>

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <a
              href="#/terms"
              className="transition hover:text-[#f5b0d0]"
            >
              Terms
            </a>

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <a
              href="#"
              className="transition hover:text-[#f5b0d0]"
            >
              Back to top â†‘
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}