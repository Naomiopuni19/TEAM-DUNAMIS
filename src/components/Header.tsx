import { useEffect, useRef, useState } from 'react'
import { FiShoppingBag, FiUser } from 'react-icons/fi'

type HeaderProps = {
  cartCount: number
  isHome: boolean
  onOpenCart: () => void
  onOpenAccount: () => void
}

const links = [
  ['Home', '#/'],
  ['Services', '#/services'],
  ['Shop', '#/shop'],
  ['Appointments', '#/appointments'],
  ['Dashboard', '#/dashboard'],
]

export function Header({
  cartCount,
  isHome,
  onOpenCart,
  onOpenAccount,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [overHero, setOverHero] = useState(isHome)
  const lastScrollPosition = useRef(window.scrollY)

  useEffect(() => {
    const updateHeroState = () => {
      if (!isHome) {
        setOverHero(false)
        return
      }

      const hero = document.querySelector<HTMLElement>('[data-home-hero]')
      const headerHeight = window.innerWidth >= 640 ? 96 : 80
      setOverHero(Boolean(hero && hero.getBoundingClientRect().bottom > headerHeight))
    }

    const handleScroll = () => {
      const currentPosition = window.scrollY
      updateHeroState()
      const scrollDelta = currentPosition - lastScrollPosition.current

      if (Math.abs(scrollDelta) < 4) return

      if (menuOpen) {
        setVisible(true)
      } else if (
        currentPosition > lastScrollPosition.current &&
        currentPosition > 96
      ) {
        setVisible(false)
      } else if (currentPosition < lastScrollPosition.current) {
        setVisible(true)
      }

      lastScrollPosition.current = currentPosition
    }

    updateHeroState()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateHeroState)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateHeroState)
    }
  }, [isHome, menuOpen])

  const blendsWithHero = isHome && overHero && !menuOpen

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transform-gpu border-b will-change-transform transition-[transform,opacity,background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } ${
        blendsWithHero
          ? 'border-transparent bg-transparent'
          : 'border-[#ecd7e0] bg-[#fffaf8]/88 shadow-[0_8px_30px_rgba(71,35,51,0.06)] backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-5 sm:h-24 sm:px-8 lg:px-12">
        <a
          href="#/"
          className={`shrink-0 font-serif leading-none transition-colors duration-300 ${
            blendsWithHero ? 'text-[#f2e7eb]' : 'text-[#3e2530]'
          }`}
        >
          <span className="block text-[21px] font-semibold uppercase tracking-[0.16em] sm:text-2xl">
            Beryl&apos;s
          </span>
          <span
            className={`mt-1 block text-[8px] font-bold uppercase tracking-[0.48em] transition-colors duration-300 ${
              blendsWithHero ? 'text-[#e9a5c4]' : 'text-[#d92c83]'
            }`}
          >
            Beauty Mark
          </span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className={`text-[11px] font-bold uppercase tracking-[0.16em] transition duration-300 ${
                blendsWithHero
                  ? 'text-[#e8dce1] hover:text-white'
                  : 'text-[#604c55] hover:text-[#d92c83]'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag with ${cartCount} items`}
            title="Shopping bag"
            className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition duration-300 ${
              blendsWithHero
                ? 'border-white/25 bg-white/5 text-[#eee3e7] hover:border-white/50 hover:bg-white/10'
                : 'border-[#e4bdce] text-[#604c55] hover:border-[#d92c83] hover:bg-[#f8e3ec] hover:text-[#d92c83]'
            }`}
          >
            <FiShoppingBag aria-hidden="true" size={20} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d92c83] px-1 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </button>
          <a
            href="#/appointments"
            title="Book an appointment"
            className="hidden h-11 items-center justify-center rounded-full bg-[#d92c83] px-5 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#b92068] md:flex"
          >
            Book
          </a>
          <button
            type="button"
            onClick={onOpenAccount}
            aria-label="Open account"
            title="Account"
            className={`hidden h-11 w-11 items-center justify-center rounded-full border transition duration-300 sm:flex ${
              blendsWithHero
                ? 'border-white/25 bg-white/5 text-[#eee3e7] hover:border-white/50 hover:bg-white/10'
                : 'border-[#e4bdce] text-[#604c55] hover:border-[#d92c83] hover:bg-[#f8e3ec] hover:text-[#d92c83]'
            }`}
          >
            <FiUser aria-hidden="true" size={20} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className={`flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full transition-colors duration-300 lg:hidden ${
              blendsWithHero ? 'text-[#eee3e7]' : 'text-[#8f3862]'
            }`}
          >
            <span className="h-px w-5 bg-current" />
            <span className="h-px w-5 bg-current" />
            <span className="h-px w-5 bg-current" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[#ecd7e0] bg-[#fffaf8] px-5 py-6 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1">
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-serif text-xl text-[#3e2530] transition hover:bg-[#f8e3ec]"
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                onOpenAccount()
                setMenuOpen(false)
              }}
              className="rounded-xl px-4 py-3 text-left font-serif text-xl text-[#3e2530] transition hover:bg-[#f8e3ec] sm:hidden"
            >
              Account
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
