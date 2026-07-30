export type Product = {
  id: string
  name: string
  description: string
  price: number
  stockQty: number
  inStock: boolean
  images: string[]
  image: string
  category: string
}

export type ServiceCategory = {
  id: string
  name: string
  dailyCap: number
  imageUrl: string
}

export type Service = {
  id: string
  name: string
  description: string
  durationMinutes: number
  priceMin: number
  priceMax: number
  images: string[]
  category: ServiceCategory
}

export type User = {
  id: string
  name: string
  phone: string
  role: 'customer' | 'admin'
  email?: string | null
  area?: string | null
}

export const imageBase =
  'https://sampahallen.github.io/beryl-s-beauty-mark/images'

export function productImage(product: Pick<Product, 'images' | 'name'>) {
  if (product.images[0]) return product.images[0]

  const name = product.name.toLowerCase()
  if (name.includes('wig')) return `${imageBase}/product-hd-lace-wig.jpg`
  if (name.includes('bundle')) return `${imageBase}/product-burmese-wave.jpg`
  return `${imageBase}/product-hair-mask.jpg`
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (!hours) return `${remainingMinutes} min`
  if (!remainingMinutes) return `${hours} hr${hours === 1 ? '' : 's'}`
  return `${hours} hr ${remainingMinutes} min`
}
