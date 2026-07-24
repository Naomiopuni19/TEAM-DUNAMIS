export type Product = {
  id: string
  name: string
  category: 'Wigs' | 'Bundles' | 'Hair Care'
  price: number
  image: string
  badge?: string
  description: string
}

export type Service = {
  id: string
  name: string
  category: 'Braids' | 'Weaves & Extensions' | 'Treatments' | 'Finishing Touch'
  duration: string
  price: number
  description: string
}

export const imageBase =
  'https://sampahallen.github.io/beryl-s-beauty-mark/images'

export const products: Product[] = [
  {
    id: 'signature-hd-lace-wig',
    name: 'Signature HD Lace Front Wig',
    category: 'Wigs',
    price: 4500,
    image: `${imageBase}/product-hd-lace-wig.jpg`,
    badge: 'Best seller',
    description: 'Natural-looking 13×6 HD lace, pre-plucked and finished by hand.',
  },
  {
    id: 'raw-burmese-wave',
    name: 'Raw Burmese Wavy Bundles',
    category: 'Bundles',
    price: 1500,
    image: `${imageBase}/product-burmese-wave.jpg`,
    badge: 'Single donor',
    description: 'Soft Burmese wave with aligned cuticles, full ends and natural movement.',
  },
  {
    id: 'argan-keratin-mask',
    name: 'Argan & Keratin Hair Mask',
    category: 'Hair Care',
    price: 380,
    image: `${imageBase}/product-hair-mask.jpg`,
    badge: 'Hair care',
    description: 'Deep-conditioning care for wigs, bundles and natural hair.',
  },
  {
    id: 'silk-press-serum',
    name: 'Silk Press Finishing Serum',
    category: 'Hair Care',
    price: 240,
    image: `${imageBase}/product-hair-mask.jpg`,
    description: 'Lightweight shine and heat protection without product build-up.',
  },
  {
    id: 'straight-bundles',
    name: 'Raw Burmese Straight Bundles',
    category: 'Bundles',
    price: 1450,
    image: `${imageBase}/product-burmese-wave.jpg`,
    description: 'Silky straight texture selected for density, length and longevity.',
  },
  {
    id: 'closure-wig',
    name: 'Everyday Closure Wig',
    category: 'Wigs',
    price: 3200,
    image: `${imageBase}/product-hd-lace-wig.jpg`,
    description: 'A polished, low-maintenance unit designed for everyday wear.',
  },
]

export const services: Service[] = [
  {
    id: 'knotless-box-braids',
    name: 'Knotless Box Braids',
    category: 'Braids',
    duration: '4–5 hours',
    price: 350,
    description: 'Tension-free, natural-looking braids with clean parts and flexible styling.',
  },
  {
    id: 'goddess-braids',
    name: 'Goddess Braids',
    category: 'Braids',
    duration: '4 hours',
    price: 420,
    description: 'Flowing curls woven through soft knotless braids for a romantic finish.',
  },
  {
    id: 'stitch-cornrows',
    name: 'Stitch Cornrows',
    category: 'Braids',
    duration: '2–3 hours',
    price: 220,
    description: 'Crisp, modern cornrows designed around your preferred pattern.',
  },
  {
    id: 'frontal-install',
    name: 'Frontal Install',
    category: 'Weaves & Extensions',
    duration: '2 hours 30 min',
    price: 250,
    description: 'Natural-looking lace placement, customisation and a polished finish.',
  },
  {
    id: 'traditional-sew-in',
    name: 'Traditional Sew-in',
    category: 'Weaves & Extensions',
    duration: '3 hours',
    price: 300,
    description: 'A secure, seamless install with carefully blended leave-out.',
  },
  {
    id: 'microlink-extensions',
    name: 'Microlink Extensions',
    category: 'Weaves & Extensions',
    duration: '4 hours',
    price: 850,
    description: 'Natural movement and flexible styling without braids or adhesive.',
  },
  {
    id: 'silk-press',
    name: 'Signature Silk Press',
    category: 'Treatments',
    duration: '1 hour 30 min',
    price: 180,
    description: 'Hydration, heat protection and a smooth, body-filled finish.',
  },
  {
    id: 'wash-steam',
    name: 'Wash & Steam',
    category: 'Treatments',
    duration: '1 hour',
    price: 95,
    description: 'A deep cleanse and steam treatment for softness and moisture.',
  },
  {
    id: 'wig-revamp',
    name: 'Wig Revamp',
    category: 'Finishing Touch',
    duration: '1 hour 30 min',
    price: 120,
    description: 'Restore shape, movement and shine to a well-loved unit.',
  },
]

export const serviceCategories = [
  'Braids',
  'Weaves & Extensions',
  'Treatments',
  'Finishing Touch',
] as const
