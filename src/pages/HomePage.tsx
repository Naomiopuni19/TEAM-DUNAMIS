import { ProductCard } from '../components/ProductCard'
import { imageBase, products, type Product } from '../data/catalog'

type HomePageProps = {
  onAdd: (product: Product) => void
}

const categories = [
  {
    title: 'Signature Wigs',
    label: 'Wigs',
    copy: 'Natural-looking HD lace, full ends and soft movement.',
    image: `${imageBase}/product-hd-lace-wig.jpg`,
    href: '#/shop?category=Wigs',
  },
  {
    title: 'Raw Bundles',
    label: 'Bundles',
    copy: 'Premium textures selected for density, longevity and lustre.',
    image: `${imageBase}/product-burmese-wave.jpg`,
    href: '#/shop?category=Bundles',
  },
  {
    title: 'Hair Care',
    label: 'Aftercare',
    copy: 'Thoughtful formulas to protect your investment between visits.',
    image: `${imageBase}/product-hair-mask.jpg`,
    href: '#/shop?category=Hair Care',
  },
]

export function HomePage({ onAdd }: HomePageProps) {
  return (
    <>
      <section
        data-home-hero
        className="relative isolate min-h-screen overflow-hidden bg-[#22171b] text-white"
      >
        <img
          src={`${imageBase}/hero-home.jpg`}
          alt="Model wearing a long body-wave HD lace wig"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center] sm:object-[64%_center] lg:object-center"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(18,12,14,0.92)_0%,rgba(35,20,27,0.73)_44%,rgba(154,46,99,0.12)_78%,rgba(18,12,14,0.25)_100%)]" />
        <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-20 pt-28 sm:px-10 sm:pb-24 sm:pt-32 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#f4a7cb] sm:text-sm">
              Premium hair, personally finished
            </p>
            <h1 className="mt-6 max-w-2xl font-serif text-[clamp(3.25rem,9vw,6rem)] leading-[0.95] tracking-[-0.04em]">
              Beauty, made entirely your own.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              Discover quality raw hair, natural-looking wigs and considered salon
              appointments in Kumasi.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#/shop"
                className="inline-flex min-h-13 items-center justify-center rounded-full bg-[#dc2d83] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#ef4d9a]"
              >
                Shop the collection
              </a>
              <a
                href="#/appointments"
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/55 bg-white/5 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition hover:bg-white hover:text-[#3e2530]"
              >
                Book an appointment
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf8] px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d92c83]">
              Curated for every ritual
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#3e2530] sm:text-5xl">
              Hair that looks beautiful and feels like you.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#745f68] sm:text-lg">
              Shop by how you wear, care for and celebrate your hair.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {categories.map((category, categoryIndex) => (
              <a
                key={category.title}
                href={category.href}
                className={`group relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[#5e3447] sm:min-h-[450px] ${
                  categoryIndex === 2 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <img
                  src={category.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#24131b]/90 via-[#24131b]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#f5b0d0]">
                    {category.label}
                  </p>
                  <h3 className="mt-2 font-serif text-3xl">{category.title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/80">
                    {category.copy}
                  </p>
                  <span className="mt-5 inline-block border-b border-white pb-1 text-xs font-bold uppercase tracking-[0.16em]">
                    Explore collection
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7e4ec] px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d92c83]">
                Popular picks
              </p>
              <h2 className="mt-4 font-serif text-4xl text-[#3e2530] sm:text-5xl">
                Client favourites
              </h2>
            </div>
            <a
              href="#/shop"
              className="w-fit border-b border-[#3e2530] pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#3e2530]"
            >
              View all products
            </a>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAdd} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid bg-[#fffaf8] lg:grid-cols-2">
        <div className="flex items-center px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24 xl:px-24">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d92c83]">
              Kumasi salon
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#3e2530] sm:text-5xl">
              Artistry, care and enough time for every client.
            </h2>
            <p className="mt-6 text-base leading-8 text-[#745f68]">
              From seamless frontal installs to restorative treatments, each
              appointment begins with your hair, lifestyle and desired finish.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ['Frontal install', '2h 30m'],
                ['Wig revamp', '1h 30m'],
                ['Wash & steam', '1h'],
              ].map(([name, time]) => (
                <div key={name} className="border-t border-[#e2b8ca] pt-4">
                  <p className="font-serif text-lg text-[#3e2530]">{name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#8f707d]">
                    {time}
                  </p>
                </div>
              ))}
            </div>
            <a
              href="#/services"
              className="mt-9 inline-flex rounded-full bg-[#dc2d83] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white"
            >
              Explore services
            </a>
          </div>
        </div>
        <img
          src={`${imageBase}/service-lace-install.jpg`}
          alt="Stylist completing a lace installation"
          className="h-full min-h-[520px] w-full object-cover"
        />
      </section>

      <section className="bg-[#4b2637] px-6 py-16 text-center text-white sm:px-10 sm:py-20 lg:py-24">
        <blockquote className="mx-auto max-w-4xl font-serif text-3xl leading-snug sm:text-4xl lg:text-5xl">
          “Luxury is feeling understood—from your first consultation to the final
          mirror moment.”
        </blockquote>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.24em] text-[#f2a7c9]">
          Beryl Vance · Founder
        </p>
      </section>
    </>
  )
}
