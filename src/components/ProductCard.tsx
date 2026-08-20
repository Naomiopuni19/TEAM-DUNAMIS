import { productImage, type Product } from '../data/catalog'

type ProductCardProps = {
  product: Product
  onAdd: (product: Product) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white ring-1 ring-[#ecd8e1] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(62,37,48,0.4)]">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f7e4ec]">
        <img
          src={productImage(product)}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#29151f]/40 to-transparent opacity-0 transition group-hover:opacity-100" />

        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-[#fff9f7]/95 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#b32269]">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#dc2d83]">
          {product.category}
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3e2530]">
          {product.name}
        </p>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#745f68]">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="text-sm font-bold text-[#3e2530]">
            GH&#8373;{product.price.toLocaleString()}
          </p>
          <button
            type="button"
            onClick={() => onAdd(product)}
            disabled={!product.inStock}
            className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#dc2d83] transition hover:text-[#b92068] disabled:cursor-not-allowed disabled:text-[#c7aeb9]"
          >
            {product.inStock ? 'Add to bag' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  )
}