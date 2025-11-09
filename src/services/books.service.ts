/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ApplicationDB } from "../firebase/config";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  QueryFieldFilterConstraint,
  setDoc,
  updateDoc,
  where,
  DocumentSnapshot,
  Query,
  startAfter,
  limit,
  orderBy,
} from "firebase/firestore";
import { nanoid } from "nanoid/non-secure";
import { StorageModels } from "../utils/constants";
import { cartService } from "./cart.service";


class BookServices {
  goodReadsBaseURL = "https://audio-book-server.onrender.com/api/v1/books/rating";
  googleAPIBaseURL = "https://www.googleapis.com/books/v1/volumes";

  private booksRef = collection(ApplicationDB, StorageModels.books);

  public async addBook(book: Partial<Book>) {
    const duplicate = await this.getBookByTitle(book.title!);
    if (duplicate) {
      await this.updateBook(book.id!, { stockQuantity: duplicate.stockQuantity + 1 });
      return duplicate;
    }

    await setDoc(doc(this.booksRef, book.id), {
      ...book,
      keywords: this.generateKeywords(book.title ?? ""),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return this.getBookById(book.id!);
  };

  public async getBookByTitle(title: string, authors?: string[]) {
    const whereQueries: QueryFieldFilterConstraint[] = [];
    if (authors?.length) {
      for (const author of authors) {
        whereQueries.push(where("authors", "array-contains", author));
      }
    }

    try {
      const q = query(
        this.booksRef,
        where("title", "==", title.toLowerCase()),
        ...whereQueries,
      );
      const querySnapShot = await getDocs(q);

      const books: Book[] = [];
      querySnapShot.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id } as Book);
      });

      if (books.length) return books[0];
      return null
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  public async getBookById(bookId: string) {
    try {
      const docRef = doc(ApplicationDB, StorageModels.books, bookId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const book = { ...docSnap.data(), id: docSnap.id } as Book;
        return book;
      } else {
        throw Error("Book not found");
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  public async getBook(bookId: string) {
    const docRef = doc(ApplicationDB, StorageModels.books, bookId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const book = { ...docSnap.data(), id: docSnap.id } as Book;
      return book;
    }
  
    return null;
  };

  public async getBooks(filter: Book["status"] | null = null) {
    const whereQueries: QueryFieldFilterConstraint[] = [];
    if (filter) whereQueries.push(where("status", "==", filter))

    const q = query(this.booksRef, ...whereQueries);
    const querySnapShot = await getDocs(q);
    const books: Book[] = [];
    querySnapShot.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id } as Book);
    });

