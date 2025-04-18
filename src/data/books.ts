import { Book } from "../types";

// Mock data for books
export const books: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    price: 24.99,
    coverImage: "https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=600",
    isbn: "978-0525559474",
    publisher: "Viking",
    publicationDate: "2020-08-13",
    pageCount: 304,
    genre: ["Fiction", "Fantasy", "Philosophy"],
    stockQuantity: 15,
    rating: 4.2
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. Learn how small changes can have remarkable results.",
    price: 19.99,
    coverImage: "https://images.pexels.com/photos/3747279/pexels-photo-3747279.jpeg?auto=compress&cs=tinysrgb&w=600",
    isbn: "978-0735211292",
    publisher: "Avery",
    publicationDate: "2018-10-16",
    pageCount: 320,
    genre: ["Self-Help", "Psychology", "Productivity"],
    stockQuantity: 24,
    rating: 4.8
  },
  {
    id: "3",
    title: "Educated",
    author: "Tara Westover",
    description: "An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    price: 22.99,
    coverImage: "https://images.pexels.com/photos/762687/pexels-photo-762687.jpeg?auto=compress&cs=tinysrgb&w=600",
    isbn: "978-0399590504",
    publisher: "Random House",
    publicationDate: "2018-02-20",
    pageCount: 334,
    genre: ["Memoir", "Biography", "Education"],
    stockQuantity: 18,
    rating: 4.7
  },
  {
    id: "4",
    title: "Project Hail Mary",
    author: "Andy Weir",
    description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian.",
    price: 28.99,
    coverImage: "https://images.pexels.com/photos/6762348/pexels-photo-6762348.jpeg?auto=compress&cs=tinysrgb&w=600",
    isbn: "978-0593135204",
    publisher: "Ballantine Books",
    publicationDate: "2021-05-04",
    pageCount: 496,
    genre: ["Science Fiction", "Adventure", "Space"],
    stockQuantity: 12,
    rating: 4.9
  },
  {
    id: "5",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    description: "A novel about a young woman who raises herself in the marshes of the deep South after being abandoned as a child.",
    price: 18.99,
    coverImage: "https://images.pexels.com/photos/1806461/pexels-photo-1806461.jpeg?auto=compress&cs=tinysrgb&w=600",
    isbn: "978-0735219090",
    publisher: "G.P. Putnam's Sons",
    publicationDate: "2018-08-14",
    pageCount: 384,
    genre: ["Fiction", "Mystery", "Coming of Age"],
    stockQuantity: 20,
    rating: 4.5
  },
  {
    id: "6",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description: "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know. It's about how you behave.",
    price: 17.99,
    coverImage: "https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg?auto=compress&cs=tinysrgb&w=600",
    isbn: "978-0857197689",
    publisher: "Harriman House",
    publicationDate: "2020-09-08",
    pageCount: 256,
    genre: ["Finance", "Psychology", "Economics"],
    stockQuantity: 30,
    rating: 4.6
  },
  {
    id: "7",
    title: "Dune",
    author: "Frank Herbert",
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
    price: 21.99,
    coverImage: "https://images.pexels.com/photos/3310691/pexels-photo-3310691.jpeg?auto=compress&cs=tinysrgb&w=600",
    isbn: "978-0441172719",
    publisher: "Ace",
    publicationDate: "1990-09-01",
    pageCount: 896,
    genre: ["Science Fiction", "Fantasy", "Classic"],
    stockQuantity: 25,
    rating: 4.7
  },
  {
    id: "8",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "A famous painter shoots her husband and then never speaks another word. A criminal psychotherapist is determined to unravel her mystery.",
    price: 20.99,
    coverImage: "https://images.pexels.com/photos/2128249/pexels-photo-2128249.jpeg?auto=compress&cs=tinysrgb&w=600",
    isbn: "978-1250301697",
    publisher: "Celadon Books",
    publicationDate: "2019-02-05",
    pageCount: 336,
    genre: ["Thriller", "Mystery", "Psychological Fiction"],
    stockQuantity: 14,
    rating: 4.3
  }
];

export const getBookById = (id: string): Book | undefined => {
  return books.find(book => book.id === id);
};

export const searchBooks = (query: string): Book[] => {
  const lowercaseQuery = query.toLowerCase();
  return books.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) || 
    book.author.toLowerCase().includes(lowercaseQuery) ||
    book.description.toLowerCase().includes(lowercaseQuery) ||
    book.genre.some(g => g.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterBooksByGenre = (genre: string): Book[] => {
  return books.filter(book => book.genre.includes(genre));
};

export const getAllGenres = (): string[] => {
  const genreSet = new Set<string>();
  books.forEach(book => {
    book.genre.forEach(genre => {
      genreSet.add(genre);
    });
  });
  return Array.from(genreSet);
};