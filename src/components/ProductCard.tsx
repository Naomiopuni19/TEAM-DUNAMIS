import { useEffect, useMemo, useState } from 'react'
import { productImage, type Product } from '../data/catalog'
import { api, type ProductVariant } from '../lib/api'

type ProductCardProps = {
  product: Product
  onAdd: (product: Product) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [selectedOption1, setSelectedOption1] = useState<string | null>(null)
  const [selectedOption2, setSelectedOption2] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  useEffect(function () {
    let cancelled = false
    api.productVariants(product.id).then(function (data) {
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
  }, [product.id])

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

  const displayPrice = selectedVariant ? selectedVariant.price : product.price
  const canAdd = variants.length === 0 ? product.inStock : Boolean(selectedVariant && selectedVariant.stockQty > 0)

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
    <article
      className="
        group flex h-full flex-col
        overflow-hidden
        rounded-[1.25rem]
        sm:rounded-[1.5rem]
        border border-[#efd7e1]
        bg-white
        shadow-[0_10px_28px_rgba(87,43,61,0.06)]
        transition duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(87,43,61,0.12)]
      "
    >
      {/* PRODUCT IMAGE */}
      <div
        className="
          relative
          aspect-square
          overflow-hidden
          bg-[#f6edf0]
          sm:aspect-[4/5]
        "
      >
        <img
          src={selectedVariant && selectedVariant.imageUrl ? selectedVariant.imageUrl : productImage(product)}
          alt={product.name}
          className="
            h-full
            w-full
            object-cover
            transition
            duration-500
            group-hover:scale-[1.03]
          "
        />

        {!canAdd && (
          <span
            className="
              absolute
              left-2.5
              top-2.5
              rounded-full
              bg-[#fff9f7]/95
              px-2.5
              py-1
              text-[8px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-[#b32269]
              sm:left-4
              sm:top-4
              sm:px-3
              sm:py-1.5
              sm:text-[10px]
              sm:tracking-[0.16em]
            "
          >
            Out of stock
          </span>
        )}
      </div>

      {/* PRODUCT DETAILS */}
      <div
        className="
          flex
          flex-1
          flex-col
          p-3
          sm:p-5
          lg:p-6
        "
      >
        <p
          className="
            text-[8px]
            font-bold
            uppercase
            tracking-[0.14em]
            text-[#d92c83]
            sm:text-[10px]
            sm:tracking-[0.18em]
          "
        >
          {product.category}
        </p>

        <a href={'#/product?id=' + product.id}>
          <h3
            className="
              mt-1.5
              font-serif
              text-base
              leading-tight
              text-[#3e2530]
              transition
              hover:text-[#dc2d83]
              sm:mt-2
              sm:text-xl
              lg:text-2xl
            "
          >
            {product.name}
          </h3>
        </a>

        <p
          className="
            mt-2
            line-clamp-2
            text-[10px]
            leading-4
            text-[#745f68]
            sm:mt-3
            sm:text-sm
            sm:leading-6
          "
        >
          {product.description}
        </p>

        {isStructured ? (
          <>
            {option1Values.length > 0 && (
              <div className="mt-3">
                <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#a08a94]">{option1Name}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {option1Values.map(function (value) {
                    const active = selectedOption1 === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={function () {
                          setSelectedOption1(value)
                          setSelectedOption2(null)
                        }}
                        className={
                          'rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] transition ' +
                          (active
                            ? 'border-[#dc2d83] bg-[#fbe0eb] text-[#a51e61]'
                            : 'border-[#e4bdce] bg-white text-[#745f68]')
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
              <div className="mt-2.5">
                <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#a08a94]">{option2Name}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {option2Values.map(function (value) {
                    const active = selectedOption2 === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={function () { setSelectedOption2(value) }}
                        className={
                          'rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] transition ' +
                          (active
                            ? 'border-[#dc2d83] bg-[#fbe0eb] text-[#a51e61]'
                            : 'border-[#e4bdce] bg-white text-[#745f68]')
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
            <div className="mt-3 flex flex-wrap gap-1.5">
              {variants.map(function (variant) {
                const active = selectedVariant?.id === variant.id
                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={variant.stockQty <= 0}
                    onClick={function () { setSelectedVariant(variant) }}
                    className={
                      'rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] transition disabled:cursor-not-allowed disabled:opacity-40 ' +
                      (active
                        ? 'border-[#dc2d83] bg-[#fbe0eb] text-[#a51e61]'
                        : 'border-[#e4bdce] bg-white text-[#745f68]')
                    }
                  >
                    {variant.label}
                  </button>
                )
              })}
            </div>
          )
        )}

        <div
          className="
            mt-auto
            flex
            flex-col
            items-start
            gap-2
            pt-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:gap-4
            sm:pt-6
          "
        >
          <p
            className="
              font-serif
              text-base
              font-semibold
              text-[#3e2530]
              sm:text-xl
            "
          >
            GHâ‚µ{displayPrice.toLocaleString()}
          </p>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="
              w-full
              rounded-full
              bg-[#dc2d83]
              px-3
              py-2
              text-[9px]
              font-bold
              uppercase
              tracking-[0.1em]
              text-white
              transition
              hover:bg-[#b92068]
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[#dc2d83]
              disabled:cursor-not-allowed
              disabled:bg-[#c7aeb9]
              sm:w-auto
              sm:px-5
              sm:py-2.5
              sm:text-xs
              sm:tracking-[0.12em]
            "
          >
            {canAdd ? 'Add to bag' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  )
}