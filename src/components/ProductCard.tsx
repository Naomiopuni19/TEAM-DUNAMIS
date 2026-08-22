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
   OPTION CHIP STYLES
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

  /* =======================================================
     WISHLIST STATE
     ======================================================= */

  const [
    isWishlisted,
    setIsWishlisted,
  ] = useState(() =>
    wishlistIds.has(product.id),
  )

  const [
    wishlistBusy,
    setWishlistBusy,
  ] = useState(false)

  /* Keep local state synchronized with
     the global wishlist state. */
  useEffect(() => {
    setIsWishlisted(
      wishlistIds.has(product.id),
    )
  }, [
    wishlistIds,
    product.id,
  ])

  /* =======================================================
     VARIANT STATE
     ======================================================= */

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

    if (wishlistBusy) return

    const previousState =
      isWishlisted

    const nextState =
      !previousState

    /*
     * Optimistic UI:
     * Change the heart immediately.
     */
    setIsWishlisted(nextState)
    setWishlistBusy(true)

    try {
      await toggleWishlist(product.id)
    } catch {
      /*
       * If the API fails, restore
       * the previous heart state.
       */
      setIsWishlisted(
        previousState,
      )
    } finally {
      setWishlistBusy(false)
    }
  }

  /* =======================================================
     LOAD VARIANTS
     ======================================================= */

  useEffect(() => {
    let cancelled = false

    async function loadVariants() {
      try {
        const data =
          await api.productVariants(
            product.id,
          )

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
          setSelectedVariant(null)
        }
      }
    }

    loadVariants()

    return () => {
      cancelled = true
    }
  }, [product.id])

  /* =======================================================
     OPTION STRUCTURE
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
     FIND SELECTED VARIANT
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
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_6px_24px_rgba(87,43,61,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(87,43,61,0.14)]"
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

        {/* Subtle image fade */}

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
              : 'Add to wishlist'
          }
          className="
            absolute
            right-2.5
            top-2.5
            z-10

            flex
            h-9
            w-9
            items-center
            justify-center

            rounded-full

            bg-white/95

            shadow-[0_5px_18px_rgba(60,30,40,0.12)]

            transition-all
            duration-300

            active:scale-90

            disabled:cursor-wait
            disabled:opacity-80

            sm:right-4
            sm:top-4
            sm:h-10
            sm:w-10

            lg:hover:scale-105
          "
        >
          <span
            className={`
              flex
              items-center
              justify-center

              font-sans
              text-[20px]
              leading-none

              transition-all
              duration-300

              ${
                isWishlisted
                  ? 'scale-110 text-[#dc2d83]'
                  : 'scale-100 text-[#c8b0ba]'
              }
            `}
          >
            {isWishlisted ? '\u2665' : '\u2661'}
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

        {/* CATEGORY */}

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

        {/* PRODUCT NAME */}

        <a
          href={`#/product?id=${product.id}`}
          className="
            block
            min-w-0
          "
        >
          <h3
            className="mt-1 line-clamp-2 font-serif text-[15px] leading-snug text-[#3e2530] transition hover:text-[#dc2d83] sm:text-lg"
          >
            {product.name}
          </h3>
        </a>

        {/* DESCRIPTION */}

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
            OPTIONS
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
              <div className="mt-3">
                <p
                  className="font-serif text-[15px] font-semibold text-[#3e2530] sm:text-lg"
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
              <div className="mt-3">
                <p
                  className="font-serif text-[15px] font-semibold text-[#3e2530] sm:text-lg"
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
            ================================================= */}

        <div className="mt-3 flex items-center justify-between gap-2 sm:gap-3"
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
            GH&#8373;
            {displayPrice.toLocaleString()}
          </p>

          {/* ADD TO BAG */}

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="shrink-0 whitespace-nowrap rounded-full bg-[#dc2d83] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#b92068] disabled:cursor-not-allowed disabled:bg-[#c7aeb9] sm:px-5 sm:py-2.5 sm:text-[10px]"
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