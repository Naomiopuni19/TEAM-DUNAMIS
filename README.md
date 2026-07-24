# Beryl's Beauty Mark

A responsive React and Tailwind CSS experience combining Beryl's Beauty Mark's editorial luxury aesthetic with the blush, cream, and magenta interface system supplied in the Figma reference.

## Features

- Responsive editorial homepage
- Service catalogue and pricing
- Product boutique with category filters and functional shopping bag
- API-backed product inventory and out-of-stock states
- Three-step appointment booking with live capacity checks
- Customer login and registration through the salon API
- Session validation, profile editing and password changes
- Client account history for appointments and orders
- Order creation and Mobile Money payment initiation
- Admin-protected staff login and live management dashboard
- Mobile navigation and four-column desktop footer
- Modular React component structure
- Tailwind utility classes written directly in components
- Accessible labels, keyboard focus states, semantic forms, and responsive dialogs

## Project structure

```text
src/
├── components/
│   ├── AuthPanel.tsx
│   ├── CartDrawer.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── ProductCard.tsx
├── data/
│   └── catalog.ts
├── pages/
│   ├── AboutPage.tsx
│   ├── BookingPage.tsx
│   ├── DashboardPage.tsx
│   ├── HomePage.tsx
│   ├── ServicesPage.tsx
│   └── ShopPage.tsx
├── App.tsx
├── index.css
└── main.tsx
```

## Run locally

Create a local frontend environment file:

```bash
cp .env.example .env
```

Set the backend API URL:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Only browser-safe configuration belongs in the frontend `.env`. Database,
JWT, Mobile Money and other secret keys must remain in the backend environment
and must never use the `VITE_` prefix.

Start the backend separately according to `Salon website backend/README.md`,
then run the frontend:

```bash
npm install
npm run dev
```

Open the local address shown by Vite.
The development server uses `http://localhost:3000` to match the backend CORS
configuration supplied with this workspace.

## Backend integration

The frontend consumes the backend's public catalogue endpoints and protected
JWT endpoints for:

- products and stock availability;
- salon services and category booking limits;
- customer registration and login;
- appointment availability and booking requests;
- customer orders and Mobile Money payment initiation;
- staff authentication, bookings, orders, revenue and inventory.

Authentication tokens are kept in session storage and sent only as bearer
tokens to `VITE_API_BASE_URL`. Administrative authorization is enforced again
by the backend on every protected management request.

Role-based access control supports `customer` and `admin` accounts. Public
registration always creates a customer. The `#/dashboard` route and every
`#/dashboard/*` section redirect non-admin visitors to `#/staff-login`, while
the API independently verifies the account's current database role.

Signed-in users can open the navbar profile menu to access account settings,
appointments, orders and sign out. Staff accounts also receive a link to the
administrator dashboard.

## Admin application

The protected admin application uses a separate responsive shell under
`src/admin/`. Each management area is an independent module:

- appointments: approval, completion, cancellation and rescheduling;
- services: category organization and full catalogue CRUD;
- products: product details, pricing, inventory and catalogue CRUD;
- orders: payment and fulfilment status management;
- customers: contact details, booking history and purchase history;
- payments: transaction records, statuses and revenue totals;
- analytics: revenue trends, popular services, product sales and key metrics;
- settings: business details, hours, notifications, payment methods and staff.

All admin mutations are persisted through the backend API. The public website
header and footer are not rendered inside the admin application.

## Production build

```bash
npm run build
```

## Responsive behavior

- **Mobile:** single-column editorial layouts with compact navigation and touch-friendly actions.
- **Tablet:** two-column product and footer arrangements with balanced reading widths.
- **Laptop and desktop:** immersive hero imagery, multi-column commerce layouts, and a four-column footer.
