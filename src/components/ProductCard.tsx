import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { productImage, type Product } from '../data/catalog'
import { api, type ProductVariant } from '../lib/api'
import { useAppData } from '../context/appData'

type ProductCardProps = {
  product: Product
  onAdd: (product: Product) => void
}

const chipBase =
  'shrink-0 rounded-full border px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.07em] transition disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-[10px]'

const chipOn =
  'border-[#dc2d83] bg-[#fbe0eb] text-[#a51e61]'

const chipOff =
  'border-[#e4bdce] bg-white text-[#745f68] hover:border-[#dc2d83] hover:text-[#a51e61]'

export function ProductCard({
  product,
  onAdd,
}: ProductCardProps) {
  const { wishlistIds, toggleWishlist } = useAppData()

  const isWishlisted = wishlistIds.has(product.id)

  const [wishlistBusy, setWishlistBusy] = useState(false)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [selectedOption1, setSelectedOption1] =
    useState<string | null>(null)
  const [selectedOption2, setSelectedOption2] =
    useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null)

  async function handleWishlistToggle(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault()
    event.stopPropagation()

    setWishlistBusy(true)

    try {
      await toggleWishlist(product.id)
    } catch {
      // Ignore wishlist errors.
    } finally {
      setWishlistBusy(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    api.productVariants(product.id).then((data) => {
      if (cancelled) return

      setVariants(data)

      const firstAvailable =
        data.find((variant) => variant.stockQty > 0) ??
        data[0]

      if (firstAvailable) {
        setSelectedVariant(firstAvailable)
        setSelectedOption1(
          firstAvailable.option1Value || null,
        )
        setSelectedOption2(
          firstAvailable.option2Value || null,
        )
      }
    })

    return () => {
      cancelled = true
    }
  }, [product.id])

  const isStructured = variants.some(
    (variant) => variant.option1Name,
  )

  const option1Name = isStructured
    ? variants.find((variant) => variant.option1Name)
        ?.option1Name ?? null
    : null

  const option2Name = isStructured
    ? variants.find((variant) => variant.option2Name)
        ?.option2Name ?? null
    : null

  const option1Values = useMemo(() => {
    if (!isStructured) return []

    return Array.from(
      new Set(
        variants
          .map((variant) => variant.option1Value)
          .filter(
            (value): value is string => Boolean(value),
          ),
      ),
    )
  }, [variants, isStructured])

  const option2Values = useMemo(() => {
    if (!isStructured || !option2Name) return []

    return Array.from(
      new Set(
        variants
          .filter(
            (variant) =>
              !selectedOption1 ||
              variant.option1Value === selectedOption1,
          )
          .map((variant) => variant.option2Value)
          .filter(
            (value): value is string => Boolean(value),
          ),
      ),
    )
  }, [
    variants,
    isStructured,
    option2Name,
    selectedOption1,
  ])

  useEffect(() => {
    if (!isStructured) return

    const matchingVariant = variants.find((variant) => {
      const matchesOption1 =
        !selectedOption1 ||
        variant.option1Value === selectedOption1

      const matchesOption2 =
        !option2Name ||
        !selectedOption2 ||
        variant.option2Value === selectedOption2

      return matchesOption1 && matchesOption2
    })

    setSelectedVariant(matchingVariant ?? null)
  }, [
    selectedOption1,
    selectedOption2,
    variants,
    isStructured,
    option2Name,
  ])

  const displayPrice =
    selectedVariant?.price ?? product.price

  const canAdd =
    variants.length === 0
      ? product.inStock
      : Boolean(
          selectedVariant &&
            selectedVariant.stockQty > 0,
        )

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
        group
        flex
        h-full
        w-full
        min-w-0
        flex-col
        overflow-hidden
        rounded-[24px]
        border
        border-[#efd7e1]
        bg-white
        shadow-[0_10px_35px_rgba(87,43,61,0.07)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(87,43,61,0.13)]
      "
    >
      {/* =====================================================
          LARGE PRODUCT IMAGE
          ===================================================== */}
      <div
        className="
          relative
          aspect-[4/5]
          w-full
          overflow-hidden
          bg-[#f5edef]
        "
      >
        <img
          src={
            selectedVariant?.imageUrl ||
            productImage(product)
          }
          alt={product.name}
          loading="lazy"
          className="
            block
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-[1.025]
          "
        />

        {!canAdd && (
          <span
            className="
              absolute
              left-4
              top-4
              rounded-full
              bg-white/95
              px-3
              py-1.5
              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-[#b32269]
              shadow-sm
            "
          >
            Out of stock
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={wishlistBusy}
          aria-pressed={isWishlisted}
          aria-label={
            isWishlisted
              ? 'Remove from wishlist'
              : 'Save to wishlist'
          }
          className="
            absolute
            right-4
            top-4
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-xl
            shadow-[0_4px_15px_rgba(60,30,40,0.12)]
            transition
            hover:scale-105
            active:scale-95
            disabled:opacity-60
          "
        >
          <span
            className={
              isWishlisted
                ? 'text-[#dc2d83]'
                : 'text-[#c7aeb9]'
            }
          >
            {isWishlisted ? '\u2665' : '\u2661'}
          </span>
        </button>
      </div>

      {/* =====================================================
          PRODUCT DETAILS
          ===================================================== */}
      <div
        className="
          flex
          min-h-[270px]
          min-w-0
          flex-1
          flex-col
          p-6
          sm:p-7
          lg:p-8
        "
      >
        {/* Category */}
        <p
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[#d92c83]
            sm:text-[10px]
          "
        >
          {product.category}
        </p>

        {/* Product name */}
        <a
          href={`#/product?id=${product.id}`}
          className="min-w-0"
        >
          <h3
            className="
              mt-2
              line-clamp-2
              font-serif
              text-[23px]
              leading-[1.15]
              text-[#3e2530]
              transition-colors
              hover:text-[#dc2d83]
              sm:text-[25px]
              lg:text-[27px]
            "
          >
            {product.name}
          </h3>
        </a>

        {/* Description */}
        <p
          className="
            mt-3
            line-clamp-2
            max-w-[95%]
            text-[12px]
            leading-5
            text-[#745f68]
            sm:text-[13px]
          "
        >
          {product.description}
        </p>

        {/* ===================================================
            OPTIONS
            =================================================== */}
        {isStructured ? (
          <div className="mt-5 space-y-4">
            {option1Values.length > 0 && (
              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.1em]
                    text-[#a08a94]
                  "
                >
                  {option1Name}
                </p>

                <div
                  className="
                    mt-2
                    flex
                    min-w-0
                    gap-2
                    overflow-x-auto
                    pb-1
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                    sm:flex-wrap
                    sm:overflow-visible
                  "
                >
                  {option1Values.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setSelectedOption1(value)
                        setSelectedOption2(null)
                      }}
                      className={`${chipBase} ${
                        selectedOption1 === value
                          ? chipOn
                          : chipOff
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {option2Values.length > 0 && (
              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.1em]
                    text-[#a08a94]
                  "
                >
                  {option2Name}
                </p>

                <div
                  className="
                    mt-2
                    flex
                    min-w-0
                    gap-2
                    overflow-x-auto
                    pb-1
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                    sm:flex-wrap
                    sm:overflow-visible
                  "
                >
                  {option2Values.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setSelectedOption2(value)
                      }
                      className={`${chipBase} ${
                        selectedOption2 === value
                          ? chipOn
                          : chipOff
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          variants.length > 0 && (
            <div
              className="
                mt-5
                flex
                min-w-0
                gap-2
                overflow-x-auto
                pb-1
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                sm:flex-wrap
                sm:overflow-visible
              "
            >
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  disabled={variant.stockQty <= 0}
                  onClick={() =>
                    setSelectedVariant(variant)
                  }
                  className={`${chipBase} ${
                    selectedVariant?.id === variant.id
                      ? chipOn
                      : chipOff
                  }`}
                >
                  {variant.label}
                </button>
              ))}
            </div>
          )
        )}

        {/* ===================================================
            PRICE + ADD TO BAG
            =================================================== */}
        <div
          className="
            mt-auto
            flex
            items-center
            justify-between
            gap-4
            pt-7
          "
        >
          <p
            className="
              font-serif
              text-[21px]
              font-semibold
              text-[#3e2530]
              sm:text-[23px]
            "
          >
            GH₵{displayPrice.toLocaleString()}
          </p>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="
              shrink-0
              rounded-full
              bg-[#dc2d83]
              px-6
              py-3
              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-white
              transition
              hover:bg-[#b92068]
              active:scale-95
              disabled:cursor-not-allowed
              disabled:bg-[#c7aeb9]
              sm:px-7
              sm:py-3.5
            "
          >
            {canAdd ? 'Add to bag' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  )
}