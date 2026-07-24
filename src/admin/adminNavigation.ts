import {
  FiBarChart2,
  FiCalendar,
  FiCreditCard,
  FiGrid,
  FiPackage,
  FiScissors,
  FiSettings,
  FiShoppingBag,
  FiUsers,
} from 'react-icons/fi'

export const adminNavigation = [
  ['overview', 'Overview', FiGrid],
  ['appointments', 'Appointments', FiCalendar],
  ['services', 'Services', FiScissors],
  ['products', 'Products', FiPackage],
  ['orders', 'Orders', FiShoppingBag],
  ['customers', 'Customers', FiUsers],
  ['payments', 'Payments', FiCreditCard],
  ['analytics', 'Analytics', FiBarChart2],
  ['settings', 'Settings', FiSettings],
] as const

export function currentAdminSection() {
  return (
    window.location.hash.replace(/^#\//, '').split('?')[0].split('/')[1] ||
    'overview'
  )
}
