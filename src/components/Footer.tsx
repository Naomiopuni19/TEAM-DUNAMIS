export function Footer() {
  return (
    <footer className="bg-[#402231] text-[#fff8fb]">
      <section className="border-b border-white/15 px-6 py-14 sm:px-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f1a3c6]">
              Stay updated
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
              New arrivals, hair-care notes and available appointment dates.
            </h2>
          </div>
          <form className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Email address"
              className="h-13 min-w-0 flex-1 rounded-full border border-white/30 bg-white/10 px-5 text-sm text-white outline-none placeholder:text-white/55 focus:border-[#f1a3c6]"
            />
            <button
              type="submit"
              className="h-13 rounded-full bg-[#dc2d83] px-7 text-xs font-bold uppercase tracking-[0.14em] text-white"
            >
              Sign up
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-12">
        <div>
          <h2 className="font-serif text-3xl uppercase tracking-[0.12em]">
            Beryl&apos;s
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">
            Quality raw hair, ready-to-wear wigs and professional salon services
            in Kumasi.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#f1a3c6]">
            Visit
          </h3>
          <address className="mt-4 text-sm not-italic leading-7 text-white/65">
            Ayeduase Newsite
            <br />
            Kumasi, Ghana
            <br />
            By appointment only
          </address>
        </div>
        <nav>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#f1a3c6]">
            Explore
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-white/65">
            <a href="#/shop" className="hover:text-white">Shop</a>
            <a href="#/services" className="hover:text-white">Services</a>
            <a href="#/appointments" className="hover:text-white">Appointments</a>
          </div>
        </nav>
        <nav>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#f1a3c6]">
            Information
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-white/65">
            <a href="#/about" className="hover:text-white">About</a>
            <a href="#/privacy" className="hover:text-white">Privacy policy</a>
            <a href="#/faqs" className="hover:text-white">FAQs</a>
            <a href="#/terms" className="hover:text-white">Terms of service</a>
            <a href="tel:0591911212" className="hover:text-white">059 191 1212</a>
            <a
              href="#/staff-login"
              className="mt-2 border-t border-white/10 pt-4 font-semibold text-[#f1a3c6] hover:text-white"
            >
              Staff Portal
            </a>
          </div>
        </nav>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/45">
        © 2026 Beryl&apos;s Beauty Mark. All rights reserved.
      </div>
    </footer>
  )
}
