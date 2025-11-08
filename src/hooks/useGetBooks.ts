import { useEffect, useState } from "react";
import { initAppState, InitReloads } from "../utils/initVariables";
import { bookServices } from "../services";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";


type PaginatedResponseData = {
  books: Book[];
  lastVisible: DocumentSnapshot<DocumentData, DocumentData> | null;
  hasMore: boolean;
}

export const useGetBooks = (filter: FilterQueries<DocumentSnapshot>) => {
  const [booksData, setBooksData] = useState<PaginatedResponseData>({} as PaginatedResponseData);
  const [appState, setAppState] = useState<AppState>(initAppState);
  const [reload, setReload] = useState<Reloads>(InitReloads)

  const { pagination } = filter;

  useEffect(() => {
    // let isMounted = true;
    (async () => {
      // if (!isMounted) return;
      try {
        setAppState((prev) => ({ ...prev, isLoading: true }));
        const inventory = await bookServices.getBooksByQuery(
          {
            status: filter?.status,
            author: filter?.author,
            title: filter?.title,
            publisher: filter?.publisher,
            createdAt: filter?.createdAt,
            price: filter?.price,
            rating: filter?.rating,
            pagination: {
              pageSize: pagination?.pageSize ?? 50,
              orderByField: pagination?.orderByField ?? "createdAt",
              orderDirection: pagination?.orderDirection ?? "desc",
              lastDoc: pagination?.lastDoc,
            }
          }
        );
        setBooksData(inventory);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(err.message)
        setAppState((prev) => ({ ...prev, isError: true, errMsg: err.message }));
      } finally {
        setAppState((prev) => ({ ...prev, isLoading: false }));
      }
    })();

    // return () => {
    //   isMounted = false;
    // }
  }, [
    reload.bookUpdate_reload,
    filter?.status,
    filter?.title,
    filter?.author,
    filter?.price,
    filter?.rating,
    filter?.publisher,
    filter?.createdAt,
    pagination?.pageSize,
    pagination?.orderByField,
    pagination?.orderDirection,
    pagination?.lastDoc,
  ])

  return { booksData, appState, setReload };
}