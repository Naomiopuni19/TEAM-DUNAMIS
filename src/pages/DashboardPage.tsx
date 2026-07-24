import { products } from '../data/catalog'

export function DashboardPage() {
  return (
    <main className="min-h-[760px] bg-[#fffaf8] px-5 py-10 sm:px-10 sm:py-12 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d92c83]">
              Dashboard overview
            </p>
            <h1 className="mt-3 font-serif text-[42px] leading-tight text-[#3e2530] sm:text-5xl">
              Today&apos;s soirée
            </h1>
            <p className="mt-3 text-sm text-[#745f68]">
              Monday, October 14 · 3 appointments scheduled
            </p>
          </div>
          <a
            href="#/appointments"
            className="w-fit rounded-full bg-[#dc2d83] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white"
          >
            Quick booking
          </a>
        </div>

        <div className="mt-9 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {[
            ['Appointments', '03', '1 awaiting confirmation'],
            ['Orders', '12', '4 ready for dispatch'],
            ['Revenue', 'GH₵8.4k', 'Today so far'],
            ['Low stock', '02', 'Products need attention'],
          ].map(([label, value, note]) => (
            <article key={label} className="rounded-2xl border border-[#ecd8e1] bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#956f80]">
                {label}
              </p>
              <p className="mt-3 font-serif text-4xl text-[#d92c83]">{value}</p>
              <p className="mt-2 text-xs text-[#8c747e]">{note}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[1.75rem] border border-[#ecd8e1] bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl text-[#3e2530]">Today&apos;s timeline</h2>
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#d92c83]">
                Live
              </span>
            </div>
            <div className="mt-7 space-y-4">
              {[
                ['09:00', 'Helena V.', 'Frontal install', 'Confirmed'],
                ['12:30', 'Adwoa K.', 'Knotless box braids', 'In salon'],
                ['03:30', 'Miriam E.', 'Wash & steam', 'Pending'],
              ].map(([time, name, service, status]) => (
                <div
                  key={`${time}-${name}`}
                  className="grid gap-3 rounded-2xl bg-[#fff7fa] p-4 sm:grid-cols-[70px_1fr_auto] sm:items-center"
                >
                  <p className="font-serif text-xl text-[#d92c83]">{time}</p>
                  <div>
                    <p className="font-semibold text-[#3e2530]">{name}</p>
                    <p className="mt-1 text-xs text-[#8c747e]">{service}</p>
                  </div>
                  <span className="w-fit rounded-full bg-[#f7d8e6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#a91f63]">
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-[#ecd8e1] bg-white p-6 sm:p-8">
            <h2 className="font-serif text-3xl text-[#3e2530]">Inventory</h2>
            <div className="mt-7 space-y-5">
              {products.slice(0, 4).map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#3e2530]">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-[#8c747e]">
                      {index < 2 ? `${index + 2} remaining` : `${8 + index} in stock`}
                    </p>
                  </div>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      index < 2 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
