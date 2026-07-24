# Beryl's Beauty Mark

A responsive React and Tailwind CSS experience combining Beryl's Beauty Mark's editorial luxury aesthetic with the blush, cream, and magenta interface system supplied in the Figma reference.

## Features

- Responsive editorial homepage
- Service catalogue and pricing
- Product boutique with category filters and functional shopping bag
- Three-step appointment booking flow
- Client login and registration panel
- Responsive management dashboard
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

```bash
npm install
npm run dev
```

Open the local address shown by Vite.

## Production build

```bash
npm run build
```

## Responsive behavior

- **Mobile:** single-column editorial layouts with compact navigation and touch-friendly actions.
- **Tablet:** two-column product and footer arrangements with balanced reading widths.
- **Laptop and desktop:** immersive hero imagery, multi-column commerce layouts, and a four-column footer.