    return books;
  };

  public async getBooksByQuery(filters?: FilterQueries<DocumentSnapshot>) {
    try {
      
      const whereQueries: QueryFieldFilterConstraint[] = [];

      if (filters?.status) whereQueries.push(where("status", "==", filters.status));

      if (filters?.rating) whereQueries.push(where("rating", ">=", filters.rating));

      if (filters?.price) whereQueries.push(where("price", "<=", filters.price));

      if (filters?.publisher) whereQueries.push(where("publisher", "==", filters.publisher));

      if (filters?.title) whereQueries.push(where("keywords", "array-contains", filters.title));

      if (filters?.createdAt) whereQueries.push(where("createdAt", ">=", filters.createdAt));

      if (filters?.author) whereQueries.push(where("authors", "array-contains", filters.author));

      if (filters?.genre) whereQueries.push(where("genre", "array-contains", filters.genre));
  
      if (filters?.genres?.length) whereQueries.push(where("genre", "array-contains-any", filters.genres));

      let q: Query = query(this.booksRef, ...whereQueries);
      console.log(whereQueries, filters)

      const paginate = filters?.pagination;
      if (paginate?.orderByField) 
        q = query(q, orderBy(paginate.orderByField, paginate.orderDirection));

      if (paginate?.pageSize) 
        q = query(q, limit(paginate.pageSize));

      if (paginate?.lastDoc)
        q = query(q, startAfter(paginate.lastDoc));

      const querySnapShot = await getDocs(q);
      const books: Book[] = [];
      let lastVisible: DocumentSnapshot | null = null;
      let hasMore = false;
    
      querySnapShot.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id } as Book);
      });

      if (books.length > 0) {
        lastVisible = querySnapShot.docs[querySnapShot.docs.length - 1];
        hasMore = books.length === paginate?.pageSize;
      }

      return { books, lastVisible, hasMore };
    } catch (error) {
      console.error('Error fetching books:', error);
      return { books: [], lastVisible: null, hasMore: false };
    }
  };

  public async updateBook(bookId: string, updatedInfo: Partial<Book>) {
    const docRef = doc(ApplicationDB, "books", bookId);
    await updateDoc(
      docRef,
      {
        ...updatedInfo,
        // keywords: this.generateKeywords(updatedInfo.title!),
        updatedAt: new Date().toISOString(),
      },
    );
  };

  public async mutateBookStockQuantity(carts: CartItem[], opr: "deduct" | "revert") {
    await Promise.all(carts?.map(async (cart) => {
      const book = await this.getBook(cart.book.id);
      if (book) {
        let stockQuantity = book.stockQuantity;
        if (opr === "deduct" && cart.status === "pending") {
          stockQuantity -= cart.quantity;
          await cartService.markCartAsCompleted(cart.userId, cart.book.id, "completed");
        } else {
          stockQuantity += cart.quantity;
          await cartService.markCartAsCompleted(cart.userId, cart.book.id, "pending");
        }

        await this.updateBook(book.id, { stockQuantity });
      }
    }));
  }

  public async removeBook(bookId: string) {
    const docRef = doc(ApplicationDB, StorageModels.books, bookId);
    await deleteDoc(docRef);
  };

  public async updateBookStatus(bookId: string, status: Book["status"]) {
    await this.updateBook(bookId, { status });
  }

  async googleAPIFetch(query: string) {
    const result = await axios.get<GoogleAPIResponse>(
      this.googleAPIBaseURL,
      {
        params: { q: query },
      }
    );
    return result.data.items;
  }

  async goodReadAPIFetch(title: string) {
    const result = await axios.get<ResponseData<GracieAudioAPIGoodReadResponse[]>>(
      this.goodReadsBaseURL,
      {
        params: { title },
      },
    );
    return result.data.data;
  }

  public generateKeywords(title: string): string[] {
    const words = title.toLowerCase().split(/\s+/);
    const keywords = new Set<string>();

    words.forEach(word => keywords.add(word));

    for (let n = 2; n <= words.length; n++) {
      for (let i = 0; i <= words.length - n; i++) {
        keywords.add(words.slice(i, i + n).join(" "));
      }
    }

    return Array.from(keywords);
  }

  public async fetchBookDetails(query: string): Promise<Partial<Book>[]> {
    try {
      const volumes = await this.googleAPIFetch(query);
      const normalizeResult: Partial<Book>[] = volumes?.slice(0,10)?.map((volume) => {
        const bookInfo = volume.volumeInfo;
        return {
          id: nanoid(),
          title: bookInfo.title.toLowerCase(),
          subtitle: "",
          authors: bookInfo?.authors ?? [],
          description: bookInfo?.description ?? "",
          price: 0,
          icon: bookInfo?.imageLinks?.thumbnail ?? "",
          coverImage: bookInfo?.previewLink ?? "",
          previewImages: Object.values(bookInfo.imageLinks),
          isbn: "",
          publicationDate: bookInfo.publishedDate,
          publisher: bookInfo?.publisher ?? "",
          discount: "",
          pageCount: bookInfo.pageCount,
          genre: bookInfo?.categories ?? [],
          source: "google" as Book["source"],
          stockQuantity: 1,
          status: 'public',
        }
      })
      return normalizeResult;
    } catch (error: any) {
      // console.log(error)
      if (axios.isCancel(error)) throw error;
  
      const bookInfo = await this.goodReadAPIFetch(query);
      const normalizeResult: Partial<Book>[] = bookInfo?.slice(0,10)?.map((bookInfo) => {
        return {
          id: nanoid(),
          title: bookInfo.title.toLowerCase(),
          subtitle: "",
          authors: [bookInfo.author?.name ?? ''],
          authorAvatar: bookInfo.author.profileUrl,
          description: bookInfo.description.html,
          price: 0,
          icon: bookInfo.imageUrl,
          coverImage: bookInfo.imageUrl,
          previewImages: [bookInfo.imageUrl],
          pageCount: bookInfo.numPages,
          genre: [],
          source: "goodreads" as Book["source"],
          stockQuantity: 1,
          status: 'public',
        }
      });
      return normalizeResult;
    }
  }

  public searchBooks(query: string, books: Book[]): Book[] {
    const lowercaseQuery = query.toLowerCase();
    return books?.filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) || 
      // book.authors.toLowerCase().includes(lowercaseQuery) ||
      book.description.toLowerCase().includes(lowercaseQuery) ||
      book.genre.some(g => g.toLowerCase().includes(lowercaseQuery))
    );
  };
  
  public filterBooksByGenre = (genre: string, books: Book[]): Book[] => {
    return books.filter(book => book.genre.includes(genre));
  };
  
  public getAllGenres = (books: Book[]): string[] => {
    const genreSet = new Set<string>();
    books?.forEach(book => {
      book.genre.forEach(genre => {
        genreSet.add(genre);
      });
    });
    return Array.from(genreSet);
  };
}
export const bookServices = new BookServices();