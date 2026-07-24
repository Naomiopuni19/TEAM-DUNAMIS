import { useEffect, useState } from 'react'
import { AuthPanel } from './components/AuthPanel'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import type { Product } from './data/catalog'
import { AboutPage } from './pages/AboutPage'
import { BookingPage } from './pages/BookingPage'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'
import { ServicesPage } from './pages/ServicesPage'
import { ShopPage } from './pages/ShopPage'

function currentRoute() {
  const route = window.location.hash.replace(/^#\//, '').split('?')[0]
  return route || 'home'
}

function App() {
  const [route, setRoute] = useState(currentRoute)
  const [cart, setCart] = useState<Product[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    const syncRoute = () => {
      setRoute(currentRoute())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  function addToCart(product: Product) {
    setCart((items) => [...items, product])
    setCartOpen(true)
  }

  let page
  switch (route) {
    case 'services':
      page = <ServicesPage />
      break
    case 'shop':
      page = <ShopPage onAdd={addToCart} />
      break
    case 'appointments':
      page = <BookingPage />
      break
    case 'dashboard':
      page = <DashboardPage />
      break
    case 'about':
      page = <AboutPage />
      break
    default:
      page = <HomePage onAdd={addToCart} />
  }

  return (
    <div className="min-h-screen bg-[#fffaf8] text-[#604c55]">
      <Header
        key={route}
        cartCount={cart.length}
        isHome={route === 'home'}
        onOpenCart={() => setCartOpen(true)}
        onOpenAccount={() => setAuthOpen(true)}
      />
      <div className={route === 'home' ? '' : 'pt-20 sm:pt-24'}>{page}</div>
      <Footer />
      <AuthPanel open={authOpen} onClose={() => setAuthOpen(false)} />
      <CartDrawer
        items={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={(index) =>
          setCart((items) => items.filter((_, itemIndex) => itemIndex !== index))
        }
      />
    </div>
  )
}

export default App
