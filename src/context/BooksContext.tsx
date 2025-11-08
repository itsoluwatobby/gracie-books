import { useEffect, useState, createContext, ReactNode } from "react";
import { initAppState, InitReloads } from "../utils/initVariables";
import { bookServices } from "../services";

const BooksContext = createContext<BookContextType>({} as BookContextType);

const BooksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [appState, setAppState] = useState<AppState>(initAppState);
  const [reload, setReload] = useState<Reloads>(InitReloads)

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) return;
      try {
        setAppState((prev) => ({ ...prev, isLoading: true }));
        const inventory = await bookServices.getBooks("public");
        setBooks(inventory);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setAppState((prev) => ({ ...prev, isError: true, errMsg: err.message }));
      } finally {
        setAppState((prev) => ({ ...prev, isLoading: false }));
      }
    })();

    return () => {
      isMounted = false;
    }
  }, [reload.bookUpdate_reload])


  const value = {
    appState,
    books,
    reload,
    setReload,
    setBooks,
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  )
}

export {
  BooksProvider,
  BooksContext,
};
