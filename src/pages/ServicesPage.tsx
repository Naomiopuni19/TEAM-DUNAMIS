import { imageBase, serviceCategories, services } from '../data/catalog'

export function ServicesPage() {
  return (
    <main className="bg-[#fffaf8]">
      <section className="grid min-h-[620px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] xl:grid-cols-[0.9fr_1.1fr]">
        <div className="flex items-center bg-[#4b2637] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-10 lg:py-16 xl:px-16 2xl:px-24">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f2a7c9]">
              Salon menu
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-6xl lg:text-[60px] xl:text-7xl">
              Artistry and care, in equal measure.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-white/75 sm:text-lg">
              Consultative styling, healthy-hair preparation and a polished
              finish—designed around how you want to feel.
            </p>
            <a
              href="#/appointments"
              className="mt-9 inline-flex rounded-full bg-[#dc2d83] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white"
            >
              Book your visit
            </a>
          </div>
        </div>
        <img
          src={`${imageBase}/service-lace-install.jpg`}
          alt="Beryl's Beauty Mark salon service"
          className="h-full min-h-[420px] w-full object-cover"
        />
      </section>

      <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24 xl:py-28">
        <div className="mx-auto max-w-7xl">
          {serviceCategories.map((category, categoryIndex) => (
            <div
              key={category}
              className={`${categoryIndex ? 'mt-16 border-t border-[#e8cbd8] pt-16 sm:mt-20 sm:pt-20' : ''}`}
            >
              <div className="grid gap-8 lg:grid-cols-[0.8fr_2fr] lg:gap-16">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d92c83]">
                    0{categoryIndex + 1}
                  </p>
                  <h2 className="mt-3 font-serif text-4xl text-[#3e2530] sm:text-5xl">
                    {category}
                  </h2>
                </div>
                <div className="divide-y divide-[#ecd6df]">
                  {services
                    .filter((service) => service.category === category)
                    .map((service) => (
                      <article
                        key={service.id}
                        className="grid gap-5 py-7 first:pt-0 sm:grid-cols-[1fr_auto] sm:items-start"
                      >
                        <div>
                          <h3 className="font-serif text-2xl text-[#3e2530]">
                            {service.name}
                          </h3>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#745f68]">
                            {service.description}
                          </p>
                          <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#9a7183]">
                            {service.duration}
                          </p>
                        </div>
                        <div className="flex items-center gap-5 sm:flex-col sm:items-end">
                          <p className="font-serif text-xl text-[#3e2530]">
                            GH₵{service.price}
                          </p>
                          <a
                            href={`#/appointments?service=${service.id}`}
                            className="rounded-full bg-[#dc2d83] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-white"
                          >
                            Book
                          </a>
                        </div>
                      </article>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
