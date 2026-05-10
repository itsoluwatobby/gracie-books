# Wandyte Book Sales

A full-featured online bookstore built with React and TypeScript. Browse a curated catalog, filter by genre and price, manage a shopping cart, and place orders — all backed by Firebase and Supabase.

**Live site:** [booksales.wandyte.com](https://booksales.wandyte.com)

---

## Features

### Storefront
- Browse the full book catalog with grid layout
- Filter by genre, price range, and sort order
- Full-text search across titles, authors, and descriptions
- Book detail page with description, specs, and related books
- New releases and bestsellers sections on the homepage
- Genre-specific listing pages

### Shopping
- Add/remove books from the cart with quantity controls
- Coupon code support (10% discount)
- Shipping cost calculation (free over $100)
- Checkout with shipping address form
- Order history and per-order detail/tracking

### Authentication
- Email/password sign-up and login
- Google OAuth (one-click sign-in)
- Forgot password and password reset flow
- Password strength indicator

### Admin Dashboard
- Manage books — add, edit, delete, bulk import via CSV
- Manage orders — view and update order status
- Manage users — view accounts and roles

### Other
- Open Graph and Twitter Card meta tags on every page
- Canonical URLs and per-page SEO titles/descriptions
- Responsive design from 380 px (`xxxs`) up to 1536 px (`2xl`)
- Toast notifications for all user actions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM 6 |
| Database | Firebase Firestore |
| Auth | Firebase Auth + Google OAuth (`@react-oauth/google`) |
| Storage | Supabase (book cover images) |
| HTTP client | Axios |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Meta/SEO | React Helmet |
| CSV import | PapaParse |
| ID generation | nanoid |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A [Firebase](https://firebase.google.com) project with **Firestore** and **Authentication** enabled
- A [Supabase](https://supabase.com) project for image storage

### Install

```bash
git clone https://github.com/itsoluwatobby/gracie-books.git
cd gracie-books
npm install
```

### Environment variables

Create a `.env` file in the project root (it is already listed in `.gitignore`):

```env
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key

# App config
VITE_NAME="Your Store Name"
VITE_EMAIL=your@email.com
VITE_CONTACT="+1 000-000-0000"
VITE_ADDRESS="City, State"
VITE_INSTAGRAM=https://instagram.com/yourhandle
VITE_FACEBOOK=https://facebook.com/yourpage
VITE_TWITTER=https://x.com/yourhandle

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_APIKEY=your_supabase_anon_key
```

> All `VITE_` prefixed variables are embedded into the client bundle at build time. Do **not** store private server-side secrets here.

### Run locally

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and produce a production bundle in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across all source files |

---

## Project Structure

```
src/
├── components/
│   ├── books/          # BookCard, BookGrid, BookFilters
│   ├── dashboard/      # Admin panels (ManageBooks, ManageOrders, ManageUsers)
│   ├── layout/         # Header, Footer, Layout, OGgraph (MetaTags)
│   ├── orders/         # OrderItem, StatusIcons
│   └── ui/             # Button, Card, Input, Loader
├── composables/        # Firebase auth methods, localStorage wrapper
├── context/            # AuthContext, CartContext, BooksContext
├── firebase/           # Firebase app initialisation
├── hooks/              # useGetBooks, ObserverRef
├── pages/              # One file per route
├── services/           # books.service, cart.service, order.service, user.service
├── supabase/           # Supabase client initialisation
├── types/              # Global TypeScript declarations (index.d.ts)
└── utils/              # helper, constants, pageRoutes, initVariables
```

---

## Deployment

Build the project and deploy the `dist/` folder to any static host (Vercel, Netlify, Firebase Hosting, etc.):

```bash
npm run build
```

Ensure the host is configured to redirect all routes to `index.html` for client-side routing to work correctly.

---

## License

[MIT](LICENSE) © 2026 itsoluwatobby
