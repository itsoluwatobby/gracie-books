
export const PageRoutes = {
  home: '/',
  books: '/books',
  cart: '/cart',
  dashboard: '/dashboard',
  genres: '/genres',
  checkout: '/checkout',
  orders: '/orders',
  search: '/search',
  newRelease: '/new-release',
  auth: {
    login: '/login',
    signup: '/signup',
    forgotPassword: '/forgot-password',
    unauthorised: '/unauthorised',
  },
} as const;