/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ApplicationDB } from "../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
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
    const duplicate = await this.getBookByISBN(book.isbn!);
    if (duplicate) return duplicate;

    const bookId = nanoid();
    await setDoc(doc(this.booksRef, bookId), {
      ...book,
      id: bookId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return this.getBookById(bookId);
  };

  public async getBookByISBN(isbn: string) {
    try {
      const q = query(this.booksRef, where("isbn", "==", isbn));
      const querySnapShot = await getDocs(q);

      const books: Book[] = [];
      querySnapShot.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id } as Book);
      });

      if (books.length) return books[0];
      else {
        throw Error("Book not found");
      }
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

  public async updateUser(bookId: string, updatedInfo: Partial<Book>) {
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
        params: { q: query }
      }
    );
    return result.data;
  }

  async goodReadAPIFetch(title: string) {
    const result = await axios.get<GoogleAPIResponse>(
      this.goodReadsBaseURL,
      {
        params: { title },
      },
    );
    return result.data;
  }

  public async fetchBookDetails(query: string) {
    const [google, goodReads] = await Promise.all(
      [
        this.googleAPIFetch(query),
        this.goodReadAPIFetch(query),
      ]
    )

    console.log(google)
    console.log(goodReads)
    // return {
    //   title: result.title,
    //   averageRating: result?.averageRating || null,
    //   ratingsCount: result?.ratingsCount || 0,
    // };
  }
}
export const bookServices = new BookServices();