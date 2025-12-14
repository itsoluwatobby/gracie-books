
export const PageRoutes = {
  home: '/',
  aboutUs: '/about',
  termsAndConditions: '/terms',
  comingSoon: '/pending',
  books: '/books',
  cart: '/cart',
  dashboard: '/dashboard',
  genres: '/genres',
  checkout: '/checkout',
  orders: '/orders',
  search: '/search',
  profile: '/profile',
  newRelease: '/new-releases',
  auth: {
    login: '/login',
    signup: '/signup',
    forgotPassword: '/forgot-password',
    newPassword: '/new-password',
    unauthorised: '/unauthorised',
  },
} as const;