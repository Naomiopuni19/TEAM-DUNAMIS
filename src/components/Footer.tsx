export function Footer() {
  return (
    <footer className="bg-[#402231] text-[#fff8fb]">
      <section className="border-b border-white/10 px-6 py-14 sm:px-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f1a3c6]">
              Stay updated
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
              New arrivals, hair-care notes and available appointment dates.
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
              className="h-13 w-full flex-1 rounded-full border border-white/25 bg-white/10 px-5 text-sm text-white outline-none backdrop-blur-md placeholder:text-white/60 focus:border-[#d6b56e] focus:bg-white/15"
            />
            <button
              type="submit"
              className="h-13 shrink-0 rounded-full bg-[#dc2d83] px-8 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#ef4d9a]"
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
            Quality raw hair, ready-to-wear wigs and professional salon services in Kumasi.
          </p>
        </div>

        <div>
          <p className="h-px w-8 bg-[#d6b56e]" />
          <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f1a3c6]">
            Visit
          </h3>
          <address className="mt-5 text-sm not-italic leading-8 text-white/60">
            Ayeduase Newsite
            <br />
            Kumasi, Ghana
            <br />
            By appointment only
          </address>
        </div>

        <nav>
          <p className="h-px w-8 bg-[#d6b56e]" />
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
          <p className="h-px w-8 bg-[#d6b56e]" />
          <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f1a3c6]">
            Information
          </h3>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3.5 text-sm text-white/60 lg:grid-cols-1">
            <a href="#/about" className="w-fit transition hover:text-white">About</a>
            <a href="#/reviews" className="w-fit transition hover:text-white">Reviews</a>
            <a href="#/privacy" className="w-fit transition hover:text-white">Privacy policy</a>
            <a href="#/faqs" className="w-fit transition hover:text-white">FAQs</a>
            <a href="#/terms" className="w-fit transition hover:text-white">Terms of service</a>
            <a href="tel:0591911212" className="w-fit transition hover:text-white">059 191 1212</a>
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
        (c) 2026 Beryl's Beauty Mark. All rights reserved.
      </div>
    </footer>
  )
}