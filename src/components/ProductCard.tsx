import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from 'react'

import {
  productImage,
  type Product,
} from '../data/catalog'

import {
  api,
  type ProductVariant,
} from '../lib/api'

import { useAppData } from '../context/appData'

type ProductCardProps = {
  product: Product
  onAdd: (product: Product) => void
}

/* =========================================================
   LUXURY OPTION CHIPS
   ========================================================= */

const chipBase = `
  inline-flex
  min-h-[30px]
  shrink-0
  items-center
  justify-center
  rounded-full
  border
  px-2.5
  py-1.5
  text-[7px]
  font-bold
  uppercase
  tracking-[0.09em]
  transition-all
  duration-200
  disabled:cursor-not-allowed
  disabled:opacity-40

  sm:min-h-[34px]
  sm:px-3.5
  sm:text-[9px]
`

const chipOn = `
  border-[#d92c83]
  bg-[#d92c83]
  text-white
  shadow-[0_5px_15px_rgba(217,44,131,0.18)]
`

const chipOff = `
  border-[#ead7df]
  bg-[#fffafa]
  text-[#745f68]

  hover:border-[#d92c83]
  hover:text-[#b5226c]
`

/* =========================================================
   PRODUCT CARD
   ========================================================= */

export function ProductCard({
  product,
  onAdd,
}: ProductCardProps) {
  const {
    wishlistIds,
    toggleWishlist,
  } = useAppData()

  const isWishlisted =
    wishlistIds.has(product.id)

  const [
    wishlistBusy,
    setWishlistBusy,
  ] = useState(false)

  const [
    variants,
    setVariants,
  ] = useState<ProductVariant[]>([])

  const [
    selectedOption1,
    setSelectedOption1,
  ] = useState<string | null>(null)

  const [
    selectedOption2,
    setSelectedOption2,
  ] = useState<string | null>(null)

  const [
    selectedVariant,
    setSelectedVariant,
  ] = useState<ProductVariant | null>(null)

  /* =======================================================
     WISHLIST
     ======================================================= */

  async function handleWishlistToggle(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault()
    event.stopPropagation()

    setWishlistBusy(true)

    try {
      await toggleWishlist(product.id)
    } catch {
      // Wishlist errors are intentionally ignored.
    } finally {
      setWishlistBusy(false)
    }
  }

  /* =======================================================
     LOAD PRODUCT VARIANTS
     ======================================================= */

  useEffect(() => {
    let cancelled = false

    async function loadVariants() {
      try {
        const data =
          await api.productVariants(product.id)

        if (cancelled) return

        setVariants(data)

        const firstAvailable =
          data.find(
            (variant) =>
              variant.stockQty > 0,
          ) ?? data[0]

        if (firstAvailable) {
          setSelectedVariant(
            firstAvailable,
          )

          setSelectedOption1(
            firstAvailable.option1Value ||
              null,
          )

          setSelectedOption2(
            firstAvailable.option2Value ||
              null,
          )
        }
      } catch {
        if (!cancelled) {
          setVariants([])
        }
      }
    }

    loadVariants()

    return () => {
      cancelled = true
    }
  }, [product.id])

  /* =======================================================
     DETERMINE PRODUCT STRUCTURE
     ======================================================= */

  const isStructured =
    variants.some(
      (variant) =>
        Boolean(variant.option1Name),
    )

  const option1Name =
    isStructured
      ? variants.find(
          (variant) =>
            variant.option1Name,
        )?.option1Name ?? null
      : null

  const option2Name =
    isStructured
      ? variants.find(
          (variant) =>
            variant.option2Name,
        )?.option2Name ?? null
      : null

  /* =======================================================
     OPTION 1 VALUES
     ======================================================= */

  const option1Values =
    useMemo(() => {
      if (!isStructured) return []

      return Array.from(
        new Set(
          variants
            .map(
              (variant) =>
                variant.option1Value,
            )
            .filter(
              (
                value,
              ): value is string =>
                Boolean(value),
            ),
        ),
      )
    }, [
      variants,
      isStructured,
    ])

  /* =======================================================
     OPTION 2 VALUES
     ======================================================= */

  const option2Values =
    useMemo(() => {
      if (
        !isStructured ||
        !option2Name
      ) {
        return []
      }

      return Array.from(
        new Set(
          variants
            .filter(
              (variant) =>
                !selectedOption1 ||
                variant.option1Value ===
                  selectedOption1,
            )
            .map(
              (variant) =>
                variant.option2Value,
            )
            .filter(
              (
                value,
              ): value is string =>
                Boolean(value),
            ),
        ),
      )
    }, [
      variants,
      isStructured,
      option2Name,
      selectedOption1,
    ])

  /* =======================================================
     FIND MATCHING VARIANT
     ======================================================= */

  useEffect(() => {
    if (!isStructured) return

    const matchingVariant =
      variants.find(
        (variant) => {
          const matchesOption1 =
            !selectedOption1 ||
            variant.option1Value ===
              selectedOption1

          const matchesOption2 =
            !option2Name ||
            !selectedOption2 ||
            variant.option2Value ===
              selectedOption2

          return (
            matchesOption1 &&
            matchesOption2
          )
        },
      )

    setSelectedVariant(
      matchingVariant ?? null,
    )
  }, [
    selectedOption1,
    selectedOption2,
    variants,
    isStructured,
    option2Name,
  ])

  /* =======================================================
     PRICE
     ======================================================= */

  const displayPrice =
    selectedVariant?.price ??
    product.price

  /* =======================================================
     STOCK
     ======================================================= */

  const canAdd =
    variants.length === 0
      ? product.inStock
      : Boolean(
          selectedVariant &&
            selectedVariant.stockQty > 0,
        )

  /* =======================================================
     ADD TO BAG
     ======================================================= */

  function handleAdd() {
    if (selectedVariant) {
      onAdd({
        ...product,
        price:
          selectedVariant.price,
        variantId:
          selectedVariant.id,
        variantLabel:
          selectedVariant.label,
      })

      return
    }

    onAdd(product)
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <article
      className="
        group
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden

        rounded-[18px]

        border
        border-[#ead7df]

        bg-white

        shadow-[0_7px_28px_rgba(75,35,52,0.055)]

        transition-all
        duration-500

        sm:rounded-[22px]

        lg:hover:-translate-y-1
        lg:hover:shadow-[0_20px_50px_rgba(75,35,52,0.11)]
      "
    >

      {/* ==================================================
          PRODUCT IMAGE
          ================================================== */}

      <div
        className="
          relative
          aspect-[0.88]
          w-full
          overflow-hidden
          bg-[#f7f0f2]

          sm:aspect-[4/5]
        "
      >

        {/* Image */}

        <a
          href={`#/product?id=${product.id}`}
          className="
            block
            h-full
            w-full
          "
          aria-label={product.name}
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
              duration-[900ms]
              ease-out

              lg:group-hover:scale-[1.035]
            "
          />
        </a>

        {/* Very subtle image overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-16
            bg-gradient-to-t
            from-[#3e2530]/[0.06]
            to-transparent
          "
        />

        {/* =================================================
            OUT OF STOCK
            ================================================= */}

        {!canAdd && (
          <span
            className="
              absolute
              left-2.5
              top-2.5

              rounded-full

              bg-white/95

              px-2.5
              py-1.5

              text-[6px]
              font-bold
              uppercase
              tracking-[0.14em]

              text-[#b32269]

              shadow-[0_3px_12px_rgba(60,30,40,0.10)]

              sm:left-4
              sm:top-4
              sm:px-3
              sm:text-[8px]
            "
          >
            Out of stock
          </span>
        )}

        {/* =================================================
            WISHLIST
            ================================================= */}

        <button
          type="button"
          onClick={
            handleWishlistToggle
          }
          disabled={wishlistBusy}
          aria-pressed={
            isWishlisted
          }
          aria-label={
            isWishlisted
              ? 'Remove from wishlist'
              : 'Save to wishlist'
          }
          className="
            absolute
            right-2.5
            top-2.5

            flex
            h-9
            w-9
            items-center
            justify-center

            rounded-full

            bg-white/95

            shadow-[0_5px_18px_rgba(60,30,40,0.10)]

            transition-all
            duration-200

            active:scale-90

            disabled:opacity-60

            sm:right-4
            sm:top-4
            sm:h-10
            sm:w-10

            lg:hover:scale-105
          "
        >
          <span
            className={`
              font-sans
              text-[18px]
              leading-none

              ${
                isWishlisted
                  ? 'text-[#d92c83]'
                  : 'text-[#c8b0ba]'
              }
            `}
          >
            {isWishlisted
              ? '\u2665'
              : '\u2661'}
          </span>
        </button>
      </div>

      {/* ==================================================
          PRODUCT INFORMATION
          ================================================== */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col

          p-3

          sm:p-5

          lg:p-6
        "
      >

        {/* =================================================
            CATEGORY
            ================================================= */}

        <p
          className="
            text-[6px]
            font-bold
            uppercase
            tracking-[0.18em]

            text-[#d52c83]

            sm:text-[8px]
          "
        >
          {product.category}
        </p>

        {/* =================================================
            PRODUCT NAME
            ================================================= */}

        <a
          href={`#/product?id=${product.id}`}
          className="
            block
            min-w-0
          "
        >
          <h3
            className="
              mt-1

              line-clamp-2

              font-serif

              text-[15px]
              leading-[1.12]

              text-[#3e2530]

              transition-colors

              sm:mt-2
              sm:text-[21px]

              lg:text-[25px]

              lg:hover:text-[#d92c83]
            "
          >
            {product.name}
          </h3>
        </a>

        {/* =================================================
            DESCRIPTION

            Kept intentionally tiny on mobile so the
            photography and product name stay dominant.
            ================================================= */}

        <p
          className="
            mt-2

            line-clamp-2

            max-w-[98%]

            text-[8px]
            leading-[1.4]

            text-[#806d75]

            sm:mt-2.5
            sm:text-[11px]
            sm:leading-[1.55]

            lg:text-[12px]
            lg:leading-5
          "
        >
          {product.description}
        </p>

        {/* =================================================
            PRODUCT OPTIONS
            ================================================= */}

        {isStructured ? (
          <div
            className="
              mt-4
              space-y-3

              sm:mt-5
              sm:space-y-4
            "
          >

            {/* OPTION 1 */}

            {option1Values.length >
              0 && (
              <div
                className="
                  min-w-0
                "
              >
                <p
                  className="
                    mb-1.5

                    text-[6px]
                    font-bold
                    uppercase
                    tracking-[0.12em]

                    text-[#a08a94]

                    sm:text-[8px]
                  "
                >
                  {option1Name}
                </p>

                <div
                  className="
                    flex
                    min-w-0
                    gap-1.5
                    overflow-x-auto
                    pb-1

                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden

                    sm:flex-wrap
                  "
                >
                  {option1Values.map(
                    (value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setSelectedOption1(
                            value,
                          )

                          setSelectedOption2(
                            null,
                          )
                        }}
                        className={`${chipBase} ${
                          selectedOption1 ===
                          value
                            ? chipOn
                            : chipOff
                        }`}
                      >
                        {value}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* OPTION 2 */}

            {option2Values.length >
              0 && (
              <div
                className="
                  min-w-0
                "
              >
                <p
                  className="
                    mb-1.5

                    text-[6px]
                    font-bold
                    uppercase
                    tracking-[0.12em]

                    text-[#a08a94]

                    sm:text-[8px]
                  "
                >
                  {option2Name}
                </p>

                <div
                  className="
                    flex
                    min-w-0
                    gap-1.5
                    overflow-x-auto
                    pb-1

                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden

                    sm:flex-wrap
                  "
                >
                  {option2Values.map(
                    (value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setSelectedOption2(
                            value,
                          )
                        }
                        className={`${chipBase} ${
                          selectedOption2 ===
                          value
                            ? chipOn
                            : chipOff
                        }`}
                      >
                        {value}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          variants.length > 0 && (
            <div
              className="
                mt-4

                flex
                min-w-0
                gap-1.5
                overflow-x-auto
                pb-1

                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden

                sm:flex-wrap
              "
            >
              {variants.map(
                (variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={
                      variant.stockQty <= 0
                    }
                    onClick={() =>
                      setSelectedVariant(
                        variant,
                      )
                    }
                    className={`${chipBase} ${
                      selectedVariant?.id ===
                      variant.id
                        ? chipOn
                        : chipOff
                    }`}
                  >
                    {variant.label}
                  </button>
                ),
              )}
            </div>
          )
        )}

        {/* =================================================
            PRICE + ADD TO BAG

            mt-auto keeps this anchored to the bottom,
            giving every card a polished equal finish.
            ================================================= */}

        <div
          className="
            mt-auto

            flex
            items-center
            justify-between

            gap-2

            pt-5

            sm:gap-3
            sm:pt-6
          "
        >

          {/* PRICE */}

          <p
            className="
              shrink-0

              font-serif

              text-[16px]
              font-semibold
              leading-none

              text-[#3e2530]

              sm:text-[20px]

              lg:text-[22px]
            "
          >
            GH₵
            {displayPrice.toLocaleString()}
          </p>

          {/* ADD TO BAG */}

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="
              min-w-0
              shrink

              rounded-full

              bg-[#d92c83]

              px-2.5
              py-2

              text-[6.5px]
              font-bold
              uppercase
              tracking-[0.10em]

              text-white

              shadow-[0_5px_14px_rgba(217,44,131,0.12)]

              transition-all
              duration-200

              active:scale-[0.96]

              disabled:cursor-not-allowed
              disabled:bg-[#c7aeb9]
              disabled:shadow-none

              sm:px-5
              sm:py-3
              sm:text-[8px]

              lg:px-6
              lg:text-[9px]

              lg:hover:bg-[#b92068]
              lg:hover:shadow-[0_7px_18px_rgba(217,44,131,0.20)]
            "
          >
            {canAdd
              ? 'Add to bag'
              : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  )
}