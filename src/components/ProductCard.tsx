import { productImage, type Product } from '../data/catalog'

type ProductCardProps = {
  product: Product
  onAdd: (product: Product) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#efd7e1] bg-white shadow-[0_12px_35px_rgba(87,43,61,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(87,43,61,0.12)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f6edf0]">
        <img
          src={productImage(product)}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {!product.inStock && (
          <span className="absolute left-4 top-4 rounded-full bg-[#fff9f7]/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#b32269]">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d92c83]">
          {product.category}
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-tight text-[#3e2530]">
          {product.name}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#745f68]">{product.description}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <p className="font-serif text-xl font-semibold text-[#3e2530]">
            GH₵{product.price.toLocaleString()}
          </p>
          <button
            type="button"
            onClick={() => onAdd(product)}
            disabled={!product.inStock}
            className="rounded-full bg-[#dc2d83] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#b92068] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2d83] disabled:cursor-not-allowed disabled:bg-[#c7aeb9]"
          >
            {product.inStock ? 'Add to bag' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  )
}
