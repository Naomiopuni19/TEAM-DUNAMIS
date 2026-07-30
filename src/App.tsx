import { useEffect, useState } from 'react'
import { AuthPanel } from './components/AuthPanel'
import { AdminRoute } from './components/AdminRoute'
import { AdminApp } from './admin/AdminApp'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PaymentVerifier } from './components/PaymentVerifier'
import type { Product } from './data/catalog'
import { AccountPage } from './pages/AccountPage'
import { AboutPage } from './pages/AboutPage'
import { BookingPage } from './pages/BookingPage'
import { HomePage } from './pages/HomePage'
import { FaqPage } from './pages/FaqPage'
import { PaymentCompletePage } from './pages/PaymentCompletePage'
import { PrivacyPage } from './pages/PrivacyPage'
import { ServicesPage } from './pages/ServicesPage'
import { ShopPage } from './pages/ShopPage'
import { StaffLoginPage } from './pages/StaffLoginPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { TermsPage } from './pages/TermsPage'

function currentRoute() {
  const route = window.location.hash.replace(/^#\//, '').split('?')[0]
  return route.split('/')[0] || 'home'
}

function App() {
  const [route, setRoute] = useState(currentRoute)
  const [locationKey, setLocationKey] = useState(window.location.hash)
  const [cart, setCart] = useState<Product[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    const syncRoute = () => {
      setRoute(currentRoute())
      setLocationKey(window.location.hash)
      const routeParams = new URLSearchParams(
        window.location.hash.split('?')[1],
      )
      if (!routeParams.has('section')) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
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
      page = <BookingPage onRequireAuth={() => setAuthOpen(true)} onAdd={addToCart} />
      break
    case 'dashboard':
      page = (
        <AdminRoute>
          <AdminApp />
        </AdminRoute>
      )
      break
    case 'about':
      page = <AboutPage />
      break
    case 'privacy':
      page = <PrivacyPage />
      break
    case 'terms':
      page = <TermsPage />
      break
    case 'reviews':
      page = <ReviewsPage />
      break
    case 'faqs':
      page = <FaqPage />
      break
    case 'staff-login':
      page = <StaffLoginPage />
      break
    case 'account':
      page = <AccountPage onRequireAuth={() => setAuthOpen(true)} />
      break
    case 'payment-complete':
      page = <PaymentCompletePage />
      break
    default:
      page = <HomePage onAdd={addToCart} />
  }

  if (route === 'dashboard') {
    return (
      <>
        <PaymentVerifier />
        <div key={locationKey} className="min-h-screen bg-[#f8f3f5] text-[#604c55]">
          {page}
        </div>
      </>
    )
  }

  return (
    <>
      <PaymentVerifier />
      <div className="min-h-screen bg-[#fffaf8] text-[#604c55]">
        <Header
          key={route}
          cartCount={cart.length}
          isHome={route === 'home'}
          onOpenCart={() => setCartOpen(true)}
          onOpenAccount={() => setAuthOpen(true)}
        />
        <div
          key={locationKey}
          className={route === 'home' ? '' : 'pt-20 sm:pt-24'}
        >
          {page}
        </div>
        <Footer />
        <AuthPanel open={authOpen} onClose={() => setAuthOpen(false)} />
        <CartDrawer
          items={cart}
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          onRequireAuth={() => setAuthOpen(true)}
          onOrderComplete={() => setCart([])}
          onRemove={(index) =>
            setCart((items) => items.filter((_, itemIndex) => itemIndex !== index))
          }
        />
      </div>
    </>
  )
}

export default App