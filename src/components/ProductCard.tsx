import { productImage, type Product } from '../data/catalog'

type ProductCardProps = {
  product: Product
  onAdd: (product: Product) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
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
          aspect-[4/3]
          overflow-hidden
          bg-[#f6edf0]
          sm:aspect-[4/5]
        "
      >
        <img
          src={productImage(product)}
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

        {!product.inStock && (
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

        <h3
          className="
            mt-1.5
            font-serif
            text-base
            leading-tight
            text-[#3e2530]
            sm:mt-2
            sm:text-xl
            lg:text-2xl
          "
        >
          {product.name}
        </h3>

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
            GH₵{product.price.toLocaleString()}
          </p>

          <button
            type="button"
            onClick={() => onAdd(product)}
            disabled={!product.inStock}
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
            {product.inStock ? 'Add to bag' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  )
}
