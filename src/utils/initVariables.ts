export const InitBookForm: Book = {
  title: '',
  authors: [],
  description: '',
  price: 0,
  icon: '',
  coverImage: '',
  isbn: '',
  publisher: '',
  publicationDate: '1990-01-01',
  pageCount: 0,
  genre: ['fiction', 'adventure'],
  stockQuantity: 0,
  rating: 0,
  source: 'google',
  subtitle: '',
  id: '',
  status: 'public',
  createdAt: "",
  updatedAt: ""
};

export const InitPriceRange = { min: 0, max: 10000 };

export const InitReloads = {
  cart_reload: 0,
  platform_reload: 0,
  bookUpdate_reload: 0,
  order_reload: 0,
};

export const initAppState = {
  isLoading: false,
  isError: false,
  errMsg: ''
};

export const PaginatedQuery = {
  page: 1,
  limit: 10,
  isPublic: true,
};

export const PaginatedQueryResponse = {
  page: 0,
  limit: 0,
  totalDocs: 0,
  totalPages: 0,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: 0,
  nextPage: 0
};

export const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
