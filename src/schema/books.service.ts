/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ApplicationDB } from "../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  QueryFieldFilterConstraint,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { nanoid } from "nanoid/non-secure";

class BookServices {
  goodReadsBaseURL = "https://audio-book-server.onrender.com/api/v1/books/rating";
  googleAPIBaseURL = "https://www.googleapis.com/books/v1/volumes";

  private booksRef = collection(ApplicationDB, "books");
  // private appConfigRef = collection(ApplicationDB, "appConfig");
  // private chatsRef = collection(ApplicationDB, "messages");
  // private conversationsRef = collection(ApplicationDB, "conversations");
  // private cartsRef = collection(ApplicationDB, "carts");
  // private ordersRef = collection(ApplicationDB, "orders");

  public async addBook(book: Partial<Book>) {
    const duplicate = await this.getBookByTitle(book.title!);
    if (duplicate) {
      await this.updateBook(book.id!, { stockQuantity: duplicate.stockQuantity + 1 });
      return duplicate;
    }
  
    await setDoc(doc(this.booksRef, book.id), {
      ...book,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return this.getBookById(book.id!);
  };

  public async getBookByTitle(title: string, authors?: string[]) {
    const whereQueries: QueryFieldFilterConstraint[] = [];
    if (authors?.length) {
      for (const author in authors) {
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
      const docRef = doc(ApplicationDB, "books", bookId);
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

  public async getBooks() {
    const q = query(this.booksRef);
    const querySnapShot = await getDocs(q);
    const books: Book[] = [];
    querySnapShot.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id } as Book);
    });

    return books;
  };

  public async updateBook(bookId: string, updatedInfo: Partial<Book>) {
    // const q = query(
    //   this.usersRef,
    //   where("convoId", "==", conversationId),
    //   where("receiverId", "==", receiverId),
    //   where("read", "==", false),
    // );
    // const querySnapShot = await getDocs(q);
    // querySnapShot.forEach(async (msg) => {})
    
    const docRef = doc(this.booksRef, bookId);
    await updateDoc(
      docRef,
      {
        ...updatedInfo,
        updatedAt: new Date().toISOString(),
      },
    );
  };

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

  public async fetchBookDetails(query: string): Promise<Book[]> {
    try {
      const volumes = await this.googleAPIFetch(query);
      const normalizeResult: Book[] = volumes?.slice(0,5)?.map((volume) => {
        const bookInfo = volume.volumeInfo;
        return {
          id: nanoid(),
          title: bookInfo.title.toLowerCase(),
          subtitle: "",
          authors: bookInfo.authors,
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
          stockQuantity: 0,
        }
      })
      return normalizeResult;
    } catch (error: any) {
      console.log(error)
      if (axios.isCancel(error)) throw error;
  
      const bookInfo = await this.goodReadAPIFetch(query);
      const normalizeResult: Book[] = bookInfo?.slice(0,5)?.map((bookInfo) => {
        return {
          id: nanoid(),
          title: bookInfo.title.toLowerCase(),
          subtitle: "",
          authors: [bookInfo.author.name],
          authorAvatar: bookInfo.author.profileUrl,
          description: bookInfo.description.html,
          price: 0,
          icon: bookInfo.imageUrl,
          coverImage: bookInfo.imageUrl,
          previewImages: [bookInfo.imageUrl],
          pageCount: bookInfo.numPages,
          genre: [],
          source: "goodreads" as Book["source"],
          stockQuantity: 0,
        }
      });
      return normalizeResult;
    }
  }
}
export const bookServices = new BookServices();