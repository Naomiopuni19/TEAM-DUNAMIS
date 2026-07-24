import { useMemo, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { products, type Product } from '../data/catalog'

type ShopPageProps = {
  onAdd: (product: Product) => void
}

const categories = ['All', 'Wigs', 'Bundles', 'Hair Care'] as const

export function ShopPage({ onAdd }: ShopPageProps) {
  const hashCategory = new URLSearchParams(window.location.hash.split('?')[1]).get(
    'category',
  )
  const [category, setCategory] = useState(
    categories.includes(hashCategory as (typeof categories)[number])
      ? (hashCategory as (typeof categories)[number])
      : 'All',
  )

  const visibleProducts = useMemo(
    () =>
      category === 'All'
        ? products
        : products.filter((product) => product.category === category),
    [category],
  )

  return (
    <main className="bg-[#fffaf8]">
      <section className="border-b border-[#edd4df] bg-[#f7e4ec] px-6 py-16 text-center sm:px-10 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d92c83]">
          The boutique
        </p>
        <h1 className="mt-4 font-serif text-5xl text-[#3e2530] sm:text-6xl">
          Luxury hair care
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#745f68] sm:text-lg">
          Curated essentials for your home ritual, selected for performance,
          longevity and a beautiful finish.
        </p>
      </section>

      <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.13em] transition ${
                  category === item
                    ? 'bg-[#dc2d83] text-white'
                    : 'border border-[#e4bdce] bg-white text-[#624956] hover:border-[#dc2d83]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAdd} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
