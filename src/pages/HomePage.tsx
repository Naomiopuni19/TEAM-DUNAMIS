import { useEffect, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { useAppData } from '../context/appData'
import { imageBase, type Product } from '../data/catalog'
import { api, type HeroSlide } from '../lib/api'

type HomePageProps = {
  onAdd: (product: Product) => void
}

const categories = [
  {
    title: 'Signature Wigs',
    label: 'Wigs',
    copy: 'Natural-looking HD lace, full ends and soft movement.',
    image: imageBase + '/product-hd-lace-wig.jpg',
    href: '#/shop?category=Wigs',
  },
  {
    title: 'Raw Bundles',
    label: 'Bundles',
    copy: 'Premium textures selected for density, longevity and lustre.',
    image: imageBase + '/product-burmese-wave.jpg',
    href: '#/shop?category=Bundles',
  },
  {
    title: 'Hair Care',
    label: 'Aftercare',
    copy: 'Thoughtful formulas to protect your investment between visits.',
    image: imageBase + '/product-hair-mask.jpg',
    href: '#/shop?category=Hair Care',
  },
]

function HeroBanner() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    api.heroSlides().then(function (data) {
      if (!cancelled) setSlides(data)
    })
    return function () {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(function () {
      setIndex(function (current) {
        return (current + 1) % slides.length
      })
    }, 6000)
    return function () {
      clearInterval(timer)
    }
  }, [slides])

  if (slides.length === 0) return null
  const slide = slides[index]

  return (
    <section data-home-hero className="relative isolate min-h-screen overflow-hidden bg-[#22171b] text-white">
      {slides.map(function (item, itemIndex) {
        return (
          <img
            key={item.id}
            src={item.imageUrl}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center] transition-opacity duration-1000 ease-in-out sm:object-[64%_center] lg:object-center"
            style={{ opacity: itemIndex === index ? 1 : 0 }}
          />
        )
      })}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(18,12,14,0.92)_0%,rgba(35,20,27,0.73)_44%,rgba(154,46,99,0.12)_78%,rgba(18,12,14,0.25)_100%)]" />
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-20 pt-28 sm:px-10 sm:pb-24 sm:pt-32 lg:px-12">
        <div key={slide.id} className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#f4a7cb] sm:text-sm">
            {slide.eyebrow}
          </p>
          <h1 className="mt-6 max-w-2xl font-serif text-[clamp(3.25rem,9vw,6rem)] leading-[0.95] tracking-[-0.04em]">
            {slide.title}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
            {slide.subtitle}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#/shop" className="inline-flex min-h-13 items-center justify-center rounded-full bg-[#dc2d83] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#ef4d9a]">
              Shop the collection
            </a>
            <a href="#/appointments" className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/55 bg-white/5 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition hover:bg-white hover:text-[#3e2530]">
              Book an appointment
            </a>
          </div>
        </div>
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map(function (item, dotIndex) {
            return (
              <button
                key={item.id}
                aria-label={'Show slide ' + (dotIndex + 1)}
                onClick={function () { setIndex(dotIndex) }}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: dotIndex === index ? 24 : 8,
                  backgroundColor: dotIndex === index ? '#ffffff' : 'rgba(255,255,255,0.5)',
                }}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}

export function HomePage(props: HomePageProps) {
  const onAdd = props.onAdd
  const appData = useAppData()
  const products = appData.products
  const services = appData.services
  const catalogLoading = appData.catalogLoading
  const catalogError = appData.catalogError

  const categoryMap = new Map()
  for (const service of services) {
    categoryMap.set(service.category.name, {
      id: service.category.id,
      name: service.category.name,
      imageUrl: service.category.imageUrl || service.images[0] || '',
    })
  }
  const orderList = ['Braiding', 'Makeup', 'Nails', 'Lashes']
  const serviceCategories = Array.from(categoryMap.values()).sort(function (first, second) {
    return orderList.indexOf(first.name) - orderList.indexOf(second.name)
  })

  return (
    <>
      <HeroBanner />

      <section className="bg-[#fffaf8] px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d92c83]">Shop by category</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#3e2530] sm:text-5xl">
              Hair that looks beautiful and feels like you.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#745f68] sm:text-lg">
              Shop by how you wear, care for and celebrate your hair.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {categories.map(function (category, categoryIndex) {
              const spanClass = categoryIndex === 2 ? 'md:col-span-2 lg:col-span-1' : ''
              return (
                <a key={category.title} href={category.href} className={'group relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[#5e3447] sm:min-h-[450px] ' + spanClass}>
                  <img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#24131b]/90 via-[#24131b]/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#f5b0d0]">{category.label}</p>
                    <h3 className="mt-2 font-serif text-3xl">{category.title}</h3>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-white/80">{category.copy}</p>
                    <span className="mt-5 inline-block border-b border-white pb-1 text-xs font-bold uppercase tracking-[0.16em]">
                      Explore collection
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7e4ec] px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d92c83]">Popular picks</p>
              <h2 className="mt-4 font-serif text-4xl text-[#3e2530] sm:text-5xl">Client favourites</h2>
            </div>
            <a href="#/shop" className="w-fit border-b border-[#3e2530] pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#3e2530]">
              View all products
            </a>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalogLoading && <p className="sm:col-span-2 lg:col-span-3">Loading client favourites...</p>}
            {!catalogLoading && catalogError && <p className="sm:col-span-2 lg:col-span-3 text-[#8b435f]">{catalogError}</p>}
            {!catalogLoading && !catalogError && products.slice(0, 3).map(function (product) {
              return <ProductCard key={product.id} product={product} onAdd={onAdd} />
            })}
          </div>
        </div>
      </section>

      <section className="grid bg-[#fffaf8] lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex items-center px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24 xl:px-24">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d92c83]">Kumasi salon</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#3e2530] sm:text-5xl">
              Careful beauty services with enough time for every client.
            </h2>
            <p className="mt-6 text-base leading-8 text-[#745f68]">
              From braiding and makeup to nails and lashes, every appointment begins with the look you want and the details that matter to you.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
              {serviceCategories.map(function (category) {
                return (
                  <a key={category.id} href={'#/services?section=' + category.name.toLowerCase()} className="border-t border-[#e2b8ca] pt-4">
                    <p className="font-serif text-lg text-[#3e2530]">{category.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#8f707d]">Explore services</p>
                  </a>
                )
              })}
            </div>
            <a href="#/services" className="mt-9 inline-flex rounded-full bg-[#dc2d83] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white">
              Explore services
            </a>
          </div>
        </div>
        <div className="grid min-h-[600px] grid-cols-2">
          {serviceCategories.map(function (category) {
            return (
              <a key={category.id} href={'#/services?section=' + category.name.toLowerCase()} className="group relative min-h-[300px] overflow-hidden bg-[#4b2637]">
                <img src={category.imageUrl} alt={category.name + ' service'} className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#29151f]/80 via-transparent to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-5 font-serif text-2xl text-white sm:p-7">{category.name}</p>
              </a>
            )
          })}
        </div>
      </section>

      <section className="bg-[#4b2637] px-6 py-16 text-center text-white sm:px-10 sm:py-20 lg:py-24">
        <blockquote className="mx-auto max-w-4xl font-serif text-3xl leading-snug sm:text-4xl lg:text-5xl">
          Every appointment starts with listening to what you want and ends with a style that feels right for you.
        </blockquote>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.24em] text-[#f2a7c9]">Beryl Vance - Founder</p>
      </section>
    </>
  )
}