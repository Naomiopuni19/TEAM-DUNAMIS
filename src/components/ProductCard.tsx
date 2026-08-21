import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { productImage, type Product } from '../data/catalog'
import { api, type ProductVariant } from '../lib/api'
import { useAppData } from '../context/appData'

type ProductCardProps = {
  product: Product
  onAdd: (product: Product) => void
}

const chipBase =
  'shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] transition disabled:cursor-not-allowed disabled:opacity-40 sm:text-[11px]'
const chipOn = 'border-[#dc2d83] bg-[#fbe0eb] text-[#a51e61]'
const chipOff = 'border-[#e4bdce] bg-white text-[#745f68] hover:border-[#dc2d83]'

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const { wishlistIds, toggleWishlist } = useAppData()
  const isWishlisted = wishlistIds.has(product.id)
  const [wishlistBusy, setWishlistBusy] = useState(false)

  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [selectedOption1, setSelectedOption1] = useState<string | null>(null)
  const [selectedOption2, setSelectedOption2] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  async function handleWishlistToggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    setWishlistBusy(true)
    try {
      await toggleWishlist(product.id)
    } catch {
      // likely not signed in — ignore
    } finally {
      setWishlistBusy(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    api.productVariants(product.id).then((data) => {
      if (cancelled) return
      setVariants(data)
      const first = data[0]
      if (first) {
        setSelectedVariant(first)
        setSelectedOption1(first.option1Value || null)
        setSelectedOption2(first.option2Value || null)
      }
    })
    return () => {
      cancelled = true
    }
  }, [product.id])

  const isStructured = variants.some((v) => v.option1Name)
  const option1Name = isStructured ? variants.find((v) => v.option1Name)?.option1Name : null
  const option2Name = isStructured ? variants.find((v) => v.option2Name)?.option2Name : null

  const option1Values = useMemo(() => {
    if (!isStructured) return []
    return Array.from(
      new Set(variants.map((v) => v.option1Value).filter((v): v is string => Boolean(v))),
    )
  }, [variants, isStructured])

  const option2Values = useMemo(() => {
    if (!isStructured || !option2Name) return []
    return Array.from(
      new Set(
        variants
          .filter((v) => !selectedOption1 || v.option1Value === selectedOption1)
          .map((v) => v.option2Value)
          .filter((v): v is string => Boolean(v)),
      ),
    )
  }, [variants, isStructured, option2Name, selectedOption1])

  useEffect(() => {
    if (!isStructured) return
    const match = variants.find((v) => {
      const m1 = !selectedOption1 || v.option1Value === selectedOption1
      const m2 = !option2Name || !selectedOption2 || v.option2Value === selectedOption2
      return m1 && m2
    })
    setSelectedVariant(match ?? null)
  }, [selectedOption1, selectedOption2, variants, isStructured, option2Name])

  const displayPrice = selectedVariant ? selectedVariant.price : product.price
  const canAdd =
    variants.length === 0 ? product.inStock : Boolean(selectedVariant && selectedVariant.stockQty > 0)

  function handleAdd() {
    if (selectedVariant) {
      onAdd({
        ...product,
        price: selectedVariant.price,
        variantId: selectedVariant.id,
        variantLabel: selectedVariant.label,
      })
      return
    }
    onAdd(product)
  }

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#efd7e1] bg-white shadow-[0_10px_28px_rgba(87,43,61,0.06)] transition duration-300 sm:rounded-3xl sm:hover:-translate-y-1 sm:hover:shadow-[0_18px_45px_rgba(87,43,61,0.12)]">
      <div className="relative aspect-square w-full overflow-hidden bg-[#f6edf0] sm:aspect-[4/5]">
        <img
          src={selectedVariant?.imageUrl || productImage(product)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />

        {!canAdd && (
          <span className="absolute left-2 top-2 rounded-full bg-[#fff9f7]/95 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#b32269] sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.16em]">
            Out of stock
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={wishlistBusy}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-xl shadow-sm backdrop-blur transition active:scale-95 disabled:opacity-60 sm:right-3 sm:top-3 sm:h-10 sm:w-10"
        >
          <span className={isWishlisted ? 'text-[#dc2d83]' : 'text-[#c7aeb9]'}>
            {isWishlisted ? '\u2665' : '\u2661'}
          </span>
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-5 lg:p-6">
        <p className="truncate text-[9px] font-bold uppercase tracking-[0.14em] text-[#d92c83] sm:text-[10px] sm:tracking-[0.18em]">
          {product.category}
        </p>

        <a href={`#/product?id=${product.id}`} className="min-w-0">
          <h3 className="mt-1.5 font-serif text-[15px] leading-snug text-[#3e2530] transition hover:text-[#dc2d83] sm:mt-2 sm:text-xl lg:text-2xl">
            {product.name}
          </h3>
        </a>

        <p className="mt-1.5 line-clamp-2 text-[11px] leading-[1.45] text-[#745f68] sm:mt-3 sm:text-sm sm:leading-6">
          {product.description}
        </p>

        {isStructured ? (
          <>
            {option1Values.length > 0 && (
              <div className="mt-3 min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#a08a94]">{option1Name}</p>
                <div className="-mx-1 mt-1.5 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">
                  {option1Values.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setSelectedOption1(value)
                        setSelectedOption2(null)
                      }}
                      className={`${chipBase} ${selectedOption1 === value ? chipOn : chipOff}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {option2Values.length > 0 && (
              <div className="mt-2.5 min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#a08a94]">{option2Name}</p>
                <div className="-mx-1 mt-1.5 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">
                  {option2Values.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedOption2(value)}
                      className={`${chipBase} ${selectedOption2 === value ? chipOn : chipOff}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          variants.length > 0 && (
            <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  disabled={variant.stockQty <= 0}
                  onClick={() => setSelectedVariant(variant)}
                  className={`${chipBase} ${selectedVariant?.id === variant.id ? chipOn : chipOff}`}
                >
                  {variant.label}
                </button>
              ))}
            </div>
          )
        )}

        <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 pt-4 sm:gap-4 sm:pt-6">
          <p className="truncate font-serif text-[15px] font-semibold text-[#3e2530] sm:text-xl">
            GH₵{displayPrice.toLocaleString()}
          </p>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="shrink-0 rounded-full bg-[#dc2d83] px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#b92068] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2d83] disabled:cursor-not-allowed disabled:bg-[#c7aeb9] sm:px-5 sm:text-xs sm:tracking-[0.12em]"
          >
            {canAdd ? 'Add to bag' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  )
}
