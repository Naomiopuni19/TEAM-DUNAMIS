import { useEffect, useMemo, useState } from 'react'
import { useAppData } from '../context/appData'
import { productImage, type Product } from '../data/catalog'
import { api, type ProductVariant } from '../lib/api'

type ProductDetailPageProps = {
  onAdd: (product: Product) => void
}

export function ProductDetailPage({ onAdd }: ProductDetailPageProps) {
  const wishlist = useAppData()

  const products = wishlist.products
  const catalogLoading = wishlist.catalogLoading
  const isWishlisted = productId2 => wishlist.wishlistIds.has(productId2)
  const productId = new URLSearchParams(window.location.hash.split('?')[1]).get('id')
  const product = products.find(function (p) { return p.id === productId })

  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [selectedOption1, setSelectedOption1] = useState<string | null>(null)
  const [selectedOption2, setSelectedOption2] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(function () {
    if (!productId) return
    let cancelled = false
    api.productVariants(productId).then(function (data) {
      if (!cancelled) {
        setVariants(data)
        if (data.length > 0) {
          const first = data[0]
          setSelectedVariant(first)
          setSelectedOption1(first.option1Value || null)
          setSelectedOption2(first.option2Value || null)
        }
      }
    })
    return function () {
      cancelled = true
    }
  }, [productId])

  const isStructured = variants.some(function (v) { return v.option1Name })
  const option1Name = isStructured ? variants.find(function (v) { return v.option1Name })?.option1Name : null
  const option2Name = isStructured ? variants.find(function (v) { return v.option2Name })?.option2Name : null

  const option1Values = useMemo(function () {
    if (!isStructured) return []
    const seen = new Set<string>()
    const values: string[] = []
    variants.forEach(function (v) {
      if (v.option1Value && !seen.has(v.option1Value)) {
        seen.add(v.option1Value)
        values.push(v.option1Value)
      }
    })
    return values
  }, [variants, isStructured])

  const option2Values = useMemo(function () {
    if (!isStructured || !option2Name) return []
    const seen = new Set<string>()
    const values: string[] = []
    variants
      .filter(function (v) { return !selectedOption1 || v.option1Value === selectedOption1 })
      .forEach(function (v) {
        if (v.option2Value && !seen.has(v.option2Value)) {
          seen.add(v.option2Value)
          values.push(v.option2Value)
        }
      })
    return values
  }, [variants, isStructured, option2Name, selectedOption1])

  useEffect(function () {
    if (!isStructured) return
    const match = variants.find(function (v) {
      const matchesOption1 = !selectedOption1 || v.option1Value === selectedOption1
      const matchesOption2 = !option2Name || !selectedOption2 || v.option2Value === selectedOption2
      return matchesOption1 && matchesOption2
    })
    setSelectedVariant(match || null)
  }, [selectedOption1, selectedOption2, variants, isStructured, option2Name])

  if (catalogLoading) {
    return (
      <main className="min-h-[600px] bg-[#fffaf8] px-6 py-20 text-center">
        <p>Loading...</p>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-[600px] bg-[#fffaf8] px-6 py-20 text-center">
        <p className="font-serif text-2xl text-[#3e2530]">Product not found.</p>
        <a href="#/shop" className="mt-4 inline-block text-sm font-bold text-[#dc2d83]">Back to shop</a>
      </main>
    )
  }

  const displayPrice = selectedVariant ? selectedVariant.price : product.price
  const displayImage = selectedVariant && selectedVariant.imageUrl ? selectedVariant.imageUrl : productImage(product)
  const canAdd = variants.length === 0 ? product.inStock : Boolean(selectedVariant && selectedVariant.stockQty > 0)
  const maxQty = variants.length === 0 ? 99 : (selectedVariant ? selectedVariant.stockQty : 0)

  function handleAdd() {
    for (let i = 0; i < quantity; i++) {
      if (selectedVariant) {
        onAdd({ ...product, price: selectedVariant.price, variantId: selectedVariant.id, variantLabel: selectedVariant.label })
      } else {
        onAdd(product)
      }
    }
    setAdded(true)
    setTimeout(function () { setAdded(false) }, 2000)
  }

  return (
    <main className="bg-[#fffaf8] px-5 py-12 sm:px-10 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <a href="#/shop" className="text-xs font-bold uppercase tracking-[0.12em] text-[#8f707d] hover:text-[#dc2d83]">
          &larr; Back to shop
        </a>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-[1.5rem] bg-[#f6edf0]">
            <img src={displayImage} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d92c83]">{product.category}</p>
            <h1 className="mt-3 font-serif text-4xl text-[#3e2530]">{product.name}</h1>
            <p className="mt-5 font-serif text-3xl font-semibold text-[#3e2530]">
              GHâ‚µ{displayPrice.toLocaleString()}
            </p>
            <p className="mt-5 text-sm leading-7 text-[#745f68]">{product.description}</p>

            {isStructured ? (
              <>
                {option1Values.length > 0 && (
                  <div className="mt-7">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#765b67]">{option1Name}</p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {option1Values.map(function (value) {
                        const active = selectedOption1 === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={function () { setSelectedOption1(value); setSelectedOption2(null) }}
                            className={
                              'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ' +
                              (active ? 'border-[#dc2d83] bg-[#fbe0eb] text-[#a51e61]' : 'border-[#e4bdce] bg-white text-[#745f68]')
                            }
                          >
                            {value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                {option2Values.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#765b67]">{option2Name}</p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {option2Values.map(function (value) {
                        const active = selectedOption2 === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={function () { setSelectedOption2(value) }}
                            className={
                              'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ' +
                              (active ? 'border-[#dc2d83] bg-[#fbe0eb] text-[#a51e61]' : 'border-[#e4bdce] bg-white text-[#745f68]')
                            }
                          >
                            {value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              variants.length > 0 && (
                <div className="mt-7">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#765b67]">Choose an option</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {variants.map(function (variant) {
                      const active = selectedVariant?.id === variant.id
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          disabled={variant.stockQty <= 0}
                          onClick={function () { setSelectedVariant(variant) }}
                          className={
                            'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition disabled:cursor-not-allowed disabled:opacity-40 ' +
                            (active ? 'border-[#dc2d83] bg-[#fbe0eb] text-[#a51e61]' : 'border-[#e4bdce] bg-white text-[#745f68]')
                          }
                        >
                          {variant.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            )}

            <div className="mt-7 flex items-center gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#765b67]">Quantity</p>
              <div className="flex items-center gap-3 rounded-full border border-[#e4bdce] px-3 py-1.5">
                <button type="button" onClick={function () { setQuantity(Math.max(1, quantity - 1)) }} className="text-lg font-bold text-[#604c55]">-</button>
                <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                <button type="button" onClick={function () { setQuantity(Math.min(maxQty || 1, quantity + 1)) }} className="text-lg font-bold text-[#604c55]">+</button>
              </div>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!canAdd}
                className="flex-1 rounded-full bg-[#dc2d83] px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#b92068] disabled:cursor-not-allowed disabled:bg-[#c7aeb9] sm:flex-none sm:px-10"
              >
                {!canAdd ? 'Unavailable' : added ? 'Added to bag' : 'Add to bag'}
              </button>
              <button
                type="button"
                onClick={function () { wishlist.toggleWishlist(product.id).catch(function () {}) }}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-[#e4bdce] text-xl transition hover:border-[#dc2d83]"
                aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <span className={isWishlisted(product.id) ? 'text-[#dc2d83]' : 'text-[#c7aeb9]'}>
                  {isWishlisted(product.id) ? '\u2665' : '\u2661'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}